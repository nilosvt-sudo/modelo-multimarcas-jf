"use client";

import React from "react";
import { DEALERSHIP_INFO, generateWhatsAppLink } from "@/lib/constants";
import {
  MapPin,
  Phone,
  Clock,
  Navigation,
  Mail,
  ShieldCheck,
  Building2
} from "lucide-react";
import { WhatsAppIcon, InstagramIcon, FacebookIcon } from "@/components/SocialIcons";

export default function ContactLocationSection() {
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    "Modelo Multimarcas JF, Av. Barão do Rio Branco, 4200, Juiz de Fora - MG"
  )}`;

  return (
    <section id="contato" className="py-10 sm:py-16 lg:py-20 bg-[#F8FAFC] dark:bg-[#07090e] text-slate-900 dark:text-zinc-100 scroll-mt-20 border-t border-slate-200 dark:border-zinc-800/80 transition-colors w-full max-w-full overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 w-full max-w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-speed font-bold uppercase tracking-widest mb-1.5">
            <span className="w-2 h-2 rounded-full bg-[#0047cc]"></span>
            <span className="text-[#0047cc] dark:text-[#3b82f6]">VENHA TOMAR UM CAFÉ</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#e0121d] dark:text-[#ff3844]">SHOWROOM JF</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic font-speed">
            Showroom em Juiz de Fora
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed max-w-xl mx-auto">
            Localização de fácil acesso na Av. Barão do Rio Branco, com estacionamento privativo para você conhecer nosso estoque com tranquilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-full">
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#0e1118] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-xl flex flex-col justify-between space-y-6 text-slate-900 dark:text-zinc-100 transition-colors">
            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#0047cc]/10 text-[#0047cc] dark:bg-[#0047cc]/20 dark:text-[#3b82f6] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-speed font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Endereço</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mt-0.5">
                    {DEALERSHIP_INFO.address}<br />
                    Bairro {DEALERSHIP_INFO.neighborhood} • {DEALERSHIP_INFO.city} - {DEALERSHIP_INFO.state}<br />
                    CEP: {DEALERSHIP_INFO.cep}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-speed font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Horário de Funcionamento</h4>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-0.5 mt-0.5">
                    <p><strong className="text-slate-900 dark:text-zinc-200">{DEALERSHIP_INFO.workingHoursWeek}</strong></p>
                    <p><strong className="text-slate-900 dark:text-zinc-200">{DEALERSHIP_INFO.workingHoursSaturday}</strong></p>
                    <p className="text-slate-500 dark:text-zinc-500">{DEALERSHIP_INFO.workingHoursSunday}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#0047cc] dark:text-[#3b82f6]" />
                </div>
                <div>
                  <h4 className="font-speed font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Telefones e Contato</h4>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-1 mt-0.5">
                    <p>
                      WhatsApp:{" "}
                      <a
                        href={generateWhatsAppLink("Olá! Gostaria de falar com um consultor da Modelo Multimarcas JF.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        {DEALERSHIP_INFO.phone}
                      </a>
                    </p>
                    <p>
                      Fixo Loja:{" "}
                      <a
                        href={`tel:${DEALERSHIP_INFO.phoneLandline.replace(/\D/g, "")}`}
                        className="font-semibold text-slate-900 dark:text-zinc-200 hover:underline"
                      >
                        {DEALERSHIP_INFO.phoneLandline}
                      </a>
                    </p>
                    <p>
                      E-mail:{" "}
                      <a
                        href={`mailto:${DEALERSHIP_INFO.email}`}
                        className="text-slate-700 dark:text-zinc-300 hover:underline"
                      >
                        {DEALERSHIP_INFO.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col gap-3">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-slate-100 dark:bg-zinc-800 hover:bg-[#0047cc] dark:hover:bg-[#0047cc] text-slate-800 dark:text-zinc-200 hover:text-white dark:hover:text-white font-speed font-bold uppercase tracking-wider py-3 px-4 rounded-xl text-xs sm:text-sm transition-all border border-slate-200 dark:border-zinc-700 flex items-center justify-center gap-2 cursor-pointer shadow-sm group"
              >
                <Navigation className="w-4 h-4 text-[#0047cc] group-hover:text-white transition-colors" />
                Como Chegar no GPS (Google Maps / Waze)
              </a>

              {/* Link de texto estilizado para WhatsApp, sem redundância com o botão flutuante */}
              <div className="text-center pt-1">
                <a
                  href={generateWhatsAppLink("Olá! Gostaria de falar com um vendedor agora.")}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold transition-colors hover:underline"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-current" />
                  <span>Dúvidas rápidas? Fale com a equipe no WhatsApp →</span>
                </a>
              </div>
            </div>
          </div>

          {/* Interactive Map Visual (7 cols) - Dark Modern Black / Deep Graphite Theme */}
          <div className="lg:col-span-7 bg-[#111317] rounded-3xl overflow-hidden shadow-xl relative min-h-[380px] flex flex-col justify-between p-6 sm:p-8 text-white border border-zinc-800">
            {/* Styled Map Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#0047cc_1px,transparent_1px)] [background-size:16px_16px] opacity-20" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#111317]/90 to-[#16181D]/75" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 bg-[#16181D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-700/70 text-xs font-semibold text-zinc-200">
                <Building2 className="w-4 h-4 text-[#0047cc]" />
                Juiz de Fora • Zona da Mata MG
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                Estacionamento Próprio
              </span>
            </div>

            <div className="relative z-10 max-w-md space-y-3 my-auto py-8 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#0047cc] text-white flex items-center justify-center shadow-lg shadow-blue-600/30 mx-auto sm:mx-0">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white font-speed uppercase italic tracking-wide">
                <span className="text-[#3b82f6]">MODELO</span> <span className="text-[#ff3844]">MULTIMARCAS</span> JF
              </h3>
              <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed">
                Av. Barão do Rio Branco, 4200 - Passos / Bom Pastor, Juiz de Fora - MG.
                Próximo ao trevo do Cascatinha e fácil acesso a todas as regiões da cidade.
              </p>
            </div>

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-zinc-800">
              <div className="flex items-center gap-3">
                <a
                  href={DEALERSHIP_INFO.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#1E2229] hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/60 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
                <a
                  href={DEALERSHIP_INFO.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 bg-[#1E2229] hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/60 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
              </div>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1.5 transition-colors"
              >
                Abrir Rota no Mapa →
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
