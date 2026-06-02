import { useNavigate } from "react-router-dom";
import { FileUp, Pencil, Plus, X } from "lucide-react";

function ExpenseActionFab({ open, onOpenChange }) {
  const navigate = useNavigate();

  const go = (path) => {
    onOpenChange(false);
    navigate(path);
  };

  return (
    <>
      {open ? (
        <button
          type="button"
          aria-label="Tutup menu"
          className="fixed inset-0 z-40 bg-black/40"
          onClick={() => onOpenChange(false)}
        />
      ) : null}

      <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3">
        {open ? (
          <>
            <button
              type="button"
              onClick={() => go("/expense-management/manual")}
              className="flex items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-[14px] font-semibold text-[#0846A1] shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:bg-[#F8FAFC]"
            >
              Input Manual
              <Pencil size={18} />
            </button>
            <button
              type="button"
              onClick={() => go("/expense-management/upload")}
              className="flex items-center gap-3 rounded-full border border-[#E5E7EB] bg-white px-5 py-3 text-[14px] font-semibold text-[#0846A1] shadow-[0_4px_14px_rgba(0,0,0,0.12)] hover:bg-[#F8FAFC]"
            >
              Upload Nota
              <FileUp size={18} />
            </button>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => onOpenChange(!open)}
          className="flex size-14 items-center justify-center rounded-full bg-[#052758] text-white shadow-[0_4px_14px_rgba(5,39,88,0.35)] hover:opacity-95 active:opacity-90"
          aria-label={open ? "Tutup" : "Tambah transaksi"}
        >
          {open ? <X size={28} strokeWidth={2.5} /> : <Plus size={28} strokeWidth={2.5} />}
        </button>
      </div>
    </>
  );
}

export default ExpenseActionFab;
