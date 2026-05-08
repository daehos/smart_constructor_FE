import { Outlet, NavLink } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";

const tabBase =
  "relative flex-1 py-3 text-center text-[14px] font-semibold text-[#101828]";

function MasterDataLayout() {
  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 pb-8 pt-4">
      <div className="mb-3">
        <Breadcrumb
          items={[
            { label: "Master Data", to: "/master-data/vendor" },
            { label: "Database" },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="grid grid-cols-2 bg-white/80">
          <NavLink
            to="/master-data/vendor"
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
            Vendor Database
          </NavLink>
          <NavLink
            to="/master-data/worker"
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
            Worker Database
          </NavLink>
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default MasterDataLayout;

