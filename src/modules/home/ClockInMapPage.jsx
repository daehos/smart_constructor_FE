import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/lib/toast.jsx";
import { attendanceApi } from "@/services/attendance";

function ClockInMapPage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();

  const clockInMutation = useMutation({
    mutationFn: attendanceApi.clockIn,
    onSuccess: (data) => {
      if (data?.withinRadius) {
        pushToast({ kind: "success", message: "Berhasil clock-in" });
        queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
        navigate("/home");
      } else {
        pushToast({
          kind: "info",
          message: "Anda berada di luar radius lokasi proyek.",
        });
      }
    },
    onError: (err) => {
      pushToast({
        kind: "error",
        message: err?.message ?? "Terjadi kesalahan, silakan coba lagi.",
      });
    },
  });

  const withLocation = (fn) => {
    if (!navigator.geolocation) {
      pushToast({ kind: "error", message: "Geolocation tidak tersedia." });
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        console.log("lat", pos.coords.latitude);
        console.log("lng", pos.coords.longitude);
        fn(pos.coords.latitude, pos.coords.longitude);
      },
      () =>
        pushToast({
          kind: "error",
          message: "Gagal mengambil lokasi. Pastikan izin lokasi aktif.",
        }),
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const handleReload = () => {
    withLocation((lat, lng) => {
      // “reload” just tries clock-in validation (server returns withinRadius)
      clockInMutation.mutate({ lat, lng });
    });
  };

  const handleContinue = () => {
    handleReload();
  };

  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] flex-col gap-4 bg-white px-4 py-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[12px]/[18px] text-[#6B7280]">Peta Lokasi</p>
          <p className="text-[18px]/[24px] font-semibold text-(--text-h)">
            Klapa Village
          </p>
          <p className="text-[12px]/[18px] text-[#6B7280]">Pondok Kelapa</p>
        </div>
      </header>

      <div className="relative mt-2 flex-1 rounded-2xl border border-[#E5E7EB] bg-[#E5F0FF]">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="size-40 rounded-full border-2 border-[#60A5FA]/60 bg-[#BFDBFE]/40" />
        </div>
      </div>

      <div className="mt-3 space-y-2 text-[13px]/[20px] text-[#111827]">
        <p>Lokasi</p>
        <p className="text-[12px]/[18px] text-[#6B7280]">
          Posisi Anda akan dicek terhadap radius lokasi proyek.
        </p>
      </div>

      <div className="mt-auto flex gap-3 pb-1 pt-2">
        <button
          type="button"
          onClick={handleReload}
          disabled={clockInMutation.isPending}
          className="flex-1 rounded-md border border-[#D1D5DB] bg-white px-4 py-2.5 text-[14px] font-medium text-[#111827]"
        >
          {clockInMutation.isPending ? "Memuat..." : "Muat Ulang"}
        </button>
        <button
          type="button"
          onClick={handleContinue}
          disabled={clockInMutation.isPending}
          className="flex-1 rounded-md bg-[#052758] px-4 py-2.5 text-[14px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
        >
          Lanjut
        </button>
      </div>
    </div>
  );
}

export default ClockInMapPage;
