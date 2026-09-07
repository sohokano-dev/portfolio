export type WorkProject = {
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

export const defaultPalette = [
  "oklch(0.65 0.16 70)",
  "oklch(0.55 0.18 45)",
  "oklch(0.45 0.14 250)",
  "oklch(0.7 0.18 30)",
];

// 一覧カードの表示内容。詳細ページがあるものだけ `href` を持たせる。
export const projects: WorkProject[] = [
  {
    size: "xl",
    idx: "01",
    year: "2024",
    en: "Proud Liberica Coffee",
    href: "/work/proud-liberica-coffee",
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
    en: "Homes Calendar",
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
    en: "D.LEAGUE × ALT-RHYTHM",
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
    en: "しなきゃ、なんてない。",
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
    en: "Agri Loop",
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
    en: "Homes MyPage",
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
    en: "Komorebi",
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

export function getWorkProjectBySlug(slug: string) {
  return projects.find((project) => project.href === `/work/${slug}`);
}
