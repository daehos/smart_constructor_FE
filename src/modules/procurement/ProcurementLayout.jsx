import { Outlet, NavLink } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";

const tabBase =
  "relative flex-1 py-3 text-center text-[14px] font-semibold text-[#101828]";

function ProcurementLayout() {
  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 pb-8 pt-4">
      <div className="mb-3">
        <Breadcrumb
          items={[
            { label: "Pengadaan", to: "/procurement/comparison" },
            { label: "Procurement" },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="grid grid-cols-2 bg-white/80">
          <NavLink
            to="/procurement/comparison"
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
            Pemesanan Barang
          </NavLink>
          <NavLink
            to="/procurement/history"
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
            Riwayat Pemesanan
          </NavLink>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProcurementLayout;

