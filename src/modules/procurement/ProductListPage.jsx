import { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, SlidersHorizontal } from "lucide-react";
import { Breadcrumb } from "@/components/Breadcrumb";
import { FilterChip } from "@/components/ui/filter-chip";
import { SearchInput } from "@/components/ui/search-input";
import ProductCard from "./components/ProductCard";
import ProductVariantSheet from "./components/ProductVariantSheet";
import CartSummaryBar from "./components/CartSummaryBar";
import { PRODUCT_CATEGORY_FILTERS } from "./data/productCategoryFilters";
import { useProcurementCart } from "./hooks/useProcurementCart";
import { materialsApi } from "@/services/materials";
import { mapMaterialToProduct } from "./utils/materialHelpers";
import { useToast } from "@/lib/toast.jsx";

const PAGE_SIZE = 20;

function ProductListPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { pushToast } = useToast();
  const { addItem, productCount, subtotal } = useProcurementCart();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(
    () => searchParams.get("kategori") ?? "semua",
  );
  const [page] = useState(1);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [variantOpen, setVariantOpen] = useState(false);

  const listParams = useMemo(
    () => ({
      page,
      limit: PAGE_SIZE,
      q: query.trim() || undefined,
      kategori: category === "semua" ? undefined : category,
    }),
    [page, query, category],
  );

  const materialsQuery = useQuery({
    queryKey: ["materials", "products", listParams],
    queryFn: () => materialsApi.list(listParams),
  });

  const products = useMemo(() => {
    const rows = materialsQuery.data?.data ?? [];
    return rows.map(mapMaterialToProduct);
  }, [materialsQuery.data?.data]);

  const total = materialsQuery.data?.total ?? products.length;

  const openVariant = (product) => {
    setSelectedProduct(product);
    setVariantOpen(true);
  };

  const handleAddToCart = (entry) => {
    addItem(entry);
    pushToast({ kind: "success", message: "Produk ditambahkan ke keranjang" });
  };

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 pb-28 pt-4 text-left">
      <Breadcrumb
        items={[
          { label: "Pengadaan", to: "/procurement/ordering" },
          { label: "Pemesanan Barang", to: "/procurement/ordering" },
          { label: "Daftar Produk" },
        ]}
      />

      <div className="mt-3 flex items-center justify-between rounded-xl border border-[#E5E7EB] bg-white px-4 py-3">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex size-9 items-center justify-center rounded-lg text-[#111827] hover:bg-[#F3F4F6]"
          aria-label="Kembali"
        >
          <ArrowLeft size={20} />
        </button>
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Daftar Produk
        </p>
        <span className="size-9" aria-hidden />
      </div>

      <div className="mt-4 space-y-3">
        <SearchInput
          placeholder="Cari"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-lg border border-[#E5E7EB] bg-[#F2F7FC] px-3 py-2 text-[12px] font-semibold text-[#111827]"
          >
            <SlidersHorizontal size={14} />
            Filter
          </button>
          <div className="-mx-1 flex flex-1 gap-2 overflow-x-auto px-1 pb-1">
            {PRODUCT_CATEGORY_FILTERS.map((chip) => (
              <FilterChip
                key={chip.id}
                active={category === chip.id}
                className="shrink-0"
                onClick={() => setCategory(chip.id)}
              >
                {chip.label}
              </FilterChip>
            ))}
          </div>
        </div>

        <p className="text-[12px]/[18px] text-[#6B7280]">
          Total: {materialsQuery.isLoading ? "—" : `${total} Data`}
        </p>

        {materialsQuery.isLoading ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-10 text-center text-[13px] text-[#6B7280]">
            Memuat produk...
          </div>
        ) : materialsQuery.isError ? (
          <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-10 text-center text-[13px] text-[#B91C1C]">
            Gagal memuat daftar produk.
          </div>
        ) : products.length === 0 ? (
          <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-10 text-center">
            <p className="text-[14px] font-semibold text-[#111827]">
              Produk tidak ditemukan
            </p>
            <p className="mt-1 text-[12px] text-[#6B7280]">
              Coba ubah kata kunci atau filter kategori.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-3">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => openVariant(product)}
              />
            ))}
          </div>
        )}
      </div>

      <ProductVariantSheet
        open={variantOpen}
        product={selectedProduct}
        onOpenChange={setVariantOpen}
        onAddToCart={handleAddToCart}
      />

      <CartSummaryBar
        productCount={productCount}
        total={subtotal}
        onClick={() => navigate("/procurement/review")}
      />
    </div>
  );
}

export default ProductListPage;
