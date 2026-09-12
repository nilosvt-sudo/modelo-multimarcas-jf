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
  CarFront,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

export default function ReviewsSection() {
  const [reviewsList, setReviewsList] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  // Form states
  const [authorName, setAuthorName] = useState("");
  const [neighborhood, setNeighborhood] = useState("Juiz de Fora");
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
      if (Array.isArray(data)) {
        setReviewsList(data);
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
  const [isPaused, setIsPaused] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  // Responsive itemsPerPage detection
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

  const totalItems = reviewsList.length;
  const maxIndex = Math.max(0, totalItems - itemsPerPage);

  // Autoplay timer (4.5s)
  useEffect(() => {
    if (isPaused || totalItems <= itemsPerPage) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused, totalItems, itemsPerPage, maxIndex]);

  // Adjust currentIndex if window resized
  useEffect(() => {
    if (currentIndex > maxIndex) {
      setCurrentIndex(maxIndex);
    }
  }, [maxIndex, currentIndex]);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= maxIndex ? 0 : prev + 1));
  };

  // Touch Swipe handlers
  const minSwipeDistance = 40;

  const onTouchStart = (e: React.TouchEvent) => {
    setIsPaused(true);
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    setIsPaused(false);
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe) {
      handleNext();
    } else if (isRightSwipe) {
      handlePrev();
    }
  };

  return (
    <section id="depoimentos" className="py-16 sm:py-20 bg-[#F8FAFC] dark:bg-[#07090e] text-slate-900 dark:text-zinc-100 scroll-mt-20 border-b border-slate-200 dark:border-zinc-800/80 overflow-hidden transition-colors">
      <div className="max-w-[1680px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-speed font-bold uppercase tracking-widest text-[#e30613] mb-1.5">
              <span>{"// REPUTAÇÃO E CONFIANÇA EM JUIZ DE FORA"}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-900 dark:text-white tracking-tight uppercase italic font-speed">
              Depoimentos Verificados
            </h2>
            <p className="text-sm text-slate-600 dark:text-zinc-400 mt-1 max-w-2xl leading-relaxed">
              Avaliações reais de clientes que compraram ou negociaram seu veículo na Modelo Multimarcas JF.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:flex items-center gap-2.5 bg-white dark:bg-[#11141d] border border-slate-200 dark:border-zinc-800 px-4 py-2.5 rounded-xl shadow-sm text-slate-800 dark:text-zinc-200">
              <div className="flex text-[#FBBF24]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                ))}
              </div>
              <span className="font-black text-slate-900 dark:text-white text-sm tabular-nums font-speed">{DEALERSHIP_INFO.googleRating}</span>
              <span className="text-xs text-slate-500 dark:text-zinc-400">({DEALERSHIP_INFO.googleReviewCount} avaliações Google)</span>
            </div>

            <button
              onClick={() => {
                setSubmitted(false);
                setShowModal(true);
              }}
              className="bg-white dark:bg-[#11141d] hover:bg-slate-50 dark:hover:bg-[#171b26] text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 font-speed font-bold uppercase tracking-wider text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <MessageSquarePlus className="w-4 h-4 text-[#e30613]" />
              Deixar Avaliação
            </button>

            {/* Carousel Navigation Buttons (Header/Desktop) */}
            {totalItems > itemsPerPage && (
              <div className="flex items-center gap-2 ml-1">
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Depoimento anterior"
                  className="w-10 h-10 rounded-full bg-white dark:bg-[#11141d] border border-slate-200 dark:border-zinc-800 shadow-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#171b26] hover:border-slate-300 dark:hover:border-zinc-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Próximo depoimento"
                  className="w-10 h-10 rounded-full bg-white dark:bg-[#11141d] border border-slate-200 dark:border-zinc-800 shadow-sm text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-[#171b26] hover:border-slate-300 dark:hover:border-zinc-700 flex items-center justify-center transition-all cursor-pointer active:scale-95"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Carousel Container */}
        <div
          className="relative select-none"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {[1, 2, 3].map((n) => (
                <div key={n} className="bg-white dark:bg-[#11141d] border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 h-64 animate-pulse shadow-sm" />
              ))}
            </div>
          ) : totalItems === 0 ? (
            <div className="text-center py-12 text-slate-500 dark:text-zinc-400 text-sm">
              Nenhuma avaliação cadastrada no momento.
            </div>
          ) : (
            <div className="overflow-hidden py-2 -my-2">
              <div
                className="flex transition-transform duration-500 ease-out will-change-transform"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
                }}
              >
                {reviewsList.map((rev) => (
                  <div
                    key={rev.id}
                    className="shrink-0 px-2.5 sm:px-3.5 box-border"
                    style={{ width: `${100 / itemsPerPage}%` }}
                  >
                    <div className="bg-white dark:bg-[#10131b] border border-slate-200/90 dark:border-zinc-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:border-slate-300 dark:hover:border-zinc-700 hover:shadow-lg transition-all h-full min-h-[250px] relative group shadow-sm">
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex text-[#FBBF24]">
                            {Array.from({ length: rev.rating || 5 }).map((_, idx) => (
                              <Star key={idx} className="w-4 h-4 fill-[#FBBF24] text-[#FBBF24]" />
                            ))}
                          </div>
                          <Quote className="w-6 h-6 text-[#e30613]/25 group-hover:text-[#e30613]/40 transition-colors" />
                        </div>

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-zinc-300 leading-relaxed italic mb-5">
                          &quot;{rev.comment}&quot;
                        </p>
                      </div>

                      <div className="pt-3.5 border-t border-slate-100 dark:border-zinc-800/80 flex items-center justify-between gap-2">
                        <div className="min-w-0">
                          <h4 className="font-speed font-bold text-slate-900 dark:text-zinc-100 text-sm uppercase tracking-wide truncate">
                            {rev.authorName}
                          </h4>
                          <span className="text-[11px] text-slate-500 dark:text-zinc-400 flex items-center gap-1 mt-0.5 truncate">
                            <MapPin className="w-3 h-3 text-[#e30613] shrink-0" />
                            {rev.neighborhood || "Juiz de Fora - MG"}
                          </span>
                        </div>

                        {rev.purchasedVehicle && (
                          <span className="text-[10px] bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700 px-2.5 py-1 rounded-md font-semibold flex items-center gap-1 shrink-0 whitespace-nowrap">
                            <CarFront className="w-3 h-3 text-slate-500 dark:text-zinc-400" />
                            {rev.purchasedVehicle}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dots Pagination */}
          {totalItems > itemsPerPage && (
            <div className="flex items-center justify-center gap-2 mt-8">
              {Array.from({ length: maxIndex + 1 }).map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setCurrentIndex(idx)}
                  aria-label={`Ir para o slide ${idx + 1}`}
                  className={`h-2.5 rounded-full transition-all cursor-pointer ${
                    currentIndex === idx
                      ? "w-8 bg-[#e30613] shadow-sm"
                      : "w-2.5 bg-slate-300 dark:bg-zinc-700 hover:bg-slate-400 dark:hover:bg-zinc-600"
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Review Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-sm" onClick={() => setShowModal(false)} />

          <div className="relative bg-white dark:bg-[#0e1118] rounded-3xl shadow-2xl max-w-lg w-full p-6 sm:p-8 z-10 border border-slate-200 dark:border-zinc-800 text-slate-900 dark:text-zinc-100">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-zinc-800 mb-5">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white font-speed uppercase">Avalie sua Experiência</h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-zinc-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto shadow-sm">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h4 className="text-xl font-bold text-slate-900 dark:text-white font-speed uppercase">Obrigado pela Avaliação!</h4>
                <p className="text-xs text-slate-600 dark:text-zinc-400">
                  Seu depoimento é fundamental para continuarmos mantendo o padrão de qualidade na Modelo Multimarcas JF.
                </p>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 font-semibold text-xs px-5 py-2.5 rounded-xl cursor-pointer transition-colors"
                >
                  Concluir
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-speed uppercase tracking-wider">
                    Sua Nota
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1 cursor-pointer"
                      >
                        <Star
                          className={`w-7 h-7 ${
                            star <= rating
                              ? "fill-[#FBBF24] text-[#FBBF24] scale-110"
                              : "text-slate-300 dark:text-zinc-700"
                          } transition-transform`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-speed uppercase tracking-wider">
                    Seu Nome *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Amanda Silva"
                    value={authorName}
                    onChange={(e) => setAuthorName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-speed uppercase tracking-wider">
                      Bairro / Cidade
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: São Mateus, JF"
                      value={neighborhood}
                      onChange={(e) => setNeighborhood(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-speed uppercase tracking-wider">
                      Carro Comprado
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: Honda Civic"
                      value={purchasedVehicle}
                      onChange={(e) => setPurchasedVehicle(e.target.value)}
                      className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5 font-speed uppercase tracking-wider">
                    Seu Depoimento *
                  </label>
                  <textarea
                    required
                    rows={3}
                    placeholder="Conte como foi o atendimento, a entrega do carro e a negociação..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-[#161a24] border border-slate-300 dark:border-zinc-700 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-zinc-500 rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#e30613] focus:ring-1 focus:ring-[#e30613] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#e30613] hover:bg-[#c40510] text-white font-speed font-bold uppercase tracking-wider py-3.5 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  {submitting ? "Publicando..." : "Publicar Avaliação"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
