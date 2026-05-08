import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { HandTap, SignIn, SignOut } from "@phosphor-icons/react";
import { attendanceApi } from "@/services/attendance";
import { useToast } from "@/lib/toast.jsx";
import { useNavigate } from "react-router-dom";

const DAY_NAMES = [
  "Minggu",
  "Senin",
  "Selasa",
  "Rabu",
  "Kamis",
  "Jumat",
  "Sabtu",
];
const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

function formatTime(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
}

function formatDate(date) {
  const day = DAY_NAMES[date.getDay()];
  const d = date.getDate();
  const month = MONTH_NAMES[date.getMonth()];
  const year = date.getFullYear();
  return `${day}, ${d} ${month} ${year}`;
}

function formatShortTime(date) {
  return date.toLocaleTimeString("id-ID", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
}

export function ClockWidget() {
  const [now, setNow] = useState(new Date());
  const queryClient = useQueryClient();
  const { pushToast } = useToast();
  const navigate = useNavigate();

  const todayQuery = useQuery({
    queryKey: ["attendance", "today"],
    queryFn: attendanceApi.today,
  });

  const attendance = todayQuery.data?.attendance ?? todayQuery.data ?? null;

  const clockInAt = attendance?.clockIn?.at ? new Date(attendance.clockIn.at) : null;
  const clockOutAt = attendance?.clockOut?.at ? new Date(attendance.clockOut.at) : null;

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const clockOutMutation = useMutation({
    mutationFn: attendanceApi.clockOut,
    onSuccess: (data) => {
      pushToast({ kind: "success", message: "Berhasil clock-out" });
      queryClient.invalidateQueries({ queryKey: ["attendance", "today"] });
      return data;
    },
    onError: (err) => {
      pushToast({
        kind: "error",
        message: err?.message ?? "Gagal clock-out, silakan coba lagi.",
      });
    },
  });

  const isClockedIn = !!clockInAt;
  const isClockedOut = !!clockOutAt;

  const primaryLabel = !isClockedIn ? "Clock In" : !isClockedOut ? "Clock Out" : "Selesai";

  const handlePress = async () => {
    if (!isClockedIn) {
      navigate("/home/clock-in");
      return;
    }
    if (isClockedOut) return;

    if (!navigator.geolocation) {
      pushToast({ kind: "error", message: "Geolocation tidak tersedia." });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        clockOutMutation.mutate({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
      },
      () => {
        pushToast({
          kind: "error",
          message: "Gagal mengambil lokasi. Pastikan izin lokasi aktif.",
        });
      },
      { enableHighAccuracy: true, timeout: 10_000 },
    );
  };

  const disabled = isClockedOut || todayQuery.isLoading || clockOutMutation.isPending;

  return (
    <div className="w-full max-w-[360px] overflow-hidden rounded-2xl border border-[#E8EEF7] bg-white shadow-md">
      {/* Header — jam & tanggal */}
      <div className="flex flex-col items-center gap-1 px-6 py-5 bg-linear-to-bl from-[#BEDAFE] to-[#ffff]">
        <p
          className="font-sans text-[24px] font-extrabold leading-none tracking-tight text-[#121212]"
          aria-live="polite"
        >
          {formatTime(now)}
        </p>
        <p className="mt-1 text-[14px] text-[#5a7a9c]">{formatDate(now)}</p>
      </div>

      {/* Tombol Clock In */}
      <div className="flex flex-col items-center gap-4 px-6 py-8">
        {/* Outer rings wrapper */}
        <div
          className="relative flex items-center justify-center rounded-full"
          style={{
            width: 220,
            height: 220,
            background:
              "radial-gradient(circle, #dceeff 0%, #b8d8f8 50%, #e8f4ff 100%)",
            boxShadow:
              "0 0 0 3px rgba(42,101,187,0.3), 0 0 0 6px rgba(42,101,187,0.1)",
          }}
        >
          {/* Inner ring */}
          <div
            className="absolute rounded-full"
            style={{
              width: 196,
              height: 196,
              border: "2px solid rgba(42,101,187,0.5)",
              boxShadow: "inset 0 0 12px rgba(42,101,187,0.15)",
            }}
          />

          {/* Button */}
          <button
            type="button"
            onClick={handlePress}
            disabled={disabled}
            aria-label={!isClockedIn ? "Clock In" : "Clock Out"}
            className="group relative flex items-center justify-center rounded-full transition-transform active:scale-95 disabled:cursor-not-allowed disabled:opacity-70"
            style={{
              width: 180,
              height: 180,
              background:
                "radial-gradient(circle at 45% 35%, #3a7bd5 0%, #1a4a9e 40%, #052758 100%)",
              boxShadow: `
        inset 1px 5px 4px rgba(255,255,255,0.25),
        inset 0 -4px 8px rgba(0,0,0,0.2),
        0 6px 20px rgba(5,39,88,0.5)
      `,
            }}
          >
            <span
              className="absolute inset-0 rounded-full opacity-0 transition-opacity group-hover:opacity-100"
              style={{
                background:
                  "radial-gradient(circle at 50% 30%, rgba(255,255,255,0.12) 0%, transparent 60%)",
              }}
            />
            <span className="flex flex-col items-center gap-2">
              <HandTap
                size={38}
                weight="fill"
                className="text-white drop-shadow"
              />
              <span className="text-[16px] font-semibold tracking-wide text-white drop-shadow">
                {primaryLabel}
              </span>
            </span>
          </button>
        </div>
      </div>

      {/* Footer — ringkasan */}
      <div className="grid grid-cols-2 divide-x divide-[#E8EEF7] border-t border-[#E8EEF7]">
        <div className="flex flex-col gap-1 px-5 py-4">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#5a7a9c]">
            <SignIn size={15} weight="bold" />
            Clock In
          </span>
          <p className="font-sans text-[24px] font-extrabold text-[#0d1f3c]">
            {clockInAt ? formatShortTime(clockInAt) : "--:--"}
          </p>
        </div>
        <div className="flex flex-col gap-1 px-5 py-4">
          <span className="flex items-center gap-1.5 text-[12px] font-medium text-[#5a7a9c]">
            <SignOut size={15} weight="bold" />
            Clock Out
          </span>
          <p className="font-sans text-[24px] font-extrabold text-[#0d1f3c]">
            {clockOutAt ? formatShortTime(clockOutAt) : "--:--"}
          </p>
        </div>
      </div>
    </div>
  );
}
