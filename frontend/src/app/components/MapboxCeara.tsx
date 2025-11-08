"use client";

import React, { useEffect, useRef } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

type RodaSimulada = {
  id: number;
  nome: string;
  tema: string;
  responsavel: string;
  latitude: number;
  longitude: number;
  participantes: number;
};

export default function MapboxCeara() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);

  const rodasSimuladas: RodaSimulada[] = [
    {
      id: 1,
      nome: "Roda de Literatura",
      tema: "Leitura e Discussão",
      responsavel: "Maria Silva",
      latitude: -3.73,
      longitude: -38.526,
      participantes: 12,
    },
    {
      id: 2,
      nome: "Roda de Música",
      tema: "Prática Musical",
      responsavel: "João Santos",
      latitude: -5.794,
      longitude: -35.211,
      participantes: 8,
    },
    {
      id: 3,
      nome: "Roda de Tecnologia",
      tema: "Inovação e Startups",
      responsavel: "Ana Costa",
      latitude: -4.209,
      longitude: -39.476,
      participantes: 20,
    },
    {
      id: 4,
      nome: "Roda de Arte",
      tema: "Pintura e Escultura",
      responsavel: "Carlos Pereira",
      latitude: -5.487,
      longitude: -38.952,
      participantes: 15,
    },
  ];

  useEffect(() => {
    if (mapRef.current || !mapContainer.current) return;

    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/streets-v12",
      center: [-39.3206, -5.4984],
      zoom: 6,
    });

    mapRef.current.on("load", () => {
      rodasSimuladas.forEach((roda) => {
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false,
          offset: 25,
        }).setHTML(`
          <div style="color: black; font-size: 14px;">
            <strong>${roda.nome}</strong><br/>
            Tema: ${roda.tema}<br/>
            Responsável: ${roda.responsavel}<br/>
            Participantes: ${roda.participantes}
          </div>
        `);

        const marker = new mapboxgl.Marker({ color: "#10b981" })
          .setLngLat([roda.longitude, roda.latitude])
          .addTo(mapRef.current!);

        const markerElement = marker.getElement();
        markerElement.addEventListener("mouseenter", () =>
          marker.setPopup(popup).togglePopup()
        );
        markerElement.addEventListener("mouseleave", () =>
          marker.togglePopup()
        );
      });
    });
  }, []);

  return (
    <div className="flex justify-center my-6">
      <div
        ref={mapContainer}
        className="rounded-lg shadow-lg"
        style={{ width: "70%", height: "100vh" }} // Aqui você define o tamanho do mapa
      />
    </div>
  );
}
