"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: React.ReactNode;
  asChild?: boolean;
}

export const ShimmerButton = React.forwardRef<HTMLButtonElement, ShimmerButtonProps>(
  (
    {
      shimmerColor = "rgba(255, 255, 255, 0.4)",
      shimmerSize = "0.05em",
      shimmerDuration = "3s",
      borderRadius = "14px",
      background = "rgba(227, 6, 19, 1)",
      className,
      children,
      ...props
    },
    ref
  ) => {
    return (
      <button
        style={
          {
            "--spread": "90deg",
            "--shimmer-color": shimmerColor,
            "--radius": borderRadius,
            "--speed": shimmerDuration,
            "--cut": shimmerSize,
            "--bg": background,
          } as React.CSSProperties
        }
        className={cn(
          "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-6 py-3 text-white [background:var(--bg)] [border-radius:var(--radius)] transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-red-600/20 hover:shadow-red-600/35",
          className
        )}
        ref={ref}
        {...props}
      >
        {/* Shimmer sweep effect */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-full animate-shimmer [background:linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.25)_50%,transparent_100%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        />

        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
      </button>
    );
  }
);

ShimmerButton.displayName = "ShimmerButton";
