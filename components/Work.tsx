"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./Work.module.css";
import { WorkGradientBackground } from "./work/WorkGradientBackground";
import { workContentMaxClassName, workGridClassName } from "./work/layout";
import { extractImagePalette } from "./work/palette";
import { defaultPalette, projects, type WorkProject } from "./work/workProjects";

// フィルタ UI の表示用ラベル。現状は見た目用で、絞り込みロジック自体はまだ持っていない。
const chips = [
  ["All", "24"],
  ["Product", "11"],
  ["Mobile", "8"],
  ["Brand & Web", "6"],
  ["Systems", "4"],
  ["Research", "3"],
  ["Ongoing", "2"],
] as const;

// hover 直後に即切り替えず、少しだけ間を置いて背景演出を滑らかに見せる。
// hover 演出の入りだけ少し待たせて、背景色の切り替わりを唐突に見せない。
const PALETTE_HOVER_DELAY_MS = 200;

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, "");
}

// CSS Module で持ちにくいレスポンシブの列幅だけ、TSX 側でまとめて管理する。
const sizeClassNames = {
  xl: "col-span-8 min-[1024px]:col-span-8 max-[1024px]:col-span-4",
  wide: "col-span-8 min-[1024px]:col-span-8 max-[1024px]:col-span-4",
  lg: "col-span-6 min-[1024px]:col-span-6 max-[1024px]:col-span-4",
  md: "col-span-4 min-[1024px]:col-span-4 max-[1024px]:col-span-4",
  tall: "col-span-6 min-[1024px]:col-span-6 max-[1024px]:col-span-4",
} as const;

const chipClassName =
  "flex items-center gap-2 whitespace-nowrap px-4 py-2 text-[12px] uppercase tracking-[0.12em]";

const cardTitleClassName =
  "text-[22px] font-medium leading-[1.2] text-text-100";

const cardClassName = "col-span-4 flex flex-col gap-3";

