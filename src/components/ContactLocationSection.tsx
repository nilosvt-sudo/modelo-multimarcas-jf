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
    <section id="contato" className="py-16 sm:py-20 bg-[#F8FAFC] text-slate-900 scroll-mt-20 border-t border-slate-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-speed font-bold uppercase tracking-widest text-[#e30613] mb-1">
            <span>{"// VENHA TOMAR UM CAFÉ CONOSCO"}</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight uppercase italic font-speed">
            Showroom em Juiz de Fora
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Localização de fácil acesso na Av. Barão do Rio Branco, com estacionamento privativo para você conhecer nosso estoque com tranquilidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xl flex flex-col justify-between space-y-6 text-slate-900">
            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-[#e30613]/10 text-[#e30613] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-speed font-bold text-slate-900 text-sm uppercase tracking-wider">Endereço</h4>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    {DEALERSHIP_INFO.address}<br />
                    Bairro {DEALERSHIP_INFO.neighborhood} • {DEALERSHIP_INFO.city} - {DEALERSHIP_INFO.state}<br />
                    CEP: {DEALERSHIP_INFO.cep}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-speed font-bold text-slate-900 text-sm uppercase tracking-wider">Horário de Funcionamento</h4>
                  <div className="text-xs text-slate-600 space-y-0.5 mt-0.5">
                    <p><strong className="text-slate-900">{DEALERSHIP_INFO.workingHoursWeek}</strong></p>
                    <p><strong className="text-slate-900">{DEALERSHIP_INFO.workingHoursSaturday}</strong></p>
                    <p className="text-slate-500">{DEALERSHIP_INFO.workingHoursSunday}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-[#e30613]" />
                </div>
                <div>
                  <h4 className="font-speed font-bold text-slate-900 text-sm uppercase tracking-wider">Telefones & Contato</h4>
                  <div className="text-xs text-slate-600 space-y-1 mt-0.5">
                    <p>
                      WhatsApp:{" "}
                      <a
                        href={generateWhatsAppLink("Olá! Gostaria de falar com um consultor.")}
                        target="_blank"
                        rel="noreferrer"
                        className="font-bold text-emerald-600 hover:underline"
                      >
                        {DEALERSHIP_INFO.phone}
                      </a>
                    </p>
                    <p>Fixo Loja: <span className="font-semibold text-slate-900">{DEALERSHIP_INFO.phoneLandline}</span></p>
                    <p>E-mail: <span className="text-slate-700">{DEALERSHIP_INFO.email}</span></p>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col gap-2.5">
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-slate-100 hover:bg-[#e30613] text-slate-800 hover:text-white font-speed font-bold uppercase tracking-wider py-3 px-4 rounded-xl text-xs sm:text-sm transition-all border border-slate-200 flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Navigation className="w-4 h-4 text-[#e30613]" />
                Como Chegar no GPS (Google Maps / Waze)
              </a>

              <a
                href={generateWhatsAppLink("Olá! Gostaria de falar com um vendedor agora.")}
                target="_blank"
                rel="noreferrer"
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                Falar com Vendedor no WhatsApp
              </a>
            </div>
          </div>

          {/* Interactive Map Visual (7 cols) - Dark Modern Black / Deep Graphite Theme */}
          <div className="lg:col-span-7 bg-[#111317] rounded-3xl overflow-hidden shadow-xl relative min-h-[380px] flex flex-col justify-between p-6 sm:p-8 text-white border border-zinc-800">
            {/* Styled Map Background Grid */}
            <div className="absolute inset-0 bg-[radial-gradient(#e30613_1px,transparent_1px)] [background-size:16px_16px] opacity-15" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#090A0C] via-[#111317]/90 to-[#16181D]/75" />

            <div className="relative z-10 flex items-center justify-between">
              <div className="inline-flex items-center gap-2 bg-[#16181D]/90 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-zinc-700/70 text-xs font-semibold text-zinc-200">
                <Building2 className="w-4 h-4 text-[#e30613]" />
                Juiz de Fora • Zona da Mata MG
              </div>
              <span className="text-xs bg-emerald-500/20 text-emerald-400 font-bold px-3 py-1 rounded-full border border-emerald-500/30">
                Estacionamento Próprio
              </span>
            </div>

            <div className="relative z-10 max-w-md space-y-3 my-auto py-8 text-center sm:text-left">
              <div className="w-14 h-14 rounded-2xl bg-[#e30613] text-white flex items-center justify-center shadow-lg shadow-red-600/30 mx-auto sm:mx-0">
                <MapPin className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-black text-white font-speed uppercase italic tracking-wide">
                Modelo Multimarcas JF
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
                  rel="noreferrer"
                  className="p-2 bg-[#1E2229] hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/60 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                >
                  <InstagramIcon className="w-4 h-4" />
                  <span>Instagram</span>
                </a>
                <a
                  href={DEALERSHIP_INFO.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="p-2 bg-[#1E2229] hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-700/60 rounded-lg transition-colors flex items-center gap-1.5 text-xs"
                >
                  <FacebookIcon className="w-4 h-4" />
                  <span>Facebook</span>
                </a>
              </div>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noreferrer"
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
