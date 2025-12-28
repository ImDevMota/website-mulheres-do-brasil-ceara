"use client";
import React, { useEffect, useRef, useState } from "react";
const mapboxgl = require("mapbox-gl");
import "mapbox-gl/dist/mapbox-gl.css";
import { listarRodas } from "../services/rodas";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type Roda = {
  id: number;
  tema: string;
  multiplicador?: {
    nome: string;
  };
  latitude: number | null;
  longitude: number | null;
  local: string;
  municipio: string;
  data: string;
};

export default function MapboxCeara() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [rodas, setRodas] = useState<Roda[]>([]);
  const [rodasCarregadas, setRodasCarregadas] = useState(false);

  useEffect(() => {
    const fetchRodas = async () => {
      try {
        const data = await listarRodas();
        if (Array.isArray(data)) {
          setRodas(data);
          setRodasCarregadas(true);
        } else {
          console.error("Formato de dados inválido recebido:", data);
          setRodas([]);
          setRodasCarregadas(true);
        }
      } catch (error) {
        console.error("Erro ao buscar rodas:", error);
        setRodas([]);
        setRodasCarregadas(true);
      }
    };

    fetchRodas();
  }, []);

  useEffect(() => {
    const init = async () => {
      const mapboxgl = (await import("mapbox-gl")).default;
      mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

      if (!mapContainer.current || mapRef.current) return;

      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: [-39.5, -5.2],
        zoom: 6.2,
      });

      mapRef.current = map;

      map.on("load", () => {
        rodas.forEach((roda) => {
          if (!roda.latitude || !roda.longitude) return;

          const popup = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false,
            offset: 25,
          }).setHTML(`
      <div style="color: black; font-size: 14px;">
        <strong>${roda.tema}</strong><br/>
        Local: ${roda.local}<br/>
        Município: ${roda.municipio}<br/>
        Responsável: ${roda.multiplicador?.nome || "Não informado"}<br/>
        Data: ${(() => {
          const d = new Date(roda.data);
          const dia = String(d.getUTCDate()).padStart(2, "0");
          const mes = String(d.getUTCMonth() + 1).padStart(2, "0");
          const ano = d.getUTCFullYear();
          return `${dia}/${mes}/${ano}`;
        })()}
      </div>
    `);

          const marker = new mapboxgl.Marker({ color: "#e91e63" })
            .setLngLat([roda.longitude, roda.latitude])
            .setPopup(popup) // <-- ESSENCIAL
            .addTo(map);

          const el = marker.getElement();

          el.addEventListener("mouseenter", () => popup.addTo(map));
          el.addEventListener("mouseleave", () => popup.remove());
        });
      });
    };

    if (rodasCarregadas) init();
  }, [rodasCarregadas, rodas]);

  // Mostrar loading enquanto carrega
  if (!rodasCarregadas) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e91e63] mx-auto mb-4"></div>
          <p className="text-lg">Carregando rodas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full flex justify-center my-6">
      <div
        ref={mapContainer}
        className="rounded-lg shadow-lg relative w-full"
        style={{ height: "70vh" }}
      />
    </div>
  );
}
