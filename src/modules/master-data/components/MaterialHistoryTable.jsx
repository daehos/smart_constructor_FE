function formatPrice(hargaTerakhir, satuanHarga = "") {
  if (typeof hargaTerakhir !== "number") return "-";
  const formatted = hargaTerakhir.toLocaleString("id-ID");
  return `${formatted}${satuanHarga ?? ""}`;
}

function MaterialHistoryTable({ rows }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="grid grid-cols-[1fr_130px_90px] gap-3 bg-[#F8FAFC] px-4 py-2 text-[11px]/[16px] text-[#6B7280]">
        <span>Material</span>
        <span className="text-right">Last Price (Rp)</span>
        <span className="text-right">Proyek</span>
      </div>
      <div className="divide-y divide-[#E5E7EB]">
        {rows.map((r, index) => (
          <div
            // stable enough for static mock list
            key={`${r._id ?? r.namaMaterial ?? "row"}-${index}`}
            className="grid grid-cols-[1fr_130px_90px] gap-3 px-4 py-3 text-[12px]/[18px]"
          >
            <span className="text-[#111827]">{r.namaMaterial ?? "-"}</span>
            <span className="text-right font-semibold text-[#111827]">
              {formatPrice(r.hargaTerakhir, r.satuanHarga)}
            </span>
            <span className="text-right text-[#6B7280]">{r.namaProyek ?? "-"}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MaterialHistoryTable;

