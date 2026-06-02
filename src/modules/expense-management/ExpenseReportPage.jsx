import { EmptyState } from "@/components/ui/empty-state";

function ExpenseReportPage() {
  return (
    <div className="space-y-4 text-left">
      <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
        Laporan Pengeluaran
      </p>

      <EmptyState
        title="Belum Ada Laporan"
        description="Ringkasan pengeluaran per periode akan ditampilkan di sini."
      />
    </div>
  );
}

export default ExpenseReportPage;
