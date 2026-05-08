import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MaterialHistoryTable from "./components/MaterialHistoryTable";
import { vendorsApi } from "@/services/vendors";

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-3 text-[12px]/[18px]">
      <span className="text-[#6B7280]">{label}</span>
      <span className="text-[#111827]">{value}</span>
    </div>
  );
}

function VendorDetailPage() {
  const params = useParams();
  const id = decodeURIComponent(params.id ?? "");

  const vendorQuery = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => vendorsApi.get(id),
    enabled: !!id,
  });

  const vendor = vendorQuery.data ?? null;

  const historyQuery = useQuery({
    queryKey: ["vendor", id, "material-history", { page: 1, limit: 5 }],
    queryFn: () => vendorsApi.materialHistory(id, { page: 1, limit: 5 }),
    enabled: !!id,
  });

  const historyRows = historyQuery.data?.data ?? [];

  return (
    <div className="space-y-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
            {vendor?.namaPerusahaan ?? "—"}
          </p>
          <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
            {vendor?.kategoriSpesialisasi ?? "—"}
          </p>
        </div>
        <Link
          to={`/master-data/vendor/${encodeURIComponent(id)}/edit`}
          className="rounded-md bg-[#052758] px-3 py-2 text-[12px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
        >
          Ubah Data
        </Link>
      </div>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[13px]/[18px] font-semibold text-[#111827]">
          Kontak
        </p>
        <div className="mt-3 space-y-2">
          <InfoRow label="Nomor Telepon" value={vendor?.telepon ?? "—"} />
          <InfoRow label="Email" value={vendor?.email ?? "—"} />
          <InfoRow label="Website" value={vendor?.website ?? "—"} />
          <button
            type="button"
            className="mt-2 w-full rounded-md border border-[#D1D5DB] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#111827]"
          >
            Kirim Pesan
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[13px]/[18px] font-semibold text-[#111827]">
          Informasi Umum
        </p>
        <div className="mt-3 space-y-2">
          <InfoRow label="Nama Perusahaan" value={vendor?.namaPerusahaan ?? "—"} />
          <InfoRow label="Alamat Perusahaan" value={vendor?.alamatPerusahaan ?? "—"} />
          <InfoRow label="Kategori Spesialisasi" value={vendor?.kategoriSpesialisasi ?? "—"} />
          <InfoRow
            label="Sub-Kategori"
            value={(vendor?.subKategori ?? []).join(", ") || "—"}
          />
        </div>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <div className="flex items-center justify-between">
          <p className="text-[13px]/[18px] font-semibold text-[#111827]">
            Riwayat Harga Material
          </p>
          <button
            type="button"
            className="text-[12px]/[18px] font-medium text-[#0846A1] hover:underline"
          >
            Lihat Semua
          </button>
        </div>
        <div className="mt-3">
          <MaterialHistoryTable rows={historyRows} />
        </div>
        <button
          type="button"
          className="mt-3 w-full rounded-md border border-[#D1D5DB] bg-white px-4 py-2.5 text-[13px] font-semibold text-[#111827]"
        >
          Unduh
        </button>
      </section>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[13px]/[18px] font-semibold text-[#111827]">
          Riwayat Perubahan
        </p>
        <div className="mt-3 space-y-2 text-[12px]/[18px] text-[#6B7280]">
          <p>26 Okt 2026 • Data diperbarui</p>
          <p>31 Jan 2026 • Data dibuat</p>
        </div>
      </section>

      <div className="pt-2">
        <Link
          to={`/master-data/vendor/${encodeURIComponent(id)}/edit?delete=1`}
          className="text-[13px]/[18px] font-semibold text-[#B91C1C] hover:underline"
        >
          Hapus Data
        </Link>
      </div>
    </div>
  );
}

export default VendorDetailPage;

