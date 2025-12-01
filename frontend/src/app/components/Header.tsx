"use client";
import Link from "next/link";

import Image from "next/image";
import { FaSearch } from "react-icons/fa";

export default function Header() {
  return (
    <header className="w-full bg-[#D49D32] text-gray-900">
      <div className="flex items-center justify-between max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center">
          <Link href="/" className="">
            <img src="logo-header.webp" alt="" className="w-[150px]" />
          </Link>
        </div>

        <nav className="hidden md:flex items-center space-x-6 text-white font-medium">
          <ul className="flex flex-row gap-x-[3rem]">
            <li>
              <Link href="/register" className="">
                Cadastro
              </Link>
            </li>
            <li>
              <Link href="/login" className="">
                Login
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
