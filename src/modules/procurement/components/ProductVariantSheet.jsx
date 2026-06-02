import { useEffect, useState } from "react";
import { MessageCircle, X } from "lucide-react";
import { Sheet } from "@/components/ui/sheet";
import { FilterChip } from "@/components/ui/filter-chip";
import QuantityCounter from "./QuantityCounter";
import { formatCurrencyIdr } from "../utils/formatCurrency";

function ProductVariantSheet({ open, product, onOpenChange, onAddToCart }) {
  const [ukuran, setUkuran] = useState("");
  const [qty, setQty] = useState(1);
  const [catatan, setCatatan] = useState("");

  useEffect(() => {
    if (!open || !product) return;
    setUkuran(product.variants?.[0] ?? "");
    setQty(1);
    setCatatan("");
  }, [open, product]);

  if (!product) return null;

  const handleAdd = () => {
    onAddToCart?.({
      materialId: product.id,
      namaMaterial: product.namaMaterial,
      hargaSatuan: product.hargaSatuan,
      kategoriMaterial: product.kategori,
      ukuran: ukuran || product.variants?.[0] || "Standar",
      qty,
      catatan: catatan.trim(),
      vendor: product.vendor,
      imageUrl: product.imageUrl,
    });
    onOpenChange?.(false);
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange} className="max-h-[90vh] overflow-y-auto pb-6">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <p className="text-[16px]/[22px] font-semibold text-[#111827]">
            Varian Produk
          </p>
          <p className="mt-1 text-[14px] font-semibold text-[#111827]">
            {product.namaMaterial}
          </p>
          <p className="text-[14px] font-bold text-[#0846A1]">
            {formatCurrencyIdr(product.hargaSatuan)}
          </p>
        </div>
        <button
          type="button"
          onClick={() => onOpenChange?.(false)}
          className="rounded-lg p-1 text-[#6B7280] hover:bg-[#F3F4F6]"
          aria-label="Tutup"
        >
          <X size={20} />
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-[12px]/[18px] font-medium text-[#6B7280]">Ukuran</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {product.variants.map((variant) => (
              <FilterChip
                key={variant}
                active={ukuran === variant}
                onClick={() => setUkuran(variant)}
              >
                {variant}
              </FilterChip>
            ))}
          </div>
        </div>

        <div>
          <p className="text-[12px]/[18px] font-medium text-[#6B7280]">
            Jumlah Material
          </p>
          <div className="mt-2">
            <QuantityCounter value={qty} onChange={setQty} />
          </div>
        </div>

        <label className="block">
          <span className="text-[12px]/[18px] font-medium text-[#6B7280]">
            Catatan
          </span>
          <textarea
            rows={3}
            placeholder="Tuliskan catatan disini"
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            className="mt-2 w-full rounded-lg border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#0846A1] focus:ring-2 focus:ring-[#0846A1]/20"
          />
        </label>
      </div>

      <div className="mt-6 flex gap-2">
        <button
          type="button"
          className="flex size-11 shrink-0 items-center justify-center rounded-lg border border-[#E5E7EB] bg-white text-[#0846A1]"
          aria-label="Chat vendor"
        >
          <MessageCircle size={20} />
        </button>
        <button
          type="button"
          onClick={handleAdd}
          className="flex-1 rounded-lg bg-[#052758] px-4 py-3 text-[14px] font-semibold text-white hover:opacity-95 active:opacity-90"
        >
          Tambah ke Keranjang
        </button>
      </div>
    </Sheet>
  );
}

export default ProductVariantSheet;
