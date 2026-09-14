"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types";
import { COMMON_BRANDS, TRANSMISSION_TYPES, generateWhatsAppLink } from "@/lib/constants";
import {
  Scale,
  CarFront,
  CheckCircle2,
  Send,
  Sparkles,
  TrendingUp,
  X,
  BadgeDollarSign
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface AppraisalSectionProps {
  vehicles: Vehicle[];
  isOpen?: boolean;
  onClose?: () => void;
}

export default function AppraisalSection({
  vehicles,
  isOpen,
  onClose,
}: AppraisalSectionProps) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");

  const [tradeBrand, setTradeBrand] = useState("");
  const [tradeModel, setTradeModel] = useState("");
  const [tradeYear, setTradeYear] = useState("2019");
  const [tradeMileage, setTradeMileage] = useState("60000");
  const [tradeTransmission, setTradeTransmission] = useState("Manual");
  const [tradeCondition, setTradeCondition] = useState("Excelente");
  const [hasFinancing, setHasFinancing] = useState(false);
  const [interestedVehicleId, setInterestedVehicleId] = useState("");
  const [notes, setNotes] = useState("");
  const [consentLGPD, setConsentLGPD] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !tradeBrand || !tradeModel || !consentLGPD) return;

    setSubmitting(true);
    try {
      const interestedCar = vehicles.find((v) => v.id === parseInt(interestedVehicleId, 10));

      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        tradeBrand,
        tradeModel,
        tradeYear: parseInt(tradeYear, 10),
        tradeMileage: parseInt(tradeMileage, 10),
        tradeTransmission,
        tradeFuel: "Flex",
        tradeColor: "",
        tradeCondition,
        hasFinancing,
        interestedVehicleId: interestedCar ? interestedCar.id : null,
        interestedVehicleName: interestedCar ? `${interestedCar.brand} ${interestedCar.model} (${interestedCar.yearFabrication})` : "Venda Direta",
        notes,
      };

      await fetch("/api/appraisals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Error submitting appraisal:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = `Olá! Gostaria de uma avaliação do meu carro na Modelo Multimarcas JF.
Dados do meu veículo:
- Marca/Modelo: ${tradeBrand} ${tradeModel}
- Ano: ${tradeYear}
- Km: ${tradeMileage} km
- Câmbio: ${tradeTransmission}
- Condição: ${tradeCondition}
- Financiamento ativo: ${hasFinancing ? "Sim" : "Quitado"}
${interestedVehicleId ? `- Interesse no carro do estoque: ${vehicles.find(v => v.id === parseInt(interestedVehicleId, 10))?.brand} ${vehicles.find(v => v.id === parseInt(interestedVehicleId, 10))?.model}` : "- Interesse em venda direta"}
- Nome: ${customerName || "Cliente"}
- Telefone: ${customerPhone}`;

  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  const content = (
    <div className="bg-white dark:bg-[#0e1118] rounded-3xl p-6 sm:p-8 md:p-10 border border-slate-200 dark:border-zinc-800 shadow-xl text-slate-900 dark:text-zinc-100 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 border-b border-slate-100 dark:border-zinc-800 pb-5">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-speed font-bold uppercase tracking-widest mb-1">
            <span className="w-2 h-2 rounded-full bg-[#0047cc]"></span>
            <span className="text-[#0047cc] dark:text-[#3b82f6]">TROCA INTELIGENTE</span>
            <span className="text-slate-400">•</span>
            <span className="text-[#e0121d] dark:text-[#ff3844]">VENDA DIRETA</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic font-speed">
            Avaliação do seu Veículo Usado
          </h2>
          <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
            Receba uma proposta justa e transparente com pagamento à vista ou utilize seu carro como entrada com opção de troco.
          </p>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-700 flex items-center justify-center transition-colors cursor-pointer shrink-0"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {submitted ? (
        <div className="text-center py-12 max-w-lg mx-auto space-y-4">
          <div className="w-16 h-16 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-speed uppercase">Avaliação Solicitada com Sucesso!</h3>
          <p className="text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Nossos avaliadores da Modelo Multimarcas JF vão analisar os dados do seu {tradeBrand} {tradeModel} e te enviar a proposta pelo WhatsApp em até 1 hora.
          </p>
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-2 w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 px-4 rounded-xl text-sm transition-all shadow-md"
          >
            <WhatsAppIcon className="w-5 h-5 fill-white" />
            Enviar Fotos do Carro pelo WhatsApp
          </a>
          <button
            onClick={() => setSubmitted(false)}
            className="text-xs text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200 hover:underline block mx-auto cursor-pointer pt-2"
          >
            Avaliar outro veículo
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Step 1: Vehicle specs */}
            <div className="space-y-4 bg-slate-50 dark:bg-[#12151e] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800">
              <div className="flex items-center gap-2 font-speed font-bold text-slate-900 dark:text-zinc-100 text-sm uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-zinc-800">
                <CarFront className="w-4 h-4 text-[#0047cc] dark:text-[#3b82f6]" />
                <span>1. Dados do seu Carro Atual</span>
              </div>

              {/* Marca & Modelo: Coluna única no mobile, 2 colunas a partir de md */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    Marca *
                  </label>
                  <select
                    required
                    value={tradeBrand}
                    onChange={(e) => setTradeBrand(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">Selecione</option>
                    {COMMON_BRANDS.map((b) => (
                      <option key={b} value={b} className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">
                        {b}
                      </option>
                    ))}
                    <option value="Outra" className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">Outra marca</option>
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    Modelo e Versão *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Fox 1.6 Connect"
                    value={tradeModel}
                    onChange={(e) => setTradeModel(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                  />
                </div>
              </div>

              {/* Ano, KM e Câmbio: 2 colunas no mobile (Câmbio ocupa a linha inteira abaixo) e 3 colunas em sm/desktop */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3.5">
                <div className="min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    Ano *
                  </label>
                  <input
                    type="number"
                    required
                    min={2000}
                    max={2026}
                    value={tradeYear}
                    onChange={(e) => setTradeYear(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                  />
                </div>

                <div className="min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    KM Rodados *
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 55000"
                    value={tradeMileage}
                    onChange={(e) => setTradeMileage(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                  />
                </div>

                <div className="col-span-2 sm:col-span-1 min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    Câmbio
                  </label>
                  <select
                    value={tradeTransmission}
                    onChange={(e) => setTradeTransmission(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors cursor-pointer"
                  >
                    {TRANSMISSION_TYPES.map((t) => (
                      <option key={t} value={t} className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Estado Geral e Financiamento: Linhas separadas no mobile (grid-cols-1) e 2 colunas a partir de md */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                <div className="min-w-0 w-full">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    Estado Geral
                  </label>
                  <select
                    value={tradeCondition}
                    onChange={(e) => setTradeCondition(e.target.value)}
                    className="w-full max-w-full box-border h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors cursor-pointer"
                  >
                    <option value="Excelente" className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">Excelente (Sem detalhes)</option>
                    <option value="Bom" className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">Bom (Pequenos desgastes)</option>
                    <option value="Regular" className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">Regular</option>
                    <option value="Avariado" className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">Com detalhes a fazer</option>
                  </select>
                </div>

                <div className="min-w-0 w-full">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    Financiamento Ativo?
                  </label>
                  <div className="w-full max-w-full box-border flex gap-2 h-11">
                    <button
                      type="button"
                      onClick={() => setHasFinancing(false)}
                      className={`flex-1 h-full flex items-center justify-center rounded-lg text-xs font-bold border transition-all cursor-pointer font-speed tracking-wider box-border ${
                        !hasFinancing
                          ? "bg-[#0047cc] border-[#0047cc] text-white shadow-sm"
                          : "bg-white dark:bg-[#181d29] border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      Quitado
                    </button>
                    <button
                      type="button"
                      onClick={() => setHasFinancing(true)}
                      className={`flex-1 h-full flex items-center justify-center rounded-lg text-xs font-bold border transition-all cursor-pointer font-speed tracking-wider box-border ${
                        hasFinancing
                          ? "bg-[#0047cc] border-[#0047cc] text-white shadow-sm"
                          : "bg-white dark:bg-[#181d29] border-slate-300 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-zinc-800"
                      }`}
                    >
                      Financiado
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Customer Contact & Trade-in target */}
            <div className="space-y-4 bg-slate-50 dark:bg-[#12151e] p-5 sm:p-6 rounded-2xl border border-slate-200/80 dark:border-zinc-800 flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-2 font-speed font-bold text-slate-900 dark:text-zinc-100 text-sm uppercase tracking-wider pb-2 border-b border-slate-200 dark:border-zinc-800">
                  <BadgeDollarSign className="w-4 h-4 text-[#e0121d] dark:text-[#ff3844]" />
                  <span>2. Seus Dados e Interesse</span>
                </div>

                <div className="min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    Seu Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Carlos Eduardo"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div className="min-w-0">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                      WhatsApp *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="(32) 99999-9999"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      className="w-full h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                    />
                  </div>

                  <div className="min-w-0">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                      E-mail (Opcional)
                    </label>
                    <input
                      type="email"
                      placeholder="email@exemplo.com"
                      value={customerEmail}
                      onChange={(e) => setCustomerEmail(e.target.value)}
                      className="w-full h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors"
                    />
                  </div>
                </div>

                <div className="min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    Deseja trocar por qual carro do nosso estoque?
                  </label>
                  <select
                    value={interestedVehicleId}
                    onChange={(e) => setInterestedVehicleId(e.target.value)}
                    className="w-full h-11 px-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors cursor-pointer"
                  >
                    <option value="" className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">Apenas quero vender meu carro (Sem troca)</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id} className="bg-white dark:bg-[#181d29] text-slate-900 dark:text-white">
                        {v.brand} {v.model} {v.version} ({v.yearFabrication})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="min-w-0">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-zinc-300 mb-1.5 block font-speed">
                    Observações adicionais (opcionais)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Ex: Pneus novos, revisões na concessionária, manual e chave reserva..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full p-3 text-sm rounded-lg border border-slate-300 dark:border-zinc-700 bg-white dark:bg-[#181d29] text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 focus:outline-none focus:border-[#0047cc] focus:ring-1 focus:ring-[#0047cc] transition-colors resize-none"
                  />
                </div>
              </div>

              {/* LGPD Consent Checkbox */}
              <div className="flex items-start gap-2.5 pt-1">
                <input
                  id={`consent-appraisal-lgpd-${isOpen !== undefined ? 'modal' : 'section'}`}
                  type="checkbox"
                  required
                  checked={consentLGPD}
                  onChange={(e) => setConsentLGPD(e.target.checked)}
                  className="mt-0.5 w-4 h-4 rounded bg-white dark:bg-[#181d29] border-slate-300 dark:border-zinc-700 text-[#0047cc] focus:ring-[#0047cc] cursor-pointer shrink-0"
                />
                <label htmlFor={`consent-appraisal-lgpd-${isOpen !== undefined ? 'modal' : 'section'}`} className="text-[11px] text-slate-500 dark:text-zinc-400 cursor-pointer select-none leading-relaxed">
                  Concordo com o tratamento dos meus dados e do veículo para avaliação e contato comercial pela Modelo Multimarcas JF, nos termos da Lei Geral de Proteção de Dados (LGPD).
                </label>
              </div>

              <div className="pt-2 space-y-2">
                <button
                  type="submit"
                  disabled={submitting || !consentLGPD}
                  className="w-full bg-gradient-to-r from-[#e0121d] via-[#cc0c16] to-[#b00a13] hover:from-[#c40510] hover:to-[#960007] disabled:opacity-50 text-white font-speed font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Enviando Dados..." : "Solicitar Avaliação"}
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  Chamar Direto no WhatsApp para Avaliar
                </a>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );

  if (isOpen !== undefined) {
    if (!isOpen) return null;
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6">
        <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={onClose} />
        <div className="relative max-w-4xl w-full max-h-[92vh] overflow-y-auto z-10">
          {content}
        </div>
      </div>
    );
  }

  return (
    <section id="avaliar" className="py-16 sm:py-20 bg-white dark:bg-[#06070a] text-slate-900 dark:text-zinc-100 scroll-mt-20 border-b border-slate-200 dark:border-zinc-800/80 transition-colors">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">{content}</div>
    </section>
  );
}
