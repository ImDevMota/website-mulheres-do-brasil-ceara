"use client";

import dynamic from "next/dynamic";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HeroSection from "./components/HeroSection";

const MapboxCeara = dynamic(() => import("./components/MapboxCeara"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <HeroSection totalMulheres={1250} />
      
      {/* Seção do Mapa */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Rodas de Conversa no <span className="text-[#e91e63]">Ceará</span>
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Acompanhe as rodas de conversa realizadas em todo o estado.
              Cada ponto no mapa representa um momento de transformação e diálogo.
            </p>
          </div>
          <MapboxCeara />
        </div>
      </section>
      
      <Footer />
    </div>
  );
}

