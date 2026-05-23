"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { tools } from "@/lib/tools";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // Cierra el menú al cambiar de página
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1c1d1d] bg-[#0d0e0e]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center">
          <Image
            src="/og-image.png"
            alt="GAFA"
            width={56}
            height={56}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav */}
        <nav className="hidden items-center gap-1 sm:flex">
          {tools.map((tool) => {
            const isActive = pathname.startsWith(tool.href);
            return (
              <Link
                key={tool.slug}
                href={tool.href}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-white text-[#0d0e0e]"
                    : "text-zinc-400 hover:bg-[#1c1d1d] hover:text-white"
                }`}
              >
                {tool.name}
              </Link>
            );
          })}
        </nav>

        {/* Desktop CTA */}
        <a
          href="https://gafa.com.bo"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden shrink-0 rounded-full border border-zinc-600 px-4 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-white hover:text-white sm:block"
        >
          Visitar gafa.com.bo ↗
        </a>

        {/* Hamburger — solo mobile */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? "Cerrar menú" : "Abrir menú"}
          className="flex items-center justify-center rounded-md p-2 text-zinc-400 transition-colors hover:bg-[#1c1d1d] hover:text-white sm:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="border-t border-[#1c1d1d] sm:hidden">
          <nav className="flex flex-col px-6 py-4 gap-1">
            {tools.map((tool) => {
              const isActive = pathname.startsWith(tool.href);
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-white text-[#0d0e0e]"
                      : "text-zinc-400 hover:bg-[#1c1d1d] hover:text-white"
                  }`}
                >
                  {tool.name}
                </Link>
              );
            })}
          </nav>
          <div className="border-t border-[#1c1d1d] px-6 py-4">
            <a
              href="https://gafa.com.bo"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-full border border-zinc-600 px-4 py-2 text-center text-sm font-medium text-zinc-300 transition-colors hover:border-white hover:text-white"
            >
              Visitar gafa.com.bo ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
