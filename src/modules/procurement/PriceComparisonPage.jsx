import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterChip } from "@/components/ui/filter-chip";
import VendorMaterialCard from "./components/VendorMaterialCard";
import CompareModal from "./components/CompareModal";
import ComparisonTable from "./components/ComparisonTable";
import { materialsApi } from "@/services/materials";

function PriceComparisonPage() {
  const [sort, setSort] = useState("Harga: Rendah - Tinggi");
  const [compareMode, setCompareMode] = useState(false);
  const [selectedVendors, setSelectedVendors] = useState([]);
  const [compareOpen, setCompareOpen] = useState(false);
  const [compareApplied, setCompareApplied] = useState([]);

  const sortParam = sort === "Harga: Rendah - Tinggi" ? "price_asc" : "price_asc";
  const params = useMemo(
    () => ({
      sort: sortParam,
      page: 1,
      limit: 20,
    }),
    [sortParam],
  );

  const comparisonQuery = useQuery({
    queryKey: ["materials", "price-comparison", params],
    queryFn: () => materialsApi.priceComparison(params),
  });

  const items = comparisonQuery.data?.data ?? [];

  const toggleVendor = (vendorId) => {
    setSelectedVendors((prev) => {
      if (prev.includes(vendorId)) return prev.filter((id) => id !== vendorId);
      return [...prev, vendorId].slice(0, 3);
    });
  };

  const vendorOptions = useMemo(() => {
    const map = new Map();
    for (const m of items) {
      const vendorId = m?.vendor?._id;
      if (!vendorId) continue;
      if (!map.has(vendorId)) map.set(vendorId, m);
    }
    return Array.from(map.values());
  }, [items]);

  const appliedVendors = useMemo(() => {
    const byId = new Map(vendorOptions.map((v) => [v.vendor?._id, v]));
    return compareApplied.map((id) => byId.get(id)).filter(Boolean);
  }, [compareApplied, vendorOptions]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div className="text-left">
          <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
            Perbandingan Harga Vendor
          </p>
          <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
            Urutkan berdasarkan
          </p>
        </div>
        <button
          type="button"
          className="rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 text-[12px] font-semibold text-[#111827]"
          onClick={() => setSort("Harga: Rendah - Tinggi")}
        >
          {sort}
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <FilterChip active>Filter</FilterChip>
          <FilterChip
            active={compareMode}
            onClick={() => {
              setCompareMode((v) => !v);
              setCompareApplied([]);
              setSelectedVendors([]);
            }}
          >
            Bandingkan
            {compareMode && selectedVendors.length > 0 ? (
              <span className="ml-1 rounded-full bg-[#052758] px-2 py-0.5 text-[11px] font-semibold text-white">
                {selectedVendors.length}
              </span>
            ) : null}
          </FilterChip>
        </div>
        {compareMode ? (
          <button
            type="button"
            onClick={() => setCompareOpen(true)}
            className="text-[12px]/[18px] font-semibold text-[#0846A1] hover:underline"
          >
            Bandingkan{selectedVendors.length ? ` (${selectedVendors.length})` : ""}
          </button>
        ) : null}
      </div>

      {appliedVendors.length >= 2 ? (
        <ComparisonTable vendors={appliedVendors} />
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <VendorMaterialCard
              key={`${item.vendor?._id ?? "vendor"}-${item.namaMaterial ?? "material"}`}
              item={item}
              selectable={compareMode}
              selected={selectedVendors.includes(item?.vendor?._id)}
              onToggleSelect={toggleVendor}
            />
          ))}
        </div>
      )}

      <CompareModal
        open={compareOpen}
        onOpenChange={setCompareOpen}
        vendors={vendorOptions}
        value={selectedVendors}
        onApply={(ids) => {
          setCompareApplied(ids);
          setSelectedVendors(ids);
        }}
      />
    </div>
  );
}

export default PriceComparisonPage;

