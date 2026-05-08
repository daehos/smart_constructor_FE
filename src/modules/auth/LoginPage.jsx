import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useToast } from "@/lib/toast.jsx";
import { authApi } from "@/services/auth";

const LoginPage = () => {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: () => {
      pushToast({
        kind: "success",
        message: "OTP dikirim. Silakan cek email Anda.",
      });
      navigate("/verify-otp", { state: { email, mode: "login" } });
    },
    onError: (err) => {
      pushToast({
        kind: "error",
        message: err?.message ?? "Email atau password salah.",
      });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  return (
    <form onSubmit={submit} className="w-full flex flex-col gap-5">
      <label className="block w-full text-left">
        <span className="block font-normal text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
          Email
        </span>
        <input
          type="email"
          name="email"
          placeholder="Masukkan email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg  placeholder:text-[#8A9DB9] border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-(--text-h) outline-none focus:border-(--accent-border) focus:ring-4 focus:ring-(--accent-bg)"
        />
      </label>

      <label className="block w-full text-left">
        <div className="flex items-center justify-between gap-3">
          <span className="block text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
            Kata Sandi
          </span>
        </div>
        <input
          type="password"
          name="password"
          placeholder="Masukkan kata sandi"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg placeholder:text-[#8A9DB9] border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-(--text-h) outline-none focus:border-(--accent-border) focus:ring-4 focus:ring-(--accent-bg)"
        />
      </label>

      <button
        type="submit"
        disabled={loginMutation.isPending}
        className="mt-2 w-full rounded-md bg-[#052758] px-4 py-3 text-[15px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
      >
        {loginMutation.isPending ? "Memproses..." : "Masuk"}
      </button>
    </form>
  );
};

export default LoginPage;
