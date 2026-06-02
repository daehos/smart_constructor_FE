import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { CaretUpDown, Plus } from "@phosphor-icons/react";
import { FilterChip } from "@/components/ui/filter-chip";
import { Pagination } from "@/components/ui/pagination";
import { SearchInput } from "@/components/ui/search-input";
import { EmptyState } from "@/components/ui/empty-state";
import VendorRow from "./components/VendorRow";
import VendorPeekCard from "./components/VendorPeekCard";
import VendorFilterSheet from "./components/VendorFilterSheet";
import { vendorsApi } from "@/services/vendors";
import { SlidersHorizontalIcon } from "lucide-react";

const PAGE_SIZE = 20;

function VendorListPage() {
  const navigate = useNavigate();
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
    queryKey: [
      "vendors",
      { q: query, kategoriSpesialisasi, page, limit: PAGE_SIZE },
    ],
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

  // const totalLabel = ;

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
      </div>

      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="h-8 rounded-lg border flex justify-center items-center gap-2 border-[#c2cee1] bg-white px-3 text-[12px] font-semibold text-[#3f5471]"
            onClick={() => setFilterOpen(true)}
          >
            <SlidersHorizontalIcon size={16} />
            Filter
          </button>
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
          <div className="text-[12px]/[18px] text-[#6B7280]">
            Total <span className="font-bold">{total} Data</span>
          </div>

          <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
            <div className="grid grid-cols-[36px_1fr_120px] items-center gap-2 bg-[#e7f0fe] px-4 py-3 text-[13px]/[18px] font-medium text-[#3f5471]">
              <span aria-hidden="true" />
              <span className="inline-flex items-center gap-1.5">
                Nama Vendor
                <CaretUpDown size={14} className="text-[#3f5471]" />
              </span>
              <span className="inline-flex items-center  gap-1.5">
                Kategori
                <CaretUpDown size={14} className="text-[#3f5471]" />
              </span>
            </div>

            {pageItems.map((vendor, index) => (
              <div key={vendor._id}>
                <VendorRow
                  vendor={vendor}
                  striped={index % 2 === 1}
                  peekOpen={peekId === vendor._id}
                  onTogglePeek={handleTogglePeek}
                />
                {peekId === vendor._id && <VendorPeekCard vendor={vendor} />}
              </div>
            ))}
          </div>
        </>
      )}

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

      <button
        type="button"
        onClick={() => navigate("/master-data/vendor/new")}
        className="fixed bottom-6 right-5 z-40 flex size-14 items-center justify-center rounded-full bg-[#052758] text-white shadow-[0_4px_14px_rgba(5,39,88,0.35)] hover:opacity-95 active:opacity-90"
        aria-label="Tambah vendor"
      >
        <Plus size={28} weight="bold" />
      </button>
    </div>
  );
}

export default VendorListPage;
