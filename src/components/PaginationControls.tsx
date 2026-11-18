"use client";

export type Pagination = { page: number; pageSize: number; total: number; totalPages: number };

export default function PaginationControls({
  pagination, onPageChange, disabled = false,
}: {
  pagination: Pagination | null;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}) {
  if (!pagination) return null;
  const { page, totalPages, total, pageSize } = pagination;
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);
  return <nav aria-label="List pagination" className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 p-4 text-sm">
    <span className="text-slate-600">{from}–{to} of {total} records</span>
    <div className="flex items-center gap-3">
      <button type="button" disabled={disabled || page <= 1} onClick={() => onPageChange(page - 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40">Previous</button>
      <span className="whitespace-nowrap text-slate-600">Page {page} of {totalPages}</span>
      <button type="button" disabled={disabled || page >= totalPages} onClick={() => onPageChange(page + 1)}
        className="rounded-lg border border-slate-300 px-3 py-2 disabled:opacity-40">Next</button>
    </div>
  </nav>;
}
