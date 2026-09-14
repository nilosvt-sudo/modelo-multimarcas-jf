import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { CarShowcaseItem } from "./types";

interface CarSlideProps {
  vehicle: CarShowcaseItem;
  slideIndex: number;
  totalSlides: number;
}

export const CarSlide: React.FC<CarSlideProps> = ({
  vehicle,
  slideIndex,
  totalSlides,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();

  // Ken Burns zoom effect (smooth, cinematic camera zoom without edge revealing)
  const imageScale = interpolate(frame, [0, durationInFrames], [1.05, 1.16], {
    extrapolateRight: "clamp",
  });
  const imageTranslateY = interpolate(frame, [0, durationInFrames], [0, -10], {
    extrapolateRight: "clamp",
  });

  // Entry transitions with spring physics
  const badgeSpring = spring({
    frame,
    fps,
    config: { damping: 12, stiffness: 120 },
  });

  const titleSpring = spring({
    frame: frame - 6,
    fps,
    config: { damping: 14, stiffness: 100 },
  });

  const priceSpring = spring({
    frame: frame - 12,
    fps,
    config: { damping: 14, stiffness: 110 },
  });

  const specsSpring = spring({
    frame: frame - 16,
    fps,
    config: { damping: 16, stiffness: 90 },
  });

  // Slide progress bar (0% to 100%)
  const progressPercent = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  // Formatting price
  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(parseFloat(vehicle.price));

  const formattedMileage = new Intl.NumberFormat("pt-BR").format(vehicle.mileage);

  return (
    <AbsoluteFill className="overflow-hidden bg-slate-950 font-sans select-none w-full h-full">
      {/* Background Car Image with Ken Burns motion */}
      <div
        style={{
          transform: `scale(${imageScale}) translateY(${imageTranslateY}px)`,
          width: "100%",
          height: "100%",
        }}
        className="w-full h-full absolute inset-0"
      >
        <Img
          src={vehicle.coverImage}
          className="w-full h-full object-cover"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
          alt={`${vehicle.brand} ${vehicle.model}`}
        />
      </div>

      {/* Cinematic Vignette & Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />

      {/* Top Header Strip: Dealership brand, current car index & Live Showroom pill */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-10">
        <div
          style={{
            opacity: badgeSpring,
            transform: `translateY(${interpolate(badgeSpring, [0, 1], [-20, 0])}px)`,
          }}
          className="flex items-center gap-3 bg-black/75 backdrop-blur-md border border-white/20 px-3.5 py-1.5 rounded-xl shadow-lg text-white"
        >
          <div className="w-6 h-6 rounded-md bg-white p-0.5 flex items-center justify-center overflow-hidden">
            <img src="/images/logo-oficial.jpg" alt="Logo Oficial Modelo Multimarcas JF" className="w-full h-full object-contain" />
          </div>
          <span className="font-speed font-black tracking-wider text-xs uppercase text-white">
            MODELO MULTIMARCAS JF
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-[#e30613]" />
          <span className="text-[11px] font-medium text-slate-300">
            SHOWROOM VIRTUAL
          </span>
        </div>

        <div
          style={{
            opacity: badgeSpring,
            transform: `translateY(${interpolate(badgeSpring, [0, 1], [-20, 0])}px)`,
          }}
          className="flex items-center gap-2 bg-black/75 backdrop-blur-md border border-white/20 px-3 py-1 rounded-xl text-xs font-speed font-bold text-white shadow-lg"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span>VEÍCULO {slideIndex + 1} DE {totalSlides}</span>
        </div>
      </div>

      {/* Center/Bottom Overlay: Car Information */}
      <div className="absolute bottom-8 left-6 right-6 z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        {/* Left column: Brand, Model, Version & Quality Badges */}
        <div className="max-w-2xl space-y-2.5">
          {/* Badges tag row */}
          <div
            style={{
              opacity: badgeSpring,
              transform: `scale(${badgeSpring})`,
            }}
            className="flex flex-wrap items-center gap-2"
          >
            {vehicle.badge && (
              <span className="bg-[#e30613] text-white text-[10px] font-speed font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow">
                {vehicle.badge}
              </span>
            )}
            {vehicle.hasInspectionReport && (
              <span className="bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md shadow border border-emerald-400/30 flex items-center gap-1">
                ✓ Laudo Cautelar 100% Aprovado
              </span>
            )}
            <span className="bg-slate-800/90 backdrop-blur-sm text-slate-200 text-[10px] font-medium px-2.5 py-1 rounded-md border border-white/10">
              Garantia de Procedência
            </span>
          </div>

          {/* Headline Title */}
          <div
            style={{
              opacity: titleSpring,
              transform: `translateY(${interpolate(titleSpring, [0, 1], [30, 0])}px)`,
            }}
          >
            <h2 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-black uppercase italic font-speed text-white tracking-tight drop-shadow-md">
              {vehicle.brand} <span className="text-white">{vehicle.model}</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 font-medium mt-0.5 line-clamp-1 drop-shadow">
              {vehicle.version} • {vehicle.yearFabrication}/{vehicle.yearModel}
            </p>
          </div>

          {/* Quick Specs Pill Row */}
          <div
            style={{
              opacity: specsSpring,
              transform: `translateY(${interpolate(specsSpring, [0, 1], [20, 0])}px)`,
            }}
            className="flex flex-wrap items-center gap-3 pt-1 text-xs text-slate-300 font-medium"
          >
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15">
              🚀 <strong className="text-white font-speed">{formattedMileage} km</strong>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15">
              ⚙️ <strong className="text-white">{vehicle.transmission}</strong>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15">
              ⛽ <strong className="text-white">{vehicle.fuel}</strong>
            </div>
            <div className="bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg border border-white/15">
              🎨 <strong className="text-white">{vehicle.color}</strong>
            </div>
          </div>
        </div>

        {/* Right column: Price Card */}
        <div
          style={{
            opacity: priceSpring,
            transform: `scale(${priceSpring})`,
          }}
          className="bg-black/75 backdrop-blur-md border border-white/20 p-4 rounded-2xl shadow-2xl shrink-0 text-right space-y-1"
        >
          <span className="text-[10px] text-slate-400 font-speed uppercase tracking-wider block">
            Valor à Vista ou Financiado
          </span>
          <div className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-speed tracking-tight">
            {formattedPrice}
          </div>
          <div className="text-[11px] text-emerald-400 font-medium">
            Entrada facilitada + Aceita Troca
          </div>
        </div>
      </div>

      {/* Bottom Progress Bar for this Slide */}
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/20 z-20 overflow-hidden">
        <div
          style={{ width: `${progressPercent}%` }}
          className="h-full bg-[#e30613] shadow-[0_0_10px_#e30613]"
        />
      </div>
    </AbsoluteFill>
  );
};
