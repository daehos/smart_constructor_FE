import { useMemo, useState } from "react";
import { Sheet } from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";

function CompareModal({ open, onOpenChange, vendors, value, onApply }) {
  const list = useMemo(() => vendors ?? [], [vendors]);
  const [local, setLocal] = useState(value ?? []);

  const toggle = (vendorId) => {
    setLocal((prev) => {
      if (prev.includes(vendorId)) return prev.filter((id) => id !== vendorId);
      return [...prev, vendorId].slice(0, 3);
    });
  };

  const canApply = local.length >= 2;

  const reset = () => setLocal([]);

  const apply = () => {
    if (!canApply) return;
    onApply?.(local);
    onOpenChange(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} side="bottom" className="p-0">
      <div className="px-5 pb-4 pt-4">
        <div className="flex items-start justify-between gap-4">
          <div className="text-left">
            <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
              Bandingkan Vendor
            </p>
            <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
              Pilih minimal 2 vendor untuk dibandingkan.
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

        <div className="mt-4 space-y-3">
          {list.map((v) => {
            const checked = local.includes(v.vendorId);
            return (
              <button
                key={v.vendorId}
                type="button"
                onClick={() => toggle(v.vendorId)}
                className="flex w-full items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3 text-left hover:bg-[#F9FAFB]"
              >
                <div>
                  <p className="text-[12px]/[18px] text-[#6B7280]">
                    {v.specialization}
                  </p>
                  <p className="text-[13px]/[18px] font-semibold text-[#111827]">
                    {v.vendorName}
                  </p>
                </div>
                <Checkbox checked={checked} />
              </button>
            );
          })}
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
            disabled={!canApply}
            className="flex-1 rounded-md bg-[#052758] px-4 py-2.5 text-[14px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90 disabled:opacity-60"
          >
            Bandingkan
          </button>
        </div>
      </div>
    </Sheet>
  );
}

export default CompareModal;

