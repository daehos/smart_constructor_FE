import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import OrderRow from "./components/OrderRow";
import OrderStatusFilter from "./components/OrderStatusFilter";
import { ordersApi } from "@/services/orders";

const STATUS_TO_ENUM = {
  Semua: "semua",
  Dikirim: "dikirim",
  Selesai: "selesai",
  Dibatalkan: "dibatalkan",
  Pengembalian: "pengembalian",
};

function OrderHistoryPage() {
  const [searchParams] = useSearchParams();
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState("Semua");

  useEffect(() => {
    const fromUrl = searchParams.get("status");
    if (fromUrl && STATUS_TO_ENUM[fromUrl]) {
      setStatus(fromUrl);
    }
  }, [searchParams]);
  const [page, setPage] = useState(1);
  const limit = 20;
  const [month] = useState("2026-01");

  const params = useMemo(() => {
    const s = STATUS_TO_ENUM[status] ?? "semua";
    return {
      q: query.trim() || undefined,
      status: s === "semua" ? undefined : s,
      month,
      page,
      limit,
    };
  }, [query, status, month, page]);

  const ordersQuery = useQuery({
    queryKey: ["orders", params],
    queryFn: () => ordersApi.list(params),
  });

  const items = ordersQuery.data?.data ?? [];
  const total = ordersQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
            Riwayat Pemesanan
          </p>
          <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
            Deskripsi (opsional)
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] font-semibold text-[#111827]"
        >
          Jan 2026 • Filter
        </button>
      </div>

      <SearchInput
        placeholder="Cari pesanan atau vendor"
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setPage(1);
        }}
      />

      <OrderStatusFilter
        value={status}
        onChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
      />

      {ordersQuery.isLoading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-[13px] text-[#6B7280]">
          Memuat...
        </div>
      ) : items.length === 0 ? (
        <EmptyState
          title="Belum Ada Riwayat"
          description="Riwayat pemesanan Anda akan muncul disini setelah transaksi dilakukan."
          actionLabel="Mulai Pemesanan"
          onAction={() => {
            setQuery("");
            setStatus("Semua");
            setPage(1);
          }}
        />
      ) : (
        <div className="space-y-3">
          {items.map((order) => (
            <OrderRow key={order._id ?? order.id} order={order} />
          ))}
        </div>
      )}

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
}

export default OrderHistoryPage;

