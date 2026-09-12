import Link from "next/link";

interface BrandLogoProps {
  variant?: "header" | "footer" | "compact";
  className?: string;
  showPhone?: boolean;
}

export default function BrandLogo({
  variant = "header",
  className = "",
  showPhone = false,
}: BrandLogoProps) {
  const isFooter = variant === "footer";
  const isCompact = variant === "compact";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 rounded-xl transition-all duration-200 hover:opacity-95 ${className}`}
      aria-label="Modelo Multimarcas - Início"
    >
      {/* Official Dealership Logo Image as sent by user */}
      <div className="relative shrink-0 overflow-hidden rounded-xl bg-black border border-[#262c38] shadow-md group-hover:border-red-600/60 transition-colors flex items-center justify-center p-0.5">
        <img
          src="/images/logo-oficial.jpg"
          alt="Modelo Multimarcas JF - Logo Oficial"
          className={`object-contain rounded-lg ${
            isCompact
              ? "h-9 w-9"
              : isFooter
              ? "h-14 w-14 sm:h-16 sm:w-16"
              : "h-11 w-11 sm:h-12 sm:w-12"
          }`}
          onError={(e) => {
            // fallback if needed
            (e.currentTarget as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      {/* Brand Typographic Identity com Contraste Máximo */}
      <div className="flex flex-col select-none">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Palavra MODELO */}
          <span
            className={`font-black tracking-tight uppercase font-speed ${
              isFooter
                ? "text-white text-xl md:text-2xl"
                : isCompact
                ? "text-lg text-slate-950"
                : "text-xl md:text-2xl text-slate-950"
            }`}
          >
            MODELO
          </span>

          {/* Palavra MULTIMARCAS */}
          <span
            className={`font-black tracking-tight uppercase font-speed text-red-600 ${
              isFooter
                ? "text-xl md:text-2xl"
                : isCompact
                ? "text-lg"
                : "text-xl md:text-2xl"
            }`}
          >
            MULTIMARCAS
          </span>
        </div>

        {/* Telefone opcional ou no footer */}
        {(showPhone || isFooter) && (
          <span className="text-[10px] sm:text-[11px] font-bold text-red-600 tracking-widest mt-1 font-speed">
            (32) 3212-5705 • JUIZ DE FORA
          </span>
        )}
      </div>
    </Link>
  );
}

