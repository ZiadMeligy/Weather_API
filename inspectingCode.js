import redisClient from "../redis-client.js";

export const getCurrentWeather = async (req, res) => {
  const { userId, location } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }

    const cityCode = location.toLowerCase(); // Use the city code as the cache key
    const cacheKey = `weather:${cityCode}:current`;

    // Check if the data is already cached
    const cachedData = await redisClient.get(cacheKey);
    if (cachedData) {
      console.log("Cache hit");
      return res.json(JSON.parse(cachedData));
    }

    console.log("Cache miss");
    // Fetch the data from the weather API
    const weatherResponse = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityCode}?unitGroup=metric&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json`
    );

    if (!weatherResponse.ok) {
      return res
        .status(weatherResponse.status)
        .json({ error: "Failed to fetch weather data" });
    }

    const weatherData = await weatherResponse.json();
    const filteredData = {
      location: weatherData.resolvedAddress,
      currentConditions: {
        temperature: weatherData.currentConditions.temp,
        humidity: weatherData.currentConditions.humidity,
        windSpeed: weatherData.currentConditions.windspeed + " km/h",
      },
      description: weatherData.description,
    };

    // Cache the data in Redis with a 12-hour expiration
    await redisClient.setEx(cacheKey, 43200, JSON.stringify(filteredData));

    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
