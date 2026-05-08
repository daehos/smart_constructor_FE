import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { activityLogsApi } from "@/services/activityLogs";

function formatDateTime(createdAt) {
  if (!createdAt) return "-";
  const d = new Date(createdAt);
  if (Number.isNaN(d.getTime())) return "-";
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function LogActivityPage() {
  const [page, setPage] = useState(1);
  const limit = 20;

  const params = useMemo(() => ({ page, limit }), [page]);

  const logsQuery = useQuery({
    queryKey: ["activity-logs", "me", params],
    queryFn: () => activityLogsApi.mine(params),
  });

  const items = logsQuery.data?.data ?? [];
  const total = logsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 py-6 text-left">
      <div className="mb-4">
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Log Activity
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          Aktivitas akun Anda.
        </p>
      </div>

      {logsQuery.isLoading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-[13px] text-[#6B7280]">
          Memuat...
        </div>
      ) : items.length === 0 ? (
        <EmptyState title="Belum ada aktivitas" description="Aktivitas akan muncul di sini." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          <div className="grid grid-cols-[1fr_90px] gap-3 bg-[#F8FAFC] px-4 py-2 text-[11px]/[16px] text-[#6B7280]">
            <span>Aktivitas</span>
            <span className="text-right">Waktu</span>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {items.map((log, idx) => (
              <div
                key={log._id ?? `${log.createdAt ?? "t"}-${idx}`}
                className="flex items-start justify-between gap-3 px-4 py-3 text-[12px]/[18px]"
              >
                <div className="min-w-0">
                  <p className="font-semibold text-[#111827]">
                    {log.actor?.nama ?? "—"} • {log.action ?? "—"}
                  </p>
                  <p className="mt-1 text-[#6B7280]">
                    {log.resource ?? "—"}
                  </p>
                </div>
                <p className="shrink-0 text-right text-[#6B7280]">
                  {formatDateTime(log.createdAt)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="pt-4">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
}

export default LogActivityPage;

