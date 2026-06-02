import { cn } from "@/lib/utils";

function FilterChip({ active, children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-[12px]/[18px]",
        active
          ? " text-white bg-[#e07400] font-bold"
          : "border-[#E5E7EB] bg-[#f2f7fc] text-[#4B5563]",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export { FilterChip };
