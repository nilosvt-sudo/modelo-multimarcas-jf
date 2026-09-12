"use client";

import React, { useState } from "react";
import { DEALERSHIP_INFO, generateWhatsAppLink } from "@/lib/constants";
import { MessageCircle, X, CarFront, Calculator, Scale, Sparkles } from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface FloatingWhatsAppProps {
  onOpenAppraisal?: () => void;
}

export default function FloatingWhatsApp({
  onOpenAppraisal,
}: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mainWhatsAppUrl = generateWhatsAppLink(
    "Olá! Estou navegando no site da Modelo Multimarcas JF e gostaria de atendimento."
  );

  return (
    <div className="fixed bottom-6 right-4 z-40 flex flex-col items-end">
      {/* Popover Menu */}
      {isOpen && (
        <div className="mb-3 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 text-slate-900">
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 fill-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-300 border-2 border-emerald-600 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-bold text-xs leading-tight">Modelo Multimarcas JF</h4>
                <span className="text-[10px] text-emerald-100">Atendimento Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Options */}
          <div className="p-3 space-y-1.5 bg-slate-50 text-xs">
            <p className="text-[11px] text-slate-500 px-1 py-0.5">
              Como podemos te ajudar agora?
            </p>

            <a
              href={mainWhatsAppUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-emerald-50 border border-slate-200/80 hover:border-emerald-300 transition-colors text-slate-800 font-semibold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Falar com um Consultor</span>
            </a>

            <a
              href="#estoque"
              onClick={() => setIsOpen(false)}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200/80 hover:border-slate-300 transition-colors text-slate-800 font-semibold text-left"
            >
              <CarFront className="w-4 h-4 text-red-600" />
              <span>Ver Estoque Completo</span>
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAppraisal?.();
              }}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white hover:bg-orange-50 border border-slate-200/80 hover:border-orange-300 transition-colors text-slate-800 font-semibold text-left cursor-pointer"
            >
              <Scale className="w-4 h-4 text-orange-500" />
              <span>Avaliar Meu Carro Usado</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-900/30 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Atendimento no WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400"></span>
        </span>

        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <WhatsAppIcon className="w-7 h-7 fill-white" />
        )}
      </button>
    </div>
  );
}
