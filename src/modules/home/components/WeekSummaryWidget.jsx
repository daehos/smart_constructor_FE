import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { attendanceApi } from "@/services/attendance";

function toMonthParam(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  return `${y}-${m}`;
}

const WeekSummaryWidget = () => {
  const month = useMemo(() => toMonthParam(new Date()), []);

  const calendarQuery = useQuery({
    queryKey: ["attendance", "calendar", month],
    queryFn: () => attendanceApi.calendar({ month }),
  });

  const days = calendarQuery.data?.days ?? [];
  const last7 = days.slice(-7);

  return (
    <section className="w-full max-w-[360px] rounded-2xl border border-[#E8EEF7] bg-white px-5 py-4 text-left shadow-sm">
      <header className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-[13px]/[18px] text-[#6B7280]">Presensi Saya</p>
          <p className="text-[20px]/[26px] font-semibold text-(--text-h)">
            Ringkasan Minggu Ini
          </p>
        </div>
        <button
          type="button"
          className="text-[12px]/[18px] font-medium text-[#0846A1] hover:underline"
        >
          Lihat Kalendar
        </button>
      </header>

      <div className="mt-2 grid grid-cols-7 gap-2 text-center text-[11px]/[16px]">
        {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d, index) => (
          <span key={index} className="text-[#6B7280]">
            {d}
          </span>
        ))}
        {(last7.length ? last7 : Array.from({ length: 7 }).map((_, i) => ({ day: i + 1 }))).map(
          (day, index) => (
            <div key={index} className="flex flex-col items-center gap-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3F4FF] text-[12px]/[18px] font-semibold text-[#111827]">
                {day.day ?? "--"}
              </div>
            </div>
          ),
        )}
      </div>
    </section>
  );
};

export default WeekSummaryWidget;