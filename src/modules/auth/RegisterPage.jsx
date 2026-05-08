import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { CheckCircleIcon } from "@phosphor-icons/react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Input } from "@/components/ui/input";
import { authApi } from "@/services/auth";
import { useToast } from "@/lib/toast.jsx";

const RegisterPage = () => {
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const [nama, setNama] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [gender, setGender] = useState("male");
  const [tanggalLahir, setTanggalLahir] = useState("");
  const [kategoriSpesialisasi, setKategoriSpesialisasi] = useState("");

  const registerMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: () => {
      pushToast({
        kind: "success",
        message: "OTP dikirim. Silakan cek email Anda.",
      });
      navigate("/verify-otp", { state: { email, mode: "register" } });
    },
    onError: (err) => {
      pushToast({
        kind: "error",
        message: err?.message ?? "Registrasi gagal, periksa data Anda.",
      });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    registerMutation.mutate({
      nama,
      email,
      gender,
      phoneNumber,
      tanggalLahir,
      password,
      kategoriSpesialisasi: kategoriSpesialisasi || null,
    });
  };

  return (
    <form onSubmit={submit} className="w-full flex flex-col gap-5">
      <label className="block w-full text-left">
        <span className="block font-normal text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
          Nama Lengkap <span className="text-red-500">*</span>
        </span>
        <input
          type="text"
          name="nama"
          placeholder="Masukkan nama lengkap"
          autoComplete="name"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          className="mt-2 w-full rounded-lg placeholder:text-[#8A9DB9] border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-(--text-h) outline-none focus:border-(--accent-border) focus:ring-4 focus:ring-(--accent-bg)"
        />
      </label>
      <label className="block w-full text-left">
        <span className="block font-normal text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
          Nomor Telepon <span className="text-red-500">*</span>
        </span>

        <div className="flex items-center gap-2">
          <div className="text-[14px]/[20px] border border-[#F0F2F5] mt-2 rounded-lg py-3 tracking-[0.02em] p-3 bg-[#F2F7FC] font-bold text-[#3F5471]">
            +62
          </div>
          <input
            type="text"
            name="phoneNumber"
            placeholder="812 1234 5678"
            autoComplete="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            className="mt-2 w-full rounded-lg placeholder:text-[#8A9DB9] border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-(--text-h) outline-none focus:border-(--accent-border) focus:ring-4 focus:ring-(--accent-bg)"
          />
        </div>
      </label>

      <label className="block w-full text-left">
        <span className="block font-normal text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
          Email <span className="text-red-500">*</span>
        </span>
        <input
          type="email"
          name="email"
          placeholder="Masukkan email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-2 w-full rounded-lg placeholder:text-[#8A9DB9] border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-(--text-h) outline-none focus:border-(--accent-border) focus:ring-4 focus:ring-(--accent-bg)"
        />
      </label>

      <label className="block w-full text-left">
        <span className="block text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
          Kata Sandi <span className="text-red-500">*</span>
        </span>
        <input
          type="password"
          name="password"
          placeholder="Buat kata sandi"
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-2 w-full rounded-lg placeholder:text-[#8A9DB9] border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-(--text-h) outline-none focus:border-(--accent-border) focus:ring-4 focus:ring-(--accent-bg)"
        />
        <div>
          <div className="flex items-center gap-[6px] mt-2">
            <CheckCircleIcon
              weight="fill"
              size={20}
              className="text-[#8A9DB9]"
            />
            <p className="text-[12px]/[18px] tracking-[0.02em] text-[#8693A4]">
              Minimal 8 karakter
            </p>
          </div>
          <div className="flex items-center gap-[6px] mt-2">
            <CheckCircleIcon
              weight="fill"
              size={20}
              className="text-[#8A9DB9]"
            />
            <p className="text-[12px]/[18px] tracking-[0.02em] text-[#8693A4]">
              Minimal 1 angka atau simbol
            </p>
          </div>
        </div>
      </label>

      <label className="block w-full text-left">
        <span className="block font-normal text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
          Jenis Kelamin <span className="text-red-500">*</span>
        </span>
        <RadioGroup
          name="gender"
          value={gender}
          onValueChange={setGender}
          className="mt-3 flex items-center gap-6"
        >
          <div className="flex w-full items-start gap-3 rounded-lg border border-[#F0F2F5] ">
            <label className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-[#F0F2F5] px-3 py-2 text-[14px] text-[#3F5471] transition-colors has-checked:border-[#0846A1] has-checked:bg-[#0846A1]/5">
              <RadioGroupItem value="male" />
              Laki-laki
            </label>
          </div>
          <label className="flex w-full cursor-pointer items-center gap-3 rounded-lg border border-[#F0F2F5] px-3 py-2 text-[14px] text-[#3F5471] transition-colors has-checked:border-[#0846A1] has-checked:bg-[#0846A1]/5">
            <RadioGroupItem value="female" />
            Perempuan
          </label>
        </RadioGroup>
      </label>

      <label className="block w-full text-left">
        <span className="block font-normal text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
          Tanggal Lahir <span className="text-red-500">*</span>
        </span>
        <Input
          type="date"
          name="tanggalLahir"
          placeholder="Masukkan tanggal lahir"
          value={tanggalLahir}
          onChange={(e) => setTanggalLahir(e.target.value)}
          autoComplete="bday"
          className="mt-2 w-full rounded-lg placeholder:text-[#8A9DB9] border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-(--text-h) outline-none focus:border-(--accent-border) focus:ring-4 focus:ring-(--accent-bg)"
        />
      </label>

      <label className="block w-full text-left">
        <span className="block font-normal text-[14px]/[20px] tracking-[0.02em] text-[#3F5471]">
          Kategori Spesialisasi
        </span>
        <input
          type="text"
          name="kategoriSpesialisasi"
          placeholder="Pilih kategori spesialisasi"
          value={kategoriSpesialisasi}
          onChange={(e) => setKategoriSpesialisasi(e.target.value)}
          className="mt-2 w-full rounded-lg placeholder:text-[#8A9DB9] border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-(--text-h) outline-none focus:border-(--accent-border) focus:ring-4 focus:ring-(--accent-bg)"
        />
      </label>

      <button
        type="submit"
        disabled={registerMutation.isPending}
        className="mt-2 w-full rounded-md bg-[#052758] px-4 py-3 text-[15px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
      >
        {registerMutation.isPending ? "Memproses..." : "Daftar"}
      </button>
    </form>
  );
};

export default RegisterPage;
