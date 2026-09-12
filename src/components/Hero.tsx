"use client";

import React, { useState } from "react";
import { DEALERSHIP_INFO, COMMON_BRANDS, BODY_TYPES, generateWhatsAppLink } from "@/lib/constants";
import {
  Search,
  ShieldCheck,
  CheckCircle,
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
    <section className="relative bg-[#F8FAFC] text-slate-900 pt-6 pb-12 sm:pt-12 sm:pb-18 lg:pt-16 lg:pb-24 border-b border-slate-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
          {/* Main Editorial Value Proposition */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Speed & Racing Brand Top Strip */}
            <div className="inline-flex items-center gap-2.5 bg-white border border-slate-200/90 shadow-sm px-3.5 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider text-slate-700">
              <img
                src="/images/logo-oficial.jpg"
                alt="Logo Oficial"
                className="w-5 h-5 object-contain rounded-md border border-slate-200"
              />
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-1 bg-[#e30613] rounded-sm"></span>
                <span className="w-2.5 h-1 bg-zinc-800 rounded-sm"></span>
              </span>
              <span className="font-speed font-bold text-slate-900 tracking-widest">MODELO MULTIMARCAS JF</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-600 font-medium">Av. Rio Branco, 4200</span>
            </div>

            {/* Speed, Power & Automotive Muscular Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-black tracking-tight leading-[1.05] text-zinc-900 uppercase italic font-speed">
              SEU SONHO <span className="text-[#e30613]">SOBRE RODAS</span> COM MÁXIMA POTÊNCIA E PROCEDÊNCIA.
            </h1>

            <p className="text-base sm:text-lg lg:text-xl text-slate-600 max-w-3xl font-normal leading-relaxed">
              O estoque de seminovos mais confiável de Juiz de Fora. Veículos com <strong className="text-slate-900 font-semibold">Laudo Cautelar 100% Aprovado</strong>, garantia de procedência e avaliação justa do seu usado na troca.
            </p>

            {/* Official Instagram Post 3 Pillars (Real Dealership Tagline & Icons) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-white border-l-2 border-l-[#e30613] border-y border-r border-slate-200/90 rounded-xl p-3.5 flex items-start gap-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#e30613]/10 text-[#e30613] flex items-center justify-center shrink-0">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-speed font-bold uppercase tracking-wider text-slate-900">SEMPRE AO SEU LADO</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Atendimento do início ao pós-venda</div>
                </div>
              </div>

              <div className="bg-white border-l-2 border-l-zinc-800 border-y border-r border-slate-200/90 rounded-xl p-3.5 flex items-start gap-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-900 flex items-center justify-center shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-speed font-bold uppercase tracking-wider text-slate-900">QUALIDADE E SEGURANÇA</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Perícia e procedência asseguradas</div>
                </div>
              </div>

              <div className="bg-white border-l-2 border-l-[#e30613] border-y border-r border-slate-200/90 rounded-xl p-3.5 flex items-start gap-3 shadow-sm hover:shadow-md hover:border-slate-300 transition-all">
                <div className="w-8 h-8 rounded-lg bg-[#e30613]/10 text-[#e30613] flex items-center justify-center shrink-0">
                  <CarFront className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-speed font-bold uppercase tracking-wider text-slate-900">SEU SONHO SOBRE RODAS</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Seminovos selecionados e revisados</div>
                </div>
              </div>
            </div>

            {/* Strategic CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <a
                href="#estoque"
                className="bg-[#e30613] hover:bg-[#c40510] text-white font-speed font-bold italic tracking-wider uppercase px-6 py-3.5 rounded-xl shadow-lg hover:shadow-red-600/25 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                <CarFront className="w-5 h-5" />
                Ver Estoque Completo
              </a>

              <button
                onClick={onOpenAppraisal}
                className="bg-white hover:bg-slate-50 text-slate-800 hover:text-[#e30613] font-semibold px-5 py-3.5 rounded-xl border border-slate-300 shadow-sm hover:border-slate-400 transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                Avaliar meu Usado
              </button>

              <a
                href={whatsappHero}
                target="_blank"
                rel="noreferrer"
                className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-5 py-3.5 rounded-xl transition-all flex items-center gap-2 text-sm sm:text-base shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                (32) 3212-5705
              </a>
            </div>
          </div>

          {/* Quick Search Showroom Console */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-slate-200/90 p-6 sm:p-8 xl:p-9 rounded-3xl shadow-xl relative w-full">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100">
                <div>
                  <h2 className="text-lg font-bold text-slate-900 tracking-wide uppercase font-speed">
                    Buscar Veículo
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Encontre por marca, modelo ou categoria</p>
                </div>
                <span className="text-[11px] font-bold tracking-wider uppercase bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded font-speed">
                  Estoque Ativo
                </span>
              </div>

              <form onSubmit={handleHeroSearch} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-speed">
                    Marca
                  </label>
                  <select
                    value={selectedBrand}
                    onChange={(e) => setSelectedBrand(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors"
                  >
                    <option value="">Todas as Marcas</option>
                    {COMMON_BRANDS.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-speed">
                      Carroceria
                    </label>
                    <select
                      value={selectedBodyType}
                      onChange={(e) => setSelectedBodyType(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors"
                    >
                      <option value="">Todas</option>
                      {BODY_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5 font-speed">
                      Modelo
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Onix, Corolla..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full bg-slate-50 border border-slate-300 text-slate-900 rounded-xl px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] placeholder:text-slate-400 transition-colors"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-[#e30613] hover:bg-[#c40510] text-white font-speed font-bold italic uppercase py-3.5 px-4 rounded-xl shadow-md hover:shadow-red-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer text-sm tracking-wider mt-2"
                >
                  <Search className="w-4 h-4" />
                  Filtrar Resultados
                </button>
              </form>

              {/* Toast discreto de prova social */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 hidden sm:flex items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2 text-slate-600">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0"></span>
                  <span className="text-[11px] font-medium">Mais um cliente feliz em Juiz de Fora</span>
                </div>
                <button
                  onClick={onOpenAppraisal}
                  className="text-[11px] text-[#e30613] hover:underline font-speed font-bold tracking-wider uppercase flex items-center gap-1 cursor-pointer shrink-0"
                >
                  Avaliar usado <ArrowRight className="w-3 h-3 text-[#e30613]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
