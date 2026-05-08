import { cn } from "@/lib/utils";
import { useToast } from "@/lib/toast.jsx";

const KIND_STYLES = {
  info: "bg-[#EEF3FA] text-[#1F2933] border-[#CBD2E1]",
  success: "bg-[#ECFDF3] text-[#065F46] border-[#A7F3D0]",
  error: "bg-[#FEF2F2] text-[#991B1B] border-[#FECACA]",
};

export function ToastBanner({ className = "" }) {
  const { toast, clearToast } = useToast();

  if (!toast) return null;

  const tone = KIND_STYLES[toast.kind] ?? KIND_STYLES.info;

  return (
    <div className="pointer-events-none fixed left-0 right-0 top-0 z-50 flex justify-center px-3 pt-3">
      <div
        className={cn(
          "pointer-events-auto flex max-w-[420px] items-start gap-3 rounded-xl border px-4 py-3 text-left text-[14px]/[20px] shadow-(--shadow)",
          tone,
          className,
        )}
        role="status"
        aria-live="polite"
      >
        <div className="flex-1">{toast.message}</div>
        <button
          type="button"
          onClick={clearToast}
          className="ml-2 text-[13px] font-medium text-current/70 underline-offset-2 hover:underline"
        >
          Tutup
        </button>
      </div>
    </div>
  );
}

