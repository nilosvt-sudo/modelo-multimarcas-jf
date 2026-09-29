import React from "react";
import Link from "next/link";
import { CarFront } from "lucide-react";
import { DEALERSHIP_INFO } from "@/lib/constants";

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

  // Nome da loja configurado ou padrão
  const rawName = DEALERSHIP_INFO.name || "Apex Motors";
  const parts = rawName.split(" ");
  const firstWord = parts[0] || "Apex";
  const secondWord = parts.slice(1).join(" ") || "Motors";

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-2.5 sm:gap-3 group focus:outline-none focus-visible:ring-2 focus-visible:ring-[#0047cc] rounded-xl transition-all duration-200 hover:opacity-95 shrink-0 select-none overflow-visible ${className}`}
      aria-label={`${DEALERSHIP_INFO.name} - Início`}
    >
      {/* Ícone do carro azul esportivo */}
      <div
        className={`relative shrink-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-[#0038a8] via-[#004ecb] to-[#0066ff] dark:from-[#1e3a8a] dark:to-[#3b82f6] text-white shadow-md shadow-blue-900/20 transition-transform duration-300 group-hover:scale-105 ${
          isCompact
            ? "w-8 h-8"
            : isFooter
            ? "w-11 h-11"
            : "w-9 h-9 sm:w-10 sm:h-10"
        }`}
      >
        <CarFront className={`${isCompact ? "w-4 h-4" : "w-5 h-5"} text-white drop-shadow-sm`} />
        <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-red-500 border-2 border-white dark:border-[#0a0c10]"></span>
      </div>

      {/* Textos da marca perfeitamente proporcionais e com respiro lateral */}
      <div className="flex flex-col justify-center leading-none overflow-visible pr-1.5">
        <div className="flex items-center gap-1.5 whitespace-nowrap leading-tight overflow-visible">
          {/* Título Principal - Primeira Palavra */}
          <span
            className={`font-black tracking-normal uppercase italic bg-gradient-to-r from-[#0038a8] via-[#0055ff] to-[#0077ff] dark:from-[#3b82f6] dark:via-[#60a5fa] dark:to-[#93c5fd] bg-clip-text text-transparent leading-tight inline-block pr-0.5 ${
              isFooter
                ? "text-xl sm:text-2xl"
                : isCompact
                ? "text-xs sm:text-sm"
                : "text-[16px] sm:text-[18px]"
            }`}
          >
            {firstWord}
          </span>

          {/* Título Principal - Segunda Palavra com folga para a ponta do S */}
          <span
            className={`font-black tracking-normal uppercase italic bg-gradient-to-r from-[#a00008] via-[#d6151f] to-[#ff2b36] dark:from-[#ef233c] dark:via-[#ff3844] dark:to-[#ff6b76] bg-clip-text text-transparent leading-tight inline-block pr-1 ${
              isFooter
                ? "text-xl sm:text-2xl"
                : isCompact
                ? "text-xs sm:text-sm"
                : "text-[16px] sm:text-[18px]"
            }`}
          >
            {secondWord}
          </span>
        </div>

        {/* Subtítulo proporcional com respiro */}
        <span
          className={`font-bold tracking-wider uppercase mt-0.5 leading-none block whitespace-nowrap select-none overflow-visible pr-1 ${
            isFooter
              ? "text-slate-400 text-xs"
              : "text-[9px] sm:text-[10px] text-slate-600 dark:text-slate-300"
          }`}
        >
          {showPhone || isFooter ? "(11) 3333-4444 • SÃO PAULO" : "SEMINOVOS SELECIONADOS • SP"}
        </span>
      </div>
    </Link>
  );
}
