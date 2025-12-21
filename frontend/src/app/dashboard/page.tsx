"use client";

import dynamic from "next/dynamic";
import Header from "../components/Header";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import ModalNovaRoda from "../components/ModalNovaRoda";
import Footer from "../components/Footer";
import { getUserProfile } from "../services/auth";
import SectionRodas from "../components/SectionRodas";
import SectionHistoricoRodas from "../components/SectionHistoricoRodas";
import SectionGrafico from "../components/SectionGrafico";

export default function Page() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState<{ nome: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Carregar dados od usuário
    getUserProfile()
      .then((data) => {
        if (data) setUser(data);
      })
      .catch((err) => console.error("Erro ao carregar perfil:", err));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <SectionGrafico
        userName={user?.nome}
        onNewRodaClick={() => setIsModalOpen(true)}
      />

      <SectionRodas />

      <SectionHistoricoRodas />

      <ModalNovaRoda
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          router.refresh();
        }}
      />

      <Footer />
    </div>
  );
}
