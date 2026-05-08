function VendorRow({ vendor, onTogglePeek, peekOpen }) {
  return (
    <button
      type="button"
      onClick={() => onTogglePeek?.(vendor._id)}
      className="grid w-full grid-cols-[1fr_120px] items-center gap-3 rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left hover:bg-[#F9FAFB]"
    >
      <div>
        <p className="text-[13px]/[18px] font-semibold text-[#111827]">
          {vendor.namaPerusahaan}
        </p>
      </div>
      <div className="text-right text-[12px]/[18px] text-[#6B7280]">
        <span className="inline-flex items-center gap-2">
          {vendor.kategoriSpesialisasi}
          <span className="text-[#9CA3AF]">{peekOpen ? "▴" : "▾"}</span>
        </span>
      </div>
    </button>
  );
}

export default VendorRow;

