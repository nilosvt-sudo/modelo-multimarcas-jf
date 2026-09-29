"use client";

import React from "react";
import Link from "next/link";
import { DEALERSHIP_INFO, generateWhatsAppLink } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, ShieldCheck, UserCheck, Car, KeyRound } from "lucide-react";
import { WhatsAppIcon, InstagramIcon } from "@/components/SocialIcons";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#08090d] text-zinc-400 text-xs border-t border-slate-800">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About & Logo */}
          <div className="space-y-4">
            <BrandLogo variant="footer" />

            <p className="text-zinc-400 leading-relaxed text-xs">
              Concessionária de seminovos selecionados e veículos premium no Brooklin, São Paulo. Compra, venda, troca com troco e financiamento com as menores taxas do mercado.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={DEALERSHIP_INFO.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-[#16181D] border border-zinc-800 text-zinc-300 hover:text-blue-400 hover:bg-zinc-800 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={generateWhatsAppLink("Olá! Gostaria de falar com o atendimento da Apex Motors.")}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Categorias no Estoque
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#estoque" className="text-zinc-400 hover:text-blue-400 transition-colors">
                  SUVs & Crossovers
                </a>
              </li>
              <li>
                <a href="#estoque" className="text-zinc-400 hover:text-blue-400 transition-colors">
                  Sedans Executivos & Médios
                </a>
              </li>
              <li>
                <a href="#estoque" className="text-zinc-400 hover:text-blue-400 transition-colors">
                  Hatches Compactos & Esportivos
                </a>
              </li>
              <li>
                <a href="#estoque" className="text-zinc-400 hover:text-blue-400 transition-colors">
                  Pickups 4x4 & Utilitários
                </a>
              </li>
              <li>
                <a href="#financiamento" className="text-zinc-400 hover:text-blue-400 transition-colors">
                  Simulador de Financiamento
                </a>
              </li>
              <li>
                <a href="#avaliacao" className="text-zinc-400 hover:text-blue-400 transition-colors">
                  Avaliação do seu Carro Usado
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Showroom & Atendimento
            </h4>
            <div className="space-y-2.5 text-zinc-400 text-xs">
              <p className="flex items-start gap-2 leading-relaxed">
                <MapPin className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                <span>{DEALERSHIP_INFO.address.street}, {DEALERSHIP_INFO.address.number} - {DEALERSHIP_INFO.address.neighborhood}, São Paulo - SP</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{DEALERSHIP_INFO.phoneWhatsapp} (WhatsApp Vendas)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{DEALERSHIP_INFO.email}</span>
              </p>
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-500 shrink-0" />
                <span>{DEALERSHIP_INFO.hours.weekdays}</span>
              </p>
            </div>
          </div>

          {/* Col 4: Quality & Trust Notice */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">
              Garantia & Procedência
            </h4>
            <div className="p-3.5 rounded-2xl bg-[#12141a] border border-zinc-800 space-y-2">
              <p className="text-[11px] text-zinc-300 font-bold flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Laudo Cautelar 100% Aprovado</span>
              </p>
              <p className="text-[10px] text-zinc-400">
                Garantia de 1 ano para motor e câmbio em todos os seminovos elegíveis.
              </p>
              <p className="text-[10px] text-zinc-500 leading-relaxed pt-1 border-t border-zinc-800">
                CNPJ: {DEALERSHIP_INFO.cnpj} • Todos os veículos inspecionados e periciados conforme a legislação de defesa do consumidor.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom copyright & admin access */}
        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <div>
            © {currentYear} {DEALERSHIP_INFO.name}. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/admin"
              className="text-zinc-600 hover:text-blue-400 transition-colors flex items-center gap-1.5"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Painel Administrativo / Gestão</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
