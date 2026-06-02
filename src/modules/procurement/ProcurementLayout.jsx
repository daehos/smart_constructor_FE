import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Breadcrumb } from "@/components/Breadcrumb";

const tabBase =
  "relative flex min-h-12 items-center justify-center px-2 py-3 text-center text-[11px]/[15px] font-semibold sm:text-[12px]/[16px]";

const TAB_ITEMS = [
  {
    to: "/procurement/comparison",
    label: "Perbandingan Harga Vendor",
    breadcrumb: "Perbandingan Harga Vendor",
  },
  {
    to: "/procurement/ordering",
    label: "Pemesanan Barang",
    breadcrumb: "Pemesanan Barang",
  },
  {
    to: "/procurement/history",
    label: "Riwayat Pemesanan",
    breadcrumb: "Riwayat Pemesanan",
  },
];

function ProcurementLayout() {
  const location = useLocation();
  const activeTab = TAB_ITEMS.find((tab) => {
    if (tab.to === "/procurement/ordering") {
      return (
        location.pathname === "/procurement/ordering" ||
        location.pathname.startsWith("/procurement/order/") ||
        location.pathname.startsWith("/procurement/products") ||
        location.pathname.startsWith("/procurement/review")
      );
    }
    return location.pathname.startsWith(tab.to);
  });
  const breadcrumbLabel = activeTab?.breadcrumb ?? "Pengadaan";

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 pb-8 pt-4">
      <div className="mb-3">
        <Breadcrumb
          items={[
            { label: "Pengadaan", to: "/procurement/ordering" },
            { label: breadcrumbLabel },
          ]}
        />
      </div>

      <div className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        <div className="grid w-full grid-cols-3 border-b border-[#E5E7EB] bg-white/80">
          {TAB_ITEMS.map((tab) => (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.to !== "/procurement/ordering"}
              className={({ isActive }) => {
                const active =
                  tab.to === "/procurement/ordering"
                    ? location.pathname === "/procurement/ordering" ||
                      location.pathname.startsWith("/procurement/order/") ||
                      location.pathname.startsWith("/procurement/products") ||
                      location.pathname.startsWith("/procurement/review")
                    : isActive;
                return [
                  tabBase,
                  active
                    ? "text-[#0846A1] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[2px] after:bg-[#0846A1] after:content-['']"
                    : "text-[#6B7280]",
                ].join(" ");
              }}
            >
              {tab.label}
            </NavLink>
          ))}
        </div>
        <div className="p-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default ProcurementLayout;
