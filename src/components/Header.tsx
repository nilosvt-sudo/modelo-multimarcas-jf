"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DEALERSHIP_INFO, generateWhatsAppLink } from "@/lib/constants";
import { InstagramIcon, WhatsAppIcon } from "@/components/SocialIcons";
import BrandLogo from "@/components/BrandLogo";
import ThemeToggle from "@/components/ThemeToggle";
import {
  Phone,
  Heart,
  Scale,
  Menu,
  X,
  ShieldCheck,
  CarFront,
  MapPin,
  Search,
  CalendarCheck
} from "lucide-react";

interface HeaderProps {
  favoriteCount?: number;
  comparisonCount?: number;
  onOpenFavorites?: () => void;
  onOpenComparison?: () => void;
  onOpenAppraisal?: () => void;
  onOpenTestDrive?: () => void;
  onOpenSearch?: () => void;
}

export default function Header({
  favoriteCount = 0,
  comparisonCount = 0,
  onOpenFavorites,
  onOpenComparison,
  onOpenAppraisal,
  onOpenTestDrive,
  onOpenSearch,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappGeneralLink = generateWhatsAppLink(
    "Olá! Estou navegando no site da loja e gostaria de mais informações sobre o estoque de veículos."
  );

  return (
    <header className="sticky top-0 z-50 transition-all duration-200 w-full max-w-full box-border">
      {/* Micro barra superior de informações e contato */}
      <div className="hidden md:block bg-[#F8FAFC] dark:bg-[#06070a] text-slate-600 dark:text-slate-400 text-[11px] lg:text-xs border-b border-slate-200 dark:border-[#232a38] py-1.5 transition-colors duration-200 w-full box-border">
        <div className="max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between gap-2 whitespace-nowrap">
          <div className="flex items-center gap-3 lg:gap-4 overflow-hidden text-ellipsis">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0"></span>
              <span>Hoje: <strong className="text-slate-900 dark:text-white font-bold">{DEALERSHIP_INFO.hours.weekdays}</strong></span>
            </span>
            <span className="hidden lg:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0047cc] dark:text-[#3b82f6] shrink-0" />
              <span>Laudo Cautelar 100% Aprovado & Garantia de 1 Ano</span>
            </span>
            <span className="hidden xl:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden xl:flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 shrink-0" />
              <span>{DEALERSHIP_INFO.address.street} - SP</span>
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <a
              href={`tel:${DEALERSHIP_INFO.phoneFormatted}`}
              className="hover:text-[#0047cc] dark:hover:text-[#3b82f6] transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3 h-3 text-[#e0121d]" />
              <span className="font-bold text-slate-900 dark:text-white">{DEALERSHIP_INFO.phone}</span>
            </a>
            <div className="flex items-center gap-2 border-l border-slate-200 dark:border-[#232a38] pl-2.5">
              <a
                href={DEALERSHIP_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="text-slate-500 dark:text-slate-400 hover:text-[#e0121d] transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Header Principal com Navbar em Linha Única */}
      <div
        className={`bg-white/95 dark:bg-[#0e1015]/95 backdrop-blur-md border-b border-slate-200/80 dark:border-[#232a38] transition-all duration-200 w-full box-border min-h-[70px] flex items-center overflow-visible ${
          scrolled ? "py-2 shadow-md" : "py-2.5"
        }`}
      >
        <div className="max-w-[1680px] mx-auto px-3 sm:px-6 md:px-8 lg:px-12 flex items-center justify-between gap-2 sm:gap-4 lg:gap-6 w-full box-border overflow-visible">
          {/* Logo da Loja (Nunca quebra linha nem corta texto) */}
          <div className="shrink-0 flex items-center overflow-visible">
            <BrandLogo variant="header" />
          </div>

          {/* Menu de Navegação Desktop (100% Horizontal em Linha Única) */}
          <nav className="hidden xl:flex items-center gap-4 2xl:gap-6 text-xs lg:text-[13px] font-bold text-slate-700 dark:text-slate-300 whitespace-nowrap shrink-0">
            <a
              href="#estoque"
              className="hover:text-[#0047cc] dark:hover:text-[#3b82f6] transition-colors flex items-center gap-1.5 text-[#0047cc] dark:text-[#3b82f6]"
            >
              <CarFront className="w-4 h-4" />
              <span>Estoque Completo</span>
            </a>
            <a
              href="#financiamento"
              className="hover:text-[#0047cc] dark:hover:text-[#3b82f6] transition-colors"
            >
              Simular Financiamento
            </a>
            <a
              href="#avaliacao"
              className="hover:text-[#0047cc] dark:hover:text-[#3b82f6] transition-colors"
            >
              Avaliar Usado
            </a>
            <a
              href="#sobre"
              className="hover:text-[#0047cc] dark:hover:text-[#3b82f6] transition-colors"
            >
              Sobre a Loja
            </a>
            <a
              href="#depoimentos"
              className="hover:text-[#0047cc] dark:hover:text-[#3b82f6] transition-colors"
            >
              Depoimentos
            </a>
            <a
              href="#contato"
              className="hover:text-[#0047cc] dark:hover:text-[#3b82f6] transition-colors"
            >
              Localização
            </a>
          </nav>

          {/* Ações e Botões à Direita */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Atalho de Busca (Sempre visível) */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                aria-label="Buscar veículos"
                className="p-2 sm:px-2.5 sm:py-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-[#0047cc] dark:hover:text-[#3b82f6] hover:bg-slate-100 dark:hover:bg-[#1a1d24] rounded-xl border border-slate-200 dark:border-[#232a38] transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Search className="w-4 h-4 text-[#0047cc] dark:text-[#3b82f6]" />
                <span className="hidden sm:inline">Buscar</span>
                <kbd className="hidden 2xl:inline-block px-1 py-0.2 text-[9px] bg-slate-100 dark:bg-[#1a1d24] text-slate-500 rounded border border-slate-200 dark:border-slate-700">
                  Ctrl+K
                </kbd>
              </button>
            )}

            {/* Veículos Salvos (Favoritos) - Visível a partir de telas 'sm' */}
            {onOpenFavorites && (
              <button
                type="button"
                onClick={onOpenFavorites}
                aria-label={`Veículos salvos (${favoriteCount})`}
                className="hidden sm:inline-flex relative p-2 text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 rounded-xl border border-slate-200 dark:border-[#232a38] transition-all cursor-pointer"
                title="Minha Garagem"
              >
                <Heart className="w-4 h-4 text-rose-500" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {favoriteCount}
                  </span>
                )}
              </button>
            )}

            {/* Comparador de Veículos - Visível a partir de telas 'sm' */}
            {onOpenComparison && (
              <button
                type="button"
                onClick={onOpenComparison}
                aria-label={`Comparar veículos (${comparisonCount})`}
                className="hidden sm:inline-flex relative p-2 text-slate-600 dark:text-slate-300 hover:text-[#0047cc] hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-xl border border-slate-200 dark:border-[#232a38] transition-all cursor-pointer"
                title="Comparador"
              >
                <Scale className="w-4 h-4 text-[#0047cc] dark:text-[#3b82f6]" />
                {comparisonCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#0047cc] text-white text-[9px] font-bold w-3.5 h-3.5 rounded-full flex items-center justify-center">
                    {comparisonCount}
                  </span>
                )}
              </button>
            )}

            {/* Tema Claro/Escuro - Visível a partir de telas 'sm' */}
            <div className="hidden sm:flex items-center">
              <ThemeToggle />
            </div>

            {/* Botão Agendar Test Drive (Desktop) */}
            {onOpenTestDrive && (
              <button
                type="button"
                onClick={onOpenTestDrive}
                className="hidden lg:inline-flex items-center gap-1.5 bg-[#0047cc] hover:bg-[#003bb3] text-white font-bold text-xs py-2 px-3 sm:px-3.5 rounded-xl shadow-sm hover:shadow-blue-600/25 transition-all cursor-pointer whitespace-nowrap"
              >
                <CalendarCheck className="w-3.5 h-3.5" />
                <span>Test Drive</span>
              </button>
            )}

            {/* Botão WhatsApp (Sempre visível para alta conversão) */}
            <a
              href={whatsappGeneralLink}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Falar no WhatsApp"
              className="inline-flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs p-2 sm:py-2 sm:px-3 rounded-xl transition-all shadow-sm whitespace-nowrap"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>

            {/* Botão Menu Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#1a1d24] rounded-xl border border-slate-200 dark:border-[#232a38] transition-colors cursor-pointer"
              aria-label="Menu principal"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Menu Dropdown Mobile Deslizante */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-white dark:bg-[#0e1015] border-t border-slate-200 dark:border-[#232a38] px-4 py-4 space-y-3 animate-in slide-in-from-top-2 shadow-xl">
            {/* Ações Rápidas no topo do menu mobile (Favoritos, Comparador e Tema) */}
            <div className="grid grid-cols-3 gap-2 pb-3 border-b border-slate-100 dark:border-[#232a38]">
              {onOpenFavorites && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenFavorites();
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200/80 dark:border-[#232a38] text-slate-700 dark:text-slate-300 hover:bg-rose-50 dark:hover:bg-rose-950/20 transition-all text-[11px] font-bold gap-1 cursor-pointer relative"
                >
                  <Heart className="w-4 h-4 text-rose-500" />
                  <span>Garagem</span>
                  {favoriteCount > 0 && (
                    <span className="absolute top-1 right-1 bg-rose-500 text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                      {favoriteCount}
                    </span>
                  )}
                </button>
              )}

              {onOpenComparison && (
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenComparison();
                  }}
                  className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200/80 dark:border-[#232a38] text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all text-[11px] font-bold gap-1 cursor-pointer relative"
                >
                  <Scale className="w-4 h-4 text-[#0047cc] dark:text-[#3b82f6]" />
                  <span>Comparar</span>
                  {comparisonCount > 0 && (
                    <span className="absolute top-1 right-1 bg-[#0047cc] text-white text-[8px] font-bold px-1.5 py-0.2 rounded-full">
                      {comparisonCount}
                    </span>
                  )}
                </button>
              )}

              <div className="flex flex-col items-center justify-center p-2 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200/80 dark:border-[#232a38] text-[11px] font-bold text-slate-700 dark:text-slate-300">
                <span className="text-[10px] text-slate-500 mb-0.5">Tema</span>
                <ThemeToggle />
              </div>
            </div>

            {/* Links de Navegação */}
            <nav className="flex flex-col space-y-1 text-xs sm:text-sm font-bold text-slate-700 dark:text-slate-200">
              <a
                href="#estoque"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#151821] flex items-center gap-2 text-[#0047cc] dark:text-[#3b82f6]"
              >
                <CarFront className="w-4 h-4" />
                Estoque Completo
              </a>
              <a
                href="#financiamento"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#151821]"
              >
                Simulador de Financiamento
              </a>
              <a
                href="#avaliacao"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#151821]"
              >
                Avaliar Carro na Troca
              </a>
              <a
                href="#sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#151821]"
              >
                Sobre a Loja
              </a>
              <a
                href="#depoimentos"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#151821]"
              >
                Depoimentos
              </a>
              <a
                href="#contato"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-[#151821]"
              >
                Localização do Showroom
              </a>
            </nav>

            <div className="pt-3 border-t border-slate-200 dark:border-[#232a38] flex flex-col gap-2">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenTestDrive?.();
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-[#0047cc] text-white font-bold py-2.5 px-4 rounded-xl shadow-sm text-xs cursor-pointer"
              >
                <CalendarCheck className="w-4 h-4" />
                <span>Agendar Test Drive VIP</span>
              </button>

              <a
                href={whatsappGeneralLink}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold py-2.5 px-4 rounded-xl shadow-sm text-xs"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Falar com Consultor</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
