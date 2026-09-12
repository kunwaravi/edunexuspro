import { useState, useEffect, useCallback } from 'react';
import api from '../api';

export interface CatalogCategory {
  slug: string;
  name: string;
}

/**
 * Derive the filter-chip list from the catalog response itself — real category
 * slugs/names straight from the DB, "All" first. No hardcoded category names
 * anywhere (spec E): the catalog API is the single source. "Published only" is
 * enforced by the backend, so only categories that actually carry a published
 * course ever appear here.
 */
export const deriveCourseCategories = (courses: any[]): CatalogCategory[] => {
  const seen = new Set<string>();
  const cats: CatalogCategory[] = [];
  for (const c of courses) {
    const slug = c?.category?.slug;
    if (slug && !seen.has(slug)) {
      seen.add(slug);
      cats.push({ slug, name: c.category.name || slug });
    }
  }
  return [{ slug: 'all', name: 'All' }, ...cats];
};

/**
 * Catalog data hook (TASK 5) — fetches the PUBLIC course catalog. Supports
 * server-side category filtering via `GET /courses?category=<slug>`. Category
 * chips are derived from the FULL response and kept stable while a category
 * filter is active (no repeated calls when re-clicking the active chip is
 * handled by the caller; state stays hook-local — no Redux/Zustand/React Query).
 */
export const useCourses = (category?: string) => {
  const [data, setData] = useState<any[]>([]);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async (cat?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = cat && cat !== 'all' ? `/courses?category=${encodeURIComponent(cat)}` : '/courses';
      const response = await api.get(url);
      setData(response.data);
      // Chips only make sense against the full catalog, so refresh them only
      // when fetching unfiltered (they persist across filtered fetches).
      if (!cat || cat === 'all') setCategories(deriveCourseCategories(response.data));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch courses');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses(category);
  }, [fetchCourses, category]);

  return { data, categories, loading, error, refetch: () => fetchCourses(category) };
};
