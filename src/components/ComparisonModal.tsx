"use client";

import React from "react";
import { Vehicle } from "@/types";
import { formatCurrency, formatMileage, generateWhatsAppLink } from "@/lib/constants";
import {
  Scale,
  X,
  Check,
  Minus,
  Car,
  ShieldCheck,
  Calendar,
  Gauge,
  Fuel,
  Workflow,
  ExternalLink
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface ComparisonModalProps {
  comparedVehicles: Vehicle[];
  isOpen: boolean;
  onClose: () => void;
  onRemove: (vehicleId: number) => void;
  onClear: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export default function ComparisonModal({
  comparedVehicles,
  isOpen,
  onClose,
  onRemove,
  onClear,
  onSelectVehicle,
}: ComparisonModalProps) {
  if (!isOpen) return null;

  // Gather all unique features
  const allFeaturesSet = new Set<string>();
  comparedVehicles.forEach((v) => {
    try {
      const parsed = JSON.parse(v.features || "[]");
      parsed.forEach((f: string) => allFeaturesSet.add(f));
    } catch {}
  });
  const allFeatures = Array.from(allFeaturesSet);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6">
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white dark:bg-[#10131a] rounded-3xl shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-200 dark:border-zinc-800 p-4 sm:p-6 md:p-8 flex flex-col text-slate-900 dark:text-zinc-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
                Comparador de Veículos
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Comparando {comparedVehicles.length} de até 3 seminovos da Apex Motors lado a lado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedVehicles.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-bold px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
              >
                Limpar Comparação
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {comparedVehicles.length === 0 ? (
          <div className="text-center py-16">
            <Scale className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-zinc-300">Nenhum veículo selecionado</h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-sm mx-auto mb-4">
              Clique no ícone de balança nos cards de veículos para comparar ficha técnica, opcionais e preços.
            </p>
            <button
              onClick={onClose}
              className="bg-blue-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl cursor-pointer hover:bg-blue-700 shadow-md transition-all"
            >
              Explorar Estoque
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr>
                  <th className="p-3 w-48 text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Veículo
                  </th>
                  {comparedVehicles.map((v) => (
                    <th key={v.id} className="p-3 align-top">
                      <div className="relative bg-slate-50 dark:bg-[#161a22] p-3 rounded-2xl border border-slate-200 dark:border-zinc-800">
                        <button
                          onClick={() => onRemove(v.id)}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-rose-600 shadow cursor-pointer"
                          title="Remover da comparação"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <img
                          src={v.coverImage}
                          alt={v.model}
                          className="w-full h-32 object-cover rounded-xl mb-2"
                        />
                        <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider block">
                          {v.brand}
                        </span>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-1">
                          {v.model} {v.version}
                        </h4>
                        <p className="text-sm font-black text-blue-600 dark:text-blue-400 mt-1">
                          {formatCurrency(v.price)}
                        </p>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800 text-xs">
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Ano / Modelo</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-bold text-slate-900 dark:text-white">
                      {v.yearFabrication}/{v.yearModel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Quilometragem</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-bold text-slate-900 dark:text-white">
                      {formatMileage(v.mileage)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Câmbio</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-medium text-slate-900 dark:text-white">
                      {v.transmission}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Combustível</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-medium text-slate-900 dark:text-white">
                      {v.fuel}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Carroceria</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-medium text-slate-900 dark:text-white">
                      {v.bodyType}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-500">Cor</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-medium text-slate-900 dark:text-white">
                      {v.color}
                    </td>
                  ))}
                </tr>

                {/* Features comparison */}
                {allFeatures.map((feat) => (
                  <tr key={feat}>
                    <td className="p-3 text-slate-500 font-medium">{feat}</td>
                    {comparedVehicles.map((v) => {
                      let has = false;
                      try {
                        has = JSON.parse(v.features || "[]").includes(feat);
                      } catch {}
                      return (
                        <td key={v.id} className="p-3">
                          {has ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold">
                              <Check className="w-4 h-4" /> Sim
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-400">
                              <Minus className="w-4 h-4" /> Não
                            </span>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}

                <tr>
                  <td className="p-3 font-semibold text-slate-500">Ações</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 space-y-1.5">
                      <button
                        onClick={() => {
                          onClose();
                          onSelectVehicle(v);
                        }}
                        className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                      >
                        Ver Detalhes
                      </button>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
