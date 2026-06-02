import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  Package,
  Phone,
} from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useProcurementCart } from "./hooks/useProcurementCart";
import { formatCurrencyIdr } from "./utils/formatCurrency";
import { api } from "@/lib/apiClient";
import { useToast } from "@/lib/toast.jsx";
import { vendorsApi } from "@/services/vendors";

const SHIPPING_ESTIMATE = 13520;
const SERVICE_FEE = 1000;
const ORDER_TIMEOUT_MS = 5000;
const DEFAULT_ORDER_MESSAGE = "Mohon kirim hari ini jika memungkinkan.";

function normalizePhoneTo62(input) {
  const raw = String(input ?? "").trim();
  if (!raw) return "";
  const digits = raw.replace(/[^\d+]/g, "");

  if (digits.startsWith("62")) return digits;
  if (digits.startsWith("+62")) return `62${digits.slice(3)}`;
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;

  // If it's already digits without prefix (e.g. 822...), assume it's local w/o leading 0.
  return `62${digits.replace(/^\+/, "")}`;
}

async function postWithTimeout(url, body, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await api.post(url, body, { signal: controller.signal });
  } finally {
    clearTimeout(timeoutId);
  }
}

function OrderReviewPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { items, productCount, subtotal, primaryVendor, updateQty } =
    useProcurementCart();
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const [vendorId, setVendorId] = useState(primaryVendor?._id ?? "");

  const vendorsQuery = useQuery({
    queryKey: ["vendors", { page: 1, limit: 50 }],
    queryFn: () => vendorsApi.list({ page: 1, limit: 50 }),
  });

  const vendorOptions = useMemo(
    () => vendorsQuery.data?.data ?? [],
    [vendorsQuery.data],
  );

  const effectiveVendorId = vendorId || primaryVendor?._id || "";

  const selectedVendor = useMemo(() => {
    return (
      vendorOptions.find((v) => v._id === effectiveVendorId) ??
      primaryVendor ??
      null
    );
  }, [effectiveVendorId, primaryVendor, vendorOptions]);

  const shippingDiscount = SHIPPING_ESTIMATE;
  const promoDiscount = Math.round(subtotal * 0.002);
  const total = useMemo(
    () =>
      subtotal +
      SHIPPING_ESTIMATE -
      shippingDiscount -
      promoDiscount +
      SERVICE_FEE,
    [subtotal, shippingDiscount, promoDiscount],
  );

  const vendorName = selectedVendor?.namaPerusahaan ?? "Vendor";
  const vendorRole = selectedVendor?.kategoriSpesialisasi ?? "Supplier";

  const whatsAppMessage = useMemo(() => {
    const lines = items.map(
      (line) =>
        `• ${line.namaMaterial} (${line.ukuran}) x${line.qty} — ${formatCurrencyIdr(line.hargaSatuan * line.qty)}`,
    );
    return [
      `Halo, saya ingin memesan dari ${vendorName}:`,
      "",
      ...lines,
      "",
      `Subtotal: ${formatCurrencyIdr(subtotal)}`,
      `Total estimasi: ${formatCurrencyIdr(total)}`,
      "",
      "Terima kasih.",
    ].join("\n");
  }, [items, vendorName, subtotal, total]);

  const handleWhatsApp = async () => {
    if (items.length === 0) {
      pushToast({ kind: "error", message: "Keranjang masih kosong" });
      return;
    }
    if (!effectiveVendorId) {
      pushToast({ kind: "error", message: "Pilih vendor dulu ya" });
      return;
    }

    const to = normalizePhoneTo62(selectedVendor?.telepon);
    if (!to) {
      pushToast({
        kind: "error",
        message: "Nomor telepon vendor belum ada / tidak valid",
      });
      return;
    }

    try {
      await api.post("http://157.15.40.6:8080/api/v1/whatsapp/send", {
        to,
        body: whatsAppMessage,
      });

      await postWithTimeout(
        "/orders",
        {
          vendor: effectiveVendorId,
          pesan: DEFAULT_ORDER_MESSAGE,
          items: items.map((line) => ({
            namaProduk: `${line.namaMaterial}${line.ukuran ? ` (${line.ukuran})` : ""}`,
            kategoriMaterial: line.kategoriMaterial ?? line.kategori ?? "Umum",
            subKategoriMaterial: line.subKategoriMaterial ?? line.ukuran ?? "-",
            jumlah: line.qty,
            hargaSatuan: Number(line.hargaSatuan) || 0,
          })),
        },
        ORDER_TIMEOUT_MS,
      );

      pushToast({ kind: "success", message: "Order berhasil dikirim" });
      navigate("/procurement/ordering");
    } catch (err) {
      pushToast({
        kind: "error",
        message: err?.message ?? "Gagal mengirim WhatsApp",
      });
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 py-8 text-center">
        <p className="text-[15px] font-semibold text-[#111827]">
          Keranjang kosong
        </p>
        <button
          type="button"
          onClick={() => navigate("/procurement/products")}
          className="mt-4 rounded-lg bg-[#052758] px-4 py-2.5 text-[14px] font-semibold text-white"
        >
          Pilih Produk
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 pb-32 pt-4 text-left">
      <Breadcrumb
        items={[
          { label: "Pengadaan", to: "/procurement/ordering" },
          { label: "Pemesanan Barang", to: "/procurement/ordering" },
          { label: "Tinjau Pesanan" },
        ]}
      />

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate("/procurement/products")}
          className="flex size-9 items-center justify-center rounded-lg text-[#111827] hover:bg-[#F3F4F6]"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Tinjau Pesanan
        </p>
        <span className="size-9" aria-hidden />
      </div>

      <section className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    className={[
                      "flex h-9 min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border bg-white px-3 text-left text-[14px] font-bold outline-none",
                      effectiveVendorId
                        ? "border-[#E5E7EB] text-[#121212]"
                        : "border-[#FCA5A5] text-[#B91C1C]",
                    ].join(" ")}
                    aria-label="Pilih vendor"
                  >
                    <span className="min-w-0 truncate">
                      {effectiveVendorId ? vendorName : "Pilih vendor"}
                    </span>
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-[#6B7280]"
                    />
                  </button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="start" className="min-w-64">
                  <DropdownMenuLabel>Vendor</DropdownMenuLabel>
                  <DropdownMenuRadioGroup
                    value={effectiveVendorId}
                    onValueChange={setVendorId}
                  >
                    {vendorsQuery.isLoading ? (
                      <DropdownMenuRadioItem value="__loading" disabled>
                        Memuat vendor...
                      </DropdownMenuRadioItem>
                    ) : vendorOptions.length === 0 ? (
                      <DropdownMenuRadioItem value="__empty" disabled>
                        Tidak ada vendor
                      </DropdownMenuRadioItem>
                    ) : (
                      vendorOptions.map((v) => (
                        <DropdownMenuRadioItem key={v._id} value={v._id}>
                          {v.namaPerusahaan}
                        </DropdownMenuRadioItem>
                      ))
                    )}
                  </DropdownMenuRadioGroup>
                </DropdownMenuContent>
              </DropdownMenu>

              <div className="flex gap-2">
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#F2F7FC] text-[#0846A1]"
                  aria-label="Chat"
                >
                  <MessageCircle size={18} />
                </button>
                <button
                  type="button"
                  className="flex size-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-[#F2F7FC] text-[#0846A1]"
                  aria-label="Telepon"
                >
                  <Phone size={18} />
                </button>
              </div>
            </div>

            <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
              {vendorRole}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[14px]/[20px] font-semibold text-[#111827]">
          Rincian Produk
        </p>
        <div className="mt-3 space-y-4">
          {items.map((line) => (
            <div
              key={line.cartId}
              className="flex gap-3 border-b border-[#F3F4F6] pb-4 last:border-0 last:pb-0"
            >
              <div className="flex size-14 shrink-0 items-center justify-center rounded-lg bg-[#F3F4F6]">
                {line.imageUrl ? (
                  <img
                    src={line.imageUrl}
                    alt=""
                    className="size-full rounded-lg object-cover"
                  />
                ) : (
                  <Package size={22} className="text-[#9CA3AF]" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-[13px]/[18px] font-semibold text-[#111827]">
                  {line.namaMaterial}
                </p>
                <p className="mt-1 text-[12px] text-[#6B7280]">
                  {line.ukuran}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-[13px] font-bold text-[#0846A1]">
                    {formatCurrencyIdr(line.hargaSatuan * line.qty)}
                  </p>
                  <div className="flex items-center gap-2 text-[12px]">
                    <button
                      type="button"
                      onClick={() =>
                        updateQty(line.cartId, Math.max(0, line.qty - 1))
                      }
                      className="size-7 rounded border border-[#E5E7EB]"
                    >
                      −
                    </button>
                    <span className="font-semibold">x{line.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(line.cartId, line.qty + 1)}
                      className="size-7 rounded border border-[#E5E7EB]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[14px]/[20px] font-semibold text-[#111827]">
          Rincian Pembayaran
        </p>
        <dl className="mt-3 space-y-2 text-[13px]/[18px]">
          <div className="flex justify-between gap-2">
            <dt className="text-[#6B7280]">Subtotal ({productCount} produk)</dt>
            <dd className="font-medium text-[#111827]">
              {formatCurrencyIdr(subtotal)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[#6B7280]">Estimasi pengiriman</dt>
            <dd className="font-medium text-[#111827]">
              {formatCurrencyIdr(SHIPPING_ESTIMATE)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[#6B7280]">Subtotal diskon pengiriman</dt>
            <dd className="font-medium text-[#B91C1C]">
              -{formatCurrencyIdr(shippingDiscount)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[#6B7280]">Voucher & promo discount</dt>
            <dd className="font-medium text-[#B91C1C]">
              -{formatCurrencyIdr(promoDiscount)}
            </dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-[#6B7280]">Biaya layanan</dt>
            <dd className="font-medium text-[#111827]">
              {formatCurrencyIdr(SERVICE_FEE)}
            </dd>
          </div>
        </dl>
      </section>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E5E7EB] bg-white px-4 py-4">
        <button
          type="button"
          onClick={() => setBreakdownOpen((v) => !v)}
          className="mb-3 flex w-full items-center justify-between text-left"
        >
          <span className="text-[13px] text-[#6B7280]">Total</span>
          <span className="flex items-center gap-1 text-[18px] font-bold text-[#111827]">
            {formatCurrencyIdr(total)}
            {breakdownOpen ? (
              <ChevronUp size={18} />
            ) : (
              <ChevronDown size={18} />
            )}
          </span>
        </button>
        <button
          type="button"
          onClick={handleWhatsApp}
          disabled={!effectiveVendorId}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-3.5 text-[15px] font-semibold text-white hover:opacity-95 active:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <MessageCircle size={20} />
          Pesan melalui WhatsApp
        </button>
      </div>
    </div>
  );
}

export default OrderReviewPage;
