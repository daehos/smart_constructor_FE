import { cn } from "@/lib/utils";

function PageButton({ active, children, className = "", ...props }) {
  return (
    <button
      type="button"
      className={cn(
        "inline-flex h-8 min-w-8 items-center justify-center rounded-full text-[12px]/[18px]",
        active
          ? "bg-[#052758] text-white"
          : "bg-transparent text-[#4B5563] hover:bg-[#EEF2FF]",
        className,
      )}
      aria-current={active ? "page" : undefined}
      {...props}
    >
      {children}
    </button>
  );
}

function Pagination({ page, totalPages, onChange }) {
  if (!totalPages || totalPages <= 1) return null;

  const go = (p) => {
    if (p < 1 || p > totalPages) return;
    onChange?.(p);
  };

  const pages = [];
  for (let i = 1; i <= totalPages; i += 1) {
    pages.push(i);
  }

  return (
    <div className="flex items-center justify-between gap-4 pt-4 text-[12px]/[18px] text-[#6B7280]">
      <button
        type="button"
        className="rounded-full px-2 py-1 hover:bg-[#EEF2FF]"
        onClick={() => go(page - 1)}
        disabled={page <= 1}
      >
        {"<"}
      </button>
      <div className="flex items-center gap-1.5">
        {pages.map((p) => (
          <PageButton
            // eslint-disable-next-line react/no-array-index-key
            key={p}
            active={p === page}
            onClick={() => go(p)}
          >
            {p}
          </PageButton>
        ))}
      </div>
      <button
        type="button"
        className="rounded-full px-2 py-1 hover:bg-[#EEF2FF]"
        onClick={() => go(page + 1)}
        disabled={page >= totalPages}
      >
        {">"}
      </button>
    </div>
  );
}

export { Pagination };

