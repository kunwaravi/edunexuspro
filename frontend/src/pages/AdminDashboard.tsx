import { useState, useEffect, useRef, Fragment } from 'react';
import api, { resolveCourseBanner } from '../api';
import { useUI } from '../context/UIContext';
import {
  Award, Edit3, Trash2, Plus,
  ArrowUp, ArrowDown,
  Save, FileText, Image, RefreshCw, ChevronDown, ChevronRight,
  Share2, ShieldCheck, ShieldAlert
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AdminPaymentTable from '../components/organisms/AdminPaymentTable';
import AdminInternshipsPanel from '../components/organisms/AdminInternshipsPanel';
import InternshipAdmin from '../components/admin/InternshipAdmin';
import AdminNavTabs from '../components/organisms/admin/AdminNavTabs';
import AdminPendingActions, { type PendingActionItem } from '../components/organisms/admin/AdminPendingActions';
import AdminReviewQueue from '../components/organisms/admin/AdminReviewQueue';
import AdminCandidatesTable, { type CandidateForm } from '../components/organisms/admin/AdminCandidatesTable';
import AdminMessagesTable from '../components/organisms/admin/AdminMessagesTable';
import AdminContactSettings, { type ContactSettingsForm } from '../components/organisms/admin/AdminContactSettings';
import TopicEditorModal, { type Topic } from '../components/organisms/admin/TopicEditorModal';
import QuizQuestionModal, { type QuizQuestion } from '../components/organisms/admin/QuizQuestionModal';
import CreateCourseModal from '../components/organisms/admin/CreateCourseModal';
import CreateModuleModal from '../components/organisms/admin/CreateModuleModal';
import { type AdminTab } from '../components/organisms/admin/adminTabs';
import type { AdminInternshipApplication, ApplicationStatus, InternshipStats } from '../types/internship';
import { coursesConfig } from '../config/courses';
import PageContainer from '../components/layout/PageContainer';
import Select from '../components/ui/Select';
import LoadingState from '../components/atoms/LoadingState';
import EmptyState from '../components/atoms/EmptyState';
import ErrorState from '../components/atoms/ErrorState';

interface Module {
  id: number;
  week: number;
  title: string;
  description: string;
  topics?: Topic[];
  quizQuestions?: QuizQuestion[];
}

interface Course {
  id: string;
  title: string;
  description: string;
  modules?: Module[];
  // TASK 6: admin-controlled course presentation fields.
  banner?: string | null;
  comingSoon?: boolean;
}

const AdminDashboard = () => {
  const { confirmDialog, addToast } = useUI();
  const [activeTab, setActiveTab] = useState<AdminTab>('transactions');

  // Transaction logs states
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  // Phase 15: per-source failure flags. A failed fetch must never render as a
  // real zero or an empty list — each panel shows its own error + retry instead.
  const [transactionsError, setTransactionsError] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [usersError, setUsersError] = useState<string | null>(null);
  const [certsError, setCertsError] = useState<string | null>(null);

  // Review queue states (#82)
  const [reviewTab, setReviewTab] = useState<'assignments' | 'projects'>('assignments');
  const [assignments, setAssignments] = useState<any[]>([]);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingReview, setLoadingReview] = useState(true);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [evaluatingId, setEvaluatingId] = useState<number | null>(null);

  // Internship applications states (admin workflow: review → respond)
  const [internshipApplications, setInternshipApplications] = useState<AdminInternshipApplication[]>([]);
  const [loadingInternships, setLoadingInternships] = useState(false);
  const [internshipsError, setInternshipsError] = useState<string | null>(null);
  const [internshipStatusFilter, setInternshipStatusFilter] = useState<'' | ApplicationStatus>('');
  // Phase 14: the pending-actions strip needs real queue counts on every tab, so
  // it reads the same GET /internship/admin/stats the internships panel uses.
  const [internshipStats, setInternshipStats] = useState<InternshipStats | null>(null);
  const [loadingInternshipStats, setLoadingInternshipStats] = useState(true);
  const [internshipStatsError, setInternshipStatsError] = useState<string | null>(null);

  // CMS courses states
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingCms, setLoadingCms] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [expandedModuleId, setExpandedModuleId] = useState<number | null>(null);
  // TASK 6: course presentation settings (banner URL + Coming Soon toggle).
  const [cmsBannerUrl, setCmsBannerUrl] = useState('');
  const [cmsComingSoon, setCmsComingSoon] = useState(false);
  const [savingCourseSettings, setSavingCourseSettings] = useState(false);

  // Course title for display: prefer the API title, fall back to the
  // presentation-only titleShort config, then the id itself.
  const courseTitleById = (id: string) =>
    courses.find((c: any) => c.id === id)?.title ||
    coursesConfig.find((c) => c.id === id)?.titleShort ||
    id;
  
  // Active editing state
  const [editingTopic, setEditingTopic] = useState<Topic | null>(null);
  const [topicModuleId, setTopicModuleId] = useState<number | null>(null);
  const [isNewTopic, setIsNewTopic] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(true);

  // Quiz editing state
  const [editingQuiz, setEditingQuiz] = useState<QuizQuestion | null>(null);
  const [quizModuleId, setQuizModuleId] = useState<number | null>(null);
  const [isNewQuiz, setIsNewQuiz] = useState(false);

  // Phase 17: the topic editor's image field inserts a markdown LINK — there is
  // no upload endpoint behind it, so the state is named for what it holds.
  const [assetUrl, setAssetUrl] = useState('');

  // Direct certificate states
  const [users, setUsers] = useState<any[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [selectedCourseId, setSelectedCourseId] = useState<string>('C');
  // Credential verification console states (issue #101)
  const [certRecords, setCertRecords] = useState<any[]>([]);
  // Starts true: the mount fetch is scheduled, so "not yet received" is the
  // honest initial state (the console must not imply an empty credential list).
  const [credentialLoading, setCredentialLoading] = useState(true);
  const [credentialUpdating, setCredentialUpdating] = useState(false);

  // Referral tracker states
  const [referralSearch, setReferralSearch] = useState('');
  const [expandedReferrerId, setExpandedReferrerId] = useState<number | null>(null);

  // Course & Module creation states
  const [showAddCourseModal, setShowAddCourseModal] = useState(false);
  const [newCourseId, setNewCourseId] = useState('');
  const [newCourseTitle, setNewCourseTitle] = useState('');
  const [newCourseDesc, setNewCourseDesc] = useState('');
  const [newCoursePrice, setNewCoursePrice] = useState(999);
  const [newCourseBanner, setNewCourseBanner] = useState('');
  const [newCourseComingSoon, setNewCourseComingSoon] = useState(false);

  const [showAddModuleModal, setShowAddModuleModal] = useState(false);
  const [newModuleCourseId, setNewModuleCourseId] = useState('');
  const [newModuleWeek, setNewModuleWeek] = useState(1);
  const [newModuleTitle, setNewModuleTitle] = useState('');
  const [newModuleDesc, setNewModuleDesc] = useState('');

  // Contact Us Messages & Settings States
  const [messages, setMessages] = useState<any[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [messagesError, setMessagesError] = useState<string | null>(null);
  const [contactSettings, setContactSettings] = useState<ContactSettingsForm>({
    COMPANY_NAME: '',
    WEBSITE_URL: '',
    CONTACT_EMAIL: '',
    CONTACT_PHONE: '',
    CONTACT_HOURS: ''
  });
  const [settingsError, setSettingsError] = useState<string | null>(null);
  const [savingSettings, setSavingSettings] = useState(false);

  // Candidate edit modal state
  const [editingCandidate, setEditingCandidate] = useState<any | null>(null);
  const [savingCandidate, setSavingCandidate] = useState(false);
  const [candidateForm, setCandidateForm] = useState<CandidateForm>({
    name: '',
    email: '',
    fatherName: '',
    collegeName: '',
    branchName: '',
    courseType: 'Electronics',
    role: 'USER',
    certificateStartDate: '',
    certificateEndDate: ''
  });

  const fetchMessages = async () => {
    setLoadingMessages(true);
    setMessagesError(null);
    try {
      const res = await api.get('/contact/messages');
      setMessages(res.data);
    } catch (err: any) {
      console.error('Failed to fetch contact messages:', err);
      setMessagesError(err.response?.data?.message || 'Failed to load contact messages.');
    } finally {
      setLoadingMessages(false);
    }
  };

  const fetchContactSettings = async () => {
    setSettingsError(null);
    try {
      const res = await api.get('/contact/settings');
      setContactSettings(res.data);
    } catch (err: any) {
      console.error('Failed to fetch contact settings:', err);
      setSettingsError(err.response?.data?.message || 'Failed to load contact settings.');
    }
  };

  const handleSaveContactSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);
    try {
      await api.put('/contact/settings', contactSettings);
      addToast('System settings updated successfully!', 'success');
    } catch (err: any) {
      console.error('Failed to save settings:', err);
      addToast(err.response?.data?.message || 'Failed to save settings.', 'error');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleDeleteMessage = async (id: number) => {
    const ok = await confirmDialog({ title: 'Delete message?', message: 'Are you sure you want to permanently delete this message?', confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await api.delete(`/contact/messages/${id}`);
      addToast('Message deleted successfully.', 'success');
      fetchMessages();
    } catch (err) {
      console.error('Failed to delete message:', err);
      addToast('Failed to delete message.', 'error');
    }
  };

  // Fetch initial payment transactions for audit dashboard
  const fetchTransactions = async () => {
    setLoadingTransactions(true);
    setTransactionsError(null);
    try {
      const res = await api.get('/payments/admin/all');
      setTransactions(res.data);
    } catch (err: any) {
      console.error('Failed to fetch payment list:', err);
      setTransactionsError(err.response?.data?.message || 'Failed to load payment transactions.');
    } finally {
      setLoadingTransactions(false);
    }
  };

  // Fetch full submission queues for the review tab (#82)
  const fetchReview = async () => {
    setLoadingReview(true);
    setReviewError(null);
    try {
      const [assignRes, projectRes] = await Promise.all([
        api.get('/assignments/admin/all'),
        api.get('/projects/admin/all'),
      ]);
      setAssignments(assignRes.data?.submissions ?? []);
      setProjects(projectRes.data?.submissions ?? []);
    } catch (err: any) {
      console.error('Failed to load review queue:', err);
      setReviewError(err.response?.data?.message || 'Failed to load the review queue.');
    } finally {
      setLoadingReview(false);
    }
  };

  // Phase 14: real queue counts for the pending-actions strip. Same endpoint as
  // AdminInternshipsPanel — one source of truth for these numbers.
  const fetchInternshipStats = async () => {
    setLoadingInternshipStats(true);
    setInternshipStatsError(null);
    try {
      const res = await api.get<InternshipStats>('/internship/admin/stats');
      setInternshipStats(res.data);
    } catch (err: any) {
      console.error('Failed to load internship stats:', err);
      setInternshipStatsError(err.response?.data?.message || 'Failed to load internship stats.');
    } finally {
      setLoadingInternshipStats(false);
    }
  };

  // Fetch internship applications. The status filter is applied server-side
  // (`?status=`), so the table only ever holds rows matching the filter.
  const fetchInternships = async (status: '' | ApplicationStatus = internshipStatusFilter) => {
    setLoadingInternships(true);
    setInternshipsError(null);
    try {
      const res = await api.get('/internship/admin/applications', {
        params: status ? { status } : undefined,
      });
      setInternshipApplications(Array.isArray(res.data) ? res.data : []);
    } catch (err: any) {
      // A failed fetch must never render as "no applications" — the error is
      // surfaced and the table is held back (see AdminInternshipsPanel).
      setInternshipsError(
        err.response?.data?.message || 'Failed to load internship applications.'
      );
    } finally {
      setLoadingInternships(false);
    }
  };

  const handleInternshipFilterChange = (status: '' | ApplicationStatus) => {
    setInternshipStatusFilter(status);
    fetchInternships(status);
  };

  // Approve / reject a submission; awards XP server-side on approve
  const handleEvaluate = async (submission: any, isProject: boolean, status: 'APPROVED' | 'REJECTED') => {
    const ok = await confirmDialog({
      title: `${status === 'APPROVED' ? 'Approve' : 'Reject'} ${isProject ? 'project' : 'assignment'}`,
      message: `Mark the ${isProject ? 'project' : 'assignment'} by "${submission.user?.name}" as ${status.toLowerCase()}?${status === 'APPROVED' ? ` This awards ${isProject ? '100' : '20'} XP instantly.` : ''}`,
      confirmLabel: status === 'APPROVED' ? 'Approve' : 'Reject',
      danger: status === 'REJECTED',
    });
    if (!ok) return;
    setEvaluatingId(submission.id);
    try {
      const endpoint = isProject ? `/projects/admin/evaluate/${submission.id}` : `/assignments/admin/evaluate/${submission.id}`;
      await api.put(endpoint, { status });
      await fetchReview();
    } catch (err: any) {
      console.error('Evaluate failed:', err);
      addToast(err.response?.data?.message || 'Failed to update submission.', 'error');
    } finally {
      setEvaluatingId(null);
    }
  };

  // Fetch all registered users for certificate generator & directory
  const fetchUsers = async () => {
    setLoadingUsers(true);
    setUsersError(null);
    try {
      const res = await api.get('/auth/admin/users');
      setUsers(res.data);
      if (res.data.length > 0) {
        setSelectedStudentId(res.data[0].id.toString());
      }
    } catch (err: any) {
      console.error('Failed to load users for dropdown:', err);
      setUsersError(err.response?.data?.message || 'Failed to load registered users.');
    } finally {
      setLoadingUsers(false);
    }
  };

  // Issue #101: fetch all issued credentials with their verification status
  const fetchCertRecords = async () => {
    setCredentialLoading(true);
    setCertsError(null);
    try {
      const res = await api.get('/certificate/admin/all');
      setCertRecords(res.data);
    } catch (err: any) {
      console.error('Failed to load credential records:', err);
      setCertsError(err.response?.data?.message || 'Failed to load credential records.');
    } finally {
      setCredentialLoading(false);
    }
  };

  // Issue #101: the credential record for the currently selected student + track
  const selectedCredential = certRecords.find(
    (r) => String(r.userId) === selectedStudentId && r.courseId === selectedCourseId
  );

  const handleToggleCredentialVerification = async () => {
    if (!selectedCredential || credentialUpdating) return;
    const isVerified = selectedCredential.verificationStatus === 'VERIFIED';
    setCredentialUpdating(true);
    try {
      const action = isVerified ? 'unverify' : 'verify';
      const res = await api.post(`/certificate/admin/${selectedCredential.id}/${action}`);
      addToast(res.data.message || (isVerified ? 'Credential un-verified.' : 'Credential verified.'), 'success');
      fetchCertRecords();
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to update credential verification.', 'error');
    } finally {
      setCredentialUpdating(false);
    }
  };

  // Delete candidate account and all dependencies
  const handleDeleteUser = async (userId: number, userName: string) => {
    const ok = await confirmDialog({
      title: 'Delete user account?',
      message: `Are you sure you want to permanently delete "${userName}"? All their progress, results, certificates, and submissions will be permanently wiped out. This cannot be undone.`,
      confirmLabel: 'Delete User',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/auth/admin/users/${userId}`);
      addToast(`User "${userName}" was successfully deleted.`, 'success');
      fetchUsers(); // Refresh the users list
    } catch (err: any) {
      console.error('Failed to delete user:', err);
      addToast(err.response?.data?.message || 'Failed to delete user.', 'error');
    }
  };

  const handleOpenEditCandidate = (candidate: any) => {
    // Convert stored ISO/Date to YYYY-MM-DD for <input type="date">
    const toDateInput = (d: any) => d ? new Date(d).toISOString().slice(0, 10) : '';
    setEditingCandidate(candidate);
    setCandidateForm({
      name: candidate.name || '',
      email: candidate.email || '',
      fatherName: candidate.fatherName || '',
      collegeName: candidate.collegeName || '',
      branchName: candidate.branchName || '',
      courseType: candidate.courseType || 'Electronics',
      role: candidate.role || 'USER',
      certificateStartDate: toDateInput(candidate.certificateStartDate),
      certificateEndDate: toDateInput(candidate.certificateEndDate)
    });
  };

  const handleSaveCandidate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCandidate) return;
    setSavingCandidate(true);
    try {
      await api.put(`/auth/admin/users/${editingCandidate.id}`, candidateForm);
      addToast('Candidate profile updated successfully!', 'success');
      setEditingCandidate(null);
      fetchUsers();
    } catch (err: any) {
      console.error('Failed to update candidate profile:', err);
      addToast(err.response?.data?.message || 'Failed to update candidate profile.', 'error');
    } finally {
      setSavingCandidate(false);
    }
  };

  // Fetch syllabus courses and dynamic module data
  const fetchCmsCourses = async (courseIdToSelect?: string) => {
    setLoadingCms(true);
    try {
      const res = await api.get('/courses');
      // Format backend schema structure
      const formatted: Course[] = res.data.map((c: any) => ({
        id: c.id,
        title: c.title,
        description: c.description || '',
        modules: c.modules || [],
        banner: c.banner || null,
        comingSoon: c.comingSoon || false
      }));
      setCourses(formatted);
      if (formatted.length > 0) {
        const preserveId = courseIdToSelect || selectedCourse?.id;
        const matched = formatted.find(c => c.id === preserveId);
        setSelectedCourse(matched || formatted[0]);
      } else {
        setSelectedCourse(null);
      }
    } catch (err) {
      console.error('Failed to load courses for CMS:', err);
    } finally {
      setLoadingCms(false);
    }
  };

  // TASK 6: sync the course-settings form whenever a course is selected.
  useEffect(() => {
    setCmsBannerUrl(selectedCourse?.banner || '');
    setCmsComingSoon(selectedCourse?.comingSoon || false);
  }, [selectedCourse?.id]);

  // TASK 6: save banner URL / Coming Soon state via the existing admin PUT.
  const handleSaveCourseSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setSavingCourseSettings(true);
    try {
      const payload: Record<string, unknown> = {};
      const nextBanner = cmsBannerUrl.trim() || null;
      if (nextBanner !== (selectedCourse.banner || null)) payload.banner = nextBanner;
      if (cmsComingSoon !== !!selectedCourse.comingSoon) payload.comingSoon = cmsComingSoon;
      if (Object.keys(payload).length === 0) {
        addToast('No course settings changed.', 'info');
        return;
      }
      await api.put(`/courses/${selectedCourse.id}`, payload);
      addToast(`Course "${selectedCourse.id}" settings saved.`, 'success');
      await fetchCmsCourses(selectedCourse.id);
    } catch (err: any) {
      addToast(err.response?.data?.message || 'Failed to save course settings.', 'error');
    } finally {
      setSavingCourseSettings(false);
    }
  };

  const handleCreateCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseId || !newCourseTitle) {
      addToast('Course ID and Title are required.', 'warning');
      return;
    }
    try {
      const payload: Record<string, unknown> = {
        id: newCourseId.trim(),
        title: newCourseTitle.trim(),
        description: newCourseDesc.trim(),
        price: Number(newCoursePrice)
      };
      if (newCourseBanner.trim()) payload.banner = newCourseBanner.trim();
      if (newCourseComingSoon) payload.comingSoon = true;
      await api.post('/courses', payload);
      addToast(`Course "${newCourseTitle}" created successfully.`, 'success');
      
      const createdId = newCourseId.trim();
      // Clear fields
      setNewCourseId('');
      setNewCourseTitle('');
      setNewCourseDesc('');
      setNewCoursePrice(999);
      setNewCourseBanner('');
      setNewCourseComingSoon(false);
      setShowAddCourseModal(false);

      // Refresh list and select the newly created course
      await fetchCmsCourses(createdId);
    } catch (err: any) {
      console.error('Failed to create course:', err);
      addToast(err.response?.data?.message || 'Failed to create course.', 'error');
    }
  };

  const handleDeleteCourse = async (courseId: string, courseTitle: string) => {
    const ok = await confirmDialog({
      title: 'Delete course?',
      message: `Are you sure you want to permanently delete "${courseTitle}" (${courseId})? All modules, topics, and quiz questions associated with this course will be permanently wiped out.`,
      confirmLabel: 'Delete Course',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/courses/${courseId}`);
      addToast(`Course "${courseTitle}" was successfully deleted.`, 'success');
      // Refresh list of courses
      await fetchCmsCourses();
    } catch (err: any) {
      console.error('Failed to delete course:', err);
      addToast(err.response?.data?.message || 'Failed to delete course. Ensure no students have active progress or payments for this course first.', 'error');
    }
  };

  const handleAddModuleClick = (courseId: string) => {
    const activeCourse = courses.find(c => c.id === courseId);
    const nextWeek = activeCourse && activeCourse.modules ? activeCourse.modules.length + 1 : 1;
    setNewModuleCourseId(courseId);
    setNewModuleWeek(nextWeek);
    setNewModuleTitle('');
    setNewModuleDesc('');
    setShowAddModuleModal(true);
  };

  const handleCreateModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newModuleCourseId || !newModuleTitle) {
      addToast('Module Title is required.', 'warning');
      return;
    }
    try {
      const payload = {
        week: Number(newModuleWeek),
        title: newModuleTitle.trim(),
        description: newModuleDesc.trim()
      };
      await api.post(`/courses/${newModuleCourseId}/module`, payload);
      addToast(`Week ${newModuleWeek} Module created successfully.`, 'success');
      
      const targetCourseId = newModuleCourseId;
      // Clear fields
      setNewModuleCourseId('');
      setNewModuleWeek(1);
      setNewModuleTitle('');
      setNewModuleDesc('');
      setShowAddModuleModal(false);

      // Refresh list
      await fetchCmsCourses(targetCourseId);
    } catch (err: any) {
      console.error('Failed to create module:', err);
      addToast(err.response?.data?.message || 'Failed to create module.', 'error');
    }
  };

  const handleDeleteModule = async (moduleId: number, weekNum: number) => {
    const ok = await confirmDialog({
      title: 'Delete module?',
      message: `Are you sure you want to permanently delete Week ${weekNum} Module? This will wipe out all topics and quiz questions in this module.`,
      confirmLabel: 'Delete Module',
      danger: true,
    });
    if (!ok) return;
    try {
      await api.delete(`/courses/module/${moduleId}`);
      addToast(`Week ${weekNum} Module deleted successfully.`, 'success');
      await fetchCmsCourses(selectedCourse?.id);
    } catch (err: any) {
      console.error('Failed to delete module:', err);
      addToast(err.response?.data?.message || 'Failed to delete module.', 'error');
    }
  };

  // M-049: per-source in-flight guard — prevents duplicate request storms when
  // the same source is requested from more than one tab in quick succession.
  const inFlightRef = useRef<Record<string, boolean>>({});
  const runFetch = (key: string, fn: () => Promise<void>) => {
    if (inFlightRef.current[key]) return;
    inFlightRef.current[key] = true;
    Promise.resolve(fn()).finally(() => {
      inFlightRef.current[key] = false;
    });
  };

  // M-049: which data sources each tab's render actually reads. A tab only
  // fetches these (lazily), instead of eagerly loading all 7 datasets on mount.
  // - transactions hosts the Direct Certificate Access console → needs users + certRecords too
  // - referrals & analytics derive from users (+ payments / certs / courses for analytics)
  const TAB_SOURCES: Record<AdminTab, Array<{ key: string; run: () => Promise<void> }>> = {
    transactions: [
      { key: 'transactions', run: fetchTransactions },
      { key: 'users', run: fetchUsers },
      { key: 'certs', run: fetchCertRecords },
    ],
    cms: [{ key: 'cms', run: fetchCmsCourses }],
    users: [
      { key: 'users', run: fetchUsers },
      { key: 'certs', run: fetchCertRecords },
    ],
    messages: [{ key: 'messages', run: fetchMessages }],
    settings: [{ key: 'settings', run: fetchContactSettings }],
    review: [{ key: 'review', run: fetchReview }],
    internships: [{ key: 'internships', run: () => fetchInternships() }],
    // The Internship Management console (InternshipAdmin) self-fetches on mount —
    // it owns its own list, filters and pagination, so it shares no source. The
    // empty entry is still required: TAB_SOURCES is the set of tab ids the
    // loader knows about, and a tab missing from it never gets marked loaded.
    internshipRecords: [],
    referrals: [{ key: 'users', run: fetchUsers }],
    analytics: [
      { key: 'users', run: fetchUsers },
      { key: 'transactions', run: fetchTransactions },
      { key: 'certs', run: fetchCertRecords },
      { key: 'cms', run: fetchCmsCourses },
    ],
  };

  // Tab switch: set the tab, then (re)fetch its sources. Refetching on every
  // switch keeps counts fresh; the same-tab guard avoids duplicates on re-render;
  // the in-flight guard avoids duplicate storms.
  const handleTabClick = (tabId: AdminTab) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    TAB_SOURCES[tabId].forEach((s) => runFetch(s.key, s.run));
  };

  // M-049: mount fetches ONLY what the default tab (transactions) needs to render
  // plus the review queue that powers the tab-bar pending badge (audit §10 —
  // "the review badge source if retained"). Every other tab loads on first open.
  useEffect(() => {
    const timer = setTimeout(() => {
      runFetch('transactions', fetchTransactions);
      runFetch('users', fetchUsers);
      runFetch('certs', fetchCertRecords);
      runFetch('review', fetchReview);
      // CMS course titles power the certificate-console dropdown + title lookup;
      // fetch once on mount so they're available on the default tab too.
      runFetch('cms', fetchCmsCourses);
      // Phase 14: the pending-actions strip is visible on every tab, so its one
      // extra source is fetched on mount rather than lazily per tab.
      runFetch('internshipStats', fetchInternshipStats);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  // Fetch all topics and quiz questions for a module once expanded
  const handleToggleExpandModule = async (moduleId: number, courseId: string, week: number, forceRefresh = false) => {
    if (expandedModuleId === moduleId && !forceRefresh) {
      setExpandedModuleId(null);
      return;
    }

    try {
      const res = await api.get(`/courses/${courseId}/module/${week}`);
      const detailedModule = res.data;
      
      // Also fetch quiz questions from REST API
      const quizRes = await api.get(`/quiz/questions/${courseId}/${week}`);
      
      // Update local state with both rich details and quiz questions in one batch to prevent race condition/state overwrite
      if (selectedCourse) {
        const updatedModules = selectedCourse.modules?.map(m => 
          m.id === moduleId ? { ...m, topics: detailedModule.topics, quizQuestions: quizRes.data.questions } : m
        );
        setSelectedCourse({ ...selectedCourse, modules: updatedModules });
      }

      setExpandedModuleId(moduleId);
    } catch (err) {
      console.error('Failed to load module details:', err);
      // Fallback local simulation if database tables are in process of seeding
      setExpandedModuleId(moduleId);
    }
  };

  // Topic actions (CRUD & Sorting)
  const handleOpenEditTopic = (topic: Topic, moduleId: number) => {
    setEditingTopic({ ...topic });
    setTopicModuleId(moduleId);
    setIsNewTopic(false);
  };

  const handleOpenAddTopic = (moduleId: number) => {
    const nextOrder = selectedCourse?.modules?.find(m => m.id === moduleId)?.topics?.length || 0;
    setEditingTopic({
      title: '',
      text: '',
      code: '',
      note: '',
      order: nextOrder
    });
    setTopicModuleId(moduleId);
    setIsNewTopic(true);
  };

  const handleSaveTopic = async () => {
    if (!editingTopic || topicModuleId === null || !selectedCourse) return;

    try {
      if (isNewTopic) {
        await api.post(`/courses/module/${topicModuleId}/topic`, editingTopic);
      } else {
        await api.put(`/courses/topic/${editingTopic.id}`, editingTopic);
      }

      // Refresh curriculum details
      const activeModule = selectedCourse.modules?.find(m => m.id === topicModuleId);
      if (activeModule) {
        await handleToggleExpandModule(topicModuleId, selectedCourse.id, activeModule.week, true);
        // Toggle open back again
        setExpandedModuleId(topicModuleId);
      }

      setEditingTopic(null);
      addToast('Topic saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save topic:', err);
      addToast('Failed to save topic.', 'error');
    }
  };

  const handleDeleteTopic = async (topicId: number, moduleId: number) => {
    const ok = await confirmDialog({ title: 'Delete topic?', message: 'Are you sure you want to permanently delete this topic?', confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await api.delete(`/courses/topic/${topicId}`);
      if (selectedCourse) {
        const activeModule = selectedCourse.modules?.find(m => m.id === moduleId);
        if (activeModule) {
          await handleToggleExpandModule(moduleId, selectedCourse.id, activeModule.week, true);
          setExpandedModuleId(moduleId);
        }
      }
      addToast('Topic deleted successfully.', 'success');
    } catch (err) {
      console.error('Failed to delete topic:', err);
    }
  };

  // Drag-and-Drop / Shifting topic orders dynamically (Issue #8)
  const handleShiftTopicOrder = async (topicIndex: number, direction: 'up' | 'down', moduleId: number) => {
    if (!selectedCourse) return;
    const activeModule = selectedCourse.modules?.find(m => m.id === moduleId);
    if (!activeModule || !activeModule.topics) return;

    const topicsList = [...activeModule.topics];
    const targetIndex = direction === 'up' ? topicIndex - 1 : topicIndex + 1;

    if (targetIndex < 0 || targetIndex >= topicsList.length) return;

    // Swap ordering numbers
    const tempOrder = topicsList[topicIndex].order;
    topicsList[topicIndex].order = topicsList[targetIndex].order;
    topicsList[targetIndex].order = tempOrder;

    // Update in database using API calls
    try {
      await api.put(`/courses/topic/${topicsList[topicIndex].id}`, { order: topicsList[topicIndex].order });
      await api.put(`/courses/topic/${topicsList[targetIndex].id}`, { order: topicsList[targetIndex].order });
      
      await handleToggleExpandModule(moduleId, selectedCourse.id, activeModule.week, true);
      setExpandedModuleId(moduleId);
    } catch (err) {
      console.error('Failed to shift topic ordering:', err);
    }
  };

  // Quiz Question actions
  const handleOpenAddQuiz = (moduleId: number) => {
    setEditingQuiz({
      text: '',
      options: ['', '', '', ''],
      correctAnswer: ''
    });
    setQuizModuleId(moduleId);
    setIsNewQuiz(true);
  };

  const handleOpenEditQuiz = (quiz: QuizQuestion, moduleId: number) => {
    setEditingQuiz({ ...quiz });
    setQuizModuleId(moduleId);
    setIsNewQuiz(false);
  };

  const handleSaveQuiz = async () => {
    if (!editingQuiz || quizModuleId === null || !selectedCourse) return;

    try {
      if (isNewQuiz) {
        await api.post(`/quiz/module/${quizModuleId}/question`, editingQuiz);
      } else {
        await api.put(`/quiz/question/${editingQuiz.id}`, editingQuiz);
      }

      // Refresh curriculum details
      const activeModule = selectedCourse.modules?.find(m => m.id === quizModuleId);
      if (activeModule) {
        await handleToggleExpandModule(quizModuleId, selectedCourse.id, activeModule.week, true);
        setExpandedModuleId(quizModuleId);
      }

      setEditingQuiz(null);
      addToast('Quiz question saved successfully!', 'success');
    } catch (err) {
      console.error('Failed to save quiz question:', err);
      addToast('Failed to save quiz question.', 'error');
    }
  };

  const handleDeleteQuiz = async (quizId: number, moduleId: number) => {
    const ok = await confirmDialog({ title: 'Delete question?', message: 'Are you sure you want to permanently delete this quiz question?', confirmLabel: 'Delete', danger: true });
    if (!ok) return;
    try {
      await api.delete(`/quiz/question/${quizId}`);
      if (selectedCourse) {
        const activeModule = selectedCourse.modules?.find(m => m.id === moduleId);
        if (activeModule) {
          await handleToggleExpandModule(moduleId, selectedCourse.id, activeModule.week, true);
          setExpandedModuleId(moduleId);
        }
      }
      addToast('Quiz question deleted successfully.', 'success');
    } catch (err) {
      console.error('Failed to delete quiz question:', err);
    }
  };

  // Phase 17: appends a markdown image link to the topic body. There is no
  // upload endpoint in this app, so this does exactly what it says — it inserts
  // the pasted URL and claims nothing more.
  const handleInsertAssetLink = () => {
    const url = assetUrl.trim();
    if (!url || !editingTopic) return;
    setEditingTopic({
      ...editingTopic,
      text: editingTopic.text + `\n\n![Infographic](${url})`
    });
    setAssetUrl('');
    addToast('Infographic link inserted into the topic body.', 'success');
  };

  // Phase 14: PENDING + UNDER_REVIEW are the two states that still need an
  // admin decision (the same pair the internships panel acts on).
  const pendingReviewTotal =
    assignments.filter((s) => s.status === 'PENDING').length +
    projects.filter((s) => s.status === 'PENDING').length;

  // Every entry is either a real count from a fetch that succeeded or an
  // explicit "not received" — see AdminPendingActions for how that renders.
  const pendingActionItems: PendingActionItem[] = [
    {
      id: 'review',
      label: 'Submissions',
      state: reviewError ? 'error' : loadingReview ? 'loading' : 'ready',
      count: pendingReviewTotal,
      hint: 'Assignments and projects still awaiting evaluation.',
      tab: 'review',
    },
    {
      id: 'internships',
      label: 'Internships',
      state: internshipStatsError ? 'error' : loadingInternshipStats ? 'loading' : 'ready',
      count: (internshipStats?.byStatus?.PENDING ?? 0) + (internshipStats?.byStatus?.UNDER_REVIEW ?? 0),
      hint: 'Applications submitted or under review.',
      tab: 'internships',
    },
    {
      id: 'payments',
      label: 'Payments',
      // New rows are PENDING; PENDING_VERIFICATION is the pre-rename value.
      state: transactionsError ? 'error' : loadingTransactions ? 'loading' : 'ready',
      count: transactions.filter((t: any) => t.status === 'PENDING' || t.status === 'PENDING_VERIFICATION').length,
      hint: 'Transactions waiting for manual verification.',
      tab: 'transactions',
    },
    {
      id: 'credentials',
      label: 'Credentials',
      state: certsError ? 'error' : credentialLoading ? 'loading' : 'ready',
      count: certRecords.filter((r: any) => r.verificationStatus !== 'VERIFIED').length,
      hint: 'Issued certificates not yet verified.',
      tab: 'transactions',
    },
  ];

  // Phase 17: the referral figures are only meaningful once GET
  // /auth/admin/users has answered. Until then — or after a failure — they
  // render an em dash; a "0 referred" card would read as a measured zero.
  const referralDataReady = !usersError && !(loadingUsers && users.length === 0);
  const totalReferred = users.filter((u) => u.referredBy).length;
  const paidReferred = users.filter(
    (u) => u.referredBy && u.payments?.some((p: any) => p.status === 'VERIFIED')
  ).length;
  // No seeded placeholder row: a user who has referred nobody is not a "top
  // referrer", so this is null until someone actually has referrals.
  const topReferrer = users.reduce<any | null>(
    (best, u) => ((u.referralCount || 0) > (best?.referralCount || 0) ? u : best),
    null
  );

  return (
    <PageContainer maxWidth="max-w-6xl" className="space-y-8 py-4">

      <AdminNavTabs
        activeTab={activeTab}
        onTabClick={handleTabClick}
        reviewPendingCount={pendingReviewTotal}
        onReload={() => { fetchTransactions(); fetchCmsCourses(); }}
      />

      {/* Phase 14: what is genuinely waiting on an admin, from live data only */}
      <AdminPendingActions items={pendingActionItems} onSelect={handleTabClick} />

      {/* Content Area */}
      <div className="space-y-6">

        {/* ── Review Queue (#82) ─────────────────────────────────────────── */}
        {activeTab === 'review' && (
          <AdminReviewQueue
            assignments={assignments}
            projects={projects}
            loading={loadingReview}
            error={reviewError}
            reviewTab={reviewTab}
            onReviewTabChange={setReviewTab}
            evaluatingId={evaluatingId}
            onEvaluate={handleEvaluate}
            courseTitleById={courseTitleById}
            onRetry={fetchReview}
          />
        )}

        {/* ── Internships (applications + response workflow) ─────────────── */}
        {activeTab === 'internships' && (
          <AdminInternshipsPanel
            applications={internshipApplications}
            loading={loadingInternships}
            error={internshipsError}
            onRefetch={() => fetchInternships()}
            statusFilter={internshipStatusFilter}
            onStatusFilterChange={handleInternshipFilterChange}
          />
        )}

        {/* ── Internship Management (records → completion → certificate) ──── */}
        {/* A separate destination from the panel above: that one reviews program
            applications, this one manages the interns those applications become
            and issues their credentials. Distinct concerns, distinct tabs. */}
        {activeTab === 'internshipRecords' && <InternshipAdmin />}

        {activeTab === 'transactions' && (
          <div className="space-y-6 animate-fade-in">
            {/* Direct Certificate Access Console */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="pb-2 border-b border-slate-800/80">
                <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <Award size={18} className="text-cyan-400" /> Direct Certificate Access Console
                </h3>
                <p className="text-slate-400 text-xs mt-1">Select any registered student and track to generate/preview their certificate instantly, bypassing payment & completion rules.</p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4 items-end">
                <div className="flex-1">
                  <Select
                    label="Select Student"
                    value={selectedStudentId}
                    onChange={(e) => setSelectedStudentId(e.target.value)}
                    className="px-4 py-2.5 text-xs"
                  >
                    {users.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.email})
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="w-full sm:w-1/3">
                  <Select
                    label="Select Track"
                    value={selectedCourseId}
                    onChange={(e) => setSelectedCourseId(e.target.value)}
                    className="px-4 py-2.5 text-xs"
                  >
                    {(courses.length > 0 ? courses : coursesConfig).map((c: any) => (
                      <option key={c.id} value={c.id}>
                        {c.title || c.titleShort || c.id} ({c.id})
                      </option>
                    ))}
                  </Select>
                </div>
                <button
                  onClick={() => {
                    if (selectedStudentId) {
                      window.open(`/certificate?courseId=${encodeURIComponent(selectedCourseId)}&userId=${selectedStudentId}`, '_blank');
                    }
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-750 text-white font-black text-xs uppercase tracking-widest rounded-xl transition shadow active:scale-95 disabled:opacity-50"
                  disabled={!selectedStudentId}
                >
                  View Certificate
                </button>
              </div>

              {/* Issue #101: Credential Verify — verify/un-verify the selected credential */}
              <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <h4 className="text-[12px] uppercase font-black tracking-wider text-slate-300 flex items-center gap-1.5">
                    <ShieldCheck size={14} className="text-emerald-400" /> Credential Verification Status
                  </h4>
                  <button
                    onClick={fetchCertRecords}
                    disabled={credentialLoading}
                    className="text-[12px] text-slate-400 hover:text-white transition font-bold uppercase tracking-wider inline-flex items-center gap-1 disabled:opacity-50"
                  >
                    <RefreshCw size={12} /> {credentialLoading ? 'Loading…' : 'Refresh'}
                  </button>
                </div>

                {selectedCredential ? (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 space-y-1 min-w-0">
                      <p className="text-[12px] uppercase tracking-wider text-slate-500 font-semibold">Credential ID</p>
                      <p className="text-xs font-mono text-slate-200 break-all">{selectedCredential.verificationCode}</p>
                      <div className="flex items-center gap-2 pt-1">
                        {selectedCredential.verificationStatus === 'VERIFIED' ? (
                          <span className="inline-flex items-center gap-1 text-[12px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                            <ShieldCheck size={12} /> Verified
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[12px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
                            <ShieldAlert size={12} /> Pending Verification
                          </span>
                        )}
                        {selectedCredential.verifiedAt && (
                          <span className="text-[12px] text-slate-500">
                            verified {new Date(selectedCredential.verifiedAt).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={handleToggleCredentialVerification}
                      disabled={credentialUpdating}
                      className={
                        selectedCredential.verificationStatus === 'VERIFIED'
                          ? 'px-4 py-2 text-[12px] font-black uppercase tracking-widest rounded-lg border border-slate-700 text-slate-300 hover:border-rose-500/50 hover:text-rose-400 transition disabled:opacity-50 shrink-0'
                          : 'px-4 py-2 text-[12px] font-black uppercase tracking-widest rounded-lg bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/25 transition disabled:opacity-50 shrink-0'
                      }
                    >
                      {credentialUpdating ? 'Updating…' : selectedCredential.verificationStatus === 'VERIFIED' ? 'Un-verify Credential' : '✓ Verify Credential'}
                    </button>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500">
                    No credential issued yet for this student + track. Click <strong>View Certificate</strong> to generate it, then verify it here.
                  </p>
                )}
              </div>
            </div>

            <AdminPaymentTable
              transactions={transactions} 
              loading={loadingTransactions}
              onVerified={fetchTransactions}
            />
          </div>
        )}

        {activeTab === 'cms' && (
          /* Advanced Interactive CMS Syllabus Builder (Issue #8) */
          <div className="flex flex-col lg:flex-row gap-6">
            
            {/* Sidebar Tracks */}
            <div className="w-full lg:w-1/4 bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-3 shrink-0">
              <div className="flex justify-between items-center px-2 pb-2 border-b border-slate-800">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-350">
                  Learning Tracks
                </h3>
                <button
                  onClick={() => setShowAddCourseModal(true)}
                  className="px-2 py-1 bg-cyan-500 hover:bg-cyan-600 text-slate-950 rounded text-[12px] font-black uppercase transition flex items-center gap-1 focus:outline-none"
                  title="Create New Course Track"
                >
                  <Plus size={11} /> Add
                </button>
              </div>
              <div className="space-y-2">
                {courses.map((c) => (
                  <div
                    key={c.id}
                    className={`w-full px-4 py-3 rounded-xl border flex items-center justify-between transition-all ${
                      selectedCourse?.id === c.id
                        ? 'bg-cyan-500/10 border-cyan-500/50 text-white font-extrabold shadow shadow-cyan-500/5'
                        : 'bg-slate-850/20 border-slate-800/80 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
                    }`}
                  >
                    <button
                      onClick={() => { setSelectedCourse(c); setExpandedModuleId(null); }}
                      className="flex-1 text-left text-xs uppercase font-black tracking-wider focus:outline-none truncate pr-2"
                      title={c.title}
                    >
                      {c.id}
                    </button>
                    <div className="flex items-center gap-1.5 shrink-0" onClick={e => e.stopPropagation()}>
                      <button
                        onClick={() => handleDeleteCourse(c.id, c.title)}
                        className="p-1 hover:bg-slate-800 rounded text-rose-500 transition focus:outline-none"
                        title="Delete Course Track"
                        aria-label="Delete course track"
                      >
                        <Trash2 size={12} />
                      </button>
                      <ChevronRight size={14} className="text-slate-500" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Syllabus Editor Console */}
            <div className="flex-1 bg-slate-900/20 border border-slate-800 rounded-2xl p-6 space-y-6">
              {loadingCms ? (
                <div className="py-12 text-center text-slate-500 font-semibold text-sm">Loading CMS builder modules...</div>
              ) : selectedCourse ? (
                <div className="space-y-6">
                  
                  {/* Course Title Header */}
                  <div className="pb-4 border-b border-slate-800/80 flex justify-between items-center">
                    <div>
                      <span className="text-[12px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20">
                        {selectedCourse.id} Curriculum Console
                      </span>
                      <h2 className="text-lg font-black text-white mt-1.5">Syllabus Weeks & Modules</h2>
                    </div>
                    <button
                      onClick={() => handleAddModuleClick(selectedCourse.id)}
                      className="px-3 py-2 bg-slate-850 hover:bg-slate-800 text-cyan-400 hover:text-white border border-slate-800 rounded-xl text-xs font-black uppercase transition flex items-center gap-1.5 focus:outline-none"
                    >
                      <Plus size={14} /> Add Week Module
                    </button>
                  </div>

                  {/* TASK 6 — Course Banner & Coming Soon settings */}
                  <form onSubmit={handleSaveCourseSettings} className="rounded-xl border border-slate-850 bg-slate-950/30 p-4 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Image size={14} className="text-cyan-400" />
                        <h3 className="text-xs font-black uppercase tracking-wider text-slate-300">Course Banner &amp; Availability</h3>
                      </div>
                      <label className="flex items-center gap-2 text-[12px] font-black uppercase tracking-wider text-slate-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={cmsComingSoon}
                          onChange={(e) => setCmsComingSoon(e.target.checked)}
                          className="accent-orange-500 h-4 w-4"
                        />
                        Coming Soon
                      </label>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="url"
                        value={cmsBannerUrl}
                        onChange={(e) => setCmsBannerUrl(e.target.value)}
                        placeholder="/static/course-banners/my-course.svg  or  https://…"
                        className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 text-xs text-white placeholder-slate-655 focus:outline-none focus:border-cyan-500 transition font-bold"
                      />
                      <button
                        type="submit"
                        disabled={savingCourseSettings}
                        className="px-4 py-2 bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 rounded-xl text-xs font-black uppercase tracking-wider transition inline-flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        <Save size={13} /> {savingCourseSettings ? 'Saving…' : 'Save Settings'}
                      </button>
                    </div>
                    {cmsBannerUrl && (
                      <div className="flex items-center gap-3">
                        <img
                          src={resolveCourseBanner(cmsBannerUrl) || undefined}
                          alt="Banner preview"
                          loading="lazy"
                          className="w-36 aspect-[16/9] object-cover rounded-lg border border-slate-800"
                        />
                        <span className="text-[12px] text-slate-500 leading-relaxed">
                          Live preview. Leave empty to keep the clean category-based fallback visual on cards.
                        </span>
                      </div>
                    )}
                  </form>

                  {/* Modules Accordions */}
                  <div className="space-y-4">
                    {(!selectedCourse.modules || selectedCourse.modules.length === 0) ? (
                      <div className="py-12 text-center text-slate-500 border border-dashed border-slate-800 rounded-xl text-sm font-semibold">
                        No syllabus weeks/modules defined for this course yet.<br />
                        <button
                          onClick={() => handleAddModuleClick(selectedCourse.id)}
                          className="mt-3 px-4 py-2 bg-cyan-500 text-slate-950 rounded-xl text-xs font-black uppercase hover:bg-cyan-600 transition inline-flex items-center gap-1 focus:outline-none"
                        >
                          <Plus size={13} /> Add Week 1 Module
                        </button>
                      </div>
                    ) : (
                      selectedCourse.modules.map((m) => {
                        const isExpanded = expandedModuleId === m.id;
                        return (
                          <div key={m.id} className="border border-slate-850 rounded-xl bg-slate-950/20 overflow-hidden">
                            
                            {/* Module Header Bar (keyboard-accessible accordion) */}
                            <div
                              role="button"
                              tabIndex={0}
                              aria-expanded={isExpanded}
                              onClick={() => handleToggleExpandModule(m.id, selectedCourse.id, m.week)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' || e.key === ' ') {
                                  e.preventDefault();
                                  handleToggleExpandModule(m.id, selectedCourse.id, m.week);
                                }
                              }}
                              className="p-4 bg-slate-900/40 hover:bg-slate-900/80 flex items-center justify-between cursor-pointer transition select-none"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-xs font-black text-slate-300">
                                  W{m.week}
                                </div>
                                <div>
                                  <h4 className="text-sm font-bold text-slate-200">{m.title}</h4>
                                  <p className="text-[12px] text-slate-500 truncate max-w-[320px]">{m.description}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-2.5" onClick={e => e.stopPropagation()}>
                                <button 
                                  onClick={() => handleOpenAddTopic(m.id)}
                                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-cyan-400 hover:text-white rounded-lg text-[12px] font-bold uppercase transition flex items-center gap-1"
                                >
                                  <Plus size={12} /> Add Topic
                                </button>
                                <button 
                                  onClick={() => handleOpenAddQuiz(m.id)}
                                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-yellow-400 hover:text-white rounded-lg text-[12px] font-bold uppercase transition flex items-center gap-1"
                                >
                                  <Plus size={12} /> Add Quiz Q
                                </button>
                                <button 
                                  onClick={() => handleDeleteModule(m.id, m.week)}
                                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-rose-500 hover:text-white rounded-lg text-[12px] font-bold transition flex items-center justify-center"
                                  title="Delete Module"
                                  aria-label="Delete module"
                                >
                                  <Trash2 size={12} />
                                </button>
                                {isExpanded ? <ChevronDown size={16} className="text-slate-400" /> : <ChevronRight size={16} className="text-slate-400" />}
                              </div>
                            </div>

                          {/* Expanded Content View */}
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="border-t border-slate-900 bg-slate-950/40 p-4 space-y-6"
                              >
                                
                                {/* Topics Section */}
                                <div className="space-y-3">
                                  <h5 className="text-[12px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                    <FileText size={12} /> Topic Curriculum Blocks
                                  </h5>

                                  {(!m.topics || m.topics.length === 0) ? (
                                    <div className="text-[12px] text-slate-600 pl-4 py-2 font-semibold">No topics defined for this week. Click 'Add Topic' above.</div>
                                  ) : (
                                    <div className="space-y-2">
                                      {m.topics.map((t, idx) => (
                                        <div key={t.id} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between group/row">
                                          <div className="flex items-center gap-3">
                                            <span className="text-[12px] font-bold text-slate-600">#{idx + 1}</span>
                                            <div>
                                              <span className="text-xs font-bold text-slate-200">{t.title}</span>
                                              {t.code && <span className="ml-2 text-[12px] bg-cyan-500/10 border border-cyan-500/25 px-1.5 py-0.5 rounded text-cyan-400 font-mono">Code</span>}
                                            </div>
                                          </div>
                                          
                                          {/* CMS Shifting and CRUD buttons (Issue #8) */}
                                          <div className="flex items-center gap-2">
                                            <button 
                                              disabled={idx === 0}
                                              onClick={() => handleShiftTopicOrder(idx, 'up', m.id)}
                                              className="p-1 text-slate-500 hover:text-cyan-400 disabled:opacity-20 transition"
                                            >
                                              <ArrowUp size={14} />
                                            </button>
                                            <button 
                                              disabled={idx === (m.topics?.length ?? 1) - 1}
                                              onClick={() => handleShiftTopicOrder(idx, 'down', m.id)}
                                              className="p-1 text-slate-500 hover:text-cyan-400 disabled:opacity-20 transition"
                                            >
                                              <ArrowDown size={14} />
                                            </button>
                                            <button 
                                              onClick={() => handleOpenEditTopic(t, m.id)}
                                              className="p-1 text-slate-500 hover:text-emerald-400 transition"
                                            >
                                              <Edit3 size={14} />
                                            </button>
                                            <button 
                                              onClick={() => t.id && handleDeleteTopic(t.id, m.id)}
                                              className="p-1 text-slate-500 hover:text-red-400 transition"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                                {/* Quiz Questions Section */}
                                <div className="space-y-3 pt-2">
                                  <h5 className="text-[12px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1">
                                    <Award size={12} className="text-yellow-500" /> Assessment Questions
                                  </h5>

                                  {(!m.quizQuestions || m.quizQuestions.length === 0) ? (
                                    <div className="text-[12px] text-slate-600 pl-4 py-2 font-semibold">No quiz questions defined for this week assessment.</div>
                                  ) : (
                                    <div className="space-y-2">
                                      {m.quizQuestions.map((q, idx) => (
                                        <div key={q.id} className="p-3 bg-slate-900/60 border border-slate-850 rounded-xl flex items-center justify-between">
                                          <div className="space-y-1">
                                            <div className="text-xs font-bold text-slate-200">
                                              <span className="text-yellow-500 font-black mr-1">Q{idx + 1}.</span> {q.text}
                                            </div>
                                            <div className="text-[12px] text-slate-500 font-mono">
                                              Correct Ans: <span className="text-emerald-400 font-bold">{q.correctAnswer}</span>
                                            </div>
                                          </div>
                                          
                                          <div className="flex items-center gap-2">
                                            <button 
                                              onClick={() => handleOpenEditQuiz(q, m.id)}
                                              className="p-1 text-slate-500 hover:text-emerald-400 transition"
                                            >
                                              <Edit3 size={14} />
                                            </button>
                                            <button 
                                              onClick={() => q.id && handleDeleteQuiz(q.id, m.id)}
                                              className="p-1 text-slate-500 hover:text-red-400 transition"
                                            >
                                              <Trash2 size={14} />
                                            </button>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>

                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    }))}
                  </div>

                </div>
              ) : (
                <div className="py-12 text-center text-slate-500 text-xs">Select a course track to begin syllabus adjustments.</div>
              )}
            </div>

          </div>
        )}

        {activeTab === 'users' && (
          <AdminCandidatesTable
            users={users}
            loading={loadingUsers}
            error={usersError}
            onRetry={fetchUsers}
            onEdit={handleOpenEditCandidate}
            onDelete={handleDeleteUser}
            editingCandidate={editingCandidate}
            candidateForm={candidateForm}
            onCandidateFormChange={setCandidateForm}
            savingCandidate={savingCandidate}
            onSaveCandidate={handleSaveCandidate}
            onCloseEdit={() => setEditingCandidate(null)}
          />
        )}

        {activeTab === 'messages' && (
          <AdminMessagesTable
            messages={messages}
            loading={loadingMessages}
            error={messagesError}
            onDelete={handleDeleteMessage}
            onRetry={fetchMessages}
          />
        )}

        {activeTab === 'settings' && (
          <AdminContactSettings
            settings={contactSettings}
            onSettingsChange={setContactSettings}
            saving={savingSettings}
            onSubmit={handleSaveContactSettings}
            error={settingsError}
            onRetry={fetchContactSettings}
          />
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in text-slate-350">
            {/* M-049: metrics computed live from admin data (users, payments,
                certificates, courses). No fabricated numbers. */}
            <div className="p-4 rounded-2xl border border-cyan-500/20 bg-cyan-500/5 text-[12px] leading-relaxed text-cyan-300 flex items-center justify-between gap-3">
              <span>
                Metrics are computed live from the admin data this dashboard already fetches
                (users, payments, certificates, courses) and refresh each time this tab opens.
                Figures that would need a dedicated analytics endpoint are marked unavailable —
                nothing here is estimated.
              </span>
              {(loadingTransactions || credentialLoading || loadingCms || loadingUsers) && (
                <span className="shrink-0 text-[12px] font-black uppercase tracking-wider text-cyan-400">Refreshing…</span>
              )}
            </div>

            {/* Real stat cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: 'Registered Users', value: users.length },
                { label: 'Started a Course', value: users.filter((u: any) => (u.progresses?.length ?? 0) > 0).length },
                { label: 'Verified Payments', value: transactions.filter((t: any) => t.status === 'VERIFIED').length },
                { label: 'Certificates Issued', value: certRecords.length },
              ].map((card, idx) => (
                <div key={idx} className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                  <span className="text-[12px] font-black uppercase tracking-wider text-slate-500">{card.label}</span>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-2xl font-black text-white">{card.value.toLocaleString()}</h3>
                    <span className="text-[12px] font-bold text-emerald-400">live</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Learner progression — real 3-stage funnel */}
            <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Learner Progression</h4>
                <p className="text-[12px] text-slate-500 mt-1">Registered → started a course (has progress) → earned a certificate. Computed from live admin data.</p>
              </div>
              {users.length === 0 ? (
                <p className="text-xs text-slate-500">No user data loaded yet.</p>
              ) : (
                <div className="space-y-4">
                  {[
                    { milestone: 'Registered Users', count: users.length },
                    { milestone: 'Started a Course (has progress)', count: users.filter((u: any) => (u.progresses?.length ?? 0) > 0).length },
                    { milestone: 'Earned Certificate', count: certRecords.length },
                  ].map((m, idx) => {
                    const pct = users.length > 0 ? Math.round((m.count / users.length) * 100) : 0;
                    return (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex justify-between items-center text-xs">
                          <span className="font-semibold text-slate-350">{m.milestone}</span>
                          <span className="text-slate-500 font-mono">{m.count} ({pct}%)</span>
                        </div>
                        <div className="h-3 bg-slate-950 rounded-full overflow-hidden p-[1px] border border-slate-900">
                          <div
                            className="h-full bg-cyan-500/70 rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Track distribution — real enrollments & certificates per course */}
            <div className="bg-slate-900/30 border border-slate-800 p-6 rounded-2xl space-y-6">
              <div>
                <h4 className="text-sm font-bold text-white uppercase tracking-wider">Track Distribution</h4>
                <p className="text-[12px] text-slate-500 mt-1">Enrollments (users with course progress) and certificates issued per track, from live admin data.</p>
              </div>
              {courses.length === 0 ? (
                <p className="text-xs text-slate-500">Course data not available yet.</p>
              ) : (
                <div className="space-y-5 pt-2">
                  {courses.map((course) => {
                    const enrolled = users.filter((u: any) => (u.progresses ?? []).some((p: any) => p.courseId === course.id)).length;
                    const certs = certRecords.filter((r: any) => r.courseId === course.id).length;
                    const pct = users.length > 0 ? Math.round((enrolled / users.length) * 100) : 0;
                    return (
                      <div key={course.id} className="flex items-center gap-4">
                        <div className="w-32 text-xs font-bold text-slate-400 truncate" title={course.title}>{course.title.split(' & ')[0]}</div>
                        <div className="flex-1 h-6 bg-slate-950 rounded-lg overflow-hidden border border-slate-900 relative">
                          <div className="h-full bg-cyan-500/10 border-r-2 border-cyan-400" style={{ width: `${pct}%` }}></div>
                        </div>
                        <div className="text-[12px] font-bold text-slate-500 shrink-0 text-right w-28">
                          {enrolled} enr / {certs} cert
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Clearly-labeled unavailable metrics — no fabricated numbers */}
            <div className="p-6 bg-slate-900/30 border border-dashed border-slate-700 rounded-2xl space-y-3">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Not available from current admin APIs</h4>
              <p className="text-[12px] leading-relaxed text-slate-500">
                Quiz accuracy, completion rate, and per-week quiz funnel breakdowns cannot be computed from the
                endpoints this dashboard consumes (users, payments, certificates, courses). A dedicated analytics
                endpoint would be required — these figures are marked unavailable rather than estimated.
              </p>
            </div>
          </div>
        )}

        {activeTab === 'referrals' && (
          <div className="space-y-6 animate-fade-in text-slate-350">
            {/* Referral Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Card 1: Total Referred */}
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[12px] font-black uppercase tracking-wider text-slate-500">Total Referred Students</span>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-white">
                    {referralDataReady ? totalReferred : '—'}
                  </h3>
                  <span className="text-[12px] font-bold text-emerald-400">
                    Signups via Code
                  </span>
                </div>
              </div>

              {/* Card 2: Top Referrer — no placeholder row, so an empty directory
                  reads as "nothing recorded" rather than a real-looking "N/A" */}
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[12px] font-black uppercase tracking-wider text-slate-500">Top Referrer</span>
                {!referralDataReady ? (
                  <h3 className="text-sm font-black text-slate-500 italic">Not loaded</h3>
                ) : topReferrer ? (
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-black text-white truncate max-w-[150px]" title={topReferrer.name}>
                      {topReferrer.name}
                    </h3>
                    <span className="text-[14px] font-extrabold text-cyan-400">
                      {topReferrer.referralCount || 0} Refers
                    </span>
                  </div>
                ) : (
                  <p className="text-xs text-slate-500 italic">No referrals recorded yet.</p>
                )}
              </div>

              {/* Card 3: Referral Paid Conversion — 0 of 0 has no rate, so it is
                  shown as unavailable rather than as a measured 0% */}
              <div className="p-6 bg-slate-900/40 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[12px] font-black uppercase tracking-wider text-slate-500">Paid Conversion Rate</span>
                <div className="flex items-baseline justify-between">
                  <h3 className="text-2xl font-black text-emerald-400">
                    {referralDataReady && totalReferred > 0
                      ? `${((paidReferred / totalReferred) * 100).toFixed(1)}%`
                      : '—'}
                  </h3>
                  <span className="text-[12px] font-bold text-slate-400">
                    {referralDataReady && totalReferred > 0
                      ? `${paidReferred} of ${totalReferred} paid`
                      : 'No referred signups yet'}
                  </span>
                </div>
              </div>
            </div>

            {/* Directory Control Bar */}
            <div className="bg-slate-900/30 border border-slate-800 rounded-2xl p-6 space-y-4">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-slate-800/80">
                <div>
                  <h3 className="text-base font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Share2 size={18} className="text-cyan-400" /> Referral Program Directory
                  </h3>
                  <p className="text-slate-400 text-xs mt-1">Track which candidates have referred others and drill down to view their referred signups.</p>
                </div>
                <div className="w-full sm:w-72">
                  <input
                    type="text"
                    placeholder="Search by Name, Email, or Code..."
                    value={referralSearch}
                    onChange={(e) => setReferralSearch(e.target.value)}
                    className="w-full px-4 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white text-xs focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              {/* Table — the directory is fed only by GET /auth/admin/users, so
                  "still loading", "failed" and "empty" are kept apart (#82) */}
              {usersError && users.length === 0 ? (
                <ErrorState
                  title="Couldn't load the referral directory"
                  message={usersError}
                  onRetry={fetchUsers}
                  retrying={loadingUsers}
                  className="my-6"
                />
              ) : loadingUsers && users.length === 0 ? (
                <LoadingState label="Loading referral directory…" className="py-12" />
              ) : users.length === 0 ? (
                <EmptyState
                  icon={Share2}
                  title="No candidates registered yet"
                  description="Referrers appear here once students sign up and start referring others."
                  className="my-6"
                />
              ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-450 uppercase font-black tracking-wider">
                      <th className="py-3 px-4">Referrer Details</th>
                      <th className="py-3 px-4">Referral Code</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Referred By</th>
                      <th className="py-3 px-4 text-center">Registrations</th>
                      <th className="py-3 px-4 text-center">Paid Conversions</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-850">
                    {(() => {
                      const filtered = users.filter(u => {
                        if (!referralSearch) return true;
                        const s = referralSearch.toLowerCase();
                        return (
                          u.name.toLowerCase().includes(s) ||
                          u.email.toLowerCase().includes(s) ||
                          (u.referralCode && u.referralCode.toLowerCase().includes(s))
                        );
                      });

                      // Reached only with a loaded, non-empty directory — so this
                      // genuinely means "the search matched nothing".
                      if (filtered.length === 0) {
                        return (
                          <tr>
                            <td colSpan={7} className="py-8 text-center text-slate-500 italic">
                              No referrers match “{referralSearch.trim()}”.
                              <button
                                type="button"
                                onClick={() => setReferralSearch('')}
                                className="ml-2 text-cyan-400 hover:text-cyan-300 font-bold uppercase text-[12px]"
                              >
                                Clear search
                              </button>
                            </td>
                          </tr>
                        );
                      }

                      return filtered.map((referrer) => {
                        const isExpanded = expandedReferrerId === referrer.id;
                        
                        // Find referred students
                        const referredStudents = users.filter(
                          student => student.referredBy && student.referredBy.trim().toUpperCase() === referrer.referralCode?.trim().toUpperCase()
                        );
                        
                        const paidCount = referredStudents.filter(
                          student => student.payments?.some((p: any) => p.status === 'VERIFIED')
                        ).length;

                        return (
                          <Fragment key={referrer.id}>
                            <tr className="hover:bg-slate-900/40 text-slate-300 transition">
                              <td className="py-3.5 px-4">
                                <div className="font-bold text-white">{referrer.name}</div>
                                <div className="text-[12px] text-slate-500 font-mono">{referrer.email}</div>
                              </td>
                              <td className="py-3.5 px-4 font-mono text-[12px] text-cyan-400">
                                {referrer.referralCode || '—'}
                              </td>
                              <td className="py-3.5 px-4">
                                {referrer.referralSuccess ? (
                                  <span className="px-2 py-0.5 rounded text-[12px] font-black uppercase bg-green-500/10 text-green-400 border border-green-500/20">
                                    ✓ SUCCESSFUL
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[12px] font-black uppercase bg-slate-900 text-slate-500 border border-slate-800">
                                    IN PROGRESS
                                  </span>
                                )}
                              </td>
                              <td className="py-3.5 px-4">
                                {referrer.referredBy ? (
                                  <span className="font-mono text-[12px] text-slate-450 bg-slate-900 px-2 py-0.5 rounded border border-slate-800">
                                    {referrer.referredBy}
                                  </span>
                                ) : (
                                  <span className="text-slate-650 italic">Direct Signup</span>
                                )}
                              </td>
                              <td className="py-3.5 px-4 text-center font-bold text-white">
                                {referredStudents.length} / 15
                              </td>
                              <td className="py-3.5 px-4 text-center">
                                <span className={`px-2 py-0.5 rounded text-[12px] font-bold ${
                                  paidCount >= 5 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : paidCount > 0 ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-slate-800 text-slate-500'
                                }`}>
                                  {paidCount} / 5 paid
                                </span>
                              </td>
                              <td className="py-3.5 px-4 text-right">
                                <button
                                  onClick={() => setExpandedReferrerId(isExpanded ? null : referrer.id)}
                                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[12px] font-bold uppercase transition"
                                >
                                  {isExpanded ? 'Hide Details' : 'View Details'}
                                </button>
                              </td>
                            </tr>
                            
                            {/* Expandable sub-table for referred students */}
                            {isExpanded && (
                              <tr>
                                <td colSpan={7} className="bg-slate-950/40 p-4 border-l-2 border-cyan-500">
                                  <div className="space-y-3 pl-4">
                                    <h4 className="text-[12px] font-black uppercase tracking-widest text-cyan-400 flex items-center gap-1.5">
                                      Students Referred by {referrer.name} ({referredStudents.length})
                                    </h4>
                                    
                                    {referredStudents.length === 0 ? (
                                      <p className="text-[12px] text-slate-500 italic">This user has not referred any students yet.</p>
                                    ) : (
                                      <div className="overflow-x-auto border border-slate-800 rounded-xl bg-slate-950/60">
                                        <table className="w-full text-left text-[12px] text-slate-350">
                                          <thead>
                                            <tr className="border-b border-slate-800 text-slate-500 uppercase font-bold text-[12px] tracking-wider bg-slate-900/30">
                                              <th className="py-2 px-3">Student Name</th>
                                              <th className="py-2 px-3">Email Address</th>
                                              <th className="py-2 px-3">Registration Date</th>
                                              <th className="py-2 px-3">Enrolled Course Tracks</th>
                                            </tr>
                                          </thead>
                                          <tbody className="divide-y divide-slate-850">
                                            {referredStudents.map((student) => (
                                              <tr key={student.id} className="hover:bg-slate-900/30">
                                                <td className="py-2 px-3 font-semibold text-slate-200">{student.name}</td>
                                                <td className="py-2 px-3 font-mono">{student.email}</td>
                                                <td className="py-2 px-3">
                                                  {student.createdAt ? new Date(student.createdAt).toLocaleDateString('en-US', {
                                                    year: 'numeric', month: 'short', day: 'numeric'
                                                  }) : '—'}
                                                </td>
                                                <td className="py-2 px-3">
                                                  <div className="flex flex-wrap gap-1">
                                                    {(() => {
                                                      const courseMap = new Map<string, { progress?: number; paid?: boolean; pending?: boolean }>();
                                                      
                                                      if (student.progresses) {
                                                        student.progresses.forEach((p: any) => {
                                                          courseMap.set(p.courseId, { progress: p.progress });
                                                        });
                                                      }
                                                      
                                                      if (student.payments) {
                                                        student.payments.forEach((py: any) => {
                                                          const existing = courseMap.get(py.courseId) || {};
                                                          if (py.status === 'VERIFIED') {
                                                            courseMap.set(py.courseId, { ...existing, paid: true });
                                                          } else if (py.status === 'PENDING_VERIFICATION') {
                                                            courseMap.set(py.courseId, { ...existing, pending: true });
                                                          }
                                                        });
                                                      }
                                                      
                                                      if (courseMap.size === 0) {
                                                        return <span className="text-slate-650 italic text-[12px]">Not Enrolled</span>;
                                                      }
                                                      
                                                      return Array.from(courseMap.entries()).map(([courseId, info]) => {
                                                        let badgeText = `${courseId}`;
                                                        let badgeStyle = "border-blue-500/20 bg-blue-500/5 text-blue-400";
                                                        
                                                        if (info.progress !== undefined) badgeText += ` (${info.progress}%)`;
                                                        else badgeText += ` (0%)`;
                                                        
                                                        if (info.paid) {
                                                          badgeText += ` [Paid]`;
                                                          badgeStyle = "border-emerald-500/25 bg-emerald-500/10 text-emerald-400";
                                                        } else if (info.pending) {
                                                          badgeText += ` [Pending]`;
                                                          badgeStyle = "border-amber-500/25 bg-amber-500/10 text-amber-400";
                                                        }
                                                        
                                                        return (
                                                          <span
                                                            key={courseId}
                                                            className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[12px] font-bold uppercase tracking-wider ${badgeStyle}`}
                                                          >
                                                            {badgeText}
                                                          </span>
                                                        );
                                                      });
                                                    })()}
                                                  </div>
                                                </td>
                                              </tr>
                                            ))}
                                          </tbody>
                                        </table>
                                      </div>
                                    )}
                                  </div>
                                </td>
                              </tr>
                            )}
                          </Fragment>
                        );
                      });
                    })()}
                  </tbody>
                </table>
              </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* Gorgeous Side-by-Side Live WYSIWYG Editor Modal (Issue #8) */}
      <TopicEditorModal
        topic={editingTopic}
        isNew={isNewTopic}
        onClose={() => setEditingTopic(null)}
        onChange={setEditingTopic}
        showLivePreview={showLivePreview}
        onTogglePreview={() => setShowLivePreview(!showLivePreview)}
        assetUrl={assetUrl}
        onAssetUrlChange={setAssetUrl}
        onInsertAsset={handleInsertAssetLink}
        onSave={handleSaveTopic}
      />

      {/* Quiz Question CRUD Editor Modal */}
      <QuizQuestionModal
        quiz={editingQuiz}
        isNew={isNewQuiz}
        onClose={() => setEditingQuiz(null)}
        onChange={setEditingQuiz}
        onSave={handleSaveQuiz}
      />

      {/* Create New Learning Track (Course) Modal */}
      <CreateCourseModal
        open={showAddCourseModal}
        courseId={newCourseId}
        onCourseIdChange={setNewCourseId}
        title={newCourseTitle}
        onTitleChange={setNewCourseTitle}
        description={newCourseDesc}
        onDescriptionChange={setNewCourseDesc}
        price={newCoursePrice}
        onPriceChange={setNewCoursePrice}
        banner={newCourseBanner}
        onBannerChange={setNewCourseBanner}
        comingSoon={newCourseComingSoon}
        onComingSoonChange={setNewCourseComingSoon}
        onDiscard={() => {
          setShowAddCourseModal(false);
          setNewCourseId('');
          setNewCourseTitle('');
          setNewCourseDesc('');
          setNewCoursePrice(999);
          setNewCourseBanner('');
          setNewCourseComingSoon(false);
        }}
        onSubmit={handleCreateCourse}
      />

      {/* Create New Week Module Modal */}
      <CreateModuleModal
        open={showAddModuleModal}
        week={newModuleWeek}
        onWeekChange={setNewModuleWeek}
        title={newModuleTitle}
        onTitleChange={setNewModuleTitle}
        description={newModuleDesc}
        onDescriptionChange={setNewModuleDesc}
        onDiscard={() => {
          setShowAddModuleModal(false);
          setNewModuleCourseId('');
          setNewModuleWeek(1);
          setNewModuleTitle('');
          setNewModuleDesc('');
        }}
        onSubmit={handleCreateModule}
      />

    </PageContainer>
  );
};

export default AdminDashboard;
