import * as React from "react";
import { cn } from "@/lib/utils";

function Sheet({
  open,
  onOpenChange,
  children,
  side = "bottom",
  className = "",
}) {
  if (!open) return null;

  const sideClasses =
    side === "left"
      ? "left-0 top-0 h-full w-[80%] max-w-xs rounded-r-2xl"
      : "bottom-0 left-0 w-full rounded-t-2xl";

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-start bg-black/40"
      onClick={() => onOpenChange?.(false)}
    >
      <div
        className={cn(
          "relative bg-white p-5 shadow-[0_-8px_30px_rgba(15,23,42,0.35)]",
          sideClasses,
          className,
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export { Sheet };

