import { MoreHorizontal } from "lucide-react";

function OrderStatusSummaryCard({ label, count, onClick }) {
  const Comp = onClick ? "button" : "div";

  return (
    <Comp
      type={onClick ? "button" : undefined}
      onClick={onClick}
      className={[
        "flex w-full items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-3 py-3 text-left",
        onClick ? "hover:bg-[#F8FAFC] active:bg-[#F2F7FC]" : "",
      ].join(" ")}
    >
      <div className="flex items-center gap-2.5">
        <span className="flex size-8 items-center justify-center rounded-lg bg-[#FFF7ED]">
          <MoreHorizontal size={16} className="text-[#F97316]" />
        </span>
        <span className="text-[13px]/[18px] font-medium text-[#111827]">
          {label}
        </span>
      </div>
      <span className="text-[18px]/[24px] font-bold text-[#111827]">
        {count}
      </span>
    </Comp>
  );
}

export default OrderStatusSummaryCard;
