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

export async function extractImagePalette(src: string) {
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
