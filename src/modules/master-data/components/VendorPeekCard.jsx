import { Link } from "react-router-dom";

function Row({ label, value }) {
  return (
    <div className="grid grid-cols-[92px_1fr] gap-3 text-[12px]/[18px]">
      <span className="text-[#6B7280]">{label}</span>
      <span className="text-[#111827]">{value}</span>
    </div>
  );
}

function VendorPeekCard({ vendor }) {
  return (
    <div className="mt-2 rounded-2xl border border-[#E5E7EB] bg-[#F8FAFC] p-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[14px]/[20px] font-semibold text-(--text-h)">
            {vendor.namaPerusahaan}
          </p>
          <p className="text-[12px]/[18px] text-[#6B7280]">
            {vendor.kategoriSpesialisasi}
          </p>
        </div>
        <Link
          to={`/master-data/vendor/${encodeURIComponent(vendor._id)}`}
          className="rounded-md bg-[#052758] px-3 py-2 text-[12px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
        >
          Lihat Detail
        </Link>
      </div>

      <div className="mt-3 space-y-2">
        <Row label="ID" value={vendor.vendorCode} />
        <Row label="Sub Kategori" value={(vendor.subKategori ?? []).join(", ")} />
        <Row label="Email" value={vendor.email} />
        <Row label="Alamat" value={vendor.alamatPerusahaan} />
      </div>
    </div>
  );
}

export default VendorPeekCard;

