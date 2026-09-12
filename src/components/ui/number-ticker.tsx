"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface NumberTickerProps {
  value: number;
  direction?: "up" | "down";
  delay?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function NumberTicker({
  value,
  direction = "up",
  delay = 0,
  className,
  prefix = "",
  suffix = "",
}: NumberTickerProps) {
  // Inicializa já com o valor real para renderização estática / SSR e mobile sem atraso de tela zerada
  const [displayValue, setDisplayValue] = useState(value);
  const ref = useRef<HTMLSpanElement>(null);
  const animatedRef = useRef(false);

  useEffect(() => {
    // Se a API de IntersectionObserver estiver disponível e o elemento estiver no DOM
    if (typeof window === "undefined") return;

    if (!("IntersectionObserver" in window)) {
      setDisplayValue(value);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animatedRef.current) {
          animatedRef.current = true;
          // Inicia a animação se desejado, garantindo valor final imediato se houver problemas
          const duration = 1200; // ms
          const steps = 30;
          const stepDuration = duration / steps;
          const increment = value / steps;
          let currentStep = 0;

          const timer = setInterval(() => {
            currentStep++;
            if (currentStep >= steps) {
              setDisplayValue(value);
              clearInterval(timer);
            } else {
              setDisplayValue(Math.floor(increment * currentStep));
            }
          }, stepDuration);
        }
      },
      { threshold: 0.05 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [value]);

  return (
    <span
      ref={ref}
      className={cn("inline-block tabular-nums font-bold tracking-tight", className)}
    >
      {prefix}
      {displayValue.toLocaleString("pt-BR")}
      {suffix}
    </span>
  );
}
