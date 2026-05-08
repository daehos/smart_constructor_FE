import { Link } from "react-router-dom";
import { StatusBadge } from "@/components/ui/status-badge";

function formatCurrencyIdr(value) {
  if (typeof value !== "number") return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

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

function OrderRow({ order }) {
  const orderId = order?._id ?? order?.id ?? "";
  const vendorName =
    order?.vendor?.namaBrand ??
    order?.vendor?.namaPerusahaan ??
    order?.vendorName ??
    "-";
  const title = order?.items?.[0]?.namaProduk ?? order?.title ?? "-";
  const extraCount =
    (order?.items?.length ?? 0) > 1 ? (order.items.length ?? 0) - 1 : 0;
  const total =
    typeof order?.payment?.totalDibayar === "number"
      ? formatCurrencyIdr(order.payment.totalDibayar)
      : order?.total ?? "-";
  const dateLabel = order?.createdAt ? formatDateTime(order.createdAt) : order?.dateLabel ?? "-";

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <p className="text-[12px]/[18px] text-[#6B7280]">{dateLabel}</p>
        <StatusBadge status={order?.status ?? "-"} />
      </div>

      <div className="mt-2">
        <p className="text-[14px]/[20px] font-semibold text-[#111827]">
          {vendorName}
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          {title}
          {extraCount ? ` • +${extraCount} produk lainnya` : ""}
        </p>
      </div>

      <div className="mt-3 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px]/[16px] text-[#6B7280]">Total Harga</p>
          <p className="text-[13px]/[18px] font-semibold text-[#111827]">
            {total}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            to={`/procurement/history/${encodeURIComponent(orderId)}`}
            className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] font-semibold text-[#111827]"
          >
            Lihat Detail
          </Link>
          <Link
            to="/procurement/comparison"
            className="rounded-md bg-[#052758] px-3 py-2 text-[12px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
          >
            Beli Lagi
          </Link>
        </div>
      </div>
    </div>
  );
}

export default OrderRow;

