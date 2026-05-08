import { cn } from "@/lib/utils";

const MAP = {
  Selesai: "bg-[#ECFDF3] text-[#166534] border-[#BBF7D0]",
  Dikirim: "bg-[#EFF6FF] text-[#1D4ED8] border-[#BFDBFE]",
  Dibatalkan: "bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA]",
  Pengembalian: "bg-[#FFFBEB] text-[#92400E] border-[#FDE68A]",
};

function StatusBadge({ status, className = "" }) {
  const base =
    "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px]/[16px] font-medium";
  return (
    <span className={cn(base, MAP[status] ?? MAP.Selesai, className)}>
      {status}
    </span>
  );
}

export { StatusBadge };

