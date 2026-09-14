"use client";

import React, { useState } from "react";
import { DEALERSHIP_INFO, COMMON_BRANDS, BODY_TYPES, generateWhatsAppLink } from "@/lib/constants";
import {
  Search,
  CarFront,
  MapPin,
  TrendingUp,
  Percent,
  Award,
  ArrowRight
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface HeroProps {
  onSearchSubmit: (brand: string, bodyType: string, search: string) => void;
  onOpenAppraisal: () => void;
}

export default function Hero({ onSearchSubmit, onOpenAppraisal }: HeroProps) {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedBodyType, setSelectedBodyType] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearchSubmit(selectedBrand, selectedBodyType, searchTerm);
    const estoqueEl = document.getElementById("estoque");
    if (estoqueEl) {
      estoqueEl.scrollIntoView({ behavior: "smooth" });
    }
  };

  const whatsappHero = generateWhatsAppLink(
    "Olá! Vi o estoque no site da Modelo Multimarcas JF e gostaria de atendimento para negociar um seminovo."
  );

  return (
    <section className="relative bg-[#F8FAFC] dark:bg-[#06070a] text-slate-900 dark:text-slate-100 pt-2 pb-3 sm:pb-4 border-b border-slate-200 dark:border-[#232a38] transition-colors duration-200 w-full max-w-full px-4 overflow-hidden">
      <div className="max-w-[1680px] mx-auto relative z-10 w-full max-w-full">
        <div className="grid lg:grid-cols-12 gap-4 lg:gap-8 xl:gap-10 items-center w-full max-w-full">
          {/* Main Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-2 sm:space-y-3 w-full max-w-full">
            {/* Speed, Power & Automotive Muscular Headline */}
            <h1 className="break-words text-lg sm:text-xl lg:text-2xl text-center sm:text-left leading-snug font-black tracking-tight text-zinc-900 dark:text-white uppercase italic font-speed">
              SEU SONHO{" "}
              <span className="bg-gradient-to-r from-[#0047cc] via-[#0055ff] to-[#0066ff] dark:from-[#3b82f6] dark:via-[#60a5fa] dark:to-[#93c5fd] bg-clip-text text-transparent">
                SOBRE RODAS
              </span>{" "}
              COM MÁXIMA POTÊNCIA E PROCEDÊNCIA.
            </h1>

            {/* Subtítulo / Parágrafo descritivo */}
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed text-center sm:text-left line-clamp-2 mb-2">
              O estoque de seminovos mais confiável de Juiz de Fora. Veículos com <strong className="text-slate-900 dark:text-white font-semibold">Laudo Cautelar 100% Aprovado</strong>, garantia de procedência e avaliação justa do seu usado na troca.
            </p>

            {/* CTAs Imediatos na Primeira Dobra (Above the Fold) */}
            <div className="flex flex-col sm:flex-row w-full gap-2.5 pt-0.5">
              <a
                href="#estoque"
                className="w-full sm:w-auto inline-flex items-center justify-center py-2 px-4 text-xs sm:text-sm font-semibold bg-[#0047cc] hover:bg-[#003bb3] text-white font-speed uppercase italic tracking-wider rounded-xl shadow-md hover:shadow-blue-600/25 transition-all cursor-pointer text-center"
              >
                <span className="inline-flex items-center justify-center gap-1.5">
                  <CarFront className="w-3.5 h-3.5 shrink-0" />
                  <span>Ver Estoque Completo</span>
                </span>
              </a>

              <button
                type="button"
                onClick={onOpenAppraisal}
                className="w-full sm:w-auto inline-flex items-center justify-center py-2 px-4 text-xs sm:text-sm font-semibold bg-white dark:bg-[#0e1117] hover:bg-slate-50 dark:hover:bg-[#151821] text-slate-800 dark:text-slate-200 hover:text-[#0047cc] dark:hover:text-[#3b82f6] rounded-xl border border-slate-300 dark:border-[#232a38] shadow-sm hover:border-slate-400 dark:hover:border-slate-600 transition-all cursor-pointer text-center"
              >
                <span>Avaliar meu Usado</span>
              </button>

              <a
                href={whatsappHero}
                target="_blank"
                rel="noopener noreferrer"
                className="hidden sm:inline-flex bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-3.5 text-xs sm:text-sm rounded-xl transition-all items-center justify-center gap-1.5 shadow-sm whitespace-nowrap sm:w-auto"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white shrink-0" />
                <span>(32) 3212-5705</span>
              </a>
            </div>
          </div>

          {/* Quick Search Showroom Console */}
          <div className="lg:col-span-5 w-full max-w-full px-2 sm:px-0">
            <div className="bg-white dark:bg-[#0e1117] border border-slate-200/90 dark:border-[#232a38] p-3.5 sm:p-5 rounded-2xl shadow-lg relative w-full max-w-full transition-colors duration-200">
              <div className="flex items-center justify-between mb-2 sm:mb-3 pb-2 border-b border-slate-100 dark:border-[#232a38]">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-wide uppercase font-speed">
                    Buscar Veículo
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Encontre por marca, modelo ou categoria</p>
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-slate-100 dark:bg-[#151821] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#232a38] px-2 py-0.5 rounded font-speed">
                  Estoque Ativo
                </span>
              </div>

              <form onSubmit={handleHeroSearch} className="space-y-2 sm:space-y-2.5 w-full">
                <div className="w-full">
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 font-speed">
                    Marca
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full block bg-slate-50 dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-lg px-2.5 h-9 text-xs sm:text-sm focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                  >
                    <option value="">Todas as Marcas</option>
                    {COMMON_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5 w-full">
                  <div className="w-full">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 font-speed">
                      Carroceria
                    </label>
                    <select
                      value={selectedBodyType}
                      onChange={(e) => setSelectedBodyType(e.target.value)}
                      className="w-full block bg-slate-50 dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-lg px-2.5 h-9 text-xs sm:text-sm focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                    >
                      <option value="">Todas</option>
                      {BODY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="w-full">
                    <label className="block text-[11px] font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5 font-speed">
                      Modelo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Onix, Corolla..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full block bg-slate-50 dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-lg px-2.5 h-9 text-xs sm:text-sm focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full block bg-gradient-to-r from-[#e0121d] via-[#cc0c16] to-[#b00a13] hover:from-[#c40510] hover:to-[#960007] text-white font-speed font-bold italic uppercase h-9 py-1 px-4 rounded-lg shadow-md hover:shadow-red-600/30 transition-all text-center cursor-pointer text-xs sm:text-sm tracking-wider mt-1.5 active:scale-98"
                >
                  <span className="inline-flex items-center justify-center gap-1.5">
                    <Search className="w-3.5 h-3.5" />
                    <span>Filtrar Resultados</span>
                  </span>
                </button>
              </form>

              {/* Toast discreto de prova social */}
              <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-[#232a38] hidden sm:flex items-center justify-between gap-2 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="font-medium">Seminovos com laudo e procedência</span>
                </div>
                <button
                  onClick={onOpenAppraisal}
                  className="text-[11px] text-[#0047cc] dark:text-[#3b82f6] hover:underline font-speed font-bold tracking-wider uppercase flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Avaliar usado <ArrowRight className="w-3 h-3 text-[#0047cc] dark:text-[#3b82f6]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}


