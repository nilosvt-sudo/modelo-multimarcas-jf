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
      className={`inline-flex items-center gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047cc] rounded-xl transition-all duration-200 hover:opacity-95 ${className}`}
      aria-label="Modelo Multimarcas - Início"
    >
      {/* Official Dealership Logo Image - High Resolution Transparent PNG */}
      <div
        className={`relative shrink-0 flex items-center justify-center transition-transform duration-300 group-hover:scale-105 ${
          isCompact
            ? "h-8 w-8"
            : isFooter
            ? "h-12 w-12 sm:h-16 sm:w-16"
            : "h-8 w-8 sm:h-11 sm:w-11"
        }`}
      >
        <img
          src="/images/logo-oficial.png"
          alt="Modelo Multimarcas JF - Logo Oficial"
          className="w-full h-full object-contain drop-shadow-sm filter"
          onError={(e) => {
            // fallback para .jpg se o navegador falhar
            (e.currentTarget as HTMLImageElement).src = "/images/logo-oficial.jpg";
          }}
        />
      </div>

      {/* Brand Typographic Identity com as Cores Oficiais da Logo */}
      <div className="flex flex-col select-none min-w-0">
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Palavra MODELO em Azul Royal Metálico */}
          <span
            className={`font-black tracking-tight uppercase italic font-speed bg-gradient-to-r from-[#0038a8] via-[#004ecb] to-[#0066ff] dark:from-[#3b82f6] dark:via-[#60a5fa] dark:to-[#93c5fd] bg-clip-text text-transparent drop-shadow-2xs ${
              isFooter
                ? "text-lg sm:text-xl md:text-2xl"
                : isCompact
                ? "text-base"
                : "text-base sm:text-xl md:text-2xl"
            }`}
          >
            MODELO
          </span>

          {/* Palavra MULTIMARCAS em Vermelho Racing Esportivo */}
          <span
            className={`font-black tracking-tight uppercase italic font-speed bg-gradient-to-r from-[#a00008] via-[#d6151f] to-[#ff2b36] dark:from-[#ef233c] dark:via-[#ff3844] dark:to-[#ff6b76] bg-clip-text text-transparent drop-shadow-2xs ${
              isFooter
                ? "text-lg sm:text-xl md:text-2xl"
                : isCompact
                ? "text-base"
                : "text-base sm:text-xl md:text-2xl"
            }`}
          >
            MULTIMARCAS
          </span>
        </div>

        {/* Linha de identidade / Localização */}
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="w-2.5 h-0.5 rounded-full bg-[#0047cc]"></span>
          <span className="w-2.5 h-0.5 rounded-full bg-[#e0121d]"></span>
          <span
            className={`font-bold tracking-widest uppercase font-speed text-[10px] sm:text-[11px] ${
              isFooter
                ? "text-slate-400"
                : "text-slate-500 dark:text-slate-400"
            }`}
          >
            {showPhone || isFooter ? "(32) 3212-5705 • JUIZ DE FORA" : "JUIZ DE FORA • MG"}
          </span>
        </div>
      </div>
    </Link>
  );
}


