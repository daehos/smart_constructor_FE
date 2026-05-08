import { Link } from "react-router-dom";

function ProfileMenu({ open, onOpenChange }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex justify-end bg-transparent"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="relative mt-14 w-48 translate-x-[-12px] rounded-2xl border border-black/5 bg-white py-2 text-left shadow-[0_18px_45px_rgba(15,23,42,0.35)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-4 pb-2 pt-1 text-[13px]/[18px] text-[#6B7280]">
          <p className="font-semibold text-(--text-h)">Admin3</p>
          <p className="text-[12px]">admin@example.com</p>
        </div>
        <div className="my-1 h-px bg-[#E5E7EB]" />
        <ul className="text-[14px]/[20px] text-[#111827]">
          <li>
            <Link
              to="/log-activity"
              className="block px-4 py-1.5 hover:bg-[#F3F4F6]"
              onClick={() => onOpenChange(false)}
            >
              Log Activity
            </Link>
          </li>
          <li>
            <Link
              to="/settings"
              className="block px-4 py-1.5 hover:bg-[#F3F4F6]"
              onClick={() => onOpenChange(false)}
            >
              Settings
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              className="block px-4 py-1.5 text-[#B91C1C] hover:bg-[#FEF2F2]"
              onClick={() => onOpenChange(false)}
            >
              Log Out
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

export { ProfileMenu };

