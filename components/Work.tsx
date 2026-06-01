"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import styles from "./Work.module.css";

// 画像から抽出した色を HSL として扱うための型。
type HslColor = {
  h: number;
  s: number;
  l: number;
};

// 近い色をまとめて集計するためのバケット。
type ColorBucket = {
  count: number;
  r: number;
  g: number;
  b: number;
  h: number;
  s: number;
  l: number;
};

type Project = {
  size: "xl" | "wide" | "lg" | "md" | "tall";
  idx: string;
  year: string;
  en: string;
  href?: string;
  jp: string;
  tags: string[];
  img?: string;
  palette: string[];
};

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

const defaultPalette = [
  "oklch(0.65 0.16 70)",
  "oklch(0.55 0.18 45)",
  "oklch(0.45 0.14 250)",
  "oklch(0.7 0.18 30)",
];

// hover 直後に即切り替えず、少しだけ間を置いて背景演出を滑らかに見せる。
// hover 演出の入りだけ少し待たせて、背景色の切り替わりを唐突に見せない。
const PALETTE_HOVER_DELAY_MS = 200;

// 一覧カードの表示内容。詳細ページがあるものだけ `href` を持たせる。
const projects: Project[] = [
  {
    size: "xl",
    idx: "01",
    year: "2024",
    en: "Proud <em>Liberica</em> Coffee",
    jp: "アースキュイジーヌ / プラウド リベリカ コーヒー",
    tags: ["Brand", "Packaging", "Web"],
    img: "/images/work/liberica-coffee.jpg",
    palette: [
      "oklch(0.78 0.16 55)",
      "oklch(0.62 0.19 35)",
      "oklch(0.9 0.08 90)",
      "oklch(0.55 0.17 25)",
    ],
  },
  {
    size: "tall",
    idx: "02",
    year: "2023",
    en: "Homes <em>Calendar</em>",
    jp: "くいしんぼうなホームズくんのカレンダー",
    tags: ["Illustration", "Print"],
    img: "/images/work/homes-calendar.jpg",
    palette: [
      "oklch(0.75 0.18 55)",
      "oklch(0.55 0.2 25)",
      "oklch(0.72 0.14 170)",
      "oklch(0.85 0.12 80)",
    ],
  },
  {
    size: "lg",
    idx: "03",
    year: "2024",
    en: "<em>D.LEAGUE</em> × ALT-RHYTHM",
    href: "/work/project",
    jp: "「ディー」「リーグ・ああ」 / 楽曲ジャケットシリーズ",
    tags: ["Art Direction", "Music"],
    img: "/images/work/alt-rhythm.jpg",
    palette: [
      "oklch(0.4 0.18 240)",
      "oklch(0.6 0.18 30)",
      "oklch(0.3 0.12 220)",
      "oklch(0.7 0.2 55)",
    ],
  },
  {
    size: "md",
    idx: "04",
    year: "2025",
    en: "Kiln OS",
    jp: "キルンOS / 社内DS",
    tags: ["Tools", "Systems"],
    img: "/images/work/kiln-os.jpg",
    palette: [
      "oklch(0.7 0.2 90)",
      "oklch(0.55 0.18 65)",
      "oklch(0.85 0.14 95)",
      "oklch(0.45 0.15 55)",
    ],
  },
  {
    size: "wide",
    idx: "05",
    year: "2024",
    en: "<em>しなきゃ、なんてない。</em>",
    jp: "LIFULL ブランドキャンペーン / AI 10,000変化",
    tags: ["Campaign", "AI", "Brand"],
    img: "/images/work/shinakya.jpg",
    palette: [
      "oklch(0.7 0.2 45)",
      "oklch(0.55 0.22 28)",
      "oklch(0.85 0.1 60)",
      "oklch(0.45 0.18 20)",
    ],
  },
  {
    size: "md",
    idx: "06",
    year: "2024",
    en: "Agri <em>Loop</em>",
    jp: "LIFULL Agri Loop / 循環農業",
    tags: ["Illustration", "Web"],
    img: "/images/work/agri-loop.jpg",
    palette: [
      "oklch(0.7 0.2 45)",
      "oklch(0.78 0.15 75)",
      "oklch(0.55 0.18 35)",
      "oklch(0.85 0.08 90)",
    ],
  },
  {
    size: "md",
    idx: "07",
    year: "2023",
    en: "Homes <em>MyPage</em>",
    jp: "LIFULL HOME'S / マイページ刷新",
    tags: ["Product", "Mobile"],
    img: "/images/work/homes-mypage.jpg",
    palette: [
      "oklch(0.7 0.2 50)",
      "oklch(0.55 0.22 30)",
      "oklch(0.9 0.04 80)",
      "oklch(0.8 0.14 70)",
    ],
  },
  {
    size: "tall",
    idx: "08",
    year: "2023",
    en: "<em>Komorebi</em>",
    jp: "木漏れ日 / 瞑想アプリ",
    tags: ["Wellness", "iOS"],
    palette: [
      "oklch(0.78 0.16 85)",
      "oklch(0.55 0.14 65)",
      "oklch(0.88 0.1 95)",
      "oklch(0.42 0.1 50)",
    ],
  },
  {
    size: "md",
    idx: "09",
    year: "2022",
    en: "Nocturne",
    jp: "ノクターン",
    tags: ["Creative Tool"],
    palette: [
      "oklch(0.35 0.2 290)",
      "oklch(0.55 0.22 305)",
      "oklch(0.25 0.15 270)",
      "oklch(0.7 0.18 325)",
    ],
  },
  {
    size: "md",
    idx: "10",
    year: "2022",
    en: "Pale Sun",
    jp: "ペイル・サン",
    tags: ["Editorial"],
    palette: [
      "oklch(0.82 0.1 70)",
      "oklch(0.65 0.13 45)",
      "oklch(0.9 0.07 80)",
      "oklch(0.5 0.14 30)",
    ],
  },
];

