import { useMemo, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { useToast } from "@/lib/toast.jsx";
import { ordersApi } from "@/services/orders";

const suggestions = [
  "Halo, saya ingin memesan...",
  "Bisa dikirim hari ini?",
  "Hai, barang masih tersedia?",
];

function OrderFormPage() {
  const params = useParams();
  const vendorId = decodeURIComponent(params.vendorId ?? "");
  const navigate = useNavigate();
  const { pushToast } = useToast();

  const vendor = useMemo(() => null, []);

  const [productName, setProductName] = useState("Beton Instan VUB BM Plus Mutu");
  const [materialCategory, setMaterialCategory] = useState("Pilih kategori material");
  const [subCategory, setSubCategory] = useState("Pilih kategori material");
  const [qty, setQty] = useState(1);
  const [message, setMessage] = useState("Tuliskan pesan disini");

  const createOrderMutation = useMutation({
    mutationFn: ordersApi.create,
    onSuccess: () => {
      pushToast({ kind: "success", message: "Pesanan berhasil dikirim" });
      navigate("/procurement/history");
    },
    onError: (err) => {
      pushToast({
        kind: "error",
        message: err?.message ?? "Gagal mengirim pesanan.",
      });
    },
  });

  const submit = (e) => {
    e.preventDefault();
    createOrderMutation.mutate({
      vendor: vendorId,
      items: [
        {
          namaProduk: productName,
          jumlah: qty,
          hargaSatuan: 0,
        },
      ],
      pesan: message,
    });
  };

  return (
    <div className="space-y-4 text-left">
      <div>
        <p className="text-[16px]/[22px] font-semibold text-(--text-h)">
          Pemesanan
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          Vendor
        </p>
      </div>

      <section className="rounded-2xl border border-[#E5E7EB] bg-white p-4">
        <p className="text-[14px]/[20px] font-semibold text-[#111827]">
          Vendor: {vendorId}
        </p>
        <p className="mt-1 text-[12px]/[18px] text-[#6B7280]">
          Isi detail pesanan di bawah.
        </p>
      </section>

      <form onSubmit={submit} className="space-y-4">
        <label className="block">
          <span className="text-[12px]/[18px] text-[#6B7280]">Nama Produk*</span>
          <Input
            className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
            value={productName}
            onChange={(e) => setProductName(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-[12px]/[18px] text-[#6B7280]">
            Kategori Material*
          </span>
          <Input
            className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
            value={materialCategory}
            onChange={(e) => setMaterialCategory(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="text-[12px]/[18px] text-[#6B7280]">
            Sub Kategori Material*
          </span>
          <Input
            className="mt-2 rounded-lg border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px]"
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
          />
        </label>

        <div className="flex items-center justify-between rounded-2xl border border-[#E5E7EB] bg-white px-4 py-3">
          <div>
            <p className="text-[12px]/[18px] text-[#6B7280]">Jumlah Material*</p>
            <p className="text-[14px]/[20px] font-semibold text-[#111827]">
              {qty}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setQty((v) => Math.max(1, v - 1))}
              className="size-9 rounded-full border border-[#E5E7EB] bg-white text-[18px] font-semibold text-[#111827]"
            >
              -
            </button>
            <button
              type="button"
              onClick={() => setQty((v) => v + 1)}
              className="size-9 rounded-full border border-[#E5E7EB] bg-white text-[18px] font-semibold text-[#111827]"
            >
              +
            </button>
          </div>
        </div>

        <label className="block">
          <span className="text-[12px]/[18px] text-[#6B7280]">Pesan*</span>
          <textarea
            rows={4}
            className="mt-2 w-full rounded-lg border border-[#F0F2F5] bg-[#F2F7FC] px-4 py-3 text-[14px] text-[#111827] outline-none focus:border-[#0846A1] focus:ring-2 focus:ring-[#0846A1]/20"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <div className="mt-2 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setMessage(s)}
                className="rounded-full border border-[#E5E7EB] bg-white px-3 py-1.5 text-[12px] text-[#111827]"
              >
                {s}
              </button>
            ))}
          </div>
        </label>

        <div className="flex gap-3 pt-1">
          <button
            type="button"
            onClick={() => {
              setProductName("");
              setMaterialCategory("Pilih kategori material");
              setSubCategory("Pilih kategori material");
              setQty(1);
              setMessage("Tuliskan pesan disini");
            }}
            className="flex-1 rounded-md border border-[#D1D5DB] bg-white px-4 py-3 text-[14px] font-semibold text-[#111827]"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={createOrderMutation.isPending}
            className="flex-1 rounded-md bg-[#052758] px-4 py-3 text-[14px] font-semibold text-white shadow-(--shadow) hover:opacity-95 active:opacity-90"
          >
            {createOrderMutation.isPending ? "Mengirim..." : "Kirim Sekarang"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OrderFormPage;

