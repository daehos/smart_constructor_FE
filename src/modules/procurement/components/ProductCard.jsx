import { Package } from "lucide-react";
import { formatCurrencyIdr } from "../utils/formatCurrency";

function ProductCard({ product, onClick }) {
  console.log(product);
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex flex-col cursor-pointer overflow-hidden rounded-xl border border-[#E5E7EB] bg-white text-left transition-opacity hover:opacity-95 active:opacity-90"
    >
      <div className="flex h-[150px] items-center justify-center bg-[#F3F4F6]">
        {product.imageUrl ? (
          <img
            src={product.imageUrl}
            alt=""
            className="h-full w-full object-cover"
          />
        ) : (
          <Package size={32} className="text-[#9CA3AF]" strokeWidth={1.5} />
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-3">
        <p className="line-clamp-2 text-[12px]/[16px]  text-[#3f5471]">
          {product.kategori}
        </p>
        <p className="line-clamp-2 text-[12px]/[16px] font-bold text-[#121212]">
          {product.namaMaterial}
        </p>
        <p className="text-[13px]/[18px] mt-3 font-bold text-[#121212]">
          {formatCurrencyIdr(product.hargaSatuan)}
        </p>
      </div>
    </button>
  );
}

export default ProductCard;
