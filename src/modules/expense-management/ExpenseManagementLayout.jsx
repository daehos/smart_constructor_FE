import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";

const tabBase =
  "relative flex-1 py-3 text-center text-[14px] font-semibold text-[#101828]";

function ExpenseManagementLayout() {
  const location = useLocation();
  const isReport = location.pathname.includes("/report");

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 pb-8 pt-4">
      <div className="mb-3">
        <Breadcrumb
          items={[
            { label: "Kelola Pengeluaran", to: "/expense-management/list" },
            {
              label: isReport ? "Laporan Pengeluaran" : "Daftar Pengeluaran",
            },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="grid grid-cols-2 bg-white/80">
          <NavLink
            to="/expense-management/list"
            className={({ isActive }) =>
              [
                tabBase,
                isActive &&
                  "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#0846A1]",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            Daftar Pengeluaran
          </NavLink>
          <NavLink
            to="/expense-management/report"
            className={({ isActive }) =>
              [
                tabBase,
                isActive &&
                  "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#0846A1]",
              ]
                .filter(Boolean)
                .join(" ")
            }
          >
            Laporan Pengeluaran
          </NavLink>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ExpenseManagementLayout;
