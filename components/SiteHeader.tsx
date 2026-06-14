import Link from "next/link";

export function SiteHeader() {
  return (
    <header className="fixed left-0 right-0 top-0 z-50 flex w-full items-baseline gap-2 bg-slate-900/60 px-5 py-5 backdrop-blur-xl max-[640px]:py-4">
      <Link className="shrink-0 text-[18px] font-bold leading-none text-text-100" href="/">
        soh okano<span className="text-text-50">.</span>
      </Link>
      <div className="whitespace-nowrap text-[10px] uppercase tracking-[0.12em] text-text-50">
        Product Designer · Tokyo
      </div>
    </header>
  );
}