function stripTags(value: string) {
  return value.replace(/<[^>]+>/g, "");
}

// 色補正の途中計算で値が暴れないように範囲へ収める。
function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

// 画像の代表色を扱いやすくするため、RGB を HSL に変換する。
function rgbToHsl(r: number, g: number, b: number): HslColor {
  const red = r / 255;
  const green = g / 255;
  const blue = b / 255;
  const max = Math.max(red, green, blue);
  const min = Math.min(red, green, blue);
  const l = (max + min) / 2;

  if (max === min) {
    return { h: 0, s: 0, l };
  }

  const delta = max - min;
  const s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min);
  const h =
    max === red
      ? (green - blue) / delta + (green < blue ? 6 : 0)
      : max === green
        ? (blue - red) / delta + 2
        : (red - green) / delta + 4;

  return { h: h * 60, s, l };
}

function hueDistance(left: number, right: number) {
  const diff = Math.abs(left - right) % 360;
  return Math.min(diff, 360 - diff);
}

// 元画像の色を、そのままではなく少し鮮やかに補正して背景演出向けに使う。
function toVividColor({ h, s, l }: HslColor) {
  const vividS = clamp(s * 1.35 + 0.16, 0.5, 0.92);
  const vividL = clamp(l < 0.35 ? l * 1.18 + 0.1 : l, 0.38, 0.72);

  return `hsl(${Math.round(h)} ${Math.round(vividS * 100)}% ${Math.round(vividL * 100)}%)`;
}

// Canvas へ描画できるよう、画像をクライアント側で読み込む。
function loadPaletteImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const image = new window.Image();
    image.crossOrigin = "anonymous";
    image.decoding = "async";
    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = src;
  });
}

async function extractImagePalette(src: string) {
  const image = await loadPaletteImage(src);
  const canvas = document.createElement("canvas");
  const size = 64;
  canvas.width = size;
  canvas.height = size;

  const context = canvas.getContext("2d", { willReadFrequently: true });
  if (!context) {
    return null;
  }

  context.drawImage(image, 0, 0, size, size);

  const buckets = new Map<string, ColorBucket>();
  const { data } = context.getImageData(0, 0, size, size);

  // 全ピクセルを見ると重いので、一定間隔で拾いながら大まかな傾向色を集める。
  for (let index = 0; index < data.length; index += 16) {
    const alpha = data[index + 3];
    if (alpha < 180) {
      continue;
    }

    const r = data[index];
    const g = data[index + 1];
    const b = data[index + 2];
    const hsl = rgbToHsl(r, g, b);

    if (hsl.l < 0.08 || hsl.l > 0.92 || hsl.s < 0.08) {
      continue;
    }

    const key = `${Math.round(r / 24)}-${Math.round(g / 24)}-${Math.round(b / 24)}`;
    const bucket = buckets.get(key);

    if (bucket) {
      bucket.count += 1;
      bucket.r += r;
      bucket.g += g;
      bucket.b += b;
      bucket.h += hsl.h;
      bucket.s += hsl.s;
      bucket.l += hsl.l;
    } else {
      buckets.set(key, {
        count: 1,
        r,
        g,
        b,
        h: hsl.h,
        s: hsl.s,
        l: hsl.l,
      });
    }
  }

  const ranked = [...buckets.values()]
    .map((bucket) => {
      const count = bucket.count;
      const color = {
        h: bucket.h / count,
        s: bucket.s / count,
        l: bucket.l / count,
      };
      return {
        color,
        score: count * (0.65 + color.s),
      };
    })
    .sort((left, right) => right.score - left.score);

  const selected: HslColor[] = [];

  // 近い色相ばかりに偏らないよう、ある程度離れた色を優先して拾う。
  for (const item of ranked) {
    const isDistinct = selected.every((color) => hueDistance(color.h, item.color.h) > 24);
    if (isDistinct || selected.length < 2) {
      selected.push(item.color);
    }

    if (selected.length === 4) {
      break;
    }
  }

  for (const item of ranked) {
    if (selected.length === 4) {
      break;
    }

    if (!selected.includes(item.color)) {
      selected.push(item.color);
    }
  }

  if (selected.length === 0) {
    return null;
  }

  // 色数が足りない場合は、先頭色を基準に近い色を補って4色に揃える。
  const baseColor = selected[0];
  while (selected.length < 4) {
    selected.push({
      h: (baseColor.h + selected.length * 32) % 360,
      s: baseColor.s,
      l: clamp(baseColor.l + (selected.length % 2 === 0 ? 0.08 : -0.08), 0.35, 0.72),
    });
  }

  return selected.slice(0, 4).map(toVividColor);
}

