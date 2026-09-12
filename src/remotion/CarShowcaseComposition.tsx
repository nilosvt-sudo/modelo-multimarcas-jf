import React from "react";
import { Sequence } from "remotion";
import { CarShowcaseCompositionProps } from "./types";
import { CarSlide } from "./CarSlide";

export const CarShowcaseComposition: React.FC<CarShowcaseCompositionProps> = ({
  vehicles,
  slideDurationInFrames = 120, // 4 seconds per vehicle at 30 fps
}) => {
  if (!vehicles || vehicles.length === 0) {
    return null;
  }

  return (
    <>
      {vehicles.map((vehicle, index) => {
        const fromFrame = index * slideDurationInFrames;

        return (
          <Sequence
            key={vehicle.id || index}
            from={fromFrame}
            durationInFrames={slideDurationInFrames}
            name={`${vehicle.brand} ${vehicle.model}`}
          >
            <CarSlide
              vehicle={vehicle}
              slideIndex={index}
              totalSlides={vehicles.length}
            />
          </Sequence>
        );
      })}
    </>
  );
};
