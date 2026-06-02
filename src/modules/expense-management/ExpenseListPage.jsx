import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { format, parseISO } from "date-fns";
import { id as localeId } from "date-fns/locale";
import { Calendar, ChevronDown, SlidersHorizontal } from "lucide-react";
import { FilterChip } from "@/components/ui/filter-chip";
import { SearchInput } from "@/components/ui/search-input";
import { Pagination } from "@/components/ui/pagination";
import ExpenseFilterSheet from "./components/ExpenseFilterSheet";
import ExpenseRow from "./components/ExpenseRow";
import ExpenseActionFab from "./components/ExpenseActionFab";
import { expenseCategories } from "./data/expenses";
import { receiptsApi } from "@/services/receipts";
import { mapReceiptToListItem } from "./utils/mapReceiptToListItem";

const PAGE_SIZE = 20;

function formatGroupDate(dateStr) {
  if (!dateStr) return "-";
  try {
    return format(parseISO(dateStr), "d MMM yyyy", { locale: localeId });
  } catch {
    const d = new Date(dateStr);
    if (Number.isNaN(d.getTime())) return dateStr;
    return d.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  }
}

function formatMonthLabel(monthKey) {
  try {
    return format(parseISO(`${monthKey}-01`), "MMM yyyy", { locale: localeId });
  } catch {
    return monthKey;
  }
}

function groupExpensesByDate(expenses) {
  const groups = new Map();
  for (const expense of expenses) {
    const key = expense.tanggal || "unknown";
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(expense);
  }
  return Array.from(groups.entries()).sort(([a], [b]) => b.localeCompare(a));
}

function ExpenseListPage() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("Semua");
  const [filterOpen, setFilterOpen] = useState(false);
  const [filterCategories, setFilterCategories] = useState([]);
  const [fabOpen, setFabOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [monthFilter] = useState("");

  const receiptsQuery = useQuery({
    queryKey: ["receipts", { page, limit: PAGE_SIZE }],
    queryFn: () => receiptsApi.list({ page, limit: PAGE_SIZE }),
  });

  const listItems = useMemo(() => {
    const receipts = receiptsQuery.data?.data ?? [];
    return receipts.map((receipt, index) => mapReceiptToListItem(receipt, index));
  }, [receiptsQuery.data?.data]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return listItems.filter((item) => {
      const matchesQuery =
        !q ||
        item.namaTransaksi.toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q);
      const matchesMonth =
        !monthFilter || !item.tanggal || item.tanggal.startsWith(monthFilter);
      const categoryFilter =
        filterCategories.length > 0
          ? filterCategories.includes(item.kategori)
          : activeCategory === "Semua" || item.kategori === activeCategory;
      return matchesQuery && matchesMonth && categoryFilter;
    });
  }, [listItems, query, activeCategory, filterCategories, monthFilter]);

  const grouped = useMemo(() => groupExpensesByDate(filtered), [filtered]);

  const total = receiptsQuery.data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const isLoading = receiptsQuery.isLoading;
  const isError = receiptsQuery.isError;

  return (
    <div className="space-y-4 text-left">
      <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
        Daftar Pengeluaran
      </p>

      <SearchInput
        placeholder="Cari transaksi"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
        {expenseCategories.map((chip) => (
          <FilterChip
            key={chip}
            active={activeCategory === chip && filterCategories.length === 0}
            className="shrink-0"
            onClick={() => {
              setActiveCategory(chip);
              setFilterCategories([]);
            }}
          >
            {chip}
          </FilterChip>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F2F7FC] px-3 py-2.5 text-[13px] font-medium text-[#111827]"
        >
          <span className="flex items-center gap-2">
            <Calendar size={16} className="text-[#6B7280]" />
            {monthFilter ? formatMonthLabel(monthFilter) : "Semua Periode"}
          </span>
          <ChevronDown size={14} className="text-[#6B7280]" />
        </button>
        <button
          type="button"
          onClick={() => setFilterOpen(true)}
          className="flex items-center justify-between rounded-lg border border-[#E5E7EB] bg-[#F2F7FC] px-3 py-2.5 text-[13px] font-medium text-[#111827]"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal size={16} className="text-[#6B7280]" />
            Filter
          </span>
          <ChevronDown size={14} className="text-[#6B7280]" />
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-xl border border-[#E5E7EB] bg-white px-4 py-8 text-center text-[13px] text-[#6B7280]">
          Memuat transaksi...
        </div>
      ) : isError ? (
        <div className="rounded-xl border border-[#FECACA] bg-[#FEF2F2] px-4 py-8 text-center text-[13px] text-[#B91C1C]">
          Gagal memuat daftar pengeluaran.
        </div>
      ) : grouped.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
          <p className="mt-6 text-[15px]/[22px] font-semibold text-(--text-h)">
            Belum Ada Transaksi
          </p>
          <p className="mt-1 max-w-[260px] text-[13px]/[20px] text-[#6B7280]">
            Semua riwayat transaksi Anda akan ditampilkan disini.
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          {grouped.map(([dateKey, expenses]) => (
            <section key={dateKey}>
              <p className="mb-2 text-[13px]/[18px] font-semibold text-[#6B7280]">
                {formatGroupDate(dateKey)}
              </p>
              <div className="rounded-xl border border-[#E5E7EB] bg-white px-3">
                {expenses.map((expense) => (
                  <ExpenseRow key={expense.id} expense={expense} />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      {!isLoading && !isError && totalPages > 1 ? (
        <Pagination page={page} totalPages={totalPages} onChange={setPage} />
      ) : null}

      <ExpenseFilterSheet
        open={filterOpen}
        onOpenChange={setFilterOpen}
        options={expenseCategories.filter((c) => c !== "Semua")}
        value={filterCategories}
        onApply={(vals) => {
          setFilterCategories(vals);
          if (vals.length > 0) setActiveCategory("Semua");
        }}
      />
      <ExpenseActionFab open={fabOpen} onOpenChange={setFabOpen} />
    </div>
  );
}

export default ExpenseListPage;
