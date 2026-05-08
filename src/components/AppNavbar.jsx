import { List } from "@phosphor-icons/react";

const NAV_BG = "#001a3d";
const ACCENT = "#d97706";

export function AppNavbar({
  userInitials = "AD",
  onMenuClick,
  onProfileClick,
  className = "",
}) {
  return (
    <header
      className={`flex h-14 shrink-0 items-center justify-between px-4 ${className}`}
      style={{ backgroundColor: NAV_BG }}
    >
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="flex size-10 items-center justify-center rounded-md text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/40"
          aria-label="Buka menu"
        >
          <List size={26} weight="bold" className="text-white" />
        </button>
        <div className="font-sans text-lg font-bold leading-none tracking-tight">
          <span className="text-white">Proyek</span>
          <span style={{ color: ACCENT }}>.in</span>
        </div>
      </div>
      <button
        type="button"
        onClick={onProfileClick}
        className="flex size-9 shrink-0 items-center justify-center rounded-full font-sans text-sm font-bold uppercase text-white outline-none transition-opacity hover:opacity-90 focus-visible:ring-2 focus-visible:ring-white/40"
        style={{ backgroundColor: ACCENT }}
        aria-label="Buka menu profil"
      >
        {userInitials.slice(0, 2)}
      </button>
    </header>
  );
}
