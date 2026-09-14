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
  CarFront,
  ArrowUpRight,
  ShieldCheck,
  Film,
  Maximize2
} from "lucide-react";
import { WhatsAppIcon } from "@/components/SocialIcons";

interface RemotionShowcaseSectionProps {
  vehicles: Vehicle[];
  onSelectVehicle: (vehicle: Vehicle) => void;
}

const SLIDE_DURATION = 120; // 4 seconds at 30 fps
const FPS = 30;

export default function RemotionShowcaseSection({
  vehicles,
  onSelectVehicle,
}: RemotionShowcaseSectionProps) {
  const playerRef = useRef<PlayerRef>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentCarIndex, setCurrentCarIndex] = useState(0);

  // Take the top 5 featured or high-interest vehicles
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

  // Sync current playing index based on player frame updates
  useEffect(() => {
    const player = playerRef.current;
    if (!player) return;

    const interval = setInterval(() => {
      const frame = player.getCurrentFrame();
      const calculatedIndex = Math.floor(frame / SLIDE_DURATION) % showcaseVehicles.length;
      setCurrentCarIndex(calculatedIndex);
    }, 200);

    return () => clearInterval(interval);
  }, [showcaseVehicles.length]);

  const handleTogglePlay = () => {
    if (!playerRef.current) return;
    if (isPlaying) {
      playerRef.current.pause();
      setIsPlaying(false);
    } else {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const handleJumpToCar = (index: number) => {
    if (!playerRef.current) return;
    playerRef.current.seekTo(index * SLIDE_DURATION);
    setCurrentCarIndex(index);
    if (!isPlaying) {
      playerRef.current.play();
      setIsPlaying(true);
    }
  };

  const activeVehicle = showcaseVehicles[currentCarIndex] || showcaseVehicles[0];
  const originalVehicle = vehicles.find((v) => v.id === activeVehicle?.id);

  const activeWhatsappUrl = generateWhatsAppLink(
    activeVehicle
      ? `Olá! Estava assistindo ao Showroom Virtual no site da Modelo Multimarcas JF e me interessei no ${activeVehicle.brand} ${activeVehicle.model} ${activeVehicle.version} por ${formatCurrency(activeVehicle.price)}. Poderiam me enviar mais detalhes?`
      : "Olá! Gostaria de mais informações sobre o estoque de seminovos."
  );

  if (showcaseVehicles.length === 0) return null;

  return (
    <section className="py-3 bg-[#F8FAFC] dark:bg-[#06070a] text-slate-900 dark:text-slate-100 border-b border-slate-200 dark:border-[#232a38] transition-colors duration-200 w-full max-w-full overflow-hidden">
      <div className="max-w-[1680px] mx-auto px-2 sm:px-4 md:px-6 lg:px-8 w-full max-w-full">
        {/* Section Header Compacto */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <div className="inline-flex items-center gap-1.5 text-xs font-speed font-bold uppercase tracking-widest text-[#e30613]">
              <Film className="w-3.5 h-3.5" />
              <span>{"// CINE SHOWROOM VIRTUAL"}</span>
            </div>
            <span className="text-slate-300 dark:text-slate-700 hidden sm:inline">•</span>
            <h2 className="text-sm sm:text-base md:text-lg font-black text-zinc-900 dark:text-white tracking-tight uppercase italic font-speed">
              Seminovos em Movimento
            </h2>
          </div>

          {/* Realtime Live Engine Tag */}
          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="bg-white dark:bg-[#0e1117] border border-slate-200 dark:border-[#232a38] text-slate-700 dark:text-slate-300 text-xs font-speed font-bold uppercase tracking-wider px-2.5 py-0.5 rounded shadow-xs flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Remotion Video Player
            </span>
          </div>
        </div>

        {/* Video Player Display Container - Full Width & Immersive */}
        <div className="bg-white dark:bg-[#0e1117] rounded-xl sm:rounded-2xl p-1.5 sm:p-2.5 border border-slate-200/90 dark:border-[#232a38] shadow-xl overflow-hidden w-full max-w-none transition-colors duration-200">
          <div className="relative rounded-lg sm:rounded-xl overflow-hidden bg-slate-950 shadow-lg aspect-video w-full max-w-none">
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
              className="w-full h-full aspect-video object-cover"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
              autoPlay={true}
              loop={true}
              controls={false}
            />

            {/* Float Overlay Play/Pause Button */}
            <div className="absolute top-2.5 right-2.5 sm:top-4 sm:right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-md"
                title={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
              >
                {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5 ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Interactive Navigation Thumbnails & Actions */}
          <div className="mt-2 pt-2 border-t border-slate-100 dark:border-[#232a38] flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-2">
            {/* Cars Selector Pills */}
            <div className="flex overflow-x-auto gap-1.5 no-scrollbar w-full py-0.5 items-center">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-speed shrink-0 mr-1">
                Pular para:
              </span>
              {showcaseVehicles.map((car, idx) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => handleJumpToCar(idx)}
                  className={`px-2.5 py-1 rounded text-xs font-speed font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer flex items-center gap-1.5 border ${
                    currentCarIndex === idx
                      ? "bg-[#e30613] text-white border-[#e30613] shadow-xs"
                      : "bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#1f2430] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-[#232a38]"
                  }`}
                >
                  <CarFront className="w-3 h-3 shrink-0" />
                  <span className="whitespace-nowrap">{car.brand} {car.model}</span>
                </button>
              ))}
            </div>

            {/* Quick Action for Currently Displayed Car */}
            {activeVehicle && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 shrink-0 pt-1 lg:pt-0">
                {originalVehicle && (
                  <button
                    type="button"
                    onClick={() => onSelectVehicle(originalVehicle)}
                    className="w-full sm:w-auto justify-center bg-slate-100 dark:bg-[#151821] hover:bg-slate-200 dark:hover:bg-[#1f2430] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-[#232a38] font-speed font-bold uppercase tracking-wider text-xs px-3 py-1 rounded transition-all cursor-pointer flex items-center gap-1.5 shadow-xs"
                  >
                    <span>Ver Ficha Completa</span>
                    <ArrowUpRight className="w-3.5 h-3.5 shrink-0" />
                  </button>
                )}

                <a
                  href={activeWhatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full sm:w-auto justify-center bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs px-3 py-1 rounded transition-all flex items-center gap-1.5 shadow-xs whitespace-nowrap text-center"
                >
                  <WhatsAppIcon className="w-3.5 h-3.5 fill-white shrink-0" />
                  <span>Quero este {activeVehicle.model}</span>
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
