import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/toast.jsx";
import { authApi } from "@/services/auth";
import { useAuth } from "@/lib/authContext";

function VerifyOtpPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const { login } = useAuth();

  const email = useMemo(() => state?.email ?? "", [state]);
  const [otp, setOtp] = useState("");

  const verifyMutation = useMutation({
    mutationFn: authApi.verifyOtp,
    onSuccess: (data) => {
      const token = data?.access_token;
      if (!token) {
        pushToast({ kind: "error", message: "Token tidak ditemukan." });
        return;
      }
      login(token);
      pushToast({ kind: "success", message: "OTP berhasil diverifikasi." });
      navigate("/home");
    },
    onError: (err) => {
      pushToast({
        kind: "error",
        message: err?.message ?? "OTP tidak valid atau sudah kadaluarsa.",
      });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    verifyMutation.mutate({ email, otp });
  };

  return (
    <form onSubmit={submit} className="w-full flex flex-col gap-5">
      <div className="text-left">
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Verifikasi OTP
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          Masukkan kode OTP yang dikirim ke email:{" "}
          <span className="font-semibold text-[#111827]">{email}</span>
        </p>
      </div>

      <label className="block w-full text-left">
        <span className="block font-normal text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
          OTP
        </span>
        <Input
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Masukkan OTP"
          className="mt-2 w-full rounded-lg placeholder:text-[#8A9DB9] border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-(--text-h) outline-none focus:border-(--accent-border) focus:ring-4 focus:ring-(--accent-bg)"
        />
      </label>

      <button
        type="submit"
        disabled={verifyMutation.isPending || !email}
        className="mt-2 w-full rounded-md bg-[#052758] px-4 py-3 text-[15px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90 disabled:opacity-60"
      >
        {verifyMutation.isPending ? "Memverifikasi..." : "Verifikasi"}
      </button>
    </form>
  );
}

export default VerifyOtpPage;

