import { Link, NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";

const sections = [
  {
    label: "Master Data",
    items: [
      { to: "/master-data/vendor", label: "Vendor Database" },
      { to: "/master-data/worker", label: "Worker Database" },
    ],
  },
  {
    label: "Payroll Management",
    items: [{ to: "/payroll", label: "Payroll" }],
  },
  {
    label: "Procurement",
    items: [
      { to: "/procurement/ordering", label: "Pemesanan Barang" },
      { to: "/procurement/comparison", label: "Perbandingan Harga Vendor" },
      { to: "/procurement/history", label: "Riwayat Pemesanan" },
    ],
  },
  {
    label: "Expense Management",
    items: [
      { to: "/expense-management/list", label: "Daftar Pengeluaran" },
      { to: "/expense-management/report", label: "Laporan Pengeluaran" },
    ],
  },
];

function SidebarDrawer({ open, onOpenChange }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-stretch bg-black/40"
      onClick={() => onOpenChange(false)}
    >
      <aside
        className="flex h-full w-[78%] max-w-xs flex-col bg-[#001A3D] px-4 pb-8 pt-6 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-6 flex items-center justify-between">
          <Link to="/home" className="font-sans text-lg font-bold">
            <span>Proyek</span>
            <span className="text-(--brand-orange)">.in</span>
          </Link>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full px-3 py-1 text-[13px] text-white/80 hover:bg-white/10"
          >
            Tutup
          </button>
        </div>
        <nav className="flex-1 space-y-5 text-[14px]/[20px]">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="mb-2 text-[11px]/[16px] uppercase tracking-[0.14em] text-white/50">
                {section.label}
              </p>
              <div className="space-y-1">
                {section.items.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      cn(
                        "block rounded-lg px-3 py-2 text-[14px]/[20px] text-white/85 hover:bg-white/10",
                        isActive && "bg-white text-[#001A3D] font-semibold",
                      )
                    }
                    onClick={() => onOpenChange(false)}
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ))}
        </nav>
      </aside>
    </div>
  );
}

export { SidebarDrawer };

