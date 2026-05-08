import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FilterChip } from "@/components/ui/filter-chip";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import VendorRow from "./components/VendorRow";
import VendorPeekCard from "./components/VendorPeekCard";
import VendorFilterSheet from "./components/VendorFilterSheet";
import { vendorsApi } from "@/services/vendors";

const PAGE_SIZE = 20;

function VendorListPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All Vendors");
  const [peekId, setPeekId] = useState(null);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [specializations, setSpecializations] = useState([]);

  const kategoriSpesialisasi = useMemo(() => {
    if (specializations.length > 0) return specializations[0];
    if (activeCategory === "All Vendors") return undefined;
    return activeCategory;
  }, [activeCategory, specializations]);

  const vendorsQuery = useQuery({
    queryKey: ["vendors", { q: query, kategoriSpesialisasi, page, limit: PAGE_SIZE }],
    queryFn: () =>
      vendorsApi.list({
        q: query || undefined,
        kategoriSpesialisasi,
        page,
        limit: PAGE_SIZE,
      }),
    keepPreviousData: true,
  });

  const pageItems = vendorsQuery.data?.data ?? [];
  const total = vendorsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleTogglePeek = (id) => {
    setPeekId((current) => (current === id ? null : id));
  };

  const totalLabel = `Total ${total} Data`;

  return (
    <div className="space-y-4">
      <div className="text-left">
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Vendor Database
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          Deskripsi (opsional)
        </p>
      </div>

      <div className="flex items-center gap-2">
        <SearchInput
          placeholder="Cari"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setPage(1);
            setPeekId(null);
          }}
        />
        <button
          type="button"
          className="h-10 rounded-lg border border-[#E5E7EB] bg-white px-3 text-[12px] font-semibold text-[#111827]"
          onClick={() => setFilterOpen(true)}
        >
          Filter
        </button>
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {["All Vendors", "General Contractor", "ME"].map((chip) => (
            <FilterChip
              key={chip}
              active={activeCategory === chip}
              onClick={() => {
                setActiveCategory(chip);
                setPage(1);
                setPeekId(null);
              }}
            >
              {chip}
            </FilterChip>
          ))}
        </div>
        <div className="text-[12px]/[18px] text-[#6B7280]">{totalLabel}</div>
      </div>

      <div className="space-y-2">
        <div className="grid grid-cols-[1fr_120px] px-1 text-[11px]/[16px] text-[#6B7280]">
          <span>Nama Vendor</span>
          <span className="text-right">Kategori</span>
        </div>

        {!vendorsQuery.isLoading && pageItems.length === 0 ? (
          <EmptyState
            title="Not data found"
            description="Try adjusting your search or filter options to find what you’re looking for"
            actionLabel="Reset Filter"
            onAction={() => {
              setQuery("");
              setActiveCategory("All Vendors");
              setPage(1);
              setPeekId(null);
            }}
          />
        ) : (
          <>
            {pageItems.map((vendor) => (
              <div key={vendor._id}>
                <VendorRow
                  vendor={vendor}
                  peekOpen={peekId === vendor._id}
                  onTogglePeek={handleTogglePeek}
                />
                {peekId === vendor._id && <VendorPeekCard vendor={vendor} />}
              </div>
            ))}
          </>
        )}
      </div>

      {total > 0 && (
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      )}

      <VendorFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        options={[
          "All Vendors",
          "General Contractor",
          "ME",
          "Structural Steel Contractor",
          "Material Supplier",
          "Services",
        ]}
        value={specializations}
        onApply={(vals) => {
          setSpecializations(vals);
          setPage(1);
          setPeekId(null);
        }}
      />
    </div>
  );
}

export default VendorListPage;

