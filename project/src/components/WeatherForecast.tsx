import React from "react";
import { ForecastDay } from "../types/weather";
import { ForecastCard } from "./ForecastCard";
import { Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";


interface WeatherForecastProps {
  forecast: ForecastDay[];
  unit: "C" | "F";
  onNext: () => void;
  onPrev: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  direction?: number; // 1 for next, -1 for previous
}

export const WeatherForecast: React.FC<WeatherForecastProps> = ({
  forecast,
  unit,
  onNext,
  onPrev,
  canGoNext,
  canGoPrev,
  direction,
}) => {
  const variants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 300 : -300,
      opacity: 0,
    }),
  };
  return (
    <div className="backdrop-blur-md bg-white/10 rounded-2xl p-6 border border-white/20 shadow-xl relative">
      <div className="flex items-center gap-3 mb-6">
        <Calendar className="w-6 h-6 text-white" />
        <h2 className="text-xl font-bold text-white">5-Day Forecast</h2>
      </div>

      <div className="flex items-center gap-4 relative">
        {/* Left button */}
        <button
          onClick={onPrev}
          disabled={!canGoPrev}
          className="z-10 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 disabled:opacity-30 transition"
        >
          ←
        </button>

        {/* Animated forecast block */}
        <div className="relative w-full min-h-[160px] overflow-x-hidden">
          <AnimatePresence custom={direction} mode="wait">
            <motion.div
              key={forecast[0].date} // trigger re-animation
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-5 w-full"
            >
              {forecast.map((day, index) => (
                <ForecastCard key={index} forecast={day} unit={unit} />
              ))}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Right button */}
        <button
          onClick={onNext}
          disabled={!canGoNext}
          className="z-10 p-2 bg-white/20 text-white rounded-full hover:bg-white/30 disabled:opacity-30 transition"
        >
          →
        </button>
      </div>
    </div>
  );
};

