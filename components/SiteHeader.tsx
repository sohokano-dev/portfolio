"use client";

import Link from "next/link";
import GradualBlur from "./GradualBlur";
import { useWorkBackground } from "./PageTransitionProvider";

export function SiteHeader() {
  const { auroraAnimated, setAuroraAnimated } = useWorkBackground();

  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex w-full items-baseline justify-between overflow-visible px-5 py-5 max-[640px]:py-4">
      <GradualBlur
        position="top"
        height="calc(100% + 24px)"
        strength={2}
        divCount={6}
        curve="bezier"
        exponential
        opacity={1}
        zIndex={0}
        style={{ top: 0, bottom: "auto" }}
      />
      <div className="relative z-[1] flex items-baseline">
        <Link className="shrink-0 text-[18px] font-bold leading-none text-text-100" href="/">
          soh okano
        </Link>
        <div className="whitespace-pre text-[12px] uppercase tracking-[0.12em] text-text-70">
          {" · Product Designer · Tokyo"}
        </div>
      </div>
      <button
        aria-label={auroraAnimated ? "Pause Aurora animation" : "Play Aurora animation"}
        aria-pressed={auroraAnimated}
        className="group relative z-[1] flex items-center gap-2 p-0"
        onClick={() => setAuroraAnimated(!auroraAnimated)}
        type="button"
      >
        <span className="text-[14px] text-text-100">Motion</span>
        <span aria-hidden="true" className="flex shrink-0 rounded-full bg-black/10 p-2 text-text-100 transition-colors group-hover:bg-black/50">
          {auroraAnimated ? (
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M9 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
              <path d="M17 4h-2a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h2a2 2 0 0 0 2 -2v-12a2 2 0 0 0 -2 -2z" />
            </svg>
          ) : (
            <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6 4v16a1 1 0 0 0 1.524 .852l13 -8a1 1 0 0 0 0 -1.704l-13 -8a1 1 0 0 0 -1.524 .852z" />
            </svg>
          )}
        </span>
      </button>
    </header>
  );
}
