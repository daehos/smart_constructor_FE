import { useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  Calendar as CalendarIcon,
  Camera,
  ChevronDown,
  Info,
  Plus,
  Upload,
  X,
} from "lucide-react";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useToast } from "@/lib/toast.jsx";
import { vendorsApi } from "@/services/vendors";
import { cn } from "@/lib/utils";
import { emptyFormItem, mapOcrToForm } from "./utils/mapOcrToForm";

const emptyItem = emptyFormItem;

function formatCurrencyIdr(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "Rp0";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function getItemSubtotal(item) {
  const qty = Number(item.jumlah) || 0;
  const price = Number(item.hargaSatuan) || 0;
  return qty * price;
}

function findVendorIdByMerchant(merchant, vendorOptions) {
  if (!merchant?.trim() || vendorOptions.length === 0) return null;
  const normalized = merchant.trim().toLowerCase();
  const match = vendorOptions.find((vendor) => {
    const name = (vendor.namaPerusahaan ?? "").toLowerCase();
    return name.includes(normalized) || normalized.includes(name);
  });
  return match?._id ?? null;
}

function ExpenseManualInputPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { pushToast } = useToast();
  const ocrReceipt = location.state?.receipt;
  const parsed = ocrReceipt?.parsed;
  const ocrFormDefaults = useMemo(
    () => (ocrReceipt ? mapOcrToForm(ocrReceipt) : null),
    [ocrReceipt],
  );

  const [vendorId, setVendorId] = useState("");
  const [tanggal, setTanggal] = useState(
    () => ocrFormDefaults?.tanggal || "2026-01-31",
  );
  const [dateOpen, setDateOpen] = useState(false);
  const [metodePembayaran, setMetodePembayaran] = useState("");
  const [catatan, setCatatan] = useState(() => ocrFormDefaults?.catatan ?? "");
  const [hasPhoto, setHasPhoto] = useState(() => Boolean(ocrReceipt?.objectKey));
  const [items, setItems] = useState(
    () => ocrFormDefaults?.items ?? [emptyItem()],
  );
  const [showOcrBanner, setShowOcrBanner] = useState(() => Boolean(parsed));

  const vendorsQuery = useQuery({
    queryKey: ["vendors", "options"],
    queryFn: () => vendorsApi.list({ page: 1, limit: 100 }),
  });

  const vendorOptions = useMemo(
    () => vendorsQuery.data?.data ?? [],
    [vendorsQuery.data?.data],
  );

  const autoVendorId = useMemo(
    () => findVendorIdByMerchant(parsed?.merchant, vendorOptions),
    [parsed?.merchant, vendorOptions],
  );

  const effectiveVendorId = vendorId || autoVendorId || "";

  const displayCatatan = catatan;

  const selectedVendor = vendorOptions.find((v) => v._id === effectiveVendorId);
  const vendorLabel = vendorsQuery.isLoading
    ? "Memuat vendor..."
    : (selectedVendor?.namaPerusahaan ?? "Pilih nama perusahaan");

  const selectedDate = useMemo(() => {
    if (!tanggal) return undefined;
    try {
      return parseISO(tanggal);
    } catch {
      return undefined;
    }
  }, [tanggal]);

  const tanggalLabel = selectedDate
    ? format(selectedDate, "dd/MM/yyyy", { locale: localeId })
    : "Pilih tanggal";

  const total = useMemo(
    () => items.reduce((sum, item) => sum + getItemSubtotal(item), 0),
    [items],
  );

  const updateItem = (id, patch) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    );
  };

  const addItem = () => setItems((prev) => [...prev, emptyItem()]);

  const removeAllItems = () => setItems([emptyItem()]);

  const submit = (e) => {
    e.preventDefault();
    pushToast({ kind: "success", message: "Transaksi berhasil disimpan" });
    navigate("/expense-management/list");
  };

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 pb-28 pt-4 text-left">
      <Breadcrumb
        items={[
          { label: "Kelola Pengeluaran", to: "/expense-management/list" },
          { label: "Daftar Pengeluaran", to: "/expense-management/list" },
          { label: "Input Manual" },
        ]}
      />

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-9 items-center justify-center rounded-lg text-[#111827] hover:bg-[#F3F4F6]"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Input Manual
        </p>
        <Link
          to="/expense-management/list"
          className="flex size-9 items-center justify-center rounded-lg text-[#111827] hover:bg-[#F3F4F6]"
          aria-label="Tutup"
        >
          <X size={20} />
        </Link>
      </div>

      {showOcrBanner ? (
        <div
          role="status"
          className="mt-4 flex items-start gap-3 rounded-xl border border-[#BFDBFE] bg-[#EFF6FF] px-4 py-3"
        >
          <Info size={18} className="mt-0.5 shrink-0 text-[#0846A1]" />
          <p className="flex-1 text-[13px]/[18px] text-[#1E40AF]">
            Form diisi otomatis dari hasil OCR. Harap periksa kembali.
          </p>
          <button
            type="button"
            onClick={() => setShowOcrBanner(false)}
            className="shrink-0 rounded-lg p-1 text-[#1E40AF] hover:bg-[#DBEAFE]"
            aria-label="Tutup pemberitahuan OCR"
          >
            <X size={16} />
          </button>
        </div>
      ) : null}

      <form
        id="expense-manual-form"
        onSubmit={submit}
        className="mt-4 space-y-4"
      >
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-center gap-2">
            <Info size={16} className="text-[#0846A1]" />
            <p className="text-[14px]/[20px] font-semibold text-[#111827]">
              Informasi Umum
            </p>
          </div>

          <div className="mt-4 space-y-4">
            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Nama Perusahaan*
              </span>
              <input
                type="text"
                value={effectiveVendorId}
                required
                readOnly
                className="sr-only"
                tabIndex={-1}
                aria-hidden
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    type="button"
                    disabled={vendorsQuery.isLoading}
                    className="mt-2 flex h-11 w-full items-center justify-between rounded-lg border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-left text-[14px] outline-none focus:border-[#0846A1] focus:ring-2 focus:ring-[#0846A1]/20 disabled:opacity-60"
                  >
                    <span
                      className={cn(
                        effectiveVendorId ? "text-[#111827]" : "text-[#9CA3AF]",
                      )}
                    >
                      {vendorLabel}
                    </span>
                    <ChevronDown
                      size={16}
                      className="shrink-0 text-[#6B7280]"
                    />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="max-h-60 w-(--radix-dropdown-menu-trigger-width) bg-white"
                >
                  {vendorOptions.length === 0 ? (
                    <p className="px-2 py-2 text-[13px] text-[#6B7280]">
                      Belum ada vendor
                    </p>
                  ) : (
                    <DropdownMenuRadioGroup
                      value={effectiveVendorId}
                      onValueChange={setVendorId}
                    >
                      {vendorOptions.map((vendor) => (
                        <DropdownMenuRadioItem
                          key={vendor._id}
                          value={vendor._id}
                          className="text-[14px]"
                        >
                          {vendor.namaPerusahaan}
                        </DropdownMenuRadioItem>
                      ))}
                    </DropdownMenuRadioGroup>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </label>

            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Tanggal*
              </span>
              <input
                type="text"
                value={tanggal}
                required
                readOnly
                className="sr-only"
                tabIndex={-1}
                aria-hidden
              />
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className={cn(
                      "mt-2 flex h-11 w-full items-center justify-between rounded-lg border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-left text-[14px] outline-none focus:border-[#0846A1] focus:ring-2 focus:ring-[#0846A1]/20",
                      !tanggal && "text-[#9CA3AF]",
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <CalendarIcon size={16} className="text-[#6B7280]" />
                      <span className={tanggal ? "text-[#111827]" : undefined}>
                        {tanggalLabel}
                      </span>
                    </span>
                    <ChevronDown size={16} className="shrink-0 text-[#6B7280]" />
                  </button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto bg-white p-0">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => {
                      if (date) {
                        setTanggal(format(date, "yyyy-MM-dd"));
                        setDateOpen(false);
                      }
                    }}
                    defaultMonth={selectedDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </label>

            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Metode Pembayaran*
              </span>
              <div className="relative mt-2">
                <Input
                  required
                  placeholder="Pilih metode pembayaran"
                  value={metodePembayaran}
                  onChange={(e) => setMetodePembayaran(e.target.value)}
                  className="rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 pr-10 text-[14px]"
                />
                <ChevronDown
                  size={16}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                />
              </div>
            </label>

            <div>
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Bukti Foto*
              </span>
              {!hasPhoto ? (
                <button
                  type="button"
                  onClick={() => setHasPhoto(true)}
                  className="mt-2 flex w-full items-center gap-2 rounded-lg border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-[#6B7280]"
                >
                  <Upload size={16} />
                  Unggah foto
                </button>
              ) : (
                <div className="mt-2 space-y-2">
                  <div className="h-36 rounded-lg border border-[#E5E7EB] bg-[repeating-conic-gradient(#E5E7EB_0%_25%,#F9FAFB_0%_50%)] bg-size-[16px_16px]" />
                  <button
                    type="button"
                    onClick={() => setHasPhoto(false)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg border border-[#E5E7EB] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#111827]"
                  >
                    <Camera size={16} />
                    Foto Ulang
                  </button>
                </div>
              )}
            </div>

            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">Catatan</span>
              <textarea
                rows={3}
                placeholder="Tulis catatan disini"
                value={displayCatatan}
                onChange={(e) => setCatatan(e.target.value)}
                className="mt-2 w-full rounded-lg border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#0846A1] focus:ring-2 focus:ring-[#0846A1]/20"
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <div className="flex items-center justify-between">
            <p className="text-[14px]/[20px] font-semibold text-[#111827]">
              Detail Produk
            </p>
            <button
              type="button"
              onClick={removeAllItems}
              className="text-[12px]/[18px] font-semibold text-[#B91C1C] hover:underline"
            >
              Hapus Semua
            </button>
          </div>

          <div className="mt-4 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="space-y-3 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-4"
              >
                <label className="block">
                  <span className="text-[12px]/[18px] text-[#6B7280]">
                    Nama Produk*
                  </span>
                  <div className="relative mt-2">
                    <Input
                      required
                      placeholder="Pilih nama produk"
                      value={item.namaProduk}
                      onChange={(e) =>
                        updateItem(item.id, { namaProduk: e.target.value })
                      }
                      className="rounded-lg border-[#F0F2F5] bg-white px-4 py-3 pr-10 text-[14px]"
                    />
                    <ChevronDown
                      size={16}
                      className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                    />
                  </div>
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="text-[12px]/[18px] text-[#6B7280]">
                      Jumlah Pembelian*
                    </span>
                    <Input
                      required
                      type="number"
                      min={1}
                      placeholder="Min. 1"
                      value={item.jumlah}
                      onChange={(e) =>
                        updateItem(item.id, { jumlah: e.target.value })
                      }
                      className="mt-2 rounded-lg border-[#F0F2F5] bg-white px-4 py-3 text-[14px]"
                    />
                  </label>
                  <label className="block">
                    <span className="text-[12px]/[18px] text-[#6B7280]">
                      Satuan*
                    </span>
                    <div className="relative mt-2">
                      <Input
                        required
                        placeholder="Pilih satuan"
                        value={item.satuan}
                        onChange={(e) =>
                          updateItem(item.id, { satuan: e.target.value })
                        }
                        className="rounded-lg border-[#F0F2F5] bg-white px-4 py-3 pr-10 text-[14px]"
                      />
                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#6B7280]"
                      />
                    </div>
                  </label>
                </div>

                <label className="block">
                  <span className="text-[12px]/[18px] text-[#6B7280]">
                    Harga Satuan (Rp)*
                  </span>
                  <div className="relative mt-2">
                    <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[14px] font-medium text-[#6B7280]">
                      Rp
                    </span>
                    <Input
                      required
                      type="number"
                      min={0}
                      step={1}
                      inputMode="numeric"
                      placeholder="0"
                      value={item.hargaSatuan}
                      onChange={(e) =>
                        updateItem(item.id, { hargaSatuan: e.target.value })
                      }
                      className="rounded-lg border-[#F0F2F5] bg-white py-3 pl-10 pr-4 text-[14px]"
                    />
                  </div>
                </label>

                <div className="flex items-center justify-between border-t border-[#E5E7EB] pt-3 text-[13px]/[18px]">
                  <span className="text-[#6B7280]">Subtotal</span>
                  <span className="font-semibold text-[#111827]">
                    {formatCurrencyIdr(getItemSubtotal(item))}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addItem}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#EEF3FA] px-4 py-3 text-[14px] font-semibold text-[#0846A1] hover:bg-[#E5EEF8]"
          >
            <Plus size={18} />
            Tambah Barang
          </button>
        </section>
      </form>

      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-[#E5E7EB] bg-white px-4 py-4">
        <div className="mb-3 flex items-center justify-between text-[14px]/[20px]">
          <span className="font-semibold text-[#111827]">Total</span>
          <span className="font-semibold text-[#0846A1]">
            {formatCurrencyIdr(total)}
          </span>
        </div>
        <button
          type="submit"
          form="expense-manual-form"
          className="w-full rounded-md bg-[#052758] px-4 py-3 text-[15px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
        >
          Simpan Transaksi
        </button>
      </div>
    </div>
  );
}

export default ExpenseManualInputPage;
