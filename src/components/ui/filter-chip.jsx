import { cn } from "@/lib/utils";

function FilterChip({ active, children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[12px]/[18px]",
        active
          ? "border-[#0846A1] bg-[#0846A1]/5 text-[#0846A1]"
          : "border-[#E5E7EB] bg-white text-[#4B5563]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { FilterChip };

