"use client";

import dynamic from "next/dynamic";
import Header from "./components/Header";
import Link from "next/link";

const MapboxCeara = dynamic(() => import("./components/MapboxCeara"), {
  ssr: false,
});

export default function Page() {
  return (
    <div className="w-full h-screen">
      <Header />
      <MapboxCeara />
    </div>
  );
}
