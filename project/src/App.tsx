import React, { useState, useEffect } from "react";
import axios from "axios";
import { CurrentWeather } from "./components/CurrentWeather";
import { WeatherForecast } from "./components/WeatherForecast";
import { LocationSearch } from "./components/LocationSearch";
import { getBackgroundGradient } from "./utils/weatherIcons";
import { mockWeatherData } from "./utils/mockData";
import { WeatherForecast as WeatherForecastType } from "./types/weather";

function App() {
  const [weatherData, setWeatherData] =
    useState<WeatherForecastType>(mockWeatherData);
  const [unit, setUnit] = useState<"C" | "F">("C");
  const [isLoading, setIsLoading] = useState(false);
  const [forecastStartIndex, setForecastStartIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0); // 1 for next, -1 for previous
  const itemsPerPage = 5;

  const handleNext = () => {
    setForecastStartIndex((prev) =>
      Math.min(prev + itemsPerPage, weatherData.forecast.length - itemsPerPage)
    );
    setSlideDirection(1);
  };

  const handlePrev = () => {
    setForecastStartIndex((prev) => Math.max(prev - itemsPerPage, 0));
    setSlideDirection(-1);
  };
  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: "long" }; // literal type
    return date.toLocaleDateString("en-US", options);
  };

  const handleLocationSelect = async (location: string) => {
    setIsLoading(true);

    try {
      console.log(`Searching for weather data in: ${location}`);

      const apiKey = "685086d027c9dee6b276310e";
      const currentUrl = `http://localhost:3100/weather/${location}/current/${apiKey}`;
      const allUrl = `http://localhost:3100/weather/${location}/all/${apiKey}`;

      const currentResponse = await axios.get(currentUrl);
      const allResponse = await axios.get(allUrl);

      // console.log("Weather data received(current):", currentResponse.data);
      // console.log("Weather Data recieved (all):", allResponse.data);

      const weatherData = {
        current: {
          location: currentResponse.data.location.split(",")[0],
          country: currentResponse.data.location.split(",")[1],
          temperature: currentResponse.data.currentConditions.temperature,
          condition: currentResponse.data.currentConditions.conditions,
          humidity: currentResponse.data.currentConditions.humidity,
          windSpeed: currentResponse.data.currentConditions.windSpeed,
          pressure: currentResponse.data.currentConditions.pressure,
          visibility: currentResponse.data.currentConditions.visibility,
          uvIndex: currentResponse.data.currentConditions.uvindex,
          sunrise: currentResponse.data.currentConditions.sunrise,
          sunset: currentResponse.data.currentConditions.sunset,
          description: currentResponse.data.description,
          icon: currentResponse.data.currentConditions.conditions.toLowerCase(),
        },
        forecast: allResponse.data.days.map((day: any) => ({
          date: day.datetime,
          dayName: getDayName(day.datetime),
          high: day.tempmax,
          low: day.tempmin,
          windSpeed: day.windspeed,
          condition: day.conditions,
          precipitation: day.precipprob,
          humidity: day.humidity,
          icon: day.conditions.toLowerCase(),
        })),
      };
      console.log("Weather data:", weatherData);
      setWeatherData(weatherData);
    } catch (error) {
      console.error("Failed to fetch weather data:", error);
      const newMockData = {
        ...mockWeatherData,
        current: {
          ...mockWeatherData.current,
          location: location,
          temperature: Math.floor(Math.random() * 15) + 15,
          condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain"][
            Math.floor(Math.random() * 4)
          ],
        },
      };
      setWeatherData(newMockData);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUnitToggle = () => {
    setUnit((prev) => (prev === "C" ? "F" : "C"));
  };

  const backgroundGradient = getBackgroundGradient(
    weatherData.current.condition
  );

  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${backgroundGradient} transition-all duration-1000`}
    >
      {/* Background Pattern */}
      <div className="relative inset-0 bg-black/10"></div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        {isLoading && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white/20 backdrop-blur-md rounded-xl p-6 flex items-center gap-4">
              <div className="w-8 h-8 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
              <p className="text-white font-medium">Updating weather data...</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          <div className="lg:col-span-3">
            <CurrentWeather
              weather={weatherData.current}
              unit={unit}
              onUnitToggle={handleUnitToggle}
            />
          </div>
          <div className="lg:col-span-1">
            <LocationSearch
              onLocationSelect={handleLocationSelect}
              currentLocation={`${weatherData.current.location}, ${weatherData.current.country}`}
            />
          </div>
        </div>

        {/* <WeatherForecast
          forecast={weatherData.forecast.slice(0, 5)}
          unit={unit}
        /> */}
        <WeatherForecast
          forecast={weatherData.forecast.slice(
            forecastStartIndex,
            forecastStartIndex + itemsPerPage
          )}
          unit={unit}
          onNext={handleNext}
          onPrev={handlePrev}
          canGoNext={
            forecastStartIndex + itemsPerPage < weatherData.forecast.length
          }
          canGoPrev={forecastStartIndex > 0}
          direction={slideDirection}
        />

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/60 text-sm">
            Weather Dashboard • Beautiful forecasts for every day
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;
