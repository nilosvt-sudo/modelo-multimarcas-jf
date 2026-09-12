"use client";

import React from "react";
import { Vehicle } from "@/types";
import { formatCurrency, formatMileage, generateWhatsAppLink } from "@/lib/constants";
import {
  Gauge,
  Calendar,
  Fuel,
  Cog,
  ShieldCheck,
  Heart,
  Scale,
  Award,
  ArrowUpRight
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

import { SpotlightCard } from "@/components/ui/spotlight-card";

interface VehicleCardProps {
  vehicle: Vehicle;
  isFavorite: boolean;
  isCompared: boolean;
  onToggleFavorite: (id: number) => void;
  onToggleCompare: (vehicle: Vehicle) => void;
  onSelect: (vehicle: Vehicle) => void;
}

export default function VehicleCard({
  vehicle,
  isFavorite,
  isCompared,
  onToggleFavorite,
  onToggleCompare,
  onSelect,
}: VehicleCardProps) {
  const priceNum = parseFloat(vehicle.price);
  const fipeNum = vehicle.fipePrice ? parseFloat(vehicle.fipePrice) : null;
  const isBelowFipe = fipeNum && priceNum < fipeNum;

  // Approximate 48x financing estimation (30% entry)
  const entry30 = priceNum * 0.3;
  const financed = priceNum - entry30;
  const estInstallment = Math.round((financed * 1.42) / 48);

  const whatsappMessage = `Olá! Tenho interesse no ${vehicle.brand} ${vehicle.model} ${vehicle.version} (${vehicle.yearFabrication}/${vehicle.yearModel}) anunciado por ${formatCurrency(vehicle.price)} na Modelo Multimarcas JF. Poderiam me passar mais informações?`;
  const whatsappUrl = generateWhatsAppLink(whatsappMessage);

  return (
    <SpotlightCard
      spotlightColor="rgba(227, 6, 19, 0.1)"
      className="bg-white dark:bg-[#0e1117] rounded-2xl overflow-hidden border border-slate-200/90 dark:border-[#232a38] shadow-sm hover:border-slate-300 dark:hover:border-red-600/50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group relative"
      role="article"
      aria-label={`${vehicle.brand} ${vehicle.model}`}
    >
      {/* Image Container with Badges */}
      <div
        className="relative aspect-[16/10] bg-slate-100 dark:bg-[#151821] overflow-hidden cursor-pointer"
        onClick={() => onSelect(vehicle)}
      >
        <img
          src={vehicle.coverImage}
          alt={`${vehicle.brand} ${vehicle.model} ${vehicle.version}`}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?auto=format&fit=crop&w=800&q=80";
          }}
        />

        {/* Status / Feature Badges */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10 max-w-[80%]">
          {vehicle.badge && (
            <span className="bg-white/95 dark:bg-[#0e1117]/95 backdrop-blur-md text-slate-900 dark:text-white border border-slate-200 dark:border-[#232a38] text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded shadow-sm">
              {vehicle.badge}
            </span>
          )}
          {isBelowFipe && (
            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Abaixo da FIPE
            </span>
          )}
          {vehicle.status === "reserved" && (
            <span className="bg-amber-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Reservado
            </span>
          )}
          {vehicle.status === "sold" && (
            <span className="bg-slate-800 dark:bg-zinc-700 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow-sm">
              Vendido
            </span>
          )}
        </div>

        {/* Action icons on image top right (Heart + Compare) */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleCompare(vehicle);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isCompared
                ? "bg-[#e30613] text-white"
                : "bg-white/85 dark:bg-[#0e1117]/85 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#151821] border border-slate-200 dark:border-[#232a38]"
            }`}
            title="Comparar este veículo"
            aria-label="Comparar este veículo"
          >
            <Scale className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(vehicle.id);
            }}
            className={`p-2 rounded-full backdrop-blur-md transition-all shadow-sm ${
              isFavorite
                ? "bg-rose-600 text-white"
                : "bg-white/85 dark:bg-[#0e1117]/85 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white dark:hover:bg-[#151821] border border-slate-200 dark:border-[#232a38]"
            }`}
            title="Favoritar veículo"
            aria-label="Favoritar veículo"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? "fill-white" : ""}`} />
          </button>
        </div>

        {/* Cautelar Verification Tag on bottom */}
        {vehicle.hasInspectionReport && (
          <div className="absolute bottom-2.5 left-3 bg-white/95 dark:bg-[#0e1117]/95 backdrop-blur-md border border-slate-200 dark:border-[#232a38] text-emerald-600 dark:text-emerald-400 text-[10px] font-semibold px-2 py-0.5 rounded shadow-sm flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            Laudo Cautelar Aprovado
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col flex-1">
        {/* Title & Year */}
        <div className="mb-3 cursor-pointer" onClick={() => onSelect(vehicle)}>
          <div className="flex items-baseline justify-between gap-2">
            <h3 className="font-speed font-bold uppercase text-slate-900 dark:text-white text-base sm:text-lg group-hover:text-[#e30613] transition-colors line-clamp-1 tracking-tight">
              {vehicle.brand} {vehicle.model}
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 shrink-0 tabular-nums font-speed">
              {vehicle.yearFabrication}/{vehicle.yearModel}
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5 font-normal">
            {vehicle.version}
          </p>
        </div>

        {/* Quick Specs Grid */}
        <div className="grid grid-cols-2 gap-2 py-2.5 border-y border-slate-100 dark:border-[#232a38] text-xs text-slate-500 dark:text-slate-400 mb-3">
          <div className="flex items-center gap-1.5">
            <Gauge className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300 tabular-nums font-speed">{formatMileage(vehicle.mileage)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Cog className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{vehicle.transmission}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300">{vehicle.fuel}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 shrink-0" />
            <span className="font-medium text-slate-700 dark:text-slate-300 truncate">{vehicle.color}</span>
          </div>
        </div>

        {/* Price and Financing Suggestion */}
        <div className="mt-auto pt-1">
          <div className="flex items-baseline justify-between mb-1.5">
            <span className="text-2xl font-black text-slate-950 dark:text-white tracking-tight tabular-nums font-speed">
              {formatCurrency(vehicle.price)}
            </span>
            {vehicle.singleOwner && (
              <span className="text-[10px] text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-[#151821] border border-slate-200 dark:border-[#232a38] px-1.5 py-0.5 rounded font-semibold uppercase tracking-wider flex items-center gap-1 font-speed">
                <Award className="w-3 h-3 text-slate-500 dark:text-slate-400" />
                Único Dono
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-[#151821] px-2.5 py-1.5 rounded-lg border border-slate-100 dark:border-[#232a38] flex items-center justify-between mb-3.5">
            <span>Simulação a partir de:</span>
            <span className="font-bold text-slate-800 dark:text-white tabular-nums font-speed">
              48x de ~{formatCurrency(estInstallment)}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onSelect(vehicle)}
              className="w-full bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#232a38] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#232a38] font-speed font-bold uppercase tracking-wider py-2.5 px-3 rounded-lg text-xs sm:text-sm transition-all cursor-pointer flex items-center justify-center gap-1 shadow-sm"
            >
              <span>Detalhes</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2.5 px-3 rounded-lg text-xs sm:text-sm transition-colors flex items-center justify-center gap-1.5 shadow-sm"
              onClick={(e) => e.stopPropagation()}
            >
              <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
              Proposta
            </a>
          </div>
        </div>
      </div>
    </SpotlightCard>
  );
}
