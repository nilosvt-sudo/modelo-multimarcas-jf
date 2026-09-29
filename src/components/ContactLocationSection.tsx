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
  Building2,
  Sparkles,
  Car
} from "lucide-react";
import { WhatsAppIcon, InstagramIcon } from "@/components/SocialIcons";

export default function ContactLocationSection() {
  const googleMapsDirectionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    `${DEALERSHIP_INFO.address.street}, ${DEALERSHIP_INFO.address.number}, ${DEALERSHIP_INFO.address.neighborhood}, ${DEALERSHIP_INFO.address.city} - ${DEALERSHIP_INFO.address.state}`
  )}`;

  return (
    <section id="contato" className="py-12 sm:py-16 lg:py-20 bg-slate-100/60 dark:bg-[#07090e] text-slate-900 dark:text-zinc-100 scroll-mt-20 border-t border-slate-200 dark:border-zinc-800/80 transition-colors w-full max-w-full overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 w-full max-w-full">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-1.5">
            <Car className="w-4 h-4" />
            <span>SHOWROOM & LOCALIZAÇÃO</span>
          </div>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 dark:text-white tracking-tight">
            Venha Conhecer Nosso Showroom no Brooklin
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed max-w-xl mx-auto">
            Espaço climatizado com mais de 80 veículos em exposição, cafeteria premium e estacionamento gratuito com manobrista para sua comodidade.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch w-full max-w-full">
          {/* Contact Details Card (5 cols) */}
          <div className="lg:col-span-5 bg-white dark:bg-[#10131a] rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-zinc-800 shadow-xl flex flex-col justify-between space-y-6 text-slate-900 dark:text-zinc-100 transition-colors">
            <div className="space-y-5">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0 border border-blue-200 dark:border-blue-800/40">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Endereço da Loja</h4>
                  <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed mt-0.5">
                    {DEALERSHIP_INFO.address.street}, {DEALERSHIP_INFO.address.number}<br />
                    Bairro {DEALERSHIP_INFO.address.neighborhood} • {DEALERSHIP_INFO.address.city} - {DEALERSHIP_INFO.address.state}<br />
                    CEP: {DEALERSHIP_INFO.address.zip} (Com Estacionamento Próprio)
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Horário de Funcionamento</h4>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-0.5 mt-0.5">
                    <p><strong className="text-slate-900 dark:text-zinc-200">{DEALERSHIP_INFO.hours.weekdays}</strong></p>
                    <p><strong className="text-slate-900 dark:text-zinc-200">{DEALERSHIP_INFO.hours.saturday}</strong></p>
                    <p className="text-slate-500 dark:text-zinc-500">{DEALERSHIP_INFO.hours.sunday}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-2xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm uppercase tracking-wider">Canais de Atendimento</h4>
                  <div className="text-xs text-slate-600 dark:text-zinc-400 space-y-1 mt-0.5">
                    <p>
                      WhatsApp Vendas:{" "}
                      <a
                        href={generateWhatsAppLink("Olá! Gostaria de falar com um consultor da Apex Motors.")}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-bold text-emerald-600 dark:text-emerald-400 hover:underline inline-flex items-center gap-1"
                      >
                        {DEALERSHIP_INFO.phoneWhatsapp}
                      </a>
                    </p>
                    <p>
                      Telefone Fixo:{" "}
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
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {DEALERSHIP_INFO.email}
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="pt-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-3">
              <a
                href={generateWhatsAppLink("Olá! Gostaria de agendar uma visita ao showroom da Apex Motors.")}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Falar com Vendedor</span>
              </a>

              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-zinc-700 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-800 dark:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Navigation className="w-4 h-4 text-blue-600" />
                <span>Como Chegar (GPS)</span>
              </a>
            </div>
          </div>

          {/* Interactive Map Visual (7 cols) */}
          <div className="lg:col-span-7 bg-white dark:bg-[#10131a] rounded-3xl overflow-hidden border border-slate-200 dark:border-zinc-800 shadow-xl relative flex flex-col min-h-[360px]">
            <div className="relative w-full h-full min-h-[360px] bg-slate-100 dark:bg-[#151821]">
              <iframe
                title="Localização Apex Motors"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3655.8569838048253!2d-46.702587!3d-23.609462!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce50cd12c33257%3A0x6b432a5270c5eb99!2sAv.%20das%20Na%C3%A7%C3%B5es%20Unidas%2C%2014261%20-%20Brooklin%2C%20S%C3%A3o%20Paulo%20-%20SP!5e0!3m2!1spt-BR!2sbr!4v1700000000000!5m2!1spt-BR!2sbr"
                width="100%"
                height="100%"
                style={{ border: 0, minHeight: "360px" }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full min-h-[360px] filter saturate-90 contrast-105"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
