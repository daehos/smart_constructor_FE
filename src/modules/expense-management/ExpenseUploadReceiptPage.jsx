import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Upload, X } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { useToast } from "@/lib/toast.jsx";
import { receiptsApi } from "@/services/receipts";

const ACCEPT_IMAGES =
  "image/jpeg,image/jpg,image/png,image/webp,image/gif,image/heic,image/heif,.jpg,.jpeg,.png,.webp,.gif,.heic,.heif";

const POLL_INTERVAL_MS = 2000;
const MAX_POLL_ATTEMPTS = 30;

async function pollReceiptOcr(receiptId) {
  for (let attempt = 0; attempt < MAX_POLL_ATTEMPTS; attempt += 1) {
    const receipt = await receiptsApi.get(receiptId);

    if (receipt?.parsed) return receipt;
    if (receipt?.error) return receipt;
    if (receipt?.status && !["queued", "processing"].includes(receipt.status)) {
      return receipt;
    }

    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }

  return receiptsApi.get(receiptId);
}

function ExpenseUploadReceiptPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const inputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [receipt, setReceipt] = useState(null);
  const [statusMessage, setStatusMessage] = useState("");

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const openFilePicker = () => {
    inputRef.current?.click();
  };

  const clearFile = () => {
    setFile(null);
    setReceipt(null);
    setStatusMessage("");
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return null;
    });
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    const isImage =
      selected.type.startsWith("image/") ||
      /\.(jpe?g|png|webp|gif|heic|heif)$/i.test(selected.name);

    if (!isImage) {
      pushToast({
        kind: "error",
        message: "Hanya file gambar (JPG, PNG, WEBP, dll.) yang didukung.",
      });
      e.target.value = "";
      return;
    }

    setReceipt(null);
    setStatusMessage("");
    setFile(selected);
    setPreviewUrl((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return URL.createObjectURL(selected);
    });
  };

  const handleUpload = async () => {
    if (!file) {
      openFilePicker();
      return;
    }

    setUploading(true);
    setReceipt(null);
    setStatusMessage("Mengunggah nota...");

    try {
      const uploaded = await receiptsApi.upload(file);
      const receiptId = uploaded?._id;

      if (!receiptId) {
        throw new Error("ID receipt tidak ditemukan pada response upload.");
      }

      setStatusMessage("Memproses OCR...");
      const result = await pollReceiptOcr(receiptId);
      setReceipt(result);

      if (result?.parsed) {
        pushToast({ kind: "success", message: "Nota berhasil diproses" });
        setStatusMessage("OCR selesai");
      } else if (result?.error) {
        pushToast({
          kind: "error",
          message: result.error ?? "Gagal memproses OCR nota.",
        });
        setStatusMessage("OCR gagal");
      } else {
        pushToast({
          kind: "info",
          message: "Nota diunggah. Hasil OCR belum tersedia, coba lagi nanti.",
        });
        setStatusMessage(`Status: ${result?.status ?? "menunggu"}`);
      }
    } catch (err) {
      pushToast({
        kind: "error",
        message: err?.message ?? "Gagal mengunggah nota, silakan coba lagi.",
      });
      setStatusMessage("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 pb-28 pt-4 text-left">
      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT_IMAGES}
        className="hidden"
        onChange={handleFileChange}
      />

      <Breadcrumb
        items={[
          { label: "Kelola Pengeluaran", to: "/expense-management/list" },
          { label: "Daftar Pengeluaran", to: "/expense-management/list" },
          { label: "Upload Nota" },
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
          Upload Nota
        </p>
        <Link
          to="/expense-management/list"
          className="flex size-9 items-center justify-center rounded-lg text-[#111827] hover:bg-[#F3F4F6]"
          aria-label="Tutup"
        >
          <X size={20} />
        </Link>
      </div>

      <section className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[14px]/[20px] font-semibold text-[#111827]">
          Unggah Nota
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          Upload foto nota (JPG, PNG, WEBP, dll.) untuk dicatat otomatis.
        </p>

        {!previewUrl ? (
          <button
            type="button"
            onClick={openFilePicker}
            disabled={uploading}
            className="mt-4 flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-10 text-[#6B7280] hover:bg-[#F2F7FC] active:bg-[#EEF3FA] disabled:opacity-60"
          >
            <Upload size={28} className="text-[#0846A1]" />
            <span className="text-[14px] font-semibold text-[#0846A1]">
              Pilih file nota
            </span>
            <span className="text-[12px]/[18px] text-[#6B7280]">
              Ketuk untuk membuka galeri / file
            </span>
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-[#F8FAFC]">
              <img
                src={previewUrl}
                alt="Preview nota"
                className="max-h-72 w-full object-contain"
              />
            </div>
            <p className="truncate text-[12px]/[18px] text-[#6B7280]">
              {file?.name}
            </p>
            {statusMessage ? (
              <p className="text-[12px]/[18px] font-medium text-[#0846A1]">
                {statusMessage}
              </p>
            ) : null}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={openFilePicker}
                disabled={uploading}
                className="flex-1 rounded-md border border-[#D1D5DB] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#111827] disabled:opacity-60"
              >
                Ganti File
              </button>
              <button
                type="button"
                onClick={clearFile}
                disabled={uploading}
                className="rounded-md border border-[#FECACA] bg-[#FEF2F2] px-4 py-2.5 text-[13px] font-semibold text-[#B91C1C] disabled:opacity-60"
              >
                Hapus
              </button>
            </div>
          </div>
        )}
      </section>

      {receipt?.parsed ? (
        <section className="mt-4 rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-[14px]/[20px] font-semibold text-[#111827]">
            Hasil OCR
          </p>
          <pre className="mt-3 max-h-64 overflow-auto rounded-lg bg-[#F8FAFC] p-3 text-[12px]/[18px] text-[#111827]">
            {JSON.stringify(receipt.parsed, null, 2)}
          </pre>
        </section>
      ) : null}

      {previewUrl ? (
        <div className="fixed bottom-0 left-0 right-0 z-30 space-y-2 border-t border-[#E5E7EB] bg-white px-4 py-4">
          {receipt?.parsed ? (
            <button
              type="button"
              onClick={() =>
                navigate("/expense-management/manual", {
                  state: { receipt },
                })
              }
              className="w-full rounded-md bg-[#052758] px-4 py-3 text-[15px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
            >
              Lanjut Input Manual
            </button>
          ) : null}
          {receipt && !receipt?.parsed ? (
            <button
              type="button"
              onClick={clearFile}
              disabled={uploading}
              className="w-full rounded-md border border-[#D1D5DB] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827] disabled:opacity-60"
            >
              Unggah Ulang
            </button>
          ) : null}
          {!receipt?.parsed ? (
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full rounded-md bg-[#052758] px-4 py-3 text-[15px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90 disabled:opacity-60"
            >
              {uploading ? statusMessage || "Memproses..." : "Unggah Nota"}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default ExpenseUploadReceiptPage;
