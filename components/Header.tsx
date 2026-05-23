"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { tools } from "@/lib/tools";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#1c1d1d] bg-[#0d0e0e]">
      <div className="mx-auto flex h-20 max-w-6xl items-center justify-between gap-6 px-6">
        {/* Logo */}
        <Link href="/" onClick={() => setOpen(false)} className="flex shrink-0 items-center">
          <Image
            src="/logo.png"
            alt="GAFA"
            width={120}
            height={60}
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
                style={{ fontFamily: "var(--font-syne)" }}
                className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-[#3abeff] text-[#0d0e0e]"
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
          style={{ fontFamily: "var(--font-syne)" }}
          className="hidden shrink-0 rounded-full border border-zinc-600 px-4 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:border-[#3abeff] hover:text-[#3abeff] sm:block"
        >
          gafa.com.bo ↗
        </a>

        {/* Hamburger */}
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
          <nav className="flex flex-col gap-1 px-6 py-4">
            {tools.map((tool) => {
              const isActive = pathname.startsWith(tool.href);
              return (
                <Link
                  key={tool.slug}
                  href={tool.href}
                  onClick={() => setOpen(false)}
                  style={{ fontFamily: "var(--font-syne)" }}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-[#3abeff] text-[#0d0e0e]"
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
              style={{ fontFamily: "var(--font-syne)" }}
              className="block rounded-full border border-zinc-600 px-4 py-2 text-center text-sm font-medium text-zinc-300 transition-colors hover:border-[#3abeff] hover:text-[#3abeff]"
            >
              gafa.com.bo ↗
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
