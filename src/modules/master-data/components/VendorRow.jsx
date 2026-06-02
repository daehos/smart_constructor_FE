function VendorRow({ vendor, onTogglePeek, peekOpen, striped = false }) {
  return (
    <button
      type="button"
      onClick={() => onTogglePeek?.(vendor._id)}
      className={[
        "grid w-full grid-cols-[36px_1fr_120px] items-center gap-2 px-4 py-3 text-left transition-colors",
        striped ? "bg-[#F2F7FC]" : "bg-white",
        "hover:bg-[#EEF3FA]/70",
      ].join(" ")}
    >
      <span className="flex size-8 shrink-0 items-center justify-center rounded-md  bg-white text-[16px] font-medium leading-none text-[#6B7280] shadow-sm">
        {peekOpen ? "−" : "+"}
      </span>
      <p className="text-[13px]/[18px]  text-[#121212]">
        {vendor.namaPerusahaan}
      </p>
      <p className=" text-[12px]/[18px] text-[#121212]">
        {vendor.kategoriSpesialisasi}
      </p>
    </button>
  );
}

export default VendorRow;
