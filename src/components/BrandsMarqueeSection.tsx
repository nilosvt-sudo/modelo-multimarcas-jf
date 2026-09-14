"use client";

import React from "react";
import { Marquee } from "@/components/ui/marquee";
import { ShieldCheck, Award } from "lucide-react";

const BRANDS = [
  { name: "Toyota", label: "TOYOTA" },
  { name: "Honda", label: "HONDA" },
  { name: "Jeep", label: "JEEP" },
  { name: "BMW", label: "BMW" },
  { name: "Chevrolet", label: "CHEVROLET" },
  { name: "Volkswagen", label: "VOLKSWAGEN" },
  { name: "Hyundai", label: "HYUNDAI" },
  { name: "Fiat", label: "FIAT" },
  { name: "Renault", label: "RENAULT" },
  { name: "Ford", label: "FORD" },
];

const BANK_PARTNERS = [
  { name: "Santander Financiamentos", tag: "Taxas a partir de 0,99% a.m." },
  { name: "BV Financeira", tag: "Aprovação Imediata" },
  { name: "Itaú Veículos", tag: "Até 60x Sem Entrada" },
  { name: "Bradesco Financiamentos", tag: "Crédito Pré-aprovado" },
  { name: "Banco PAN", tag: "Facilidade para Autônomos" },
  { name: "Safra Financeira", tag: "Condições Exclusivas" },
];

export default function BrandsMarqueeSection() {
  return (
    <section className="py-8 bg-white dark:bg-[#090b10] border-y border-slate-200/80 dark:border-[#232a38] overflow-hidden select-none transition-colors duration-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider font-speed">
          <Award className="w-4 h-4 text-[#e30613]" />
          <span>ESTOQUE MULTIMARCAS SELECIONADO E PARCEIROS BANCÁRIOS HOMOLOGADOS</span>
        </div>
        <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-bold">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Taxas Competitivas • Simulação Sem Compromisso</span>
        </div>
      </div>

      {/* Row 1: Car Brands Marquee */}
      <div className="w-full max-w-full overflow-hidden">
        <Marquee pauseOnHover className="[--duration:30s] py-1">
          {BRANDS.map((brand) => (
            <div
              key={brand.name}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] hover:bg-slate-100 dark:hover:bg-[#1f2430] border border-slate-200/90 dark:border-[#232a38] text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-[#e30613]" />
              <span className="font-speed font-bold text-sm tracking-wider uppercase">
                {brand.label}
              </span>
            </div>
          ))}
        </Marquee>
      </div>

      {/* Row 2: Banking Partners Marquee (Reverse Direction) */}
      <div className="w-full max-w-full overflow-hidden">
        <Marquee reverse pauseOnHover className="[--duration:35s] py-1 mt-2">
          {BANK_PARTNERS.map((partner) => (
            <div
              key={partner.name}
              className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-slate-100/70 dark:bg-[#12151d] hover:bg-slate-100 dark:hover:bg-[#181d28] border border-slate-200 dark:border-[#232a38] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors shrink-0 text-xs"
            >
              <span className="font-semibold text-slate-900 dark:text-white">{partner.name}</span>
              <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-transparent dark:border-emerald-800/40 px-2 py-0.5 rounded-full font-medium">
                {partner.tag}
              </span>
            </div>
          ))}
        </Marquee>
      </div>
    </section>
  );
}
