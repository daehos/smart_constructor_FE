import { Link } from "react-router-dom";

function Cell({ label, value }) {
  return (
    <div className="border-b border-[#E5E7EB] px-3 py-2">
      <p className="text-[11px]/[16px] text-[#6B7280]">{label}</p>
      <p className="mt-0.5 text-[12px]/[18px] font-semibold text-[#111827]">
        {value}
      </p>
    </div>
  );
}

function ComparisonTable({ vendors }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="grid grid-cols-3 border-b border-[#E5E7EB] bg-[#F8FAFC]">
        {vendors.map((v) => (
          <div key={v.vendorId} className="px-3 py-3 text-left">
            <p className="text-[12px]/[18px] font-semibold text-[#111827]">
              {v.vendorName}
            </p>
            <p className="text-[11px]/[16px] text-[#6B7280]">{v.material}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3">
        {vendors.map((v) => (
          <div key={v.vendorId} className="border-r last:border-r-0 border-[#E5E7EB]">
            <Cell label="Harga" value={v.price} />
            <Cell label="Kategori" value={v.specialization} />
            <Cell label="Material" value={v.material} />
            <div className="px-3 py-3">
              <Link
                to={`/procurement/order/${encodeURIComponent(v.vendorId)}`}
                className="block w-full rounded-md bg-[#052758] px-3 py-2 text-center text-[12px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
              >
                Pesan
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ComparisonTable;

