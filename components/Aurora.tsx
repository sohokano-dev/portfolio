"use client";

import { Color, Mesh, Program, Renderer, Triangle } from "ogl";
import { useEffect, useRef } from "react";

import "./Aurora.css";

const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

const FRAG = `#version 300 es
precision highp float;

uniform float uTime;
uniform float uAmplitude;
uniform vec3 uColorStops[3];
uniform vec2 uResolution;
uniform float uBlend;
uniform float uLightMode;
uniform float uVerticalStretch;

out vec4 fragColor;

vec3 permute(vec3 x) { return mod(((x * 34.0) + 1.0) * x, 289.0); }

float snoise(vec2 v){
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i = floor(v + dot(v, C.yy));
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod(i, 289.0);
  vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
  vec3 m = max(0.5 - vec3(dot(x0, x0), dot(x12.xy, x12.xy), dot(x12.zw, x12.zw)), 0.0);
  m = m * m;
  m = m * m;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * (a0 * a0 + h * h);
  vec3 g;
  g.x = a0.x * x0.x + h.x * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

struct ColorStop { vec3 color; float position; };

vec3 colorRamp(ColorStop colors[3], float factor) {
  int index = 0;
  for (int i = 0; i < 2; i++) {
    if (colors[i].position <= factor) index = i;
  }
  ColorStop currentColor = colors[index];
  ColorStop nextColor = colors[index + 1];
  float range = nextColor.position - currentColor.position;
  float lerpFactor = (factor - currentColor.position) / range;
  return mix(currentColor.color, nextColor.color, lerpFactor);
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution;
  ColorStop colors[3];
  colors[0] = ColorStop(uColorStops[0], 0.0);
  colors[1] = ColorStop(uColorStops[1], 0.5);
  colors[2] = ColorStop(uColorStops[2], 1.0);
  vec3 rampColor = colorRamp(colors, uv.x);
  float height = snoise(vec2(uv.x * (2.0 / uVerticalStretch) + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
  height = exp(height);
  height = (uv.y * (2.0 / uVerticalStretch) - height + 0.2);
  float intensity = 0.6 * height;
  float midPoint = 0.20;
  float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
  vec3 auroraColor = intensity * rampColor;
  if (uLightMode > 0.5) {
    float energy = clamp(max(intensity, 0.0), 0.0, 1.0);
    float coverage = clamp(auroraAlpha * (0.55 + 0.45 * energy), 0.0, 0.86);
    vec3 chroma = pow(clamp(rampColor, 0.0, 1.0), vec3(1.2));
    float chromaPeak = max(chroma.r, max(chroma.g, chroma.b));
    chroma /= max(chromaPeak, 0.0001);
    fragColor = vec4(mix(vec3(1.0), chroma, min(coverage * 1.08, 0.94)), 1.0);
  } else {
    fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
  }
}
`;

type AuroraProps = {
  amplitude?: number;
  blend?: number;
  colorStops?: string[];
  colorTransitionDuration?: number;
  lightMode?: boolean;
  speed?: number;
  time?: number;
  verticalStretch?: number;
};

