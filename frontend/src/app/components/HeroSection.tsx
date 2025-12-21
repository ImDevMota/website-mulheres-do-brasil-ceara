"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Users, ArrowRight } from "lucide-react";

interface HeroSectionProps {
  totalMulheres?: number;
}

export default function HeroSection({ totalMulheres = 0 }: HeroSectionProps) {
  const [count, setCount] = useState(0);

  // Animação de contagem
  useEffect(() => {
    if (totalMulheres === 0) return;

    const duration = 2000; // 2 segundos
    const steps = 60;
    const increment = totalMulheres / steps;
    let current = 0;

    const timer = setInterval(() => {
      current += increment;
      if (current >= totalMulheres) {
        setCount(totalMulheres);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [totalMulheres]);

  return (
    <section className="relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#e91e63] via-[#c2185b] to-[#880e4f]" />

      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-6 py-20 md:py-28">
        <div className="text-center text-white">
          {/* Counter */}
          {totalMulheres > 0 && (
            <div className="mb-6 flex items-center justify-center gap-3">
              <Users className="w-10 h-10 text-[#f8bbd9]" />
              <span className="text-5xl md:text-7xl font-bold tracking-tight">
                {count.toLocaleString("pt-BR")}
              </span>
            </div>
          )}

          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
            Mulheres do Brasil
            <span className="block text-[#f8bbd9]">Núcleo Ceará</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-8 leading-relaxed">
            Protagonismo que transforma. Unindo mulheres para construir um Ceará
            mais justo, igualitário e próspero para todos.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-[#e91e63] rounded-full font-bold text-lg hover:bg-gray-100 hover:scale-105 transition-all shadow-xl"
            >
              Junte-se a Nós
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all"
            >
              Ver Suas Rodas de Conversa
            </Link>
          </div>
        </div>
      </div>

      {/* Wave Bottom */}
      <div className="absolute -bottom-1 left-0 right-0">
        <svg
          viewBox="0 0 1440 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-auto"
        >
          <path
            d="M0 50L60 45.8C120 41.7 240 33.3 360 37.5C480 41.7 600 58.3 720 62.5C840 66.7 960 58.3 1080 50C1200 41.7 1320 33.3 1380 29.2L1440 25V100H1380C1320 100 1200 100 1080 100C960 100 840 100 720 100C600 100 480 100 360 100C240 100 120 100 60 100H0V50Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
