import { Dialog } from "@/components/ui/dialog";

function DeleteVendorDialog({ open, onOpenChange, vendorName, onDelete }) {
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
      title="Hapus Data Vendor"
      description={`Yakin ingin menghapus ${vendorName}? Tindakan ini tidak dapat dibatalkan dan semua data terkait akan hilang.`}
      actions={
        <>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-md border border-[#D1D5DB] bg-white px-4 py-2 text-[13px] font-semibold text-[#111827]"
          >
            Batalkan
          </button>
          <button
            type="button"
            onClick={onDelete}
            className="rounded-md bg-[#B91C1C] px-4 py-2 text-[13px] font-semibold text-white hover:opacity-95 active:opacity-90"
          >
            Hapus Data
          </button>
        </>
      }
    />
  );
}

export default DeleteVendorDialog;

