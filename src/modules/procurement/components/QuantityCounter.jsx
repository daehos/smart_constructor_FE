import { Minus, Plus } from "lucide-react";

function QuantityCounter({ value, onChange, min = 1 }) {
  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex size-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F8FAFC]"
        aria-label="Kurangi jumlah"
      >
        <Minus size={16} />
      </button>
      <span className="min-w-8 text-center text-[15px] font-semibold text-[#111827]">
        {value}
      </span>
      <button
        type="button"
        onClick={() => onChange(value + 1)}
        className="flex size-9 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#111827] hover:bg-[#F8FAFC]"
        aria-label="Tambah jumlah"
      >
        <Plus size={16} />
      </button>
    </div>
  );
}

export default QuantityCounter;
