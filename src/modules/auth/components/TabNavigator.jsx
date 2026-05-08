import { NavLink } from "react-router-dom";

const tabBase =
  "relative flex-1 py-4 text-center text-[18px] font-semibold text-[#101828]";

const TabNavigator = () => {
  return (
    <div className="grid grid-cols-2 bg-white/80">
      <NavLink
        to="/login"
        className={({ isActive }) =>
          [
            tabBase,
            isActive &&
              "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[0.5px] after:bg-[#0846A1]",
          ]
            .filter(Boolean)
            .join(" ")
        }
      >
        Masuk
      </NavLink>
      <NavLink
        to="/register"
        className={({ isActive }) =>
          [
            tabBase,
            isActive &&
              "after:content-[''] after:absolute after:left-0 after:right-0 after:bottom-0 after:h-[0.5px] after:bg-[#0846A1]",
          ]
            .filter(Boolean)
            .join(" ")
        }
      >
        Daftar
      </NavLink>
    </div>
  );
};

export default TabNavigator;
