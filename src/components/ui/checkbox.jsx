import * as React from "react";
import { cn } from "@/lib/utils";

function Checkbox({ checked, className = "", ...props }) {
  return (
    <button
      type="button"
      aria-pressed={checked}
      className={cn(
        "flex size-4 items-center justify-center rounded border border-[#CBD5E1] bg-white text-[10px] text-[#0846A1]",
        checked && "bg-[#0846A1] text-white border-[#0846A1]",
        className,
      )}
      {...props}
    >
      {checked ? "✓" : null}
    </button>
  );
}

export { Checkbox };

