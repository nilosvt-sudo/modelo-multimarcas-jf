"use client";

import React, { useState, useEffect } from "react";
import { Review } from "@/types";
import { DEALERSHIP_INFO } from "@/lib/constants";
import {
  Star,
  Quote,
  CheckCircle2,
  MapPin,
  MessageSquarePlus,
  X,
  Send,
  Car,
  ChevronLeft,
  ChevronRight,
  ShieldCheck
} from "lucide-react";

export default function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [authorName, setAuthorName] = useState("");
  const [neighborhood, setNeighborhood] = useState("São Paulo, SP");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [purchasedVehicle, setPurchasedVehicle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const fetchReviews = React.useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/reviews");
      const data = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setReviewsList(data);
      } else {
        // Fallback reviews
        setReviewsList([
          {
            id: 1,
            authorName: "Rodrigo Mendonça",
            neighborhood: "Moema, São Paulo",
            rating: 5,
            comment: "Excelente atendimento! Comprei meu Corolla Altis Hybrid com laudo cautelar aprovado e taxa de financiamento imbatível. Entregaram o carro impecável e revisado.",
            purchasedVehicle: "Toyota Corolla Altis Hybrid",
            isPublished: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 2,
            authorName: "Fernanda Ribeiro",
            neighborhood: "Morumbi, São Paulo",
            rating: 5,
            comment: "A melhor loja de multimarcas de SP. Avaliaram meu carro usado super bem na troca e saí no mesmo dia com a BMW 320i dos meus sonhos. Transparência total!",
            purchasedVehicle: "BMW 320i M Sport",
            isPublished: true,
            createdAt: new Date().toISOString()
          },
          {
            id: 3,
            authorName: "Carlos Eduardo Braga",
            neighborhood: "Brooklin, São Paulo",
            rating: 5,
            comment: "Comprei o Compass da minha esposa e o atendimento foi nota 10. Toda a documentação e transferência resolvida pelo despachante próprio da loja. Recomendo de olhos fechados.",
            purchasedVehicle: "Jeep Compass Limited",
            isPublished: true,
            createdAt: new Date().toISOString()
          }
        ]);
      }
    } catch (e) {
      console.error("Error fetching reviews:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authorName || !comment) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          authorName,
          neighborhood,
          rating,
          comment,
          purchasedVehicle,
        }),
      });
      if (res.ok) {
        setSubmitted(true);
        fetchReviews();
      }
    } catch (e) {
      console.error("Error submitting review:", e);
    } finally {
      setSubmitting(false);
    }
  };

  // Carousel states
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1280) {
        setItemsPerPage(3);
      } else if (width >= 768) {
        setItemsPerPage(2);
      } else {
        setItemsPerPage(1);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalReviews = reviewsList.length;
  const maxIndex = Math.max(0, totalReviews - itemsPerPage);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  return (
    <section id="depoimentos" className="py-14 sm:py-20 bg-slate-100/70 dark:bg-[#0a0c10] text-slate-900 dark:text-slate-100 transition-colors">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4 border-b border-slate-200 dark:border-[#232a38] pb-6">
          <div>
            <div className="inline-flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider text-xs mb-1.5">
              <ShieldCheck className="w-4 h-4" />
              <span>Clientes 100% Satisfeitos</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              O que nossos clientes dizem
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Avaliação média de <strong className="text-amber-500 font-bold">{DEALERSHIP_INFO.googleRating} estrelas</strong> com mais de {DEALERSHIP_INFO.googleReviewCount} avaliações no Google.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                setShowModal(true);
                setSubmitted(false);
              }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#161a22] text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-xl text-xs sm:text-sm font-bold shadow-sm transition-all cursor-pointer"
            >
              <MessageSquarePlus className="w-4 h-4 text-blue-600" />
              <span>Avaliar nossa Loja</span>
            </button>

            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                aria-label="Anterior"
                className="p-2 rounded-xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Próximo"
                className="p-2 rounded-xl bg-white dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 transition-colors cursor-pointer"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel / Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {reviewsList.slice(currentIndex, currentIndex + itemsPerPage).map((rev) => (
            <div
              key={rev.id}
              className="bg-white dark:bg-[#10131a] p-6 rounded-3xl border border-slate-200 dark:border-[#232a38] shadow-sm flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < rev.rating
                            ? "text-amber-500 fill-amber-500"
                            : "text-slate-200 dark:text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                  <Quote className="w-6 h-6 text-blue-200 dark:text-blue-900/60" />
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-[#232a38] flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    {rev.authorName}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {rev.neighborhood || "São Paulo, SP"}
                  </p>
                </div>
                {rev.purchasedVehicle && (
                  <span className="text-[10px] font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-lg">
                    {rev.purchasedVehicle}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Deixar Depoimento */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-white dark:bg-[#10131a] rounded-3xl border border-slate-200 dark:border-[#232a38] p-6 max-w-lg w-full relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 dark:hover:text-white cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
                <h3 className="text-xl font-bold">Avaliação Enviada!</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  Muito obrigado por compartilhar sua experiência de compra na Apex Motors.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <h3 className="text-lg font-bold">Conte como foi sua experiência</h3>

                <div>
                  <label className="block text-xs font-semibold mb-1">Seu Nome Completo</label>
                  <input
                    type="text"
                    required
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] rounded-xl px-3 h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Veículo Comprado ou Negociado</label>
                  <input
                    type="text"
                    placeholder="Ex: Jeep Compass, Corolla, BMW 320i..."
                    value={purchasedVehicle}
                    onChange={(e) => setPurchasedVehicle(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] rounded-xl px-3 h-9 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Nota de Satisfação</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRating(s)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            s <= rating ? "text-amber-500 fill-amber-500" : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold mb-1">Seu Depoimento</label>
                  <textarea
                    rows={3}
                    required
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a22] border border-slate-200 dark:border-[#232a38] rounded-xl p-3 text-xs"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  {submitting ? "Enviando..." : "Publicar Avaliação"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
