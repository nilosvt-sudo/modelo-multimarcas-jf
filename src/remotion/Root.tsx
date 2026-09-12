import React from "react";
import { Composition } from "remotion";
import { CarShowcaseComposition } from "./CarShowcaseComposition";
import { initialVehicles } from "@/db/seed";

import { CarShowcaseCompositionProps } from "./types";

export const RemotionRoot: React.FC = () => {
  const showcaseVehicles = initialVehicles.slice(0, 6).map((v, i) => ({
    ...v,
    id: i + 1,
    badge: v.badge || "Destaque",
  }));

  return (
    <Composition
      id="CarShowcase"
      component={CarShowcaseComposition as any}
      durationInFrames={showcaseVehicles.length * 120}
      fps={30}
      width={1280}
      height={720}
      defaultProps={{
        vehicles: showcaseVehicles,
        slideDurationInFrames: 120,
      }}
    />
  );
};
