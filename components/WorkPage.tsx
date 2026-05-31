"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";

type HslColor = {
  h: number;
  s: number;
  l: number;
};

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
  jp: string;
  tags: string[];
  img?: string;
  palette: string[];
};

const chips = [
  ["All", "24"],
  ["Product", "11"],
  ["Mobile", "08"],
  ["Brand & Web", "06"],
  ["Systems", "04"],
  ["Research", "03"],
  ["Ongoing", "02"],
] as const;

const defaultPalette = [
  "oklch(0.65 0.16 70)",
  "oklch(0.55 0.18 45)",
  "oklch(0.45 0.14 250)",
  "oklch(0.7 0.18 30)",
];

const PALETTE_HOVER_DELAY_MS = 180;

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
    jp: "ディーリーグ / 楽曲ジャケットシリーズ",
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

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

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

function toVividColor({ h, s, l }: HslColor) {
  const vividS = clamp(s * 1.35 + 0.16, 0.5, 0.92);
  const vividL = clamp(l < 0.35 ? l * 1.18 + 0.1 : l, 0.38, 0.72);

  return `hsl(${Math.round(h)} ${Math.round(vividS * 100)}% ${Math.round(vividL * 100)}%)`;
}

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

function useJstClock() {
  const [clock, setClock] = useState("JST --:--");

  useEffect(() => {
    function tick() {
      const time = new Date().toLocaleTimeString("en-GB", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone: "Asia/Tokyo",
      });

      setClock(`JST ${time}`);
    }

    tick();
    const id = window.setInterval(tick, 30000);
    return () => window.clearInterval(id);
  }, []);

  return clock;
}

export function WorkPage() {
  const [activeChip, setActiveChip] = useState("All");
  const [activePalette, setActivePalette] = useState(defaultPalette);
  const [imagePalettes, setImagePalettes] = useState<Record<string, string[]>>({});
  const [hovering, setHovering] = useState(false);
  const hoverTimer = useRef<number | null>(null);
  const paletteTimer = useRef<number | null>(null);
  const activeProject = useRef<string | null>(null);
  const clock = useJstClock();

  useEffect(() => {
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
    hoverTimer.current = window.setTimeout(() => {
      setHovering(false);
    }, 300);
  }

  const gradientStyle = {
    "--wash-1": activePalette[0],
    "--wash-2": activePalette[1],
    "--wash-3": activePalette[2],
    "--wash-4": activePalette[3],
  } as CSSProperties;

  return (
    <div className={["work-root", hovering ? "is-hovering" : ""].join(" ")}>
      <div className="work-gradient-stage" aria-hidden="true" style={gradientStyle}>
        <div className="work-wash work-wash-1" />
        <div className="work-wash work-wash-2" />
        <div className="work-wash work-wash-3" />
        <div className="work-wash work-wash-4" />
        <div className="work-vignette" />
      </div>

      <div className="work-page">
        <header className="work-nav">
          <div className="work-brand">
            <div className="work-logo">
              soh okano<span>.</span>
            </div>
            <div className="work-role">UI / UX Designer · Tokyo</div>
          </div>

          <nav className="work-main-nav" aria-label="Primary">
            <a href="#">
              <span>01</span>Index
            </a>
            <a className="is-active" href="#">
              <span>02</span>Work
            </a>
            <a href="#">
              <span>03</span>About
            </a>
            <a href="#">
              <span>04</span>Journal
            </a>
            <a href="#">
              <span>05</span>Contact
            </a>
          </nav>

          <div className="work-nav-right">
            <span className="work-clock">{clock}</span>
            <span className="work-availability">
              <span />
              Available · Q3 2026
            </span>
          </div>
        </header>

        <div className="work-filterbar">
          <div className="work-chips">
            {chips.map(([label, count]) => (
              <button
                className={["work-chip", activeChip === label ? "is-active" : ""].join(" ")}
                key={label}
                onClick={() => setActiveChip(label)}
                type="button"
              >
                {label} <span>{count}</span>
              </button>
            ))}
          </div>
          <div className="work-view-toggle">
            <span>Sort</span>
            <span className="work-sort">Recent ↓</span>
          </div>
        </div>

        <main className="work-main">
          <section className="work-bento" aria-label="Selected work">
            {projects.map((project) => {
              const palette = imagePalettes[project.idx] ?? project.palette;
              const cardStyle = {
                "--c1": palette[0],
                "--c2": palette[1],
              } as CSSProperties;

              return (
                <article
                  className={`work-cell work-cell--${project.size}`}
                  key={project.idx}
                  onBlur={releasePalette}
                  onFocus={() => activateProject(project)}
                  onMouseEnter={() => activateProject(project)}
                  onMouseLeave={releasePalette}
                  style={cardStyle}
                  tabIndex={0}
                >
                  <div className="work-swatch">
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

                  <div className="work-info">
                    <div className="work-line">
                      <span className="work-index">
                        {project.idx} · {project.year}
                      </span>
                      <span className="work-arrow" aria-hidden="true">
                        <svg
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </div>
                    <h3 dangerouslySetInnerHTML={{ __html: project.en }} />
                    <div className="work-jp-title">{project.jp}</div>
                    <div className="work-tags">
                      {project.tags.map((tag) => (
                        <span key={tag}>{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </main>

        <footer className="work-footer">
          <div className="work-footer-bottom">
            <span>© 2020 — 2026 · soh okano · all rights reserved</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
