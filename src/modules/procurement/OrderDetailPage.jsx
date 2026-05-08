import { useMemo } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { useToast } from "@/lib/toast.jsx";
import { ordersApi } from "@/services/orders";

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-[12px]/[18px]">
      <span className="text-[#6B7280]">{label}</span>
      <span className="text-right font-semibold text-[#111827]">{value}</span>
    </div>
  );
}

function formatCurrencyIdr(value) {
  if (typeof value !== "number") return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function OrderDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.orderId ?? "");
  const { pushToast } = useToast();

  const orderQuery = useQuery({
    queryKey: ["orders", id],
    queryFn: () => ordersApi.get(id),
    enabled: !!id,
  });

  const order = orderQuery.data ?? null;

  const vendorName =
    order?.vendor?.namaBrand ?? order?.vendor?.namaPerusahaan ?? "-";

  const products = useMemo(() => order?.items ?? [], [order]);

  const repeatMutation = useMutation({
    mutationFn: () => ordersApi.repeat(id),
    onSuccess: () => {
      pushToast({ kind: "success", message: "Pesanan berhasil diulang" });
    },
    onError: (err) => {
      pushToast({ kind: "error", message: err?.message ?? "Gagal mengulang pesanan." });
    },
  });

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
            Rincian Pesanan
          </p>
          <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
            Pesanan {order?.status ?? "-"}
          </p>
        </div>
        <Link
          to="/procurement/history"
          className="rounded-md border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] font-semibold text-[#111827]"
        >
          Kembali
        </Link>
      </div>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[14px]/[20px] font-semibold text-[#111827]">
          {vendorName}
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          {order?.vendor?.kategoriSpesialisasi ?? "-"}
        </p>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[13px]/[18px] font-semibold text-[#111827]">
          Informasi Transaksi
        </p>
        <div className="mt-3 space-y-2">
          <Row label="Order ID" value={order?._id ?? id} />
          <Row label="Tanggal Transaksi" value={order?.createdAt ?? "-"} />
          <Row label="Invoice" value="Lihat Invoice" />
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[13px]/[18px] font-semibold text-[#111827]">
          Informasi Pengiriman
        </p>
        <div className="mt-3 space-y-2">
          <Row label="Kurir" value={order?.shipping?.kurir ?? "-"} />
          <Row label="No Resi" value={order?.shipping?.noResi ?? "-"} />
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[13px]/[18px] font-semibold text-[#111827]">
          Rincian Produk
        </p>
        <div className="mt-3 space-y-3">
          {products.map((p) => (
            <div
              key={p.namaProduk}
              className="flex items-start justify-between gap-4 border-b border-[#E5E7EB] pb-3 last:border-b-0 last:pb-0"
            >
              <div>
                <p className="text-[13px]/[18px] font-semibold text-[#111827]">
                  {p.namaProduk}
                </p>
                <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
                  {formatCurrencyIdr(p.hargaSatuan)}
                </p>
              </div>
              <p className="text-[12px]/[18px] font-semibold text-[#111827]">
                x{p.jumlah}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[13px]/[18px] font-semibold text-[#111827]">
          Rincian Pembayaran
        </p>
        <div className="mt-3 space-y-2">
          <Row label="Metode pembayaran" value={order?.payment?.metode ?? "-"} />
          <Row label="Subtotal" value={formatCurrencyIdr(order?.payment?.subtotal)} />
          <Row
            label="Subtotal pengiriman"
            value={formatCurrencyIdr(order?.payment?.subtotalPengiriman)}
          />
          <Row
            label="Diskon pengiriman"
            value={formatCurrencyIdr(order?.payment?.diskonPengiriman)}
          />
          <Row
            label="Voucher & promo discount"
            value={formatCurrencyIdr(order?.payment?.diskonVoucher)}
          />
          <Row label="Biaya layanan" value={formatCurrencyIdr(order?.payment?.biayaLayanan)} />
          <div className="mt-2 border-t border-[#E5E7EB] pt-3">
            <Row label="Total" value={formatCurrencyIdr(order?.payment?.totalDibayar)} />
          </div>
        </div>
      </section>

      <button
        type="button"
        disabled={repeatMutation.isPending}
        onClick={() => repeatMutation.mutate()}
        className="w-full rounded-md bg-[#052758] px-4 py-3 text-[14px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
      >
        {repeatMutation.isPending ? "Memproses..." : "Beli Lagi"}
      </button>
    </div>
  );
}

export default OrderDetailPage;

