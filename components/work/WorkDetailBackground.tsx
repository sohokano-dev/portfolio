"use client";

import { useLayoutEffect } from "react";
import { useWorkBackground } from "../PageTransitionProvider";
import { extractImagePalette } from "./palette";
import { defaultPalette, type WorkProject } from "./workProjects";

type WorkDetailBackgroundProps = {
  project?: Pick<WorkProject, "img" | "palette"> | null;
};

export function WorkDetailBackground({ project }: WorkDetailBackgroundProps) {
  const { setActive, setPalette } = useWorkBackground();

  useLayoutEffect(() => {
    let cancelled = false;
    const fallbackPalette = project?.palette ?? defaultPalette;

    setActive(true);
    setPalette(fallbackPalette);

    if (project?.img) {
      extractImagePalette(project.img)
        .then((nextPalette) => {
          if (!cancelled && nextPalette) {
            setPalette(nextPalette);
          }
        })
        .catch(() => {
          // Fall back to the hand-tuned palette if browser canvas extraction fails.
        });
    }

    return () => {
      cancelled = true;
    };
  }, [project, setActive, setPalette]);

  return null;
}
