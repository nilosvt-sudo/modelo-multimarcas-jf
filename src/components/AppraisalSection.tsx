"use client";

import React, { useState } from "react";
import { Vehicle } from "@/types";
import { COMMON_BRANDS, generateWhatsAppLink, DEALERSHIP_INFO } from "@/lib/constants";
import {
  Car,
  CheckCircle2,
  Send,
  Sparkles,
  ShieldCheck,
  X,
  BadgeDollarSign,
  TrendingUp,
  Award
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

  const [tradeBrand, setTradeBrand] = useState("Volkswagen");
  const [tradeModel, setTradeModel] = useState("");
  const [tradeYear, setTradeYear] = useState("2021");
  const [tradeMileage, setTradeMileage] = useState("");
  const [tradeTransmission, setTradeTransmission] = useState("Automático");
  const [tradeFuel, setTradeFuel] = useState("Flex");
  const [tradeCondition, setTradeCondition] = useState("Excelente (todas as revisões em dia)");
  const [hasFinancing, setHasFinancing] = useState("Não, quitado");
  const [interestedVehicleId, setInterestedVehicleId] = useState("");
  const [notes, setNotes] = useState("");
  const [consentLGPD, setConsentLGPD] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !consentLGPD) return;

    setSubmitting(true);
    try {
      const interestedVehicle = vehicles.find((v) => v.id === parseInt(interestedVehicleId, 10));

      const payload = {
        customerName,
        customerPhone,
        customerEmail,
        tradeBrand,
        tradeModel: tradeModel || "Modelo a definir",
        tradeYear: parseInt(tradeYear, 10) || 2020,
        tradeMileage: parseInt(tradeMileage.replace(/\D/g, ""), 10) || 50000,
        tradeTransmission,
        tradeFuel,
        tradeColor: "A consultar",
        tradeCondition: `${tradeCondition} | Financiamento: ${hasFinancing}`,
        hasFinancing: hasFinancing.includes("Sim"),
        interestedVehicleId: interestedVehicle ? interestedVehicle.id : null,
        interestedVehicleName: interestedVehicle ? `${interestedVehicle.brand} ${interestedVehicle.model}` : "Venda Direta / Troca sem preferência inicial",
        notes,
      };

      await fetch("/api/appraisals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Erro ao enviar avaliação:", err);
      alert("Ocorreu um erro ao enviar sua proposta. Por favor, envie diretamente pelo WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = `Olá Apex Motors! Gostaria de avaliar meu veículo usado na troca:
- Nome: ${customerName || "Cliente"}
- Telefone: ${customerPhone}
- Meu Carro: ${tradeBrand} ${tradeModel} Ano ${tradeYear} (${tradeTransmission})
- Km aproximada: ${tradeMileage || "A informar"} km
- Condição: ${tradeCondition} (${hasFinancing})
${interestedVehicleId ? `- Tenho interesse no: ${vehicles.find(v => v.id === parseInt(interestedVehicleId, 10))?.brand} ${vehicles.find(v => v.id === parseInt(interestedVehicleId, 10))?.model}` : "- Gostaria de uma avaliação para venda ou troca."}`;

  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  const formContent = (
    <div className="bg-white dark:bg-[#10131a] rounded-3xl border border-slate-200 dark:border-[#232a38] shadow-2xl overflow-hidden">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 p-6 sm:p-8 text-white relative">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-300 mb-2">
            <BadgeDollarSign className="w-3.5 h-3.5" />
            <span>Melhor Avaliação do Mercado</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Avalie seu Usado na Troca
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mt-1.5 leading-relaxed">
            Aceitamos seu carro ou moto como entrada com valorização justa baseada na Tabela FIPE. Receba uma proposta em minutos!
          </p>
        </div>
      </div>

      <div className="p-6 sm:p-8 lg:p-10">
        {submitted ? (
          <div className="text-center py-10 space-y-4">
            <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Avaliação Solicitada com Sucesso!
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
              Nossos avaliadores da Apex Motors estão analisando os dados do seu veículo e retornarão no seu WhatsApp em instantes com a melhor cotação.
            </p>
            <div className="pt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm px-6 py-3.5 rounded-xl shadow-md transition-all"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Acelerar pelo WhatsApp</span>
              </a>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Dados do Cliente */}
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                1. Seus Dados de Contato
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Roberto Almeida"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    WhatsApp com DDD *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="(11) 99999-9999"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    E-mail (opcional)
                  </label>
                  <input
                    type="email"
                    placeholder="roberto@email.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Dados do Carro Usado */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#232a38]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                2. Informações do Seu Carro Atual
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Marca do Veículo
                  </label>
                  <select
                    value={tradeBrand}
                    onChange={(e) => setTradeBrand(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  >
                    {COMMON_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                    <option value="Outra">Outra Marca</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Modelo e Versão *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Polo Highline 1.0 TSI"
                    value={tradeModel}
                    onChange={(e) => setTradeModel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Ano de Fabricação / Modelo
                  </label>
                  <select
                    value={tradeYear}
                    onChange={(e) => setTradeYear(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  >
                    {[2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2011, 2010].map((y) => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Quilometragem (Km)
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: 45.000"
                    value={tradeMileage}
                    onChange={(e) => setTradeMileage(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Câmbio
                  </label>
                  <select
                    value={tradeTransmission}
                    onChange={(e) => setTradeTransmission(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Automático">Automático</option>
                    <option value="Manual">Manual</option>
                    <option value="CVT">CVT</option>
                    <option value="Dupla Embreagem (DSG/PDK)">Dupla Embreagem</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Combustível
                  </label>
                  <select
                    value={tradeFuel}
                    onChange={(e) => setTradeFuel(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Flex">Flex (Gasolina/Etanol)</option>
                    <option value="Gasolina">Gasolina</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Híbrido">Híbrido</option>
                    <option value="Elétrico">100% Elétrico</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Situação de Financiamento
                  </label>
                  <select
                    value={hasFinancing}
                    onChange={(e) => setHasFinancing(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="Não, quitado">Quitado / Sem dívidas</option>
                    <option value="Sim, com parcelas a pagar">Financiado (com saldo devedor)</option>
                    <option value="Consórcio contemplado / em andamento">Consórcio</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Interesse em Carro do Estoque */}
            <div className="pt-4 border-t border-slate-100 dark:border-[#232a38]">
              <h4 className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 mb-3">
                3. Interesse em nosso Estoque (Opcional)
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Qual carro do nosso estoque você deseja adquirir?
                  </label>
                  <select
                    value={interestedVehicleId}
                    onChange={(e) => setInterestedVehicleId(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="">Apenas quero vender meu carro / Não decidi ainda</option>
                    {vehicles.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.brand} {v.model} {v.version} ({v.yearFabrication}/{v.yearModel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Observações / Acessórios / Estado do carro
                  </label>
                  <input
                    type="text"
                    placeholder="Ex: Único dono, com teto solar, manual e chave cópia..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* LGPD Checkbox */}
            <div className="flex items-start gap-2 pt-1">
              <input
                type="checkbox"
                id="lgpd_appraisal"
                required
                checked={consentLGPD}
                onChange={(e) => setConsentLGPD(e.target.checked)}
                className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="lgpd_appraisal" className="text-[11px] text-slate-500 dark:text-slate-400">
                Autorizo a Apex Motors a entrar em contato com a proposta de avaliação do meu automóvel.
              </label>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="submit"
                disabled={submitting || !consentLGPD}
                className="flex-1 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? "Calculando Proposta..." : "Solicitar Avaliação Grátis"}</span>
              </button>

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
              >
                <WhatsAppIcon className="w-4 h-4 fill-white" />
                <span>Avaliar pelo WhatsApp</span>
              </a>
            </div>
          </form>
        )}
      </div>
    </div>
  );

  // If used as modal
  if (isOpen !== undefined) {
    if (!isOpen) return null;

    return (
      <div
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
        onClick={onClose}
      >
        <div
          className="relative w-full max-w-4xl my-auto animate-in fade-in zoom-in-95 duration-200"
          onClick={(e) => e.stopPropagation()}
        >
          {onClose && (
            <button
              type="button"
              onClick={onClose}
              className="absolute top-4 right-4 z-20 p-2 bg-white/80 dark:bg-black/80 rounded-full text-slate-700 dark:text-white hover:bg-white shadow-md cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          )}
          {formContent}
        </div>
      </div>
    );
  }

  // If rendered inline on the page
  return (
    <section id="avaliacao" className="py-12 sm:py-16 bg-slate-100/60 dark:bg-[#0a0c10] transition-colors">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {formContent}
      </div>
    </section>
  );
}
