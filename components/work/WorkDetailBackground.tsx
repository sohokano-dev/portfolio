"use client";

import { useEffect, useState } from "react";
import { extractImagePalette } from "./palette";
import { WorkGradientBackground } from "./WorkGradientBackground";
import { defaultPalette, type WorkProject } from "./workProjects";

type WorkDetailBackgroundProps = {
  project?: Pick<WorkProject, "img" | "palette"> | null;
};

export function WorkDetailBackground({ project }: WorkDetailBackgroundProps) {
  const [palette, setPalette] = useState(project?.palette ?? defaultPalette);

  useEffect(() => {
    let cancelled = false;
    const fallbackPalette = project?.palette ?? defaultPalette;

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
  }, [project]);

  return <WorkGradientBackground palette={palette} />;
}
