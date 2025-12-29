"use client";
import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  // Verifica se o usuário está logado ao carregar o componente
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkAuth();

    // Escuta mudanças no storage (para atualizar quando fizer login/logout em outra aba)
    window.addEventListener("storage", checkAuth);
    
    // Re-verifica quando a página volta a ser visível
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        checkAuth();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("storage", checkAuth);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setMenuOpen(false);
    router.push("/");
  };

  return (
    <header className="w-full bg-[#e91e63] text-white shadow-lg sticky top-0 z-50">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="flex items-center gap-3 group">
            <img
              src="/logo-header.webp"
              alt="Mulheres do Brasil Ceará"
              className="w-[140px] transition-transform group-hover:scale-105"
            />
          </Link>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            href="/"
            className="px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-all"
          >
            Início
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                className="px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="ml-2 px-5 py-2 bg-white text-[#e91e63] rounded-full font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                className="px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-all"
              >
                Cadastro
              </Link>
              <Link
                href="/login"
                className="ml-2 px-5 py-2 bg-white text-[#e91e63] rounded-full font-semibold hover:bg-gray-100 transition-all shadow-md hover:shadow-lg"
              >
                Entrar
              </Link>
            </>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden p-2 rounded-lg hover:bg-white/20 transition-all"
          aria-label="Menu"
        >
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {menuOpen && (
        <nav className="md:hidden bg-[#c2185b] border-t border-white/20 px-6 py-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMenuOpen(false)}
            className="block px-4 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
          >
            Início
          </Link>
          
          {isLoggedIn ? (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-3 bg-white text-[#e91e63] rounded-lg font-semibold text-center hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sair
              </button>
            </>
          ) : (
            <>
              <Link
                href="/register"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
              >
                Cadastro
              </Link>
              <Link
                href="/login"
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 bg-white text-[#e91e63] rounded-lg font-semibold text-center hover:bg-gray-100 transition-all"
              >
                Entrar
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}

