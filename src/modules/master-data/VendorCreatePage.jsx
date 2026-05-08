import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/toast.jsx";
import { vendorsApi } from "@/services/vendors";

function VendorCreatePage() {
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();

  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamatPerusahaan, setAlamatPerusahaan] = useState("");
  const [kategoriSpesialisasi, setKategoriSpesialisasi] = useState("");
  const [subKategoriText, setSubKategoriText] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const createMutation = useMutation({
    mutationFn: vendorsApi.create,
    onSuccess: () => {
      pushToast({ kind: "success", message: "Vendor berhasil ditambahkan" });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      navigate("/master-data/vendor");
    },
    onError: (err) => {
      pushToast({
        kind: "error",
        message: err?.message ?? "Gagal menambahkan vendor.",
      });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    const subKategori = subKategoriText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    createMutation.mutate({
      telepon,
      email,
      website,
      namaPerusahaan,
      alamatPerusahaan,
      kategoriSpesialisasi,
      subKategori,
    });
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Tambah Vendor
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          Isi informasi vendor baru.
        </p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-[13px]/[18px] font-semibold text-[#111827]">
            Informasi Umum
          </p>
          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Nama Perusahaan*
              </span>
              <Input
                required
                placeholder="Masukkan nama perusahaan"
                className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
                value={namaPerusahaan}
                onChange={(e) => setNamaPerusahaan(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Alamat Perusahaan*
              </span>
              <Input
                required
                placeholder="Masukkan alamat perusahaan"
                className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
                value={alamatPerusahaan}
                onChange={(e) => setAlamatPerusahaan(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Kategori Spesialisasi*
              </span>
              <Input
                required
                placeholder="Pilih kategori spesialisasi"
                className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
                value={kategoriSpesialisasi}
                onChange={(e) => setKategoriSpesialisasi(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Sub-Kategori*
              </span>
              <Input
                required
                placeholder="Pisahkan dengan koma (contoh: Steel Fabrication, Warehouse Construction)"
                className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
                value={subKategoriText}
                onChange={(e) => setSubKategoriText(e.target.value)}
              />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
          <p className="text-[13px]/[18px] font-semibold text-[#111827]">
            Kontak
          </p>
          <div className="mt-3 space-y-3">
            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Nomor Telepon*
              </span>
              <div className="mt-2 flex items-center gap-2">
                <div className="rounded-lg border border-[#F0F2F5] bg-[#F2F7FC] px-3 py-3 text-[14px] font-semibold text-[#3F5471]">
                  +62
                </div>
                <Input
                  required
                  placeholder="812 1234 5678"
                  className="rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
                  value={telepon}
                  onChange={(e) => setTelepon(e.target.value)}
                />
              </div>
            </label>
            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">Email*</span>
              <Input
                required
                type="email"
                placeholder="Masukkan email"
                className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">
                Website
              </span>
              <Input
                placeholder="Masukkan website"
                className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>
        </section>

        <button
          type="submit"
          disabled={createMutation.isPending}
          className="w-full rounded-md bg-[#052758] px-4 py-3 text-[15px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
        >
          {createMutation.isPending ? "Menyimpan..." : "Tambah"}
        </button>
      </form>
    </div>
  );
}

export default VendorCreatePage;

