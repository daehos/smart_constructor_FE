import { useMemo, useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

function VendorFilterSheet({ open, onOpenChange, options, value, onApply }) {
  const [local, setLocal] = useState(() => new Set(value ?? []));

  const list = useMemo(() => options ?? [], [options]);

  const toggle = (opt) => {
    setLocal((prev) => {
      const next = new Set(prev);
      if (next.has(opt)) next.delete(opt);
      else next.add(opt);
      return next;
    });
  };

  const reset = () => setLocal(new Set());

  const apply = () => {
    onApply?.(Array.from(local));
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="bottom" className="p-0">
      <div className="px-5 pb-4 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="text-left">
            <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
              Filter
            </p>
            <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
              Vendor Database
            </p>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md px-3 py-1 text-[13px] text-[#6B7280] hover:bg-[#F3F4F6]"
          >
            Tutup
          </button>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-[13px]/[18px] font-semibold text-[#111827]">
              Kategori Spesialisasi
            </p>
            <button
              type="button"
              className="text-[12px]/[18px] font-medium text-[#0846A1] hover:underline"
            >
              Lihat lainnya
            </button>
          </div>

          <div className="mt-3 space-y-3">
            {list.map((opt) => {
              const checked = local.has(opt);
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggle(opt)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left hover:bg-[#F9FAFB]"
                >
                  <span className="text-[13px]/[18px] text-[#111827]">
                    {opt}
                  </span>
                  <Checkbox checked={checked} />
                </button>
              );
            })}
          </div>
        </div>

        <div className="mt-5 flex gap-3">
          <button
            type="button"
            onClick={reset}
            className="flex-1 rounded-md border border-[#D1D5DB] bg-white px-4 py-2.5 text-[14px] font-semibold text-[#111827]"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={apply}
            className="flex-1 rounded-md bg-[#052758] px-4 py-2.5 text-[14px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
          >
            Terapkan
          </button>
        </div>
      </div>
    </Sheet>
  );
}

export default VendorFilterSheet;

