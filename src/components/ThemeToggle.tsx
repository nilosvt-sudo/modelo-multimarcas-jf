"use client";

import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  variant?: "header" | "pill" | "menu";
  className?: string;
}

export default function ThemeToggle({ variant = "header", className = "" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  if (variant === "menu") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
          isDark
            ? "bg-[#151821] text-amber-300 hover:bg-[#232a38] border border-[#232a38]"
            : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
        } ${className}`}
        aria-label="Alternar tema claro e escuro"
      >
        <span className="flex items-center gap-2.5">
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700" />
          )}
          <span>{isDark ? "Modo Claro" : "Modo Escuro"}</span>
        </span>
        <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-md font-speed bg-[#e30613]/15 text-[#e30613]">
          {isDark ? "Dark Ativo" : "Light Ativo"}
        </span>
      </button>
    );
  }

  if (variant === "pill") {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer border ${
          isDark
            ? "bg-[#151821] hover:bg-[#232a38] text-slate-200 border-[#232a38]"
            : "bg-white hover:bg-slate-100 text-slate-700 border-slate-200 shadow-sm"
        } ${className}`}
        title={`Alternar para modo ${isDark ? "claro" : "escuro"}`}
        aria-label={`Alternar para modo ${isDark ? "claro" : "escuro"}`}
      >
        <span className="relative w-4 h-4 flex items-center justify-center">
          {isDark ? (
            <Sun className="w-3.5 h-3.5 text-amber-400 animate-in fade-in zoom-in duration-200" />
          ) : (
            <Moon className="w-3.5 h-3.5 text-slate-600 animate-in fade-in zoom-in duration-200" />
          )}
        </span>
        <span className="font-speed uppercase tracking-wider text-[11px]">
          {isDark ? "Tema Escuro" : "Tema Claro"}
        </span>
      </button>
    );
  }

  // Default: Header icon button
  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={`relative p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center group ${
        isDark
          ? "bg-[#151821] hover:bg-[#232a38] text-amber-400 border-[#232a38] hover:border-amber-400/40 shadow-sm"
          : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200 hover:border-slate-300 shadow-sm"
      } ${className}`}
      title={`Alternar para modo ${isDark ? "claro" : "escuro"}`}
      aria-label={`Alternar para modo ${isDark ? "claro" : "escuro"}`}
    >
      <span className="sr-only">Alternar tema</span>
      {isDark ? (
        <Sun className="w-4 h-4 text-amber-400 transition-transform group-hover:rotate-45 duration-300" />
      ) : (
        <Moon className="w-4 h-4 text-slate-700 group-hover:text-[#e30613] transition-transform group-hover:-rotate-12 duration-300" />
      )}
    </button>
  );
}
