type RotatingLogoProps = {
  label?: string;
  size?: "sm" | "md";
};

export function RotatingLogo({ label = "Loading", size = "md" }: RotatingLogoProps) {
  const sizeClass = size === "sm" ? "h-6 w-6 text-[10px]" : "h-10 w-10 text-sm";

  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className={`${sizeClass} grid animate-spin place-items-center rounded-full bg-brand-600 font-bold text-white shadow-sm`}
      >
        RM
      </span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
