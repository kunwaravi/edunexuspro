import { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export const useCourseDetail = (courseId: string | undefined) => {
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [weeks, setWeeks] = useState<any[]>([]);
  const [activeWeekIndex, setActiveWeekIndex] = useState(0);
  const [loadingSyllabus, setLoadingSyllabus] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(true);
  const [activeModuleDetail, setActiveModuleDetail] = useState<any>(null);
  const [isPaid, setIsPaid] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // TASK 4: set when the server rejects the premium module fetch with 403 —
  // the user is authenticated but has no ACTIVE enrollment for this course.
  // Access authority is the backend response, never localStorage/frontend state.
  const [moduleAccessDenied, setModuleAccessDenied] = useState(false);

  // Canonical Course.id resolved from the route param, which may be a slug
  // ("/course/c") or a legacy id ("/course/C"). All downstream lookups
  // (progress, payments, module fetch, quiz/forum links) MUST use resolvedId,
  // never the raw param.
  const [resolvedId, setResolvedId] = useState<string | null>(null);

  const progressInfo = resolvedId
    ? user?.progresses?.find((p: any) => p.courseId === resolvedId)
    : undefined;
  const currentWeek = progressInfo?.weekCompleted || 0;

  // Mirror progress into a ref so the syllabus fetch depends only on courseId.
  // Progress changes (e.g. the user's own quiz completion triggering a user
  // refresh) must NOT re-trigger fetchSyllabus — that re-clamps activeWeekIndex
  // and jumps the student to a different week mid-session (M-048).
  const currentWeekRef = useRef(currentWeek);
  useEffect(() => {
    currentWeekRef.current = currentWeek;
  });

  const fetchSyllabus = useCallback(async () => {
    if (!courseId) return;
    setLoadingSyllabus(true);
    setError(null);
    try {
      const res = await api.get('/courses');
      // Find the specific course by id OR slug
      const matchedCourse = res.data.find((c: any) => c.id === courseId || c.slug === courseId);
      const canonicalId = matchedCourse?.id || courseId;
      setResolvedId(canonicalId);
      setCourse(matchedCourse);
      const courseWeeks = matchedCourse?.modules || [];
      setWeeks(courseWeeks);

      // Resolve progress against the canonical id (works for slug URLs too).
      // NOTE: intentionally reads `user` here WITHOUT putting it in deps — a
      // user refresh mid-session must not re-run this fetch (M-048).
      const resolvedProgress = user?.progresses?.find((p: any) => p.courseId === canonicalId);
      const resolvedWeek = resolvedProgress?.weekCompleted || 0;

      const savedIndex = localStorage.getItem(`last_viewed_week_${canonicalId}`);
      const activeIndex = savedIndex !== null
        ? Math.min(parseInt(savedIndex, 10), Math.max(0, courseWeeks.length - 1))
        : Math.min(resolvedWeek, Math.max(0, courseWeeks.length - 1));
      setActiveWeekIndex(activeIndex);
    } catch (err: any) {
      console.error('Failed to fetch course syllabus:', err);
      setError(err?.response?.data?.message || 'Failed to load course content. Please try again.');
    } finally {
      setLoadingSyllabus(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const fetchPaymentStatus = useCallback(async () => {
    if (!resolvedId || !user) return;
    setCheckingPayment(true);
    try {
      const res = await api.get(`/payments/status/${resolvedId}`);
      setIsPaid(res.data.paid);
    } catch (err) {
      console.error('Failed to fetch payment status:', err);
    } finally {
      setCheckingPayment(false);
    }
  }, [resolvedId, user]);

  // Abort any in-flight module request when the active week changes so a stale
  // response can never overwrite the current week's content (M-048 race fix).
  const moduleAbortRef = useRef<AbortController | null>(null);

  const fetchModuleDetails = useCallback(async () => {
    if (!resolvedId || weeks.length === 0) return;
    moduleAbortRef.current?.abort();
    const controller = new AbortController();
    moduleAbortRef.current = controller;
    setLoadingDetails(true);
    try {
      const activeWeekNum = weeks[activeWeekIndex]?.week || (activeWeekIndex + 1);
      const res = await api.get(`/courses/${resolvedId}/module/${activeWeekNum}`, {
        signal: controller.signal
      });
      setActiveModuleDetail(res.data);
      setModuleAccessDenied(false);
    } catch (err: any) {
      // Superseded by a newer request (or unmount) — ignore; a fallback here
      // would show the wrong week's content.
      if (err?.name === 'AbortError' || err?.code === 'ERR_CANCELED') return;
      console.error('Lazy loading module failed, utilizing fallback dataset:', err);
      if (err?.response?.status === 403) {
        // Server is the authorization authority: authenticated but not enrolled.
        // Keep the public syllabus outline (module title/description only — no
        // topic text/code leaks) and flag the access-required state.
        setModuleAccessDenied(true);
        return;
      }
      setModuleAccessDenied(false);
      setActiveModuleDetail(weeks[activeWeekIndex]);
    } finally {
      // Only the latest controller is allowed to clear the loading flag.
      if (moduleAbortRef.current === controller) {
        setLoadingDetails(false);
      }
    }
  }, [resolvedId, weeks, activeWeekIndex]);

  useEffect(() => {
    fetchSyllabus();
  }, [fetchSyllabus]);

  useEffect(() => {
    fetchPaymentStatus();
  }, [fetchPaymentStatus]);

  useEffect(() => {
    fetchModuleDetails();
  }, [fetchModuleDetails]);

  // Cancel any in-flight module request when the hook unmounts.
  useEffect(() => () => moduleAbortRef.current?.abort(), []);

  const refreshPaymentStatus = () => {
    fetchPaymentStatus();
  };

  const setPersistedActiveWeekIndex = (index: number) => {
    setActiveWeekIndex(index);
    if (resolvedId) {
      localStorage.setItem(`last_viewed_week_${resolvedId}`, index.toString());
    }
  };

  return {
    course,
    weeks,
    activeWeekIndex,
    setActiveWeekIndex: setPersistedActiveWeekIndex,
    loadingSyllabus,
    loadingDetails,
    activeModuleDetail,
    isPaid,
    checkingPayment,
    currentWeek,
    // Canonical Course.id for callers that hit id-keyed endpoints.
    courseId: resolvedId,
    error,
    moduleAccessDenied,
    refetchSyllabus: fetchSyllabus,
    refreshPaymentStatus
  };
};
