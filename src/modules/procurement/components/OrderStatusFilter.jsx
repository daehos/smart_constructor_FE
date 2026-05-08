import { FilterChip } from "@/components/ui/filter-chip";

const OPTIONS = ["Semua", "Dikirim", "Selesai", "Dibatalkan", "Pengembalian"];

function OrderStatusFilter({ value, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {OPTIONS.map((opt) => (
        <FilterChip
          key={opt}
          active={value === opt}
          onClick={() => onChange?.(opt)}
        >
          {opt}
        </FilterChip>
      ))}
    </div>
  );
}

export default OrderStatusFilter;

