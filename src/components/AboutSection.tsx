"use client";

import React from "react";
import { DEALERSHIP_INFO } from "@/lib/constants";
import {
  ShieldCheck,
  Award,
  TrendingUp,
  FileCheck,
  Car
} from "lucide-react";
import { NumberTicker } from "@/components/ui/number-ticker";

export default function AboutSection() {
  return (
    <section id="sobre" className="py-16 lg:py-20 bg-white dark:bg-[#06070a] text-slate-900 dark:text-slate-100 scroll-mt-20 border-t border-slate-200 dark:border-[#232a38] transition-colors duration-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left info column */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 text-xs font-speed font-bold uppercase tracking-widest text-[#e30613]">
              <span>{"// TRADIÇÃO E PROCEDÊNCIA EM JF"}</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight leading-tight uppercase italic font-speed">
              Mais que Vender Carros, Realizamos Conquistas com Procedência
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              A <strong className="text-slate-900 dark:text-white font-semibold">Modelo Multimarcas JF</strong> consolidou sua história na Av. Barão do Rio Branco com base na procedência inegociável de cada veículo e no relacionamento de longo prazo com clientes de Juiz de Fora e da Zona da Mata mineira.
            </p>

            {/* Official Instagram 3 Pillars Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1117] border-t-2 border-t-[#e30613] border-x border-b border-slate-200/90 dark:border-[#232a38] shadow-sm space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#e30613]/10 text-[#e30613] flex items-center justify-center mb-1 font-speed font-bold">
                  🤝
                </div>
                <h3 className="font-speed font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">SEMPRE AO SEU LADO</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Acompanhamento transparente e personalizado em todas as etapas da compra.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1117] border-t-2 border-t-zinc-800 dark:border-t-zinc-600 border-x border-b border-slate-200/90 dark:border-[#232a38] shadow-sm space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-zinc-100 dark:bg-[#151821] text-zinc-900 dark:text-slate-200 flex items-center justify-center mb-1 font-speed font-bold">
                  🛡️
                </div>
                <h3 className="font-speed font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">QUALIDADE E SEGURANÇA</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  100% dos veículos com laudo cautelar aprovado e garantia de 1 ano de motor e câmbio.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#0e1117] border-t-2 border-t-[#e30613] border-x border-b border-slate-200/90 dark:border-[#232a38] shadow-sm space-y-1.5">
                <div className="w-8 h-8 rounded-lg bg-[#e30613]/10 text-[#e30613] flex items-center justify-center mb-1 font-speed font-bold">
                  🚗
                </div>
                <h3 className="font-speed font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">SEU SONHO SOBRE RODAS</h3>
                <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                  Condições sob medida, aprovação rápida e avaliação justa do seu seminovo.
                </p>
              </div>
            </div>
          </div>

          {/* Right visual stats card */}
          <div className="lg:col-span-6">
            <div className="bg-slate-50 dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] rounded-2xl p-6 sm:p-8 shadow-md relative">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] shadow-sm">
                  <div className="mb-1">
                    <NumberTicker
                      value={1500}
                      prefix="+ "
                      className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-speed"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Veículos Entregues
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] shadow-sm">
                  <div className="mb-1">
                    <NumberTicker
                      value={98}
                      suffix="%"
                      className="text-3xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400 font-speed"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Aprovação de Clientes
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] shadow-sm">
                  <div className="mb-1">
                    <NumberTicker
                      value={10}
                      prefix="+ "
                      suffix=" Anos"
                      className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white font-speed"
                    />
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Tradição em JF
                  </span>
                </div>

                <div className="p-5 rounded-xl bg-white dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] shadow-sm">
                  <div className="text-3xl sm:text-4xl font-black text-amber-500 mb-1 tabular-nums font-speed">
                    4.9 ★
                  </div>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                    Google Reviews
                  </span>
                </div>
              </div>

              <div className="mt-5 p-4 rounded-xl bg-white dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] shadow-sm flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#06070a] border border-slate-200 dark:border-[#232a38] flex items-center justify-center shrink-0 overflow-hidden p-1 shadow-sm">
                    <img
                      src="/images/logo-oficial.jpg"
                      alt="Modelo Multimarcas JF - Logo Oficial"
                      className="w-full h-full object-contain rounded-lg"
                    />
                  </div>
                  <div className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    <strong className="text-slate-900 dark:text-white block font-speed uppercase tracking-wider text-sm">
                      Mais um CLIENTE feliz!
                    </strong>
                    <span className="text-slate-500 dark:text-slate-400">
                      Obrigado pela confiança! Laudo pericial com mais de 100 pontos inspecionados por veículo.
                    </span>
                  </div>
                </div>
                <span className="hidden sm:inline-block text-xs text-emerald-700 dark:text-emerald-400 font-speed uppercase font-bold tracking-wider shrink-0 bg-emerald-50 dark:bg-emerald-950/60 px-2.5 py-1.5 rounded border border-emerald-200 dark:border-emerald-800/40">
                  Showroom Ativo
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
