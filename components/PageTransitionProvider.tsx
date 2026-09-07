"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";
import { NoiseOverlay, WorkGradientBackground } from "./work/WorkGradientBackground";
import { defaultPalette } from "./work/workProjects";

type WorkBackgroundContextValue = {
  auroraAnimated: boolean;
  palette: string[];
  setAuroraAnimated: (animated: boolean) => void;
  setActive: (active: boolean) => void;
  setPalette: (palette: string[]) => void;
};

const WorkBackgroundContext = createContext<null | WorkBackgroundContextValue>(null);

function isWorkRoute(pathname: string) {
  return pathname === "/" || pathname.startsWith("/work/");
}

export function PageTransitionProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [backgroundPalette, setBackgroundPalette] = useState(defaultPalette);
  const [backgroundActive, setBackgroundActive] = useState(false);
  const [auroraAnimated, setAuroraAnimated] = useState(true);
  const showWorkBackground = isWorkRoute(pathname);

  const workBackgroundValue = useMemo(
    () => ({
      auroraAnimated,
      palette: backgroundPalette,
      setAuroraAnimated,
      setActive: setBackgroundActive,
      setPalette: setBackgroundPalette,
    }),
    [auroraAnimated, backgroundPalette],
  );

  return (
    <WorkBackgroundContext.Provider value={workBackgroundValue}>
      <WorkGradientBackground
        isActive={backgroundActive}
        palette={backgroundPalette}
        animated={auroraAnimated}
        showNoise={false}
        visible={showWorkBackground}
      />
      {children}
      <NoiseOverlay className="global-noise pointer-events-none fixed inset-0 z-[100]" />
    </WorkBackgroundContext.Provider>
  );
}

export function useWorkBackground() {
  const context = useContext(WorkBackgroundContext);

  if (!context) {
    throw new Error("useWorkBackground must be used within PageTransitionProvider");
  }

  return context;
}
