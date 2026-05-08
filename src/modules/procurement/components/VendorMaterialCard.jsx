import { Link } from "react-router-dom";

function formatPrice(hargaTerakhir, satuanHarga = "") {
  if (typeof hargaTerakhir !== "number") return "-";
  const formatted = hargaTerakhir.toLocaleString("id-ID");
  return `Rp${formatted}${satuanHarga ?? ""}`;
}

function VendorMaterialCard({ item, selectable, selected, onToggleSelect }) {
  const vendorName =
    item?.vendor?.namaBrand ??
    item?.vendor?.namaPerusahaan ??
    item?.vendorName ??
    "-";
  const specialization = item?.vendor?.kategoriSpesialisasi ?? item?.specialization ?? "-";
  const vendorId = item?.vendor?._id ?? item?.vendorId ?? "";
  const materialName = item?.namaMaterial ?? item?.material ?? "-";
  const price =
    typeof item?.hargaTerakhir === "number"
      ? formatPrice(item.hargaTerakhir, item.satuanHarga)
      : item?.price ?? "-";

  return (
    <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-left">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[12px]/[18px] text-[#6B7280]">
            {specialization}
          </p>
          <p className="text-[14px]/[20px] font-semibold text-[#111827]">
            {vendorName}
          </p>
        </div>
        {selectable ? (
          <button
            type="button"
            onClick={() => onToggleSelect?.(vendorId)}
            className={`rounded-full border px-3 py-1 text-[12px] font-semibold ${
              selected
                ? "border-[#0846A1] bg-[#0846A1]/5 text-[#0846A1]"
                : "border-[#E5E7EB] bg-white text-[#6B7280]"
            }`}
          >
            {selected ? "Dipilih" : "Pilih"}
          </button>
        ) : (
          <Link
            to={`/procurement/order/${encodeURIComponent(vendorId)}`}
            className="rounded-md bg-[#052758] px-3 py-2 text-[12px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
          >
            Pesan
          </Link>
        )}
      </div>

      <div className="mt-3 rounded-xl bg-[#F8FAFC] px-4 py-3">
        <p className="text-[12px]/[18px] text-[#6B7280]">Material</p>
        <div className="mt-1 flex items-end justify-between gap-3">
          <p className="text-[13px]/[18px] font-semibold text-[#111827]">
            {materialName}
          </p>
          <p className="text-[13px]/[18px] font-semibold text-[#111827]">
            {price}
          </p>
        </div>
      </div>
    </div>
  );
}

export default VendorMaterialCard;

