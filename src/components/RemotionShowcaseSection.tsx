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
    <section className="py-14 sm:py-18 bg-[#F8FAFC] text-slate-900 border-b border-slate-200">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-speed font-bold uppercase tracking-widest text-[#e30613] mb-1.5">
              <Film className="w-3.5 h-3.5" />
              <span>{"// CINE SHOWROOM VIRTUAL • TECNOLOGIA REMOTION"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 tracking-tight uppercase italic font-speed">
              Seminovos em Movimento
            </h2>
            <p className="text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
              Experimente nosso tour em vídeo programático de alta definição. Assista à apresentação dos destaques selecionados ou selecione qualquer veículo abaixo.
            </p>
          </div>

          {/* Realtime Live Engine Tag */}
          <div className="flex items-center gap-2">
            <span className="bg-white border border-slate-200 text-slate-800 text-xs font-speed font-bold uppercase tracking-wider px-3.5 py-2 rounded-xl shadow-sm flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
              Remotion Video Player Ativo
            </span>
          </div>
        </div>

        {/* Video Player Display Container */}
        <div className="bg-white rounded-3xl p-4 sm:p-6 lg:p-7 border border-slate-200 shadow-xl overflow-hidden">
          <div className="relative rounded-2xl overflow-hidden bg-slate-950 shadow-2xl aspect-[16/9] w-full max-h-[640px]">
            <Player
              ref={playerRef}
              component={CarShowcaseComposition}
              inputProps={{
                vehicles: showcaseVehicles,
                slideDurationInFrames: SLIDE_DURATION,
              }}
              durationInFrames={totalFrames}
              fps={FPS}
              compositionWidth={1280}
              compositionHeight={720}
              style={{
                width: "100%",
                height: "100%",
              }}
              autoPlay={true}
              loop={true}
              controls={false}
            />

            {/* Float Overlay Play/Pause Button */}
            <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
              <button
                type="button"
                onClick={handleTogglePlay}
                className="w-10 h-10 rounded-full bg-black/60 hover:bg-black/85 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all cursor-pointer shadow-lg"
                title={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
                aria-label={isPlaying ? "Pausar vídeo" : "Reproduzir vídeo"}
              >
                {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
              </button>
            </div>
          </div>

          {/* Interactive Navigation Thumbnails & Actions */}
          <div className="mt-5 pt-4 border-t border-slate-100 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4">
            {/* Cars Selector Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-speed shrink-0 mr-1">
                Pular para:
              </span>
              {showcaseVehicles.map((car, idx) => (
                <button
                  key={car.id}
                  type="button"
                  onClick={() => handleJumpToCar(idx)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-speed font-bold uppercase tracking-wider transition-all shrink-0 cursor-pointer flex items-center gap-2 border ${
                    currentCarIndex === idx
                      ? "bg-[#e30613] text-white border-[#e30613] shadow-md shadow-red-600/25"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}
                >
                  <CarFront className="w-3.5 h-3.5" />
                  <span>{car.brand} {car.model}</span>
                </button>
              ))}
            </div>

            {/* Quick Action for Currently Displayed Car */}
            {activeVehicle && (
              <div className="flex items-center gap-2 shrink-0">
                {originalVehicle && (
                  <button
                    type="button"
                    onClick={() => onSelectVehicle(originalVehicle)}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 font-speed font-bold uppercase tracking-wider text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                  >
                    <span>Ver Ficha Completa</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </button>
                )}

                <a
                  href={activeWhatsappUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-sm"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-white" />
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
