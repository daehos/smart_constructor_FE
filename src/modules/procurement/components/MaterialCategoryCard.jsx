import { cn } from "@/lib/utils";

function MaterialCategoryCard({ category, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "relative flex min-h-[108px] w-full flex-col overflow-hidden rounded-xl p-3 text-left transition-opacity hover:opacity-95 active:opacity-90",
        category.bg,
      )}
    >
      <p className="relative z-10 max-w-[70%] text-[20px]/[28px] font-bold text-[#111827]">
        {category.title}
      </p>
      <img
        src={category.image}
        alt=""
        className="pointer-events-none absolute -bottom-1 -right-1 h-20 w-20 object-contain object-bottom-right"
      />
    </button>
  );
}

export default MaterialCategoryCard;
