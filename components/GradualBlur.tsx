"use client";

import { memo, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";

import "./GradualBlur.css";

type Position = "top" | "bottom" | "left" | "right";
type Curve = "linear" | "bezier" | "ease-in" | "ease-out" | "ease-in-out";

type GradualBlurProps = {
  position?: Position;
  strength?: number;
  height?: string;
  width?: string;
  divCount?: number;
  exponential?: boolean;
  zIndex?: number;
  animated?: boolean | "scroll";
  duration?: string;
  easing?: string;
  opacity?: number;
  curve?: Curve;
  responsive?: boolean;
  hoverIntensity?: number;
  target?: "parent" | "page";
  className?: string;
  style?: CSSProperties;
};

const curveFunctions: Record<Curve, (progress: number) => number> = {
  linear: (progress) => progress,
  bezier: (progress) => progress * progress * (3 - 2 * progress),
  "ease-in": (progress) => progress * progress,
  "ease-out": (progress) => 1 - (1 - progress) ** 2,
  "ease-in-out": (progress) => progress < 0.5 ? 2 * progress * progress : 1 - (-2 * progress + 2) ** 2 / 2,
};

function GradualBlur({
  position = "bottom",
  strength = 2,
  height = "6rem",
  width,
  divCount = 5,
  exponential = false,
  zIndex = 1000,
  animated = false,
  duration = "0.3s",
  easing = "ease-out",
  opacity = 1,
  curve = "linear",
  hoverIntensity,
  target = "parent",
  className = "",
  style,
}: GradualBlurProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(animated !== "scroll");

  useEffect(() => {
    if (animated !== "scroll" || !containerRef.current) return;
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [animated]);

  const blurDivs = useMemo(() => {
    const currentStrength = isHovered && hoverIntensity ? strength * hoverIntensity : strength;
    const increment = 100 / divCount;
    const curveFunction = curveFunctions[curve];

    return Array.from({ length: divCount }, (_, layer) => {
      const index = layer + 1;
      const progress = curveFunction(index / divCount);
      const blurValue = exponential
        ? 2 ** (progress * 4) * 0.0625 * currentStrength
        : 0.0625 * (progress * divCount + 1) * currentStrength;
      const p1 = Math.round((increment * index - increment) * 10) / 10;
      const p2 = Math.round(increment * index * 10) / 10;
      const p3 = Math.round((increment * index + increment) * 10) / 10;
      const p4 = Math.round((increment * index + increment * 2) * 10) / 10;
      let gradient = `transparent ${p1}%, black ${p2}%`;
      if (p3 <= 100) gradient += `, black ${p3}%`;
      if (p4 <= 100) gradient += `, transparent ${p4}%`;
      const direction = `to ${position}`;

      return (
        <div
          key={index}
          style={{
            position: "absolute",
            inset: 0,
            maskImage: `linear-gradient(${direction}, ${gradient})`,
            WebkitMaskImage: `linear-gradient(${direction}, ${gradient})`,
            backdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            WebkitBackdropFilter: `blur(${blurValue.toFixed(3)}rem)`,
            opacity,
            transition: animated === true ? `backdrop-filter ${duration} ${easing}` : undefined,
          }}
        />
      );
    });
  }, [animated, curve, divCount, duration, easing, exponential, hoverIntensity, isHovered, opacity, position, strength]);

  const isVertical = position === "top" || position === "bottom";
  const containerStyle: CSSProperties = {
    position: target === "page" ? "fixed" : "absolute",
    pointerEvents: hoverIntensity ? "auto" : "none",
    opacity: isVisible ? 1 : 0,
    transition: animated ? `opacity ${duration} ${easing}` : undefined,
    zIndex: target === "page" ? zIndex + 100 : zIndex,
    ...(isVertical
      ? { height, width: width ?? "100%", [position]: 0, left: 0, right: 0 }
      : { width: width ?? height, height: "100%", [position]: 0, top: 0, bottom: 0 }),
    ...style,
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className={`gradual-blur gradual-blur-${target} ${className}`}
      style={containerStyle}
      onMouseEnter={hoverIntensity ? () => setIsHovered(true) : undefined}
      onMouseLeave={hoverIntensity ? () => setIsHovered(false) : undefined}
    >
      <div className="gradual-blur-inner">{blurDivs}</div>
    </div>
  );
}

export default memo(GradualBlur);
