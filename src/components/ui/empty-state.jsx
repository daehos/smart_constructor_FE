function EmptyState({ title, description, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-[#E5E7EB] bg-[#F9FAFB] px-6 py-10 text-center">
      <div className="size-10 rounded-full bg-white shadow-sm" />
      <div>
        <p className="text-[15px]/[22px] font-semibold text-(--text-h)">
          {title}
        </p>
        {description && (
          <p className="mt-1 text-[13px]/[20px] text-[#6B7280]">
            {description}
          </p>
        )}
      </div>
      {actionLabel && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="mt-1 rounded-md bg-[#052758] px-4 py-2 text-[13px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export { EmptyState };

