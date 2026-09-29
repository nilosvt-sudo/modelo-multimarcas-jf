"use client";

import React, { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import { generateWhatsAppLink, DEALERSHIP_INFO } from "@/lib/constants";
import {
  Car,
  Calendar,
  Clock,
  CheckCircle2,
  X,
  Send,
  Building2,
  Home,
  ShieldCheck,
  KeyRound
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface TestDriveModalProps {
  vehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
  selectedVehicle?: Vehicle | null;
}

export default function TestDriveModal({
  vehicles,
  isOpen,
  onClose,
  selectedVehicle = null,
}: TestDriveModalProps) {
  const [vehicleId, setVehicleId] = useState<string>(
    selectedVehicle ? String(selectedVehicle.id) : ""
  );
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [cnhNumber, setCnhNumber] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("14:00");
  const [locationPreference, setLocationPreference] = useState<"dealership" | "home_delivery">("dealership");
  const [notes, setNotes] = useState("");
  const [consentLGPD, setConsentLGPD] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (selectedVehicle) {
      setVehicleId(String(selectedVehicle.id));
    }
  }, [selectedVehicle]);

  // Set default min date to tomorrow
  const getTomorrowDateString = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  };

  if (!isOpen) return null;

  const currentVehicleObj = vehicles.find((v) => v.id === parseInt(vehicleId, 10)) || selectedVehicle;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerPhone || !preferredDate || !preferredTime || !consentLGPD) return;

    setSubmitting(true);
    try {
      const payload = {
        vehicleId: currentVehicleObj ? currentVehicleObj.id : null,
        vehicleName: currentVehicleObj
          ? `${currentVehicleObj.brand} ${currentVehicleObj.model} ${currentVehicleObj.version}`
          : "Test Drive Multimarcas Geral",
        customerName,
        customerPhone,
        customerEmail,
        preferredDate,
        preferredTime,
        locationPreference,
        notes: `Modalidade: ${locationPreference === "dealership" ? "No Showroom Apex (Brooklin - SP)" : "Test Drive Delivery"} | CNH informada: ${cnhNumber || "Não"} | Obs: ${notes}`,
      };

      await fetch("/api/test-drives", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      setSubmitted(true);
    } catch (err) {
      console.error("Erro ao agendar test drive:", err);
      alert("Ocorreu um erro ao agendar seu test drive. Por favor, envie diretamente pelo WhatsApp.");
    } finally {
      setSubmitting(false);
    }
  };

  const whatsappMessage = `Olá! Gostaria de agendar um Test Drive na Apex Motors:
- Nome: ${customerName || "Cliente"}
- WhatsApp: ${customerPhone}
- Veículo Escolhido: ${currentVehicleObj ? `${currentVehicleObj.brand} ${currentVehicleObj.model}` : "Sem preferência ainda"}
- Data: ${preferredDate} às ${preferredTime}
- Local: ${locationPreference === "dealership" ? "Showroom Apex Motors (Av. das Nações Unidas, SP)" : "Test Drive Delivery no meu endereço"}
${notes ? `- Detalhes: ${notes}` : ""}`;

  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#10131a] w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 dark:border-[#232a38] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 p-6 text-white relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 p-2 text-white/80 hover:text-white rounded-full hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 backdrop-blur-md text-xs font-semibold uppercase tracking-wider text-blue-300 mb-2">
            <KeyRound className="w-3.5 h-3.5" />
            <span>Experiência ao Volante</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-white">
            Agende seu Test Drive VIP
          </h3>
          <p className="text-slate-300 text-xs sm:text-sm mt-1">
            Sinta o prazer de dirigir seu próximo carro antes de fechar o negócio.
          </p>
        </div>

        {/* Content */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-slate-900 dark:text-white">
                Test Drive Agendado!
              </h4>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-md mx-auto">
                Nossa equipe de consultores da Apex Motors entrará em contato para confirmar a disponibilidade do veículo e preparar tudo para sua chegada.
              </p>
              <div className="pt-2 flex flex-col sm:flex-row gap-2 justify-center">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm px-5 py-3 rounded-xl shadow-md transition-all"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Confirmar pelo WhatsApp</span>
                </a>
                <button
                  type="button"
                  onClick={onClose}
                  className="px-5 py-3 bg-slate-100 dark:bg-[#1a1d24] text-slate-700 dark:text-slate-300 text-xs sm:text-sm font-semibold rounded-xl hover:bg-slate-200"
                >
                  Fechar
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Veículo Selecionado */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Selecione o Veículo do Estoque
                </label>
                <select
                  value={vehicleId}
                  onChange={(e) => setVehicleId(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 h-10 text-xs sm:text-sm font-semibold focus:outline-none focus:border-blue-500"
                >
                  <option value="">Gostaria de ver o estoque completo ao chegar</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.brand} {v.model} {v.version} ({v.yearFabrication}/{v.yearModel})
                    </option>
                  ))}
                </select>
              </div>

              {/* Modalidade (Showroom ou Delivery) */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Onde você prefere realizar o Test Drive?
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocationPreference("dealership")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      locationPreference === "dealership"
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200 shadow-sm"
                        : "bg-slate-50 dark:bg-[#161a22] border-slate-200 dark:border-[#232a38] text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Showroom Apex (Brooklin - SP)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setLocationPreference("home_delivery")}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-all ${
                      locationPreference === "home_delivery"
                        ? "bg-blue-50 dark:bg-blue-950/40 border-blue-600 text-blue-900 dark:text-blue-200 shadow-sm"
                        : "bg-slate-50 dark:bg-[#161a22] border-slate-200 dark:border-[#232a38] text-slate-700 dark:text-slate-300"
                    }`}
                  >
                    <Home className="w-4 h-4 text-blue-600" />
                    <span>Test Drive VIP em Casa/Trabalho</span>
                  </button>
                </div>
              </div>

              {/* Nome e Telefone */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nome Completo *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Seu nome"
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
              </div>

              {/* Data e Horário */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Data de Preferência *
                  </label>
                  <input
                    type="date"
                    required
                    min={getTomorrowDateString()}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Horário de Preferência *
                  </label>
                  <select
                    value={preferredTime}
                    onChange={(e) => setPreferredTime(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                  >
                    <option value="09:00">Manhã (09:00 - 11:00)</option>
                    <option value="11:30">Manhã (11:30 - 13:00)</option>
                    <option value="14:00">Tarde (14:00 - 16:00)</option>
                    <option value="16:30">Tarde (16:30 - 18:00)</option>
                    <option value="Sabado_Manha">Sábado (09:00 - 13:00)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Observações adicionais (opcional)
                </label>
                <input
                  type="text"
                  placeholder="Ex: Vou levar meu mecânico de confiança / Quero simular parcelas na visita..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] text-slate-900 dark:text-white rounded-xl px-3.5 h-10 text-xs sm:text-sm focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="flex items-start gap-2 pt-1">
                <input
                  type="checkbox"
                  id="lgpd_testdrive"
                  required
                  checked={consentLGPD}
                  onChange={(e) => setConsentLGPD(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="lgpd_testdrive" className="text-[11px] text-slate-500 dark:text-slate-400">
                  Possuo CNH válida e autorizo a Apex Motors a entrar em contato para confirmar meu agendamento.
                </label>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  type="submit"
                  disabled={submitting || !consentLGPD}
                  className="flex-1 py-3.5 bg-gradient-to-r from-blue-700 to-blue-600 hover:from-blue-800 hover:to-blue-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md shadow-blue-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{submitting ? "Enviando Agendamento..." : "Confirmar Agendamento VIP"}</span>
                </button>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-3.5 px-5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
                  <span>Agendar no WhatsApp</span>
                </a>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
