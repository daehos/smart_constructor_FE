import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/authContext.jsx";
import { profileApi } from "@/services/profile";

function SettingsPage() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const profileQuery = useQuery({
    queryKey: ["profile"],
    queryFn: () => profileApi.getProfile(),
  });

  const profile = profileQuery.data ?? null;

  return (
    <div className="min-h-[calc(100svh-3.5rem)] bg-[#EEF3FA] px-4 py-6 text-left">
      <div className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Settings
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          Pengaturan akun dan aplikasi.
        </p>

        <div className="mt-4 rounded-xl border border-[#E5E7EB] bg-[#F8FAFC] p-3">
          <p className="text-[12px]/[18px] text-[#6B7280]">Akun</p>
          <p className="mt-1 text-[13px]/[18px] font-semibold text-[#111827]">
            {profile?.nama ?? "—"}
          </p>
          <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
            {profile?.email ?? "—"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="mt-4 w-full rounded-md bg-[#B91C1C] px-4 py-3 text-[14px] font-semibold text-white hover:opacity-95 active:opacity-90"
        >
          Log Out
        </button>
      </div>
    </div>
  );
}

export default SettingsPage;

