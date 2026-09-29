"use client";

import React from "react";
import { DEALERSHIP_INFO } from "@/lib/constants";
import {
  ShieldCheck,
  Award,
  Sparkles,
  HeartHandshake,
  CheckCircle2,
  Car,
  FileCheck2,
  Building,
  KeyRound
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

export default function AboutSection() {
  return (
    <section id="sobre" className="py-16 lg:py-24 bg-white dark:bg-[#080a0f] text-slate-900 dark:text-slate-100 scroll-mt-20 border-t border-slate-200 dark:border-[#232a38] transition-colors duration-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left info column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              <span className="w-2 h-2 rounded-full bg-blue-600"></span>
              <span>CONCESSIONÁRIA & MULTIMARCAS PREMIUM</span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span>SÃO PAULO</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
              Mais que Vender Carros, Realizamos Conquistas com Procedência e Confiança
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              A <strong className="text-slate-900 dark:text-white font-bold">{DEALERSHIP_INFO.name}</strong> é referência em compra, venda, troca e financiamento de seminovos e importados em São Paulo. Todos os nossos veículos passam por uma rigorosa perícia cautelar com mais de 150 itens inspecionados antes de irem para o showroom.
            </p>

            {/* 3 Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12151d] border border-slate-200 dark:border-[#232a38] shadow-sm space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
                  <FileCheck2 className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  LAUDO CAUTELAR 100%
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Sem histórico de leilão, sinistro ou batidas estruturais. Procedência garantida por escrito.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12151d] border border-slate-200 dark:border-[#232a38] shadow-sm space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  GARANTIA TOTAL DE 1 ANO
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Motor, câmbio e componentes essenciais com cobertura completa para sua total tranquilidade.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#12151d] border border-slate-200 dark:border-[#232a38] shadow-sm space-y-1.5">
                <div className="w-9 h-9 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-1">
                  <KeyRound className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                  PRONTA ENTREGA
                </h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Documentação rápida, despachante próprio e saída com o veículo no mesmo dia.
                </p>
              </div>
            </div>
          </div>

          {/* Right visual stats card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-50 dark:bg-[#10131a] border border-slate-200 dark:border-[#232a38] rounded-3xl p-6 sm:p-8 shadow-md relative">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] shadow-sm">
                  <div className="mb-1">
                    <NumberTicker
                      value={5200}
                      prefix="+ "
                      className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Veículos Entregues
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] shadow-sm">
                  <div className="mb-1">
                    <NumberTicker
                      value={99}
                      suffix="%"
                      className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Clientes Satisfeitos
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] shadow-sm">
                  <div className="mb-1">
                    <NumberTicker
                      value={14}
                      prefix="Há "
                      suffix=" Anos"
                      className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    De Tradição em São Paulo
                  </span>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] shadow-sm">
                  <div className="mb-1">
                    <span className="text-3xl sm:text-4xl font-black text-amber-500">
                      4.9★
                    </span>
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Avaliação Google Reviews
                  </span>
                </div>
              </div>

              {/* Showroom location banner */}
              <div className="mt-6 pt-5 border-t border-slate-200 dark:border-[#232a38] flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                    {DEALERSHIP_INFO.name}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {DEALERSHIP_INFO.address.street} • {DEALERSHIP_INFO.address.city} - {DEALERSHIP_INFO.address.state}
                  </p>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1.5 rounded-full border border-blue-200 dark:border-blue-900">
                  Brooklin • SP
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
