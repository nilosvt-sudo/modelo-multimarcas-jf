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

  // Ken Burns zoom effect
  const imageScale = interpolate(frame, [0, durationInFrames], [1.05, 1.15], {
    extrapolateRight: "clamp",
  });
  const imageTranslateY = interpolate(frame, [0, durationInFrames], [0, -8], {
    extrapolateRight: "clamp",
  });

  // Entry transitions
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

  // Slide progress bar
  const progressPercent = interpolate(frame, [0, durationInFrames], [0, 100], {
    extrapolateRight: "clamp",
  });

  const formattedPrice = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(parseFloat(vehicle.price));

  return (
    <AbsoluteFill className="overflow-hidden bg-slate-950 font-sans select-none w-full h-full">
      {/* Background Image */}
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

      {/* Overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-black/30" />
      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />

      {/* Top Header Strip */}
      <div className="absolute top-0 inset-x-0 p-5 sm:p-7 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <div className="px-3 py-1 rounded-full bg-blue-600 text-white font-black text-xs tracking-wider uppercase backdrop-blur-md">
            Apex Motors
          </div>
          <span className="text-white/80 text-xs font-semibold">
            Destaque {slideIndex + 1} de {totalSlides}
          </span>
        </div>

        <div className="flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-1 rounded-full border border-blue-500/30">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-white text-xs font-bold uppercase tracking-wider">
            Laudo Cautelar Aprovado
          </span>
        </div>
      </div>

      {/* Bottom Content Card */}
      <div className="absolute bottom-0 inset-x-0 p-6 sm:p-10 z-20 flex flex-col justify-end">
        {/* Category & Badge */}
        <div
          style={{
            opacity: badgeSpring,
            transform: `translateY(${(1 - badgeSpring) * 15}px)`,
          }}
          className="flex items-center gap-2 mb-2"
        >
          <span className="bg-blue-600 text-white text-xs font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
            {vehicle.brand}
          </span>
          {vehicle.badge && (
            <span className="bg-white/90 text-slate-900 text-xs font-bold px-2.5 py-0.5 rounded-md uppercase tracking-wider">
              {vehicle.badge}
            </span>
          )}
        </div>

        {/* Title */}
        <div
          style={{
            opacity: titleSpring,
            transform: `translateY(${(1 - titleSpring) * 20}px)`,
          }}
        >
          <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black text-white drop-shadow-md leading-tight">
            {vehicle.model}
          </h2>
          <p className="text-blue-200 text-sm sm:text-lg font-medium mt-1 drop-shadow">
            {vehicle.version} • {vehicle.color}
          </p>
        </div>

        {/* Specs & Pricing */}
        <div
          style={{
            opacity: priceSpring,
            transform: `translateY(${(1 - priceSpring) * 20}px)`,
          }}
          className="mt-4 flex flex-wrap items-center justify-between gap-4 pt-3 border-t border-white/20"
        >
          <div className="flex items-center gap-4 text-xs sm:text-sm text-white/90 font-medium">
            <span>🕹️ {vehicle.transmission}</span>
            <span>⛽ {vehicle.fuel}</span>
          </div>

          <div className="text-right">
            <span className="text-xs text-blue-300 block font-semibold uppercase">Valor Promocional</span>
            <span className="text-xl sm:text-3xl font-black text-white">
              {formattedPrice}
            </span>
          </div>
        </div>

        {/* Slide Progress Indicator */}
        <div className="w-full bg-white/20 h-1.5 rounded-full mt-4 overflow-hidden">
          <div
            className="h-full bg-blue-500 rounded-full transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </AbsoluteFill>
  );
};
