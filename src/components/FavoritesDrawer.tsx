"use client";

import React from "react";
import { Vehicle } from "@/types";
import { formatCurrency, formatMileage, generateWhatsAppLink } from "@/lib/constants";
import { Heart, X, Trash2, ExternalLink, CarFront } from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface FavoritesDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: number[];
  vehicles: Vehicle[];
  onRemoveFavorite: (id: number) => void;
  onClearFavorites: () => void;
  onSelectVehicle: (vehicle: Vehicle) => void;
}

export default function FavoritesDrawer({
  isOpen,
  onClose,
  favorites,
  vehicles,
  onRemoveFavorite,
  onClearFavorites,
  onSelectVehicle,
}: FavoritesDrawerProps) {
  if (!isOpen) return null;

  const favoriteVehicles = vehicles.filter((v) => favorites.includes(v.id));

  const buildWhatsappFavoritesMsg = () => {
    const list = favoriteVehicles
      .map((v) => `- ${v.brand} ${v.model} (${v.yearFabrication}): ${formatCurrency(v.price)}`)
      .join("\n");
    return `Olá! Salvei os seguintes seminovos nos meus favoritos no site da Modelo Multimarcas JF e quero negociar:\n${list}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-[#0e1118] shadow-2xl flex flex-col z-10 border-l border-transparent dark:border-zinc-800 text-slate-900 dark:text-zinc-100 transition-colors">
        {/* Header */}
        <div className="p-5 bg-slate-900 dark:bg-[#07090e] text-white flex items-center justify-between border-b dark:border-zinc-800">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-[#e30613] fill-[#e30613]" />
            <h2 className="font-bold text-lg font-speed">Meus Veículos Salvos</h2>
            <span className="text-xs bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded-full border border-red-500/30">
              {favoriteVehicles.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 dark:bg-zinc-800 hover:bg-slate-700 dark:hover:bg-zinc-700 text-slate-300 flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of saved vehicles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoriteVehicles.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-zinc-400">
              <Heart className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="font-bold text-slate-700 dark:text-zinc-200">Nenhum veículo salvo ainda</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                Clique no coração nos cards dos carros para guardar seus modelos favoritos e comparar depois.
              </p>
            </div>
          ) : (
            favoriteVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-slate-50 dark:bg-[#131620] border border-slate-200 dark:border-zinc-800 rounded-2xl p-3 flex gap-3 relative group hover:border-[#e30613] dark:hover:border-[#e30613] transition-colors"
              >
                <div
                  className="w-24 h-20 rounded-xl overflow-hidden bg-slate-200 dark:bg-zinc-800 shrink-0 cursor-pointer"
                  onClick={() => {
                    onClose();
                    onSelectVehicle(vehicle);
                  }}
                >
                  <img
                    src={vehicle.coverImage}
                    alt={vehicle.model}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                <div className="flex-1 min-w-0 flex flex-col justify-between">
                  <div>
                    <div className="flex items-start justify-between gap-1">
                      <h4
                        className="font-bold text-slate-900 dark:text-white text-sm line-clamp-1 cursor-pointer hover:text-[#e30613] dark:hover:text-[#e30613] font-speed"
                        onClick={() => {
                          onClose();
                          onSelectVehicle(vehicle);
                        }}
                      >
                        {vehicle.brand} {vehicle.model}
                      </h4>
                      <button
                        onClick={() => onRemoveFavorite(vehicle.id)}
                        className="text-slate-400 hover:text-rose-500 dark:hover:text-rose-400 p-1 cursor-pointer"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 dark:text-zinc-400 block font-medium">
                      {vehicle.yearFabrication} • {formatMileage(vehicle.mileage)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-extrabold text-[#e30613] text-sm font-speed">
                      {formatCurrency(vehicle.price)}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectVehicle(vehicle);
                      }}
                      className="text-[11px] font-semibold text-slate-700 dark:text-zinc-300 hover:text-[#e30613] dark:hover:text-[#e30613] underline cursor-pointer"
                    >
                      Ver detalhes
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Bottom Drawer Actions */}
        {favoriteVehicles.length > 0 && (
          <div className="p-4 border-t border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-[#0a0d13] space-y-2">
            <a
              href={generateWhatsAppLink(buildWhatsappFavoritesMsg())}
              target="_blank"
              rel="noreferrer"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-colors flex items-center justify-center gap-2 shadow"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              Negociar Salvos no WhatsApp
            </a>

            <button
              onClick={onClearFavorites}
              className="w-full text-xs text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 font-semibold py-1.5 transition-colors cursor-pointer"
            >
              Limpar Lista de Favoritos
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
