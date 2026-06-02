import { ShoppingBag } from "lucide-react";
import { cn } from "@/lib/utils";

const ICON_VARIANTS = [
  { bg: "bg-[#DBEAFE]", icon: "text-[#2563EB]" },
  { bg: "bg-[#EDE9FE]", icon: "text-[#7C3AED]" },
  { bg: "bg-[#FEF3C7]", icon: "text-[#D97706]" },
  { bg: "bg-[#D1FAE5]", icon: "text-[#059669]" },
];

function formatCurrencyIdr(value) {
  if (typeof value !== "number" || Number.isNaN(value) || value <= 0) {
    return "-";
  }
  const formatted = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
  return `-${formatted}`;
}

function ExpenseRow({ expense }) {
  const variant = ICON_VARIANTS[expense.iconVariant % ICON_VARIANTS.length];
  const productLabel =
    expense.productCount > 0
      ? `${expense.productCount} Produk`
      : "0 Produk";

  return (
    <div className="flex items-center gap-3 border-b border-[#E5E7EB] px-1 py-3 last:border-b-0">
      <div
        className={cn(
          "flex size-10 shrink-0 items-center justify-center rounded-lg",
          variant.bg,
        )}
      >
        <ShoppingBag size={18} className={variant.icon} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[14px]/[20px] font-semibold text-[#111827]">
          {expense.namaTransaksi}
        </p>
        <p className="mt-0.5 truncate text-[12px]/[18px] text-[#6B7280]">
          {expense.kategori} • {productLabel}
        </p>
      </div>
      <p className="shrink-0 text-right text-[13px]/[18px] font-semibold text-[#0846A1]">
        {formatCurrencyIdr(expense.jumlah)}
      </p>
    </div>
  );
}

export default ExpenseRow;
