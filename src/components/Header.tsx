"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { DEALERSHIP_INFO, generateWhatsAppLink } from "@/lib/constants";
import { InstagramIcon, FacebookIcon, WhatsAppIcon } from "@/components/SocialIcons";
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
  Search
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
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const whatsappGeneralLink = generateWhatsAppLink(
    "Olá! Estou navegando no site da Modelo Multimarcas JF e gostaria de mais informações sobre o estoque."
  );

  return (
    <header className="sticky top-0 z-50 transition-all duration-300">
      {/* Top micro bar with contact info & address */}
      <div className="bg-[#F8FAFC] dark:bg-[#06070a] text-slate-600 dark:text-slate-400 text-xs border-b border-slate-200 dark:border-[#232a38] py-2 transition-colors duration-200">
        <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Atendimento hoje em JF: <strong className="text-slate-900 dark:text-white font-semibold">08:30 às 18:30</strong>
            </span>
            <span className="hidden md:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden md:flex items-center gap-1.5 text-slate-700 dark:text-slate-300 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-[#e30613]" />
              100% dos Veículos com Laudo Cautelar Aprovado
            </span>
            <span className="hidden lg:inline text-slate-300 dark:text-slate-700">|</span>
            <span className="hidden lg:flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400" />
              Av. Barão do Rio Branco, 4200 - Passos
            </span>
          </div>

          <div className="flex items-center gap-4">
            <a
              href={`tel:${DEALERSHIP_INFO.phoneFormatted}`}
              className="hover:text-[#e30613] transition-colors flex items-center gap-1.5"
            >
              <Phone className="w-3.5 h-3.5 text-[#e30613]" />
              <span className="font-bold text-slate-900 dark:text-white tracking-wide">{DEALERSHIP_INFO.phone}</span>
            </a>
            <div className="flex items-center gap-2.5 border-l border-slate-200 dark:border-[#232a38] pl-3.5">
              <a
                href={DEALERSHIP_INFO.instagram}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="text-slate-500 dark:text-slate-400 hover:text-[#e30613] transition-colors"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={DEALERSHIP_INFO.facebook}
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="text-slate-500 dark:text-slate-400 hover:text-[#0066ff] transition-colors"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <nav
        className={`bg-white dark:bg-[#0e1117] text-slate-900 dark:text-white transition-all duration-200 border-b border-slate-200/90 dark:border-[#232a38] ${
          scrolled ? "shadow-md py-3 bg-white/95 dark:bg-[#0e1117]/95 backdrop-blur-md" : "py-4"
        }`}
      >
        <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex items-center justify-between gap-4">
          {/* Coluna Esquerda: Logo Oficial */}
          <div className="flex items-center shrink-0">
            <BrandLogo variant="header" className="-my-1" />
          </div>

          {/* Coluna Central: Navegação Principal Centralizada */}
          <nav className="hidden lg:flex items-center justify-center flex-1 mx-4 xl:mx-8 gap-8 xl:gap-10 text-sm font-medium">
            <Link
              href="/#estoque"
              className="text-slate-700 dark:text-slate-300 hover:text-[#e30613] dark:hover:text-[#e30613] hover:bg-slate-100/80 dark:hover:bg-[#151821] rounded-lg transition-colors whitespace-nowrap font-semibold px-3 py-2"
            >
              Estoque
            </Link>

            <button
              type="button"
              onClick={onOpenAppraisal}
              className="text-slate-700 dark:text-slate-300 hover:text-[#e30613] dark:hover:text-[#e30613] hover:bg-slate-100/80 dark:hover:bg-[#151821] rounded-lg transition-colors whitespace-nowrap font-semibold px-3 py-2 cursor-pointer bg-transparent border-none"
            >
              Avaliar Usado
            </button>

            <Link
              href="/#depoimentos"
              className="text-slate-700 dark:text-slate-300 hover:text-[#e30613] dark:hover:text-[#e30613] hover:bg-slate-100/80 dark:hover:bg-[#151821] rounded-lg transition-colors whitespace-nowrap font-semibold px-3 py-2"
            >
              Depoimentos
            </Link>

            <Link
              href="/#sobre"
              className="text-slate-700 dark:text-slate-300 hover:text-[#e30613] dark:hover:text-[#e30613] hover:bg-slate-100/80 dark:hover:bg-[#151821] rounded-lg transition-colors whitespace-nowrap font-semibold px-3 py-2"
            >
              A Loja
            </Link>
          </nav>

          {/* Coluna Direita: Utilitários Compactos + Alternador de Tema + Busca Rápida + CTA Principal */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-4 shrink-0">
            {/* Botão de Busca Rápida (Command Search 21st.dev) */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-[#151821] hover:bg-slate-200/80 dark:hover:bg-[#232a38] border border-slate-200 dark:border-[#232a38] rounded-xl transition-all cursor-pointer group shadow-sm"
                title="Busca rápida de seminovos (Ctrl + K)"
              >
                <Search className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 group-hover:text-[#e30613] transition-colors" />
                <span className="hidden xl:inline">Buscar</span>
                <kbd className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 bg-white dark:bg-[#0e1117] px-1.5 py-0.5 rounded border border-slate-200/90 dark:border-[#232a38] shadow-2xs font-mono">
                  ⌘K
                </kbd>
              </button>
            )}

            {/* Botão/ícone compacto de Comparar */}
            <button
              type="button"
              onClick={onOpenComparison}
              className="relative p-2.5 text-slate-700 dark:text-slate-300 hover:text-[#e30613] dark:hover:text-[#e30613] bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#232a38] border border-slate-200 dark:border-[#232a38] rounded-xl transition-all cursor-pointer flex items-center justify-center group"
              title="Comparar veículos selecionados"
              aria-label={`Comparar veículos (${comparisonCount} selecionados)`}
            >
              <Scale className="w-4 h-4 text-slate-700 dark:text-slate-300 group-hover:text-[#e30613] group-hover:scale-110 transition-transform" />
              <span
                className={`absolute -top-1.5 -right-1.5 text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center tabular-nums shadow-sm ${
                  comparisonCount > 0
                    ? "bg-[#1E2229] dark:bg-red-600 text-white"
                    : "bg-slate-200 dark:bg-[#232a38] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-transparent"
                }`}
              >
                {comparisonCount}
              </span>
            </button>

            {/* Botão/ícone compacto de Favoritos */}
            <button
              type="button"
              onClick={onOpenFavorites}
              className="relative p-2.5 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-500 bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#232a38] border border-slate-200 dark:border-[#232a38] rounded-xl transition-all cursor-pointer flex items-center justify-center group"
              title="Veículos favoritados"
              aria-label={`Veículos favoritados (${favoriteCount})`}
            >
              <Heart
                className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  favoriteCount > 0 ? "text-rose-600 fill-rose-600" : "text-slate-500 dark:text-slate-400"
                }`}
              />
              <span
                className={`absolute -top-1.5 -right-1.5 text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center tabular-nums shadow-sm ${
                  favoriteCount > 0
                    ? "bg-rose-600 text-white"
                    : "bg-slate-200 dark:bg-[#232a38] text-slate-600 dark:text-slate-400 border border-slate-300 dark:border-transparent"
                }`}
              >
                {favoriteCount}
              </span>
            </button>

            {/* Alternador de Modo Claro / Escuro (Desktop) */}
            <ThemeToggle variant="header" />

            {/* Botão Principal de Conversão */}
            <a
              href={whatsappGeneralLink}
              target="_blank"
              rel="noreferrer"
              className="group relative overflow-hidden inline-flex items-center gap-2 bg-[#e30613] hover:bg-[#c40510] text-white px-5 py-2.5 rounded-xl font-speed font-bold uppercase tracking-wider text-xs shadow-md hover:shadow-red-600/30 transition-all active:scale-95 whitespace-nowrap shrink-0"
            >
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -inset-full animate-shimmer [background:linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              />
              <WhatsAppIcon className="w-4 h-4 fill-white shrink-0 relative z-10" />
              <span className="relative z-10">Falar com Consultor</span>
            </a>
          </div>

          {/* Ações Mobile e Tablet (lg:hidden) */}
          <div className="flex lg:hidden items-center gap-2">
            {/* Alternador de Modo Claro / Escuro (Mobile Topbar) */}
            <ThemeToggle variant="header" />

            {/* Busca Rápida Mobile */}
            {onOpenSearch && (
              <button
                type="button"
                onClick={onOpenSearch}
                className="p-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#232a38] border border-slate-200 dark:border-[#232a38] rounded-xl cursor-pointer"
                title="Buscar seminovos"
              >
                <Search className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              </button>
            )}

            {/* Comparar Compacto Mobile */}
            <button
              type="button"
              onClick={onOpenComparison}
              className="relative p-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#232a38] border border-slate-200 dark:border-[#232a38] rounded-xl cursor-pointer"
              title="Comparar veículos"
              aria-label={`Comparar veículos (${comparisonCount})`}
            >
              <Scale className="w-4 h-4 text-slate-700 dark:text-slate-300" />
              {comparisonCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-[#1E2229] dark:bg-red-600 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                  {comparisonCount}
                </span>
              )}
            </button>

            {/* Favoritos Compacto Mobile */}
            <button
              type="button"
              onClick={onOpenFavorites}
              className="relative p-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#232a38] border border-slate-200 dark:border-[#232a38] rounded-xl cursor-pointer"
              title="Favoritos"
              aria-label={`Favoritos (${favoriteCount})`}
            >
              <Heart className={`w-4 h-4 ${favoriteCount > 0 ? "text-rose-600 fill-rose-600" : "text-slate-500 dark:text-slate-400"}`} />
              {favoriteCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-bold min-w-4 h-4 px-1 rounded-full flex items-center justify-center tabular-nums shadow-sm">
                  {favoriteCount}
                </span>
              )}
            </button>

            {/* Botão Hambúrguer Mobile */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#232a38] border border-slate-200 dark:border-[#232a38] rounded-xl cursor-pointer"
              aria-label={mobileMenuOpen ? "Fechar menu" : "Abrir menu"}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile slide-down menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 dark:border-[#232a38] bg-white dark:bg-[#0e1117] px-4 py-5 space-y-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
            {/* Alternador de tema destacado no menu */}
            <ThemeToggle variant="menu" />

            {/* Quick Actions Grid */}
            <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-100 dark:border-[#232a38]">
              <Link
                href="/#estoque"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-xs font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1f2430] text-left transition-colors"
              >
                <CarFront className="w-4 h-4 text-[#e30613] shrink-0" />
                <span>Estoque</span>
              </Link>

              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppraisal?.();
                }}
                className="flex items-center gap-2 p-3 rounded-xl bg-slate-50 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] text-xs font-semibold text-slate-900 dark:text-white hover:bg-slate-100 dark:hover:bg-[#1f2430] text-left cursor-pointer transition-colors"
              >
                <Scale className="w-4 h-4 text-[#e30613] shrink-0" />
                <span>Avaliar Usado</span>
              </button>
            </div>

            {/* Navigation links */}
            <div className="flex flex-col space-y-1 text-sm font-medium">
              <Link
                href="/#estoque"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#151821] hover:text-[#e30613] dark:hover:text-[#e30613] transition-colors whitespace-nowrap font-medium"
              >
                Estoque
              </Link>
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAppraisal?.();
                }}
                className="px-3 py-2.5 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#151821] hover:text-[#e30613] dark:hover:text-[#e30613] transition-colors text-left whitespace-nowrap font-medium cursor-pointer"
              >
                Avaliar Usado
              </button>
              <Link
                href="/#depoimentos"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#151821] hover:text-[#e30613] dark:hover:text-[#e30613] transition-colors whitespace-nowrap font-medium"
              >
                Depoimentos
              </Link>
              <Link
                href="/#sobre"
                onClick={() => setMobileMenuOpen(false)}
                className="px-3 py-2.5 rounded-lg text-slate-800 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-[#151821] hover:text-[#e30613] dark:hover:text-[#e30613] transition-colors whitespace-nowrap font-medium"
              >
                A Loja
              </Link>
            </div>

            {/* Mobile CTA */}
            <div className="pt-2">
              <a
                href={whatsappGeneralLink}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 w-full bg-[#e30613] hover:bg-[#c40510] text-white py-3 rounded-xl font-speed font-bold uppercase tracking-wider text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
                <span>Falar com Consultor</span>
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
