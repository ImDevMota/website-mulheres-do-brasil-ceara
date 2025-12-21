"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselProps<T> {
  title: string;
  items: T[];
  renderItem: (item: T) => React.ReactNode;
  onRefresh: () => void;
  emptyMessage: string;
  loading?: boolean;
}

export default function Carousel<T>({
  title,
  items,
  renderItem,
  onRefresh,
  emptyMessage,
  loading = false,
}: CarouselProps<T>) {
  const [startIndex, setStartIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setItemsPerPage(1);
      } else {
        setItemsPerPage(3);
      }
    };

    // Set initial value
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleNext = () => {
    if (startIndex + itemsPerPage < items.length) {
      setStartIndex((prev) => prev + itemsPerPage);
    }
  };

  const handlePrev = () => {
    if (startIndex - itemsPerPage >= 0) {
      setStartIndex((prev) => prev - itemsPerPage);
    } else {
      // Prevent negative index if resizing caused weird offset
      setStartIndex(0);
    }
  };

  const visibleItems = items.slice(startIndex, startIndex + itemsPerPage);

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
            {title}
          </h2>
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#e91e63]"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-12 px-4 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={onRefresh}
            className="bg-[#e91e63] text-white px-4 py-2 rounded-lg hover:bg-[#c2185b] transition flex items-center gap-2"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Atualizar
          </button>
        </div>

        {items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <p className="text-gray-500 text-lg">{emptyMessage}</p>
          </div>
        ) : (
          <div className="relative">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {visibleItems.map((item, index) => (
                <div key={startIndex + index} className="h-full">
                  {renderItem(item)}
                </div>
              ))}
            </div>

            {/* Navigation Buttons */}
            {startIndex > 0 && (
              <button
                onClick={handlePrev}
                className="absolute left-[-20px] md:left-[-50px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#e91e63] p-3 rounded-full shadow-lg transition-all z-10 cursor-pointer"
                aria-label="Anterior"
              >
                <ChevronLeft size={32} />
              </button>
            )}

            {startIndex + itemsPerPage < items.length && (
              <button
                onClick={handleNext}
                className="absolute right-[-20px] md:right-[-50px] top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white text-[#e91e63] p-3 rounded-full shadow-lg transition-all z-10 cursor-pointer"
                aria-label="Próximo"
              >
                <ChevronRight size={32} />
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
