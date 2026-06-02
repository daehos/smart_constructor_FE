import { ChevronRight } from "lucide-react";
import { formatCurrencyIdr } from "../utils/formatCurrency";

function CartSummaryBar({ productCount, total, onClick }) {
  if (productCount <= 0) return null;

  return (
    <button
      type="button"
      onClick={onClick}
      className="fixed bottom-0 left-0 right-0 z-30 flex items-center justify-between gap-3 border-t border-[#052758] bg-[#052758] px-4 py-3.5 text-white shadow-[0_-4px_20px_rgba(5,39,88,0.25)]"
    >
      <span className="text-[14px] font-semibold">
        Total ({productCount} produk)
      </span>
      <span className="flex items-center gap-1 text-[14px] font-bold">
        {formatCurrencyIdr(total)}
        <ChevronRight size={18} />
      </span>
    </button>
  );
}

export default CartSummaryBar;
