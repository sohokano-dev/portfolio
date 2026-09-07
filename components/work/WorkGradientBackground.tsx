"use client";

import { useEffect, useMemo, useRef } from "react";
import Aurora from "../Aurora";
import styles from "../Work.module.css";

type WorkGradientBackgroundProps = {
  animated?: boolean;
  isActive?: boolean;
  palette: string[];
  showNoise?: boolean;
  visible?: boolean;
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

type NoiseOverlayProps = {
  className: string;
};

export function NoiseOverlay({ className }: NoiseOverlayProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;

    if (!canvas) {
      return;
    }

    const context = canvas.getContext("2d", { alpha: true });

    if (!context) {
      return;
    }

    let frameId = 0;

    const draw = () => {
      const bounds = canvas.getBoundingClientRect();
      const width = Math.max(1, Math.round(bounds.width));
      const height = Math.max(1, Math.round(bounds.height));
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const resolutionScale = 0.94;
      const pixelWidth = Math.max(1, Math.round(width * dpr * resolutionScale));
      const pixelHeight = Math.max(1, Math.round(height * dpr * resolutionScale));

      if (canvas.width !== pixelWidth || canvas.height !== pixelHeight) {
        canvas.width = pixelWidth;
        canvas.height = pixelHeight;
      }

      const imageData = context.createImageData(pixelWidth, pixelHeight);
      const { data } = imageData;

      for (let index = 0; index < data.length; index += 4) {
        const value = 56 + Math.floor(Math.random() * 200);

        data[index] = value;
        data[index + 1] = value;
        data[index + 2] = value;
        data[index + 3] = 255;
      }

      context.putImageData(imageData, 0, 0);
    };

    const redraw = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(draw);
    };

    redraw();
    window.addEventListener("resize", redraw);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("resize", redraw);
    };
  }, []);

  return <canvas ref={canvasRef} aria-hidden="true" className={className} />;
}

function toHexColor(color: string) {
  if (color.startsWith("#")) {
    return color;
  }

  if (typeof document === "undefined") {
    return "#5227FF";
  }

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return "#5227FF";
  }

  context.fillStyle = color;
  context.fillRect(0, 0, 1, 1);
  const [red, green, blue] = context.getImageData(0, 0, 1, 1).data;
  return `#${[red, green, blue].map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

export function WorkGradientBackground({
  animated = true,
  isActive = false,
  palette,
  showNoise = false,
  visible = true,
}: WorkGradientBackgroundProps) {
  // Aurora accepts hexadecimal stops. Convert the existing OKLCH/HSL project palette
  // and retain its beginning, middle, and final colours for the three-stop shader.
  const colorStops = useMemo(
    () => [palette[0], palette[Math.floor(palette.length / 2)], palette[palette.length - 1]].map(toHexColor),
    [palette],
  );

  return (
    <div
      className={cn(
        styles.gradientStage,
        visible && styles.gradientStageVisible,
        isActive && styles.gradientStageActive,
        "pointer-events-none fixed inset-0 z-0 overflow-hidden",
      )}
      aria-hidden="true"
    >
      <Aurora
        colorStops={colorStops}
        blend={0.5}
        amplitude={1.0}
        speed={animated ? 0.5 : 0}
        colorTransitionDuration={animated ? 1200 : 150}
      />
      {showNoise ? <NoiseOverlay className={cn(styles.noiseOverlay, "absolute inset-0 z-[1]")} /> : null}
    </div>
  );
}
