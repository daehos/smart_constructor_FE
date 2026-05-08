import * as React from "react";
import { cn } from "@/lib/utils";

function Dialog({ open, onOpenChange, title, description, children, actions }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-6"
      onClick={() => onOpenChange?.(false)}
    >
      <div
        className={cn(
          "w-full max-w-sm rounded-2xl bg-white p-6 text-left shadow-[0_18px_45px_rgba(15,23,42,0.35)]",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <h2 className="text-[18px]/[24px] font-semibold text-(--text-h)">
            {title}
          </h2>
        )}
        {description && (
          <p className="mt-1 text-[14px]/[20px] text-[#6B7280]">
            {description}
          </p>
        )}
        {children && <div className="mt-4">{children}</div>}
        {actions && (
          <div className="mt-6 flex justify-end gap-2">{actions}</div>
        )}
      </div>
    </div>
  );
}

export { Dialog };

