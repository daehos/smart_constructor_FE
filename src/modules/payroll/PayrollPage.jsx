import { useQuery } from "@tanstack/react-query";
import { EmptyState } from "@/components/ui/empty-state";
import { payrollApi } from "@/services/payroll";

function formatCurrencyIdr(value) {
  if (typeof value !== "number") return "-";
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(value);
}

function PayrollPage() {
  const payrollQuery = useQuery({
    queryKey: ["payroll", "me"],
    queryFn: () => payrollApi.mine(),
  });

  const payroll = payrollQuery.data ?? null;

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 py-6 text-left">
      <div className="mb-4">
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Payroll
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          Ringkasan gaji Anda.
        </p>
      </div>

      {payrollQuery.isLoading ? (
        <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4 text-[13px] text-[#6B7280]">
          Memuat...
        </div>
      ) : !payroll ? (
        <EmptyState title="Belum ada data payroll" description="Data akan muncul di sini." />
      ) : (
        <div className="space-y-3">
          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <p className="text-[13px]/[18px] font-semibold text-[#111827]">
              Periode
            </p>
            <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
              {payroll.period ?? "-"}
            </p>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <p className="text-[13px]/[18px] font-semibold text-[#111827]">
              Ringkasan
            </p>
            <div className="mt-3 space-y-2 text-[12px]/[18px]">
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#6B7280]">Gaji Pokok</span>
                <span className="font-semibold text-[#111827]">
                  {formatCurrencyIdr(payroll.gajiPokok)}
                </span>
              </div>
              <div className="flex items-start justify-between gap-4">
                <span className="text-[#6B7280]">Net Salary</span>
                <span className="font-semibold text-[#111827]">
                  {formatCurrencyIdr(payroll.netSalary)}
                </span>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
            <p className="text-[13px]/[18px] font-semibold text-[#111827]">
              Komponen
            </p>
            {Array.isArray(payroll.components) && payroll.components.length ? (
              <div className="mt-3 space-y-2">
                {payroll.components.map((c, idx) => (
                  <div
                    key={`${c.nama ?? "comp"}-${idx}`}
                    className="flex items-start justify-between gap-4 text-[12px]/[18px]"
                  >
                    <span className="text-[#6B7280]">{c.nama ?? "-"}</span>
                    <span className="font-semibold text-[#111827]">
                      {formatCurrencyIdr(c.amount)}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-[12px]/[18px] text-[#6B7280]">
                Tidak ada komponen tambahan.
              </p>
            )}
          </section>
        </div>
      )}
    </div>
  );
}

export default PayrollPage;

