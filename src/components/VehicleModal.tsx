"use client";

import React, { useState, useEffect } from "react";
import { Vehicle } from "@/types";
import {
  formatCurrency,
  formatMileage,
  generateWhatsAppLink,
  calculateFinancing,
  DEALERSHIP_INFO,
} from "@/lib/constants";
import {
  X,
  Gauge,
  Calendar,
  Fuel,
  Cog,
  Palette,
  ShieldCheck,
  CheckCircle,
  Calculator,
  CalendarCheck,
  Maximize2,
  CarFront,
  Phone,
  DollarSign
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface VehicleModalProps {
  vehicle: Vehicle | null;
  onClose: () => void;
  onOpenTestDriveForVehicle?: (vehicle: Vehicle) => void;
}

export default function VehicleModal({
  vehicle,
  onClose,
  onOpenTestDriveForVehicle,
}: VehicleModalProps) {
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  // Embedded Financing Simulator State
  const [entryAmount, setEntryAmount] = useState<number>(0);
  const [months, setMonths] = useState<number>(48);

  useEffect(() => {
    if (vehicle) {
      setSelectedPhotoIndex(0);
      const priceNum = parseFloat(vehicle.price) || 50000;
      setEntryAmount(Math.round(priceNum * 0.3));
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [vehicle]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxOpen) setLightboxOpen(false);
        else onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, lightboxOpen]);

  if (!vehicle) return null;

  let galleryImages: string[] = [];
  try {
    galleryImages = JSON.parse(vehicle.gallery || "[]");
    if (!galleryImages.length) galleryImages = [vehicle.coverImage];
  } catch {
    galleryImages = [vehicle.coverImage];
  }

  let featuresList: string[] = [];
  try {
    featuresList = JSON.parse(vehicle.features || "[]");
  } catch {
    featuresList = [];
  }

  const priceNum = parseFloat(vehicle.price);
  const fipeNum = vehicle.fipePrice ? parseFloat(vehicle.fipePrice) : null;
  const isBelowFipe = fipeNum && priceNum < fipeNum;
  const fipeSavings = fipeNum && priceNum < fipeNum ? fipeNum - priceNum : 0;

  const finCalc = calculateFinancing({
    carPrice: priceNum,
    entryAmount: entryAmount,
    months: months,
  });

  const whatsappMessage = `Olá! Gostaria de receber mais informações e negociar o ${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.yearFabrication}/${vehicle.yearModel}) anunciado por ${formatCurrency(vehicle.price)} na Apex Motors.`;
  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 md:p-6 bg-black/75 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative bg-white dark:bg-[#0e1117] w-full max-w-4xl rounded-3xl shadow-2xl border border-slate-200 dark:border-[#232a38] overflow-hidden my-auto max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200 dark:border-[#232a38] bg-slate-50 dark:bg-[#07090e]">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#0047cc] dark:text-[#3b82f6] uppercase tracking-wider">
              {vehicle.brand} • {vehicle.bodyType}
            </span>
            <span className="text-slate-300 dark:text-slate-700">•</span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              Placa Final {vehicle.plateEnd || "X"}
            </span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white rounded-full hover:bg-slate-100 dark:hover:bg-[#1a1d24] transition-colors"
            aria-label="Fechar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Top Title & Price Section */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase italic">
                {vehicle.brand} {vehicle.model}
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5">
                {vehicle.version} • {vehicle.yearFabrication}/{vehicle.yearModel}
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs text-slate-400 block uppercase font-bold">
                Preço à Vista
              </span>
              <span className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {formatCurrency(vehicle.price)}
              </span>
              {isBelowFipe && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 block font-bold">
                  Economia de {formatCurrency(fipeSavings)} em relação à Tabela FIPE
                </span>
              )}
            </div>
          </div>

          {/* Photo Gallery with Thumbnails */}
          <div className="space-y-3">
            <div className="relative aspect-[16/9] sm:aspect-[16/8] bg-slate-100 dark:bg-[#151821] rounded-2xl overflow-hidden border border-slate-200 dark:border-[#232a38]">
              <img
                src={galleryImages[selectedPhotoIndex] || vehicle.coverImage}
                alt={vehicle.model}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                className="absolute bottom-3 right-3 p-2 bg-black/60 hover:bg-black/80 text-white rounded-xl backdrop-blur-sm transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
              >
                <Maximize2 className="w-4 h-4" />
                <span>Ampliar Foto</span>
              </button>
            </div>

            {galleryImages.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedPhotoIndex(idx)}
                    className={`relative w-20 h-14 rounded-xl overflow-hidden shrink-0 border-2 transition-all ${
                      selectedPhotoIndex === idx
                        ? "border-[#0047cc] scale-95"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img src={img} alt={`Foto ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 dark:bg-[#141720] p-4 rounded-2xl border border-slate-200 dark:border-[#232a38]">
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Gauge className="w-3.5 h-3.5 text-slate-500" /> Quilometragem
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {formatMileage(vehicle.mileage)}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Cog className="w-3.5 h-3.5 text-slate-500" /> Câmbio
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {vehicle.transmission}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Fuel className="w-3.5 h-3.5 text-slate-500" /> Combustível
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {vehicle.fuel}
              </p>
            </div>

            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase flex items-center gap-1">
                <Palette className="w-3.5 h-3.5 text-slate-500" /> Cor
              </span>
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                {vehicle.color}
              </p>
            </div>
          </div>

          {/* Vehicle Description */}
          <div className="space-y-2">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
              Descrição do Veículo
            </h4>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {vehicle.description}
            </p>
          </div>

          {/* Features / Opcionais */}
          {featuresList.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                Opcionais e Itens de Série
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {featuresList.map((feature, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-[#161a22] border border-slate-200/80 dark:border-[#232a38] text-xs font-medium text-slate-700 dark:text-slate-200"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Embedded Financing Simulator */}
          <div className="bg-blue-50/50 dark:bg-[#121622] border border-blue-200 dark:border-blue-900/40 p-4 sm:p-5 rounded-2xl space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Calculator className="w-4 h-4 text-[#0047cc] dark:text-[#3b82f6]" />
                Simulação Rápida de Financiamento
              </h4>
              <span className="text-xs text-blue-700 dark:text-blue-300 font-bold">
                Taxas a partir de 1,39% a.m.
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Valor da Entrada: {formatCurrency(entryAmount)}
                </label>
                <input
                  type="range"
                  min={0}
                  max={Math.round(priceNum * 0.8)}
                  step={1000}
                  value={entryAmount}
                  onChange={(e) => setEntryAmount(Number(e.target.value))}
                  className="w-full accent-[#0047cc]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1">
                  Prazo: {months}x Parcelas
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[24, 36, 48, 60].map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setMonths(m)}
                      className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                        months === m
                          ? "bg-[#0047cc] text-white"
                          : "bg-white dark:bg-[#1a1d24] text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-[#232a38]"
                      }`}
                    >
                      {m}x
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-3 bg-white dark:bg-[#151821] rounded-xl border border-slate-200 dark:border-[#232a38] flex items-center justify-between">
              <div>
                <span className="text-[11px] text-slate-400 block uppercase font-semibold">Parcela Estimada</span>
                <span className="text-lg font-black text-[#0047cc] dark:text-[#3b82f6]">
                  {formatCurrency(finCalc.monthlyPayment)} /mês
                </span>
              </div>
              <span className="text-xs text-slate-500">
                Financiado: {formatCurrency(finCalc.financedAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-200 dark:border-[#232a38] bg-slate-50 dark:bg-[#07090e] flex flex-col sm:flex-row gap-3 items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-[#1a1d24] rounded-xl transition-colors cursor-pointer"
          >
            Voltar ao Estoque
          </button>

          {onOpenTestDriveForVehicle && (
            <button
              type="button"
              onClick={() => {
                onClose();
                onOpenTestDriveForVehicle(vehicle);
              }}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-bold bg-white dark:bg-[#161a22] text-slate-900 dark:text-white border border-slate-300 dark:border-slate-700 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <CalendarCheck className="w-4 h-4 text-[#0047cc]" />
              <span>Agendar Test Drive</span>
            </button>
          )}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md"
          >
            <WhatsAppIcon className="w-4 h-4 fill-white shrink-0" />
            <span>Negociar no WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
