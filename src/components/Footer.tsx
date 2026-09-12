"use client";

import React from "react";
import Link from "next/link";
import { DEALERSHIP_INFO, generateWhatsAppLink } from "@/lib/constants";
import { MapPin, Phone, Mail, Clock, ShieldCheck, UserCheck } from "lucide-react";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "@/components/SocialIcons";
import BrandLogo from "@/components/BrandLogo";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#090A0C] text-zinc-400 text-xs border-t border-zinc-800">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Col 1: About & Logo */}
          <div className="space-y-4">
            <BrandLogo variant="footer" />

            <p className="text-zinc-400 leading-relaxed text-xs">
              Seminovos rigorosamente selecionados com laudo cautelar aprovado, procedência garantida e as melhores condições de financiamento em Juiz de Fora.
            </p>

            <div className="flex items-center gap-3 pt-1">
              <a
                href={DEALERSHIP_INFO.instagram}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#16181D] border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={DEALERSHIP_INFO.facebook}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-[#16181D] border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <FacebookIcon className="w-3.5 h-3.5" />
              </a>
              <a
                href={generateWhatsAppLink("Olá! Gostaria de falar com a loja.")}
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white flex items-center justify-center transition-colors shadow-sm"
                aria-label="WhatsApp"
              >
                <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-[#9CA3AF] font-bold text-xs uppercase tracking-wider font-speed">
              Navegação
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/#estoque" className="text-zinc-400 hover:text-white transition-colors">
                  Estoque de Seminovos
                </Link>
              </li>
              <li>
                <Link href="/#avaliar" className="text-zinc-400 hover:text-white transition-colors">
                  Avaliação do seu Carro
                </Link>
              </li>
              <li>
                <Link href="/#depoimentos" className="text-zinc-400 hover:text-white transition-colors">
                  Depoimentos de Clientes JF
                </Link>
              </li>
              <li>
                <Link href="/#sobre" className="text-zinc-400 hover:text-white transition-colors">
                  Sobre a Concessionária
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Contact */}
          <div className="space-y-3">
            <h4 className="text-[#9CA3AF] font-bold text-xs uppercase tracking-wider font-speed">
              Showroom & Atendimento
            </h4>
            <div className="space-y-2.5 text-zinc-400 text-xs">
              <p className="flex items-start gap-2 leading-relaxed">
                <MapPin className="w-4 h-4 text-[#e30613] shrink-0 mt-0.5" />
                <span>{DEALERSHIP_INFO.address}, Juiz de Fora - MG</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#e30613] shrink-0" />
                <span>{DEALERSHIP_INFO.phone} (WhatsApp & Atendimento)</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#e30613] shrink-0" />
                <span>{DEALERSHIP_INFO.email}</span>
              </p>
              <p className="flex items-start gap-2 pt-1 leading-relaxed">
                <Clock className="w-4 h-4 text-[#e30613] shrink-0 mt-0.5" />
                <span>
                  Seg a Sex: 08:30 às 18:30<br />
                  Sábado: 08:30 às 13:00
                </span>
              </p>
            </div>
          </div>

          {/* Col 4: Guarantees & Safe Buying */}
          <div className="space-y-3">
            <h4 className="text-[#9CA3AF] font-bold text-xs uppercase tracking-wider font-speed">
              Procedência & Garantia
            </h4>
            <div className="bg-[#111317] border border-zinc-800 p-4 rounded-xl space-y-2 text-zinc-300">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs">
                <ShieldCheck className="w-4 h-4" />
                <span>100% dos Veículos Periciados</span>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Todos os veículos contam com laudo cautelar aprovado e garantia de 1 ano para motor e câmbio.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-zinc-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-zinc-500 text-[11px]">
          <p>© {currentYear} {DEALERSHIP_INFO.name} &bull; Juiz de Fora / MG &bull; Todos os direitos reservados.</p>
          <p className="text-zinc-500">Av. Barão do Rio Branco, 4200 • Passos • Juiz de Fora/MG</p>
        </div>
      </div>
    </footer>
  );
}
