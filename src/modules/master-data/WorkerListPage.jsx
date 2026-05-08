import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { workersApi } from "@/services/workers";

function WorkerListPage() {
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const limit = 20;

  const params = useMemo(
    () => ({
      q: q.trim() || undefined,
      page,
      limit,
    }),
    [q, page],
  );

  const workersQuery = useQuery({
    queryKey: ["workers", params],
    queryFn: () => workersApi.list(params),
  });

  const items = workersQuery.data?.data ?? [];
  const total = workersQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4">
      <div className="text-left">
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Worker Database
        </p>
      </div>

      <div className="text-left">
        <Input
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setPage(1);
          }}
          placeholder="Cari worker..."
          className="rounded-xl border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
        />
      </div>

      {workersQuery.isLoading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-[13px] text-[#6B7280]">
          Memuat...
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Belum ada worker"
          description="Coba ubah kata kunci pencarian."
        />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
          <div className="grid grid-cols-[110px_1fr_120px] gap-3 bg-[#F8FAFC] px-4 py-2 text-[11px]/[16px] text-[#6B7280]">
            <span>Kode</span>
            <span>Nama</span>
            <span className="text-right">Keahlian</span>
          </div>
          <div className="divide-y divide-[#E5E7EB]">
            {items.map((w) => (
              <div
                key={w._id ?? w.kodeWorker ?? w.nama}
                className="grid grid-cols-[110px_1fr_120px] gap-3 px-4 py-3 text-[12px]/[18px]"
              >
                <span className="font-semibold text-[#111827]">
                  {w.kodeWorker ?? "-"}
                </span>
                <span className="text-[#111827]">{w.nama ?? "-"}</span>
                <span className="text-right text-[#6B7280]">
                  {w.keahlian ?? "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        onPageChange={(p) => setPage(p)}
      />
    </div>
  );
}

export default WorkerListPage;

