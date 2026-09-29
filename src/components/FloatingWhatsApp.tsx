"use client";

import React, { useState } from "react";
import { DEALERSHIP_INFO, generateWhatsAppLink } from "@/lib/constants";
import { MessageCircle, X, Car, Calendar, DollarSign, KeyRound } from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface FloatingWhatsAppProps {
  onOpenAppraisal?: () => void;
  onOpenTestDrive?: () => void;
}

export default function FloatingWhatsApp({
  onOpenAppraisal,
  onOpenTestDrive,
}: FloatingWhatsAppProps) {
  const [isOpen, setIsOpen] = useState(false);

  const mainWhatsAppUrl = generateWhatsAppLink(
    "Olá! Estou no site da Apex Motors e gostaria de falar com um consultor de vendas."
  );

  return (
    <div
      style={{
        bottom: "max(1.5rem, calc(1.5rem + env(safe-area-inset-bottom, 0px)))",
      }}
      className="fixed right-4 sm:right-6 bottom-6 sm:bottom-8 z-50 flex flex-col items-end box-border pointer-events-auto"
    >
      {/* Popover Menu Responsivo */}
      {isOpen && (
        <div className="mb-3 w-[calc(100vw-32px)] max-w-72 sm:w-72 bg-white dark:bg-[#10131a] rounded-3xl shadow-2xl border border-slate-200 dark:border-[#232a38] overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 text-slate-900 dark:text-white box-border">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white p-3.5 sm:p-4 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="relative">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <WhatsAppIcon className="w-5 h-5 fill-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-400 border-2 border-slate-900 rounded-full"></span>
              </div>
              <div>
                <h4 className="font-black text-xs leading-tight">{DEALERSHIP_INFO.name}</h4>
                <span className="text-[10px] text-blue-200">Consultores Online</span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/80 hover:text-white p-1 cursor-pointer"
              aria-label="Fechar"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body Options */}
          <div className="p-3 space-y-1.5 bg-slate-50 dark:bg-[#141720] text-xs">
            <p className="text-[11px] text-slate-500 dark:text-slate-400 px-1 py-0.5">
              Como podemos ajudar você hoje?
            </p>

            <a
              href={mainWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-[#1a1d24] hover:bg-emerald-50 dark:hover:bg-emerald-950/20 border border-slate-200/80 dark:border-[#232a38] hover:border-emerald-300 transition-colors text-slate-800 dark:text-slate-200 font-bold"
            >
              <MessageCircle className="w-4 h-4 text-emerald-600" />
              <span>Falar com Vendedor</span>
            </a>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenTestDrive?.();
              }}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-[#1a1d24] hover:bg-blue-50 dark:hover:bg-blue-950/20 border border-slate-200/80 dark:border-[#232a38] hover:border-blue-300 transition-colors text-slate-800 dark:text-slate-200 font-bold text-left cursor-pointer"
            >
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>Agendar Test Drive VIP</span>
            </button>

            <button
              onClick={() => {
                setIsOpen(false);
                onOpenAppraisal?.();
              }}
              className="w-full flex items-center gap-2.5 p-2.5 rounded-xl bg-white dark:bg-[#1a1d24] hover:bg-amber-50 dark:hover:bg-amber-950/20 border border-slate-200/80 dark:border-[#232a38] hover:border-amber-300 transition-colors text-slate-800 dark:text-slate-200 font-bold text-left cursor-pointer"
            >
              <DollarSign className="w-4 h-4 text-amber-500" />
              <span>Avaliar Meu Carro Usado</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center justify-center w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-xl shadow-emerald-900/30 hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer"
        aria-label="Atendimento no WhatsApp"
      >
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-400"></span>
        </span>
        <WhatsAppIcon className="w-6 h-6 fill-white" />
      </button>
    </div>
  );
}
