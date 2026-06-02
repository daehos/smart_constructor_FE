import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight, Plus } from "lucide-react";
import OrderStatusSummaryCard from "./components/OrderStatusSummaryCard";
import MaterialCategoryCard from "./components/MaterialCategoryCard";
import {
  MATERIAL_CATEGORIES,
  ORDER_STATUS_SUMMARY,
} from "./data/materialCategories";
import { ordersApi } from "@/services/orders";
import { countOrdersBySummaryKey } from "./utils/orderStatusCounts";

const SUMMARY_FETCH_LIMIT = 100;

const HISTORY_FILTER_BY_KEY = {
  belumDitinjau: "Semua",
  ditolak: "Dibatalkan",
  diproses: "Dikirim",
  selesai: "Selesai",
};

function GoodsOrderPage() {
  const navigate = useNavigate();

  const ordersQuery = useQuery({
    queryKey: ["orders", "summary", { limit: SUMMARY_FETCH_LIMIT }],
    queryFn: () => ordersApi.list({ page: 1, limit: SUMMARY_FETCH_LIMIT }),
  });

  const statusCounts = useMemo(() => {
    const orders = ordersQuery.data?.data ?? [];
    return countOrdersBySummaryKey(orders);
  }, [ordersQuery.data?.data]);

  const goToHistory = (summaryKey) => {
    const status = HISTORY_FILTER_BY_KEY[summaryKey];
    navigate(
      status
        ? `/procurement/history?status=${encodeURIComponent(status)}`
        : "/procurement/history",
    );
  };

  const goToProducts = (categoryId) => {
    const params = categoryId ? `?kategori=${encodeURIComponent(categoryId)}` : "";
    navigate(`/procurement/products${params}`);
  };

  return (
    <div className="space-y-5 text-left">
      <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
        Pemesanan Barang
      </p>

      <button
        type="button"
        onClick={() => navigate("/procurement/products")}
        className="flex w-full items-center mt-8  justify-center gap-2 rounded-lg bg-[#052758] px-4 py-3 text-[14px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
      >
        <Plus size={18} strokeWidth={2.5} />
        Input Pesanan
      </button>

      <div className="grid grid-cols-2 gap-3">
        {ORDER_STATUS_SUMMARY.map(({ key, label }) => (
          <OrderStatusSummaryCard
            key={key}
            label={label}
            count={
              ordersQuery.isLoading
                ? "—"
                : (statusCounts[key] ?? 0)
            }
            onClick={() => goToHistory(key)}
          />
        ))}
      </div>

      <section>
        <div className="mb-3 flex items-center justify-between gap-2">
          <p className="text-[14px]/[20px] font-semibold text-[#111827]">
            Apa yang Anda cari?
          </p>
          <button
            type="button"
            onClick={() => goToProducts()}
            className="flex shrink-0 items-center gap-0.5 text-[13px] font-semibold text-[#0846A1] hover:underline"
          >
            Lihat Semua
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {MATERIAL_CATEGORIES.map((category) => (
            <MaterialCategoryCard
              key={category.id}
              category={category}
              onClick={() => goToProducts(category.id)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

export default GoodsOrderPage;