// CSS Module で持ちにくいレスポンシブの列幅だけ、TSX 側でまとめて管理する。
const sizeClassNames = {
  xl: "col-span-8 min-[1024px]:col-span-8 max-[1024px]:col-span-4",
  wide: "col-span-8 min-[1024px]:col-span-8 max-[1024px]:col-span-4",
  lg: "col-span-6 min-[1024px]:col-span-6 max-[1024px]:col-span-4",
  md: "col-span-4 min-[1024px]:col-span-4 max-[1024px]:col-span-4",
  tall: "col-span-6 min-[1024px]:col-span-6 max-[1024px]:col-span-4",
} as const;

const navLinkClassName =
  "flex items-center gap-2 text-[14px] transition-colors duration-200";

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

  function activateProject(project: Project) {
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

  // CSS のカスタムプロパティへ流し込んで、背景演出側で4色を受け取る。
  const gradientStyle = {
    "--wash-1": activePalette[0],
    "--wash-2": activePalette[1],
    "--wash-3": activePalette[2],
    "--wash-4": activePalette[3],
  } as CSSProperties;

  return (
    <div
      className={cn(
        styles.root,
        hovering && styles.isHovering,
        "relative min-h-screen overflow-x-hidden text-text-100",
      )}
    >
      <div
        className={cn(styles.gradientStage, "pointer-events-none fixed inset-0 z-0 overflow-hidden")}
        aria-hidden="true"
        style={gradientStyle}
      >
        <div
          className={cn(
            styles.wash,
            styles.wash1,
            "absolute -left-[18%] -top-[24%] h-[min(980px,82vw)] w-[min(980px,82vw)]",
          )}
        />
        <div
          className={cn(
            styles.wash,
            styles.wash2,
            "absolute right-[2%] top-[14%] h-[min(460px,42vw)] w-[min(460px,42vw)]",
          )}
        />
        <div
          className={cn(
            styles.wash,
            styles.wash3,
            "absolute bottom-[-24%] left-[36%] h-[min(760px,58vw)] w-[min(760px,58vw)]",
          )}
        />
        <div
          className={cn(
            styles.wash,
            styles.wash4,
            "absolute bottom-[16%] right-[24%] h-[min(280px,24vw)] w-[min(280px,24vw)]",
          )}
        />
        <div className={cn(styles.vignette, "absolute inset-0 z-[2]")} />
      </div>

      <div className="relative z-[1]">
        {/* Fixed header with logo only */}
        <div className="fixed left-0 top-0 right-0 z-50 w-full flex items-baseline gap-2 px-10 py-5 max-[640px]:px-5 max-[640px]:py-4 bg-slate-900/60 backdrop-blur-xl">
          <div className={cn(styles.logo, "shrink-0 text-[18px] font-bold")}>
            soh okano<span>.</span>
          </div>
          <div className="whitespace-nowrap text-[10px] uppercase tracking-[0.12em] text-text-50">
            Product Designer · Tokyo
          </div>
        </div>

        {/* Header retained only for logo; chips moved below into gallery */}

        <main className="p-[120px] max-[1024px]:px-10 max-[1024px]:py-20 max-[640px]:px-5 max-[640px]:pb-4 max-[640px]:pt-6">
          {/* Filter placed above the gallery */}
          <div className={cn(styles.filterbar, "mb-10 overflow-auto -mx-[120px] max-[1024px]:-mx-10 max-[640px]:-mx-5 max-[640px]:pt-20")}>
            <div className="px-[120px] max-[1024px]:px-10 max-[640px]:px-5">
              <div className="flex gap-2 items-center justify-start">
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
            className="grid grid-cols-4 min-[640px]:grid-cols-8 min-[1024px]:grid-cols-12 auto-rows-auto items-start gap-x-6 gap-y-10 max-[640px]:gap-x-3 max-[640px]:gap-y-7"
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
