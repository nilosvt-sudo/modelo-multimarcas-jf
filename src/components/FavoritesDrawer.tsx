"use client";

import React from "react";
import { Vehicle } from "@/types";
import { formatCurrency, formatMileage, generateWhatsAppLink } from "@/lib/constants";
import { Heart, X, Trash2, ExternalLink, Car, Gauge, Calendar } from "lucide-react";
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
      .map((v) => `- ${v.brand} ${v.model} ${v.version} (${v.yearFabrication}/${v.yearModel}): ${formatCurrency(v.price)}`)
      .join("\n");
    return `Olá Apex Motors! Salvei os seguintes veículos do estoque em meus favoritos e gostaria de mais informações:\n${list}`;
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-md w-full bg-white dark:bg-[#10131a] shadow-2xl flex flex-col z-10 border-l border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100 transition-colors">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-blue-950 via-slate-900 to-blue-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
            <h2 className="font-black text-lg">Minha Garagem Favorita</h2>
            <span className="text-xs bg-blue-500/30 text-blue-200 font-bold px-2 py-0.5 rounded-full border border-blue-400/30">
              {favoriteVehicles.length}
            </span>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* List of saved vehicles */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {favoriteVehicles.length === 0 ? (
            <div className="text-center py-16 text-slate-500 dark:text-zinc-400">
              <Car className="w-12 h-12 text-slate-300 dark:text-zinc-700 mx-auto mb-3" />
              <p className="font-bold text-slate-700 dark:text-zinc-200">Sua garagem está vazia</p>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 max-w-xs mx-auto">
                Clique no coração nos cards dos carros para salvar seus favoritos e consultá-los depois.
              </p>
            </div>
          ) : (
            favoriteVehicles.map((vehicle) => (
              <div
                key={vehicle.id}
                className="bg-slate-50 dark:bg-[#141720] border border-slate-200 dark:border-zinc-800 rounded-2xl p-3 flex gap-3 relative group hover:border-blue-500 transition-colors"
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
                        className="font-bold text-slate-900 dark:text-white text-xs sm:text-sm line-clamp-1 cursor-pointer hover:text-blue-600 dark:hover:text-blue-400"
                        onClick={() => {
                          onClose();
                          onSelectVehicle(vehicle);
                        }}
                      >
                        {vehicle.brand} {vehicle.model}
                      </h4>
                      <button
                        onClick={() => onRemoveFavorite(vehicle.id)}
                        className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                        title="Remover"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <span className="text-[10px] text-slate-500 dark:text-slate-400 block line-clamp-1">
                      {vehicle.version} • {vehicle.yearFabrication}/{vehicle.yearModel}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <span className="font-black text-blue-600 dark:text-blue-400 text-xs sm:text-sm">
                      {formatCurrency(vehicle.price)}
                    </span>
                    <button
                      onClick={() => {
                        onClose();
                        onSelectVehicle(vehicle);
                      }}
                      className="text-blue-600 dark:text-blue-400 hover:underline text-[11px] font-bold flex items-center gap-1 cursor-pointer"
                    >
                      Ver Carro <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer Actions */}
        {favoriteVehicles.length > 0 && (
          <div className="p-4 bg-slate-50 dark:bg-[#10131a] border-t border-slate-200 dark:border-zinc-800 space-y-2">
            <a
              href={generateWhatsAppLink(buildWhatsappFavoritesMsg())}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
            >
              <WhatsAppIcon className="w-4 h-4 fill-white" />
              <span>Negociar Carros Salvos no WhatsApp</span>
            </a>

            <button
              onClick={onClearFavorites}
              className="w-full py-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 text-xs font-semibold cursor-pointer"
            >
              Limpar Garagem
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
