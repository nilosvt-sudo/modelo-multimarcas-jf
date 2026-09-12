"use client";

import React from "react";
import { Vehicle } from "@/types";
import { formatCurrency, formatMileage, generateWhatsAppLink } from "@/lib/constants";
import {
  Scale,
  X,
  Check,
  Minus,
  Sparkles,
  ShieldCheck,
  Award,
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

  // Gather all unique features across compared cars
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

      <div className="relative bg-white dark:bg-[#0e1118] rounded-3xl shadow-2xl max-w-6xl w-full max-h-[92vh] overflow-y-auto z-10 border border-slate-200 dark:border-zinc-800 p-4 sm:p-6 md:p-8 flex flex-col text-slate-900 dark:text-zinc-100 transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-zinc-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-50 dark:bg-red-950/40 text-[#e30613] flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white font-speed">
                Comparador de Seminovos
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Comparando {comparedVehicles.length} de no máximo 3 veículos lado a lado
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {comparedVehicles.length > 0 && (
              <button
                onClick={onClear}
                className="text-xs text-rose-600 hover:text-rose-700 dark:text-rose-400 font-semibold px-3 py-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
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
              Clique no ícone de balança nos cards do estoque para comparar até 3 carros lado a lado.
            </p>
            <button
              onClick={onClose}
              className="bg-[#e30613] text-white font-bold text-xs px-4 py-2 rounded-xl cursor-pointer"
            >
              Explorar Estoque
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left text-xs sm:text-sm">
              <thead>
                <tr>
                  <th className="p-3 bg-slate-50 dark:bg-[#131620] text-slate-500 dark:text-zinc-400 font-bold w-1/4 rounded-tl-xl font-speed uppercase tracking-wider">
                    Especificação
                  </th>
                  {comparedVehicles.map((v) => (
                    <th key={v.id} className="p-3 bg-slate-50 dark:bg-[#131620] relative min-w-[220px]">
                      <button
                        onClick={() => onRemove(v.id)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-slate-200 dark:bg-zinc-700 hover:bg-rose-100 dark:hover:bg-rose-950/60 hover:text-rose-600 dark:hover:text-rose-400 text-slate-600 dark:text-zinc-300 flex items-center justify-center text-xs transition-colors cursor-pointer"
                        title="Remover da comparação"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>

                      <div className="aspect-[16/10] rounded-xl overflow-hidden mb-2 bg-slate-200 dark:bg-zinc-800">
                        <img
                          src={v.coverImage}
                          alt={v.model}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <h4 className="font-extrabold text-slate-900 dark:text-white text-base line-clamp-1 font-speed">
                        {v.brand} {v.model}
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-zinc-400 font-normal line-clamp-1 mb-2">
                        {v.version}
                      </p>
                      <div className="text-lg font-black text-[#e30613] font-speed">
                        {formatCurrency(v.price)}
                      </div>

                      <div className="mt-2 flex gap-1.5">
                        <button
                          onClick={() => {
                            onClose();
                            onSelectVehicle(v);
                          }}
                          className="flex-1 bg-slate-900 dark:bg-zinc-100 hover:bg-slate-800 dark:hover:bg-white text-white dark:text-zinc-900 font-semibold py-1.5 px-2 rounded-lg text-xs transition-colors cursor-pointer font-speed uppercase tracking-wider"
                        >
                          Ver Detalhes
                        </button>
                        <a
                          href={generateWhatsAppLink(
                            `Olá! Comparei o ${v.brand} ${v.model} (${formatCurrency(v.price)}) no site e quero negociar.`
                          )}
                          target="_blank"
                          rel="noreferrer"
                          className="p-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg flex items-center justify-center"
                          title="Chamar no WhatsApp"
                        >
                          <WhatsAppIcon className="w-4 h-4 fill-white" />
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50/50 dark:bg-[#131620]/50 font-speed">Ano Fab/Modelo</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-bold text-slate-900 dark:text-zinc-100">
                      {v.yearFabrication} / {v.yearModel}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50/50 dark:bg-[#131620]/50 font-speed">Quilometragem</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 font-bold text-slate-900 dark:text-zinc-100 font-speed">
                      {formatMileage(v.mileage)}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50/50 dark:bg-[#131620]/50 font-speed">Câmbio</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 text-slate-800 dark:text-zinc-200">
                      {v.transmission}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50/50 dark:bg-[#131620]/50 font-speed">Combustível</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 text-slate-800 dark:text-zinc-200">
                      {v.fuel}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50/50 dark:bg-[#131620]/50 font-speed">Cor</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 text-slate-800 dark:text-zinc-200">
                      {v.color}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50/50 dark:bg-[#131620]/50 font-speed">Carroceria</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 text-slate-800 dark:text-zinc-200">
                      {v.bodyType}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50/50 dark:bg-[#131620]/50 font-speed">Tabela FIPE</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3 text-slate-800 dark:text-zinc-200 font-medium font-speed">
                      {v.fipePrice ? formatCurrency(v.fipePrice) : "N/D"}
                    </td>
                  ))}
                </tr>

                <tr>
                  <td className="p-3 font-semibold text-slate-600 dark:text-zinc-400 bg-slate-50/50 dark:bg-[#131620]/50 font-speed">Laudo Cautelar</td>
                  {comparedVehicles.map((v) => (
                    <td key={v.id} className="p-3">
                      {v.hasInspectionReport ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded font-bold text-xs border border-emerald-200 dark:border-emerald-800">
                          <Check className="w-3.5 h-3.5" /> Aprovado
                        </span>
                      ) : (
                        <span className="text-slate-400 dark:text-zinc-500">Padrão</span>
                      )}
                    </td>
                  ))}
                </tr>

                {/* Features rows */}
                {allFeatures.length > 0 && (
                  <>
                    <tr className="bg-slate-100 dark:bg-zinc-800/60">
                      <td colSpan={comparedVehicles.length + 1} className="p-2.5 font-bold text-slate-800 dark:text-zinc-200 uppercase text-xs tracking-wider font-speed">
                        Opcionais e Equipamentos
                      </td>
                    </tr>
                    {allFeatures.map((feat) => (
                      <tr key={feat}>
                        <td className="p-2.5 text-slate-600 dark:text-zinc-400 bg-slate-50/40 dark:bg-[#131620]/40 text-xs font-medium">
                          {feat}
                        </td>
                        {comparedVehicles.map((v) => {
                          let hasFeat = false;
                          try {
                            const parsed = JSON.parse(v.features || "[]");
                            hasFeat = parsed.includes(feat);
                          } catch {}
                          return (
                            <td key={v.id} className="p-2.5">
                              {hasFeat ? (
                                <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                              ) : (
                                <Minus className="w-4 h-4 text-slate-300 dark:text-zinc-700" />
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