export default function Aurora({
  colorStops = ["#5227FF", "#7cff67", "#5227FF"],
  amplitude = 1.0,
  blend = 0.5,
  colorTransitionDuration = 1200,
  lightMode = false,
  verticalStretch = 1.5,
  ...props
}: AuroraProps) {
  const propsRef = useRef({ colorStops, amplitude, blend, colorTransitionDuration, lightMode, verticalStretch, ...props });
  propsRef.current = { colorStops, amplitude, blend, colorTransitionDuration, lightMode, verticalStretch, ...props };
  const ctnDom = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const ctn = ctnDom.current;
    if (!ctn) return;

    let renderer: Renderer;
    let gl: Renderer["gl"];
    let program: Program;
    let animateId = 0;
    let animationTime = 0;
    let previousFrameTime: number | null = null;

    try {
      renderer = new Renderer({ alpha: true, premultipliedAlpha: true, antialias: true });
      gl = renderer.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
      (gl.canvas as HTMLCanvasElement).style.backgroundColor = "transparent";

      function resize() {
      if (!ctn) return;
      const width = ctn.offsetWidth;
      const height = ctn.offsetHeight;
      renderer.setSize(width, height);
      if (program) program.uniforms.uResolution.value = [width, height];
      }
      window.addEventListener("resize", resize);

      const geometry = new Triangle(gl);
      if (geometry.attributes.uv) delete geometry.attributes.uv;
      const toRgb = (stops: string[]) => stops.map((hex) => {
        const color = new Color(hex);
        return [color.r, color.g, color.b];
      });
      let displayedStops = toRgb(colorStops);
      let fromStops = displayedStops;
      let targetStops = displayedStops;
      let targetKey = colorStops.join("|");
      let transitionStartedAt = 0;

      program = new Program(gl, {
      vertex: VERT,
      fragment: FRAG,
      uniforms: {
        uTime: { value: 0 },
        uAmplitude: { value: amplitude },
        uColorStops: { value: displayedStops },
        uResolution: { value: [ctn.offsetWidth, ctn.offsetHeight] },
        uBlend: { value: blend },
        uLightMode: { value: lightMode ? 1 : 0 },
        uVerticalStretch: { value: verticalStretch },
      },
      });
      const mesh = new Mesh(gl, { geometry, program });
      ctn.appendChild(gl.canvas as HTMLCanvasElement);

      const update = (time: number) => {
        animateId = requestAnimationFrame(update);
        const current = propsRef.current;
        if (previousFrameTime === null) {
          previousFrameTime = time;
        }
        const elapsed = time - previousFrameTime;
        previousFrameTime = time;
        const currentSpeed = current.speed ?? 1.0;
        if (currentSpeed !== 0) {
          animationTime += elapsed * currentSpeed * 0.001;
        }
        const nextColorStops = current.colorStops ?? colorStops;
        const nextKey = nextColorStops.join("|");

        if (nextKey !== targetKey) {
          fromStops = displayedStops.map((stop) => [...stop]);
          targetStops = toRgb(nextColorStops);
          targetKey = nextKey;
          transitionStartedAt = time;
        }

        const duration = current.colorTransitionDuration ?? colorTransitionDuration;
        const progress = duration <= 0 ? 1 : Math.min((time - transitionStartedAt) / duration, 1);
        const easedProgress = progress * progress * (3 - 2 * progress);
        displayedStops = fromStops.map((stop, index) =>
          stop.map((channel, channelIndex) => channel + (targetStops[index][channelIndex] - channel) * easedProgress),
        );

        program.uniforms.uTime.value = current.time ?? animationTime;
        program.uniforms.uAmplitude.value = current.amplitude ?? 1.0;
        program.uniforms.uBlend.value = current.blend ?? blend;
        program.uniforms.uLightMode.value = (current.lightMode ?? lightMode) ? 1 : 0;
        program.uniforms.uVerticalStretch.value = current.verticalStretch ?? verticalStretch;
        program.uniforms.uColorStops.value = displayedStops;
        renderer.render({ scene: mesh });
      };
      animateId = requestAnimationFrame(update);
      resize();

      return () => {
        cancelAnimationFrame(animateId);
        window.removeEventListener("resize", resize);
        if (gl.canvas.parentNode === ctn) ctn.removeChild(gl.canvas as HTMLCanvasElement);
        gl.getExtension("WEBGL_lose_context")?.loseContext();
      };
    } catch (error) {
      console.warn("Aurora could not initialize; keeping the page background visible.", error);
    }

    return () => {
      cancelAnimationFrame(animateId);
    };
    // Props are deliberately read from propsRef in the animation loop.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [amplitude, blend, lightMode]);

  return <div ref={ctnDom} className="aurora-container" />;
}
