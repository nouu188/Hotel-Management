"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";

interface UseAdminFetchOptions {
  endpoint: string;
  dataKey: string;
  limit?: number;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface UseAdminFetchReturn<T> {
  data: T[];
  loading: boolean;
  search: string;
  setSearch: (value: string) => void;
  filters: Record<string, string>;
  setFilter: (key: string, value: string) => void;
  clearFilters: () => void;
  pagination: Pagination;
  setPagination: React.Dispatch<React.SetStateAction<Pagination>>;
  refresh: () => void;
  extra: Record<string, unknown>;
}

export function useAdminFetch<T>({
  endpoint,
  dataKey,
  limit = 20,
}: UseAdminFetchOptions): UseAdminFetchReturn<T> {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearchRaw] = useState("");
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  });
  const [extra, setExtra] = useState<Record<string, unknown>>({});
  const [refreshKey, setRefreshKey] = useState(0);
  const filtersKey = useMemo(() => JSON.stringify(filters), [filters]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      params.set("page", String(pagination.page));
      params.set("limit", String(pagination.limit));
      if (search) params.set("search", search);

      const currentFilters: Record<string, string> = JSON.parse(filtersKey);
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value) params.set(key, value);
      });

      const res = await fetch(`${endpoint}?${params}`);
      const json = await res.json();

      if (json.success && json.data) {
        setData(json.data[dataKey] ?? []);
        if (json.data.pagination) {
          setPagination((prev) => ({ ...prev, ...json.data.pagination }));
        }
        const { [dataKey]: _, pagination: __, ...rest } = json.data;
        setExtra(rest);
      }
    } catch {
      toast.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, [endpoint, dataKey, pagination.page, pagination.limit, search, filtersKey, refreshKey]);

  useEffect(() => {
    const timeout = setTimeout(fetchData, 300);
    return () => clearTimeout(timeout);
  }, [fetchData]);

  const setSearch = useCallback((value: string) => {
    setSearchRaw(value);
    setPagination((p) => ({ ...p, page: 1 }));
  }, []);

  const setFilter = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((p) => ({ ...p, page: 1 }));
  }, []);

  const clearFilters = useCallback(() => {
    setSearchRaw("");
    setFilters({});
    setPagination((p) => ({ ...p, page: 1 }));
  }, []);

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1);
  }, []);

  return {
    data,
    loading,
    search,
    setSearch,
    filters,
    setFilter,
    clearFilters,
    pagination,
    setPagination,
    refresh,
    extra,
  };
}