// 条件付き className を見やすく組み立てるための小さなヘルパー。
function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function Work() {
  // 現状は見た目だけだが、将来的にフィルタを有効化しやすいよう state 化している。
  const [activeChip, setActiveChip] = useState("All");
  // 背景の wash 演出に流し込む現在の4色。
  const [activePalette, setActivePalette] = useState(defaultPalette);
  // 画像から後追いで抽出したパレットをカード ID ごとに保持する。
  const [imagePalettes, setImagePalettes] = useState<Record<string, string[]>>({});
  // wash / vignette の見た目制御用フラグ。
  const [hovering, setHovering] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const paletteTimer = useRef<number | null>(null);
  const activeProject = useRef<string | null>(null);

  useEffect(() => {
    // ページ離脱時にタイマーを残さないように後始末する。
    return () => {
      if (hoverTimer.current) {
        window.clearTimeout(hoverTimer.current);
      }

      if (paletteTimer.current) {
        window.clearTimeout(paletteTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    // 先に画像ごとの色を抽出しておき、hover 時にすぐ背景へ反映できるようにする。
    projects.forEach((project) => {
      if (!project.img) {
        return;
      }

      extractImagePalette(project.img)
        .then((palette) => {
          if (cancelled || !palette) {
            return;
          }

          setImagePalettes((current) => ({
            ...current,
            [project.idx]: palette,
          }));

          if (activeProject.current === project.idx) {
            setActivePalette(palette);
          }
        })
        .catch(() => {
          // Fall back to the hand-tuned palette if browser canvas extraction fails.
        });
    });

    return () => {
      cancelled = true;
    };
  }, []);

  function activateProject(project: WorkProject) {
    if (hoverTimer.current) {
      window.clearTimeout(hoverTimer.current);
    }

    if (paletteTimer.current) {
      window.clearTimeout(paletteTimer.current);
    }

    activeProject.current = project.idx;
    setHovering(true);

    // 少し遅らせて色を切り替えることで、hover の入りを滑らかに見せる。
    paletteTimer.current = window.setTimeout(() => {
      const palette = imagePalettes[project.idx] ?? project.palette;
      setActivePalette(palette);
    }, PALETTE_HOVER_DELAY_MS);
  }

  function releasePalette() {
    if (paletteTimer.current) {
      window.clearTimeout(paletteTimer.current);
    }

    activeProject.current = null;
    // pointer が外れた瞬間ではなく、少し遅れて演出を戻す。
    hoverTimer.current = window.setTimeout(() => {
      setHovering(false);
    }, 300);
  }

  return (
    <div
      className={cn(
        styles.root,
        hovering && styles.isHovering,
        "relative min-h-screen overflow-x-hidden text-text-100",
      )}
    >
      <WorkGradientBackground palette={activePalette} />

      <div className="relative z-[1]">
        <main className="p-[120px] max-[1024px]:px-10 max-[1024px]:py-20 max-[640px]:px-5 max-[640px]:pb-4 max-[640px]:pt-6">
          {/* Filter placed above the gallery */}
          <div className={cn(styles.filterbar, "mb-10 overflow-auto max-[640px]:pt-20")}>
            <div className={workContentMaxClassName}>
              <div className="flex items-center justify-start gap-2">
                {chips.map(([label, count]) => (
                  <button
                    className={cn(styles.chip, chipClassName, activeChip === label && styles.chipActive)}
                    key={label}
                    onClick={() => setActiveChip(label)}
                    type="button"
                  >
                    {label} <sup>{count}</sup>
                  </button>
                ))}
                <div className="shrink-0 w-5" />
              </div>
            </div>
          </div>

          <section
            className={workGridClassName}
            aria-label="Selected work"
          >
            {/* カードごとに palette を切り替えながら、必要なら詳細ページへの導線も付ける。 */}
            {projects.map((project) => {
              const palette = imagePalettes[project.idx] ?? project.palette;
              const swatchStyle = {
                background: palette[0],
                backgroundImage: `linear-gradient(135deg, ${palette[0]}, ${palette[1]})`,
              } as CSSProperties;
              const cardClasses = cn(styles.cell, cardClassName, sizeClassNames[project.size]);

              // 記事リンクの有無にかかわらず、カード本体の見た目は共通化しておく。
              const cardBody = (
                <>
                  <div className={cn(styles.swatch, "relative aspect-[3/2] w-full overflow-hidden")} style={swatchStyle}>
                    {project.img ? (
                      <Image
                        alt={stripTags(project.en)}
                        fill
                        priority={project.idx === "01"}
                        sizes="(max-width: 900px) 100vw, 66vw"
                        src={project.img}
                      />
                    ) : null}
                  </div>

                  <div className={cn(styles.info, "flex flex-col gap-2 px-[2px] pb-1 pt-[2px]")}>
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.1em] text-text-50">
                      <span className={cn(styles.index, "tracking-[0]")}>
                        {project.idx} · {project.year}
                      </span>
                      <span
                        className={cn(
                          styles.arrow,
                          "inline-flex h-[22px] w-[22px] items-center justify-center",
                        )}
                        aria-hidden="true"
                      >
                        <svg
                          className="h-[10px] w-[10px]"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                    <h3 className={cardTitleClassName} dangerouslySetInnerHTML={{ __html: project.en }} />
                    <div className="text-[12px] leading-[1.8] text-text-70">{project.jp}</div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {project.tags.map((tag) => (
                        <span
                          className="rounded-full border border-border px-2 py-1 text-[12px] uppercase tracking-[0.12em] text-text-50"
                          key={tag}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </>
              );

              // 詳細ページがあるカードだけ Link として描画する。
              if (project.href) {
                return (
                  <Link
                    className={cardClasses}
                    href={project.href}
                    key={project.idx}
                    onBlur={releasePalette}
                    onFocus={() => activateProject(project)}
                    onMouseEnter={() => activateProject(project)}
                    onMouseLeave={releasePalette}
                  >
                    {cardBody}
                  </Link>
                );
              }

              return (
                <article
                  className={cardClasses}
                  key={project.idx}
                  onBlur={releasePalette}
                  onFocus={() => activateProject(project)}
                  onMouseEnter={() => activateProject(project)}
                  onMouseLeave={releasePalette}
                  tabIndex={0}
                >
                  {cardBody}
                </article>
              );
            })}
          </section>
        </main>

        <footer className={cn(styles.footer, "mt-10 px-10 pb-10 pt-20 max-[640px]:px-5 max-[640px]:pb-8 max-[640px]:pt-16")}>
          <div className="flex justify-between text-[12px] uppercase tracking-[0.12em] text-text-50">
            <span>© 2020 — 2026 · soh okano · all rights reserved</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
