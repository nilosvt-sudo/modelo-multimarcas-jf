"use client";

import React, { useState } from "react";
import { DEALERSHIP_INFO, COMMON_BRANDS, BODY_TYPES, generateWhatsAppLink } from "@/lib/constants";
import {
  Search,
  CarFront,
  MapPin,
  TrendingUp,
  ShieldCheck,
  Award,
  ArrowRight,
  CalendarCheck
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface HeroProps {
  onSearchSubmit: (brand: string, bodyType: string, search: string) => void;
  onOpenAppraisal: () => void;
  onOpenTestDrive?: () => void;
}

export default function Hero({ onSearchSubmit, onOpenAppraisal, onOpenTestDrive }: HeroProps) {
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
    "Olá! Vi o estoque no site da Apex Motors e gostaria de atendimento para negociar um seminovo."
  );

  return (
    <section className="relative bg-[#F8FAFC] dark:bg-[#06070a] text-slate-900 dark:text-slate-100 pt-3 pb-6 sm:pb-8 border-b border-slate-200 dark:border-[#232a38] transition-colors duration-200 w-full max-w-full px-4 overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-[1680px] mx-auto relative z-10 w-full max-w-full">
        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10 xl:gap-14 items-center w-full max-w-full">
          {/* Main Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-3 sm:space-y-4 w-full max-w-full">
            {/* Speed & Automotive Headline */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800 text-[#0047cc] dark:text-[#3b82f6] text-xs font-bold uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Laudo 100% Aprovado & 1 Ano de Garantia</span>
            </div>

            <h1 className="break-words text-2xl sm:text-3xl lg:text-4xl xl:text-5xl text-left leading-tight font-black tracking-tight text-zinc-900 dark:text-white uppercase italic">
              SEU PRÓXIMO CARRO{" "}
              <span className="bg-gradient-to-r from-[#0047cc] via-[#0055ff] to-[#0066ff] dark:from-[#3b82f6] dark:via-[#60a5fa] dark:to-[#93c5fd] bg-clip-text text-transparent">
                COM MÁXIMA PROCEDÊNCIA
              </span>{" "}
              E AS MELHORES TAXAS.
            </h1>

            {/* Subtítulo descritivo */}
            <p className="text-xs sm:text-sm md:text-base text-slate-600 dark:text-slate-300 max-w-2xl font-normal leading-relaxed text-left">
              O estoque de seminovos mais qualificado de São Paulo. Veículos revisados com <strong className="text-slate-900 dark:text-white font-semibold">1 ano de garantia</strong>, aprovação rápida de crédito em até 60x e avaliação justa do seu usado na troca.
            </p>

            {/* Badges de Confiança */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Laudo Cautelar Aprovado</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Award className="w-4 h-4 text-[#0047cc] dark:text-[#3b82f6] shrink-0" />
                <span>1 Ano de Garantia</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300 col-span-2 sm:col-span-1">
                <TrendingUp className="w-4 h-4 text-[#e0121d] shrink-0" />
                <span>Troca com Troco</span>
              </div>
            </div>

            {/* CTAs Imediatos */}
            <div className="flex flex-col sm:flex-row w-full gap-2.5 pt-2">
              <a
                href="#estoque"
                className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-5 text-xs sm:text-sm font-bold bg-[#0047cc] hover:bg-[#003bb3] text-white uppercase italic tracking-wider rounded-xl shadow-md hover:shadow-blue-600/25 transition-all cursor-pointer text-center"
              >
                <span className="inline-flex items-center justify-center gap-2">
                  <CarFront className="w-4 h-4 shrink-0" />
                  <span>Ver Estoque Completo</span>
                </span>
              </a>

              <button
                type="button"
                onClick={onOpenAppraisal}
                className="w-full sm:w-auto inline-flex items-center justify-center py-2.5 px-5 text-xs sm:text-sm font-semibold bg-white dark:bg-[#0e1117] hover:bg-slate-50 dark:hover:bg-[#151821] text-slate-800 dark:text-slate-200 hover:text-[#0047cc] dark:hover:text-[#3b82f6] rounded-xl border border-slate-300 dark:border-[#232a38] shadow-sm transition-all cursor-pointer text-center"
              >
                <span>Avaliar meu Usado</span>
              </button>

              <a
                href={whatsappHero}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-4 text-xs sm:text-sm rounded-xl transition-all items-center justify-center gap-1.5 shadow-sm whitespace-nowrap sm:w-auto"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
                <span>{DEALERSHIP_INFO.phone}</span>
              </a>
            </div>
          </div>

          {/* Quick Search Showroom Console */}
          <div className="lg:col-span-5 w-full max-w-full px-1 sm:px-0">
            <div className="bg-white dark:bg-[#0e1117] border border-slate-200/90 dark:border-[#232a38] p-4 sm:p-5 rounded-2xl shadow-xl relative w-full max-w-full transition-colors duration-200">
              <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-slate-100 dark:border-[#232a38]">
                <div>
                  <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white tracking-wide uppercase italic">
                    Buscar Veículo
                  </h2>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">Encontre por marca, modelo ou categoria</p>
                </div>
                <span className="text-[10px] font-bold tracking-wider uppercase bg-blue-50 dark:bg-blue-950/40 text-[#0047cc] dark:text-[#3b82f6] border border-blue-200 dark:border-blue-900 px-2 py-0.5 rounded">
                  Estoque Ativo
                </span>
              </div>

              <form onSubmit={handleHeroSearch} className="space-y-3 w-full">
                <div className="w-full">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5">
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

                <div className="w-full">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5">
                    Carroceria / Categoria
                  </label>
                  <select
                    value={selectedBodyType}
                    onChange={(e) => setSelectedBodyType(e.target.value)}
                    className="w-full block bg-slate-50 dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-lg px-2.5 h-9 text-xs sm:text-sm focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                  >
                    <option value="">Todas as Categorias (SUV, Sedan, Hatch...)</option>
                    {BODY_TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="w-full">
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-0.5">
                    Modelo ou Palavra-Chave
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: Corolla, Compass, 320i, T-Cross..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full block bg-slate-50 dark:bg-[#151821] border border-slate-300 dark:border-[#232a38] text-slate-900 dark:text-white rounded-lg pl-8 pr-2.5 h-9 text-xs sm:text-sm focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                    />
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-3" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-[#0047cc] hover:bg-[#003bb3] text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer mt-1"
                >
                  <Search className="w-4 h-4" />
                  <span>Filtrar Seminovos</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
