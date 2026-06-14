import type { CSSProperties } from "react";
import styles from "../Work.module.css";

type WorkGradientBackgroundProps = {
  palette: string[];
};

function cn(...classNames: Array<string | false | null | undefined>) {
  return classNames.filter(Boolean).join(" ");
}

export function WorkGradientBackground({ palette }: WorkGradientBackgroundProps) {
  const gradientStyle = {
    "--wash-1": palette[0],
    "--wash-2": palette[1],
    "--wash-3": palette[2],
    "--wash-4": palette[3],
  } as CSSProperties;

  return (
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
  );
}
