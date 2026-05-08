import { Link } from "react-router-dom";

function Breadcrumb({ items }) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex flex-wrap items-center gap-1 text-[11px]/[16px] text-[#6B7280]"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <span key={item.label} className="flex items-center gap-1">
            {index > 0 && <span className="text-[#9CA3AF]">/</span>}
            {item.to && !isLast ? (
              <Link
                to={item.to}
                className="hover:text-[#111827] hover:underline"
              >
                {item.label}
              </Link>
            ) : (
              <span className={isLast ? "font-semibold text-[#111827]" : ""}>
                {item.label}
              </span>
            )}
          </span>
        );
      })}
    </nav>
  );
}

export { Breadcrumb };

