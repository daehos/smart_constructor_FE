import { cn } from "@/lib/utils";
import { MagnifyingGlassIcon } from "@phosphor-icons/react";

function SearchInput({ className = "", ...props }) {
  return (
    <div className={cn("relative w-full", className)}>
      <span className="pointer-events-none absolute left-3 bg-[#f2f7fc] top-1/2 -translate-y-1/2 text-[16px] text-[#9CA3AF]">
        <MagnifyingGlassIcon size={16} />
      </span>
      <input
        type="search"
        className="h-10 w-full rounded-lg border border-[#E5E7EB] bg-white pl-9 pr-3 text-[13px] text-[#111827] placeholder:text-[#9CA3AF] outline-none focus:border-[#0846A1] focus:ring-2 focus:ring-[#0846A1]/20"
        {...props}
      />
    </div>
  );
}

export { SearchInput };
