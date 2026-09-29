"use client";

import React, { useRef, useState, useMemo, useEffect } from "react";
import { Player, PlayerRef } from "@remotion/player";
import { Vehicle } from "@/types";
import { CarShowcaseComposition } from "@/remotion/CarShowcaseComposition";
import { CarShowcaseItem } from "@/remotion/types";
import { formatCurrency, generateWhatsAppLink } from "@/lib/constants";
import {
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  ArrowUpRight,
  ShieldCheck,
  Film,
  Car
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface RemotionShowcaseSectionProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

const SLIDE_DURATION = 135; // 4.5 seconds per vehicle at 30 fps (smooth continuous transition)
const FPS = 30;

export default function RemotionShowcaseSection({
  vehicles,
  onSelectVehicle,
}: RemotionShowcaseSectionProps) {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHoverPaused, setIsHoverPaused] = useState(false);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  const showcaseVehicles: CarShowcaseItem[] = useMemo(() => {
    const list = vehicles.slice(0, 6).map((v) => ({
      id: v.id,
      brand: v.brand,
      model: v.model,
      version: v.version,
      yearFabrication: v.yearFabrication,
      yearModel: v.yearModel,
      price: v.price,
      fipePrice: v.fipePrice,
      mileage: v.mileage,
      transmission: v.transmission,
      fuel: v.fuel,
      color: v.color,
      coverImage: v.coverImage,
      badge: v.badge || "Destaque",
      hasInspectionReport: v.hasInspectionReport !== false,
      singleOwner: v.singleOwner,
    }));
    return list;
  }, [vehicles]);

  const totalFrames = Math.max(1, showcaseVehicles.length * SLIDE_DURATION);

  // Garantir autoplay inicial ativo assim que o componente monta
  useEffect(() => {
    const timer = setTimeout(() => {
      if (playerRef.current) {
        playerRef.current.play();
        setIsPlaying(true);
      }
    }, 150);
    return () => clearTimeout(timer);
  }, []);

  // Monitorar frame atual e atualizar o indicador de veículo ativo
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const interval = setInterval(() => {
      try {
        const frame = player.getCurrentFrame();
        if (showcaseVehicles.length > 0) {
          const calculatedIndex = Math.floor(frame / SLIDE_DURATION) % showcaseVehicles.length;
          setCurrentCarIndex(calculatedIndex);
        }
      } catch {
        // Safe catch if player is re-rendering
      }
    }, 150);

    return () => clearInterval(interval);
  }, [showcaseVehicles.length]);

  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
      setIsHoverPaused(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
      setIsHoverPaused(false);
    }
  };

  // Pausa suave no hover (opcional e não intrusiva)
  const handleMouseEnter = () => {
    if (playerRef.current && isPlaying) {
      playerRef.current.pause();
      setIsHoverPaused(true);
    }
  };

  const handleMouseLeave = () => {
    if (playerRef.current && isHoverPaused) {
      playerRef.current.play();
      setIsHoverPaused(false);
    }
  };

  const handleJumpToCar = (index: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(index * SLIDE_DURATION);
    setCurrentCarIndex(index);
    if (!isPlaying) {
      playerRef.current.play();
      setIsPlaying(true);
      setIsHoverPaused(false);
    }
  };

  const activeVehicle = showcaseVehicles[currentCarIndex] || showcaseVehicles[0];
  const originalVehicle = vehicles.find((v) => v.id === activeVehicle?.id);

  const activeWhatsappUrl = generateWhatsAppLink(
    activeVehicle
      ? `Olá! Vi a apresentação em vídeo do "${activeVehicle.brand} ${activeVehicle.model} ${activeVehicle.version}" no site da Apex Motors e gostaria de receber a ficha técnica e proposta de compra!`
      : "Olá! Gostaria de mais informações sobre o estoque de veículos da Apex Motors."
  );

  if (showcaseVehicles.length === 0) return null;

  return (
    <section className="py-4 bg-slate-100/60 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-[#232a38] transition-colors duration-200 w-full max-w-full overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 w-full max-w-full">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400">
              <Film className="w-3.5 h-3.5" />
              <span>Vitrine Virtual Dinâmica</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white tracking-tight">
              Ofertas em Alta Resolução
            </h2>
          </div>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="bg-white dark:bg-[#12151d] border border-slate-200 dark:border-[#232a38] text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-lg shadow-xs flex items-center gap-1.5">
              <span className={`w-1.5 h-1.5 rounded-full ${isPlaying && !isHoverPaused ? "bg-emerald-500 animate-ping" : "bg-amber-500"}`} />
              Apex Motion Player {isPlaying && !isHoverPaused ? "• Autoplay Ativo" : "• Pausado"}
            </span>
          </div>
        </div>

        {/* Video Player Display Container com Suporte a Hover Pause */}
        <div
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          className="bg-white dark:bg-[#10131a] rounded-2xl p-2 sm:p-3 border border-slate-200 dark:border-[#232a38] shadow-lg overflow-hidden w-full max-w-none transition-colors duration-200"
        >
          <div className="relative rounded-xl overflow-hidden bg-slate-950 shadow-md aspect-video w-full max-w-none">
            <Player
              ref={playerRef}
              component={CarShowcaseComposition}
              inputProps={{
                vehicles: showcaseVehicles,
                slideDurationInFrames: SLIDE_DURATION,
              }}
              durationInFrames={totalFrames}
              fps={FPS}
              compositionWidth={1920}
              compositionHeight={1080}
              style={{
                width: "100%",
                height: "100%",
              }}
              autoPlay
              loop
            />
          </div>

          {/* Interactive Player Controls & Quick-Action Bar */}
          <div className="mt-2.5 flex flex-col md:flex-row md:items-center justify-between gap-3 pt-2 border-t border-slate-100 dark:border-[#232a38] px-1">
            {/* Play/Pause & Thumbnails Selector com Divisor e Espaçamento Seguro */}
            <div className="flex items-center gap-2.5 overflow-x-auto pb-1 md:pb-0 min-w-0">
              {/* Botão de Controle Play/Pause Isolado */}
              <div className="pr-2 border-r border-slate-200 dark:border-slate-800 shrink-0">
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  aria-label={isPlaying ? "Pausar apresentação" : "Reproduzir apresentação"}
                  className={`p-2 sm:p-2.5 rounded-xl border transition-all cursor-pointer ${
                    isPlaying
                      ? "bg-blue-50 dark:bg-blue-950/40 text-blue-800 dark:text-blue-300 border-blue-200 dark:border-blue-800/40 hover:bg-blue-100"
                      : "bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100"
                  }`}
                  title={isPlaying ? "Pausar apresentação" : "Reproduzir apresentação"}
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
              </div>

              {/* Botões dos Veículos em Destaque */}
              <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
                {showcaseVehicles.map((car, idx) => (
                  <button
                    type="button"
                    key={car.id}
                    onClick={() => handleJumpToCar(idx)}
                    className={`text-xs px-2.5 sm:px-3 py-1.5 rounded-lg font-bold transition-all shrink-0 cursor-pointer whitespace-nowrap ${
                      currentCarIndex === idx
                        ? "bg-blue-600 text-white shadow-xs ring-2 ring-blue-500/30"
                        : "bg-slate-100 dark:bg-[#161a22] text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-[#1c222e]"
                    }`}
                  >
                    {idx + 1}. {car.brand} {car.model.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Current Active Vehicle CTA */}
            {activeVehicle && originalVehicle && (
              <div className="flex items-center gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => onSelectVehicle(originalVehicle)}
                  className="py-1.5 px-3 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 text-blue-900 dark:text-blue-200 rounded-xl text-xs font-bold border border-blue-200 dark:border-blue-800/40 transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Ficha Técnica</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>

                <a
                  href={activeWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-1.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white" />
                  <span>Negociar no WhatsApp</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
