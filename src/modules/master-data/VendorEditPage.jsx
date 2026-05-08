import { useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Dialog } from "@/components/ui/dialog";
import { useToast } from "@/lib/toast.jsx";
import DeleteVendorDialog from "./components/DeleteVendorDialog";
import { vendorsApi } from "@/services/vendors";

function VendorEditPage() {
  const params = useParams();
  const [search] = useSearchParams();
  const navigate = useNavigate();
  const { pushToast } = useToast();
  const queryClient = useQueryClient();

  const id = decodeURIComponent(params.id ?? "");

  const vendorQuery = useQuery({
    queryKey: ["vendor", id],
    queryFn: () => vendorsApi.get(id),
    enabled: !!id,
  });

  const vendor = vendorQuery.data ?? null;

  const [namaPerusahaan, setNamaPerusahaan] = useState("");
  const [alamatPerusahaan, setAlamatPerusahaan] = useState("");
  const [kategoriSpesialisasi, setKategoriSpesialisasi] = useState("");
  const [subKategoriText, setSubKategoriText] = useState("");
  const [telepon, setTelepon] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  useEffect(() => {
    if (!vendor) return;
    setNamaPerusahaan(vendor.namaPerusahaan ?? "");
    setAlamatPerusahaan(vendor.alamatPerusahaan ?? "");
    setKategoriSpesialisasi(vendor.kategoriSpesialisasi ?? "");
    setSubKategoriText((vendor.subKategori ?? []).join(", "));
    setTelepon(vendor.telepon ?? "");
    setEmail(vendor.email ?? "");
    setWebsite(vendor.website ?? "");
  }, [vendor]);

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(search.get("delete") === "1");

  const updateMutation = useMutation({
    mutationFn: ({ vendorId, body }) => vendorsApi.update(vendorId, body),
    onSuccess: () => {
      pushToast({ kind: "success", message: "Data berhasil diperbarui" });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      queryClient.invalidateQueries({ queryKey: ["vendor", id] });
      navigate(`/master-data/vendor/${encodeURIComponent(id)}`);
    },
    onError: (err) => {
      pushToast({
        kind: "error",
        message: err?.message ?? "Gagal memperbarui data, silakan coba lagi.",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (vendorId) => vendorsApi.remove(vendorId),
    onSuccess: () => {
      pushToast({ kind: "success", message: "Data berhasil dihapus" });
      queryClient.invalidateQueries({ queryKey: ["vendors"] });
      navigate("/master-data/vendor");
    },
    onError: (err) => {
      pushToast({
        kind: "error",
        message: err?.message ?? "Gagal menghapus data, silakan coba lagi.",
      });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    setConfirmOpen(true);
  };

  const confirmSave = () => {
    setConfirmOpen(false);
    const subKategori = subKategoriText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    updateMutation.mutate({
      vendorId: id,
      body: {
        telepon,
        email,
        website,
        namaPerusahaan,
        alamatPerusahaan,
        kategoriSpesialisasi,
        subKategori,
      },
    });
  };

  const onDelete = () => {
    setDeleteOpen(false);
    deleteMutation.mutate(id);
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Ubah Data
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          {vendor?.namaPerusahaan ?? "—"}
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
              <Input
                className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
                value={telepon}
                onChange={(e) => setTelepon(e.target.value)}
              />
            </label>
            <label className="block">
              <span className="text-[12px]/[18px] text-[#6B7280]">Email*</span>
              <Input
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
                className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
              />
            </label>
          </div>
        </section>

        <button
          type="submit"
          className="w-full rounded-md bg-[#052758] px-4 py-3 text-[15px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </button>

        <button
          type="button"
          onClick={() => setDeleteOpen(true)}
          className="w-full rounded-md border border-[#FECACA] bg-[#FEF2F2] px-4 py-3 text-[14px] font-semibold text-[#B91C1C]"
          disabled={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? "Menghapus..." : "Hapus Data"}
        </button>
      </form>

      <Dialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Kirim Laporan Kejadian?"
        description="Laporan kejadian yang sudah dikirim tidak dapat dibatalkan."
        actions={
          <>
            <button
              type="button"
              onClick={() => setConfirmOpen(false)}
              className="rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-[13px] font-semibold text-[#111827]"
            >
              Batalkan
            </button>
            <button
              type="button"
              onClick={confirmSave}
              className="rounded-md bg-[#052758] px-4 py-2 text-[13px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
            >
              Ya, Simpan
            </button>
          </>
        }
      />

      <DeleteVendorDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        vendorName={vendor?.namaPerusahaan ?? "vendor ini"}
        onDelete={onDelete}
      />
    </div>
  );
}

export default VendorEditPage;

