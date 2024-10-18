// List of stuff to do
// 1. Embed Location to fetch weather data for a specific location  // DONE

// 2. Embed Time to fetch weather data for a next hour. next day, weekly ->
// 3. Embed Weather to fetch weather data for a specific weather condition (that depends on the API) for rain
// 4. Embed Users accounts and add responses to their history of weather data -> 3 responses max
// 5. Allow only authenticated users to access the weather data -> JWT token
// 6. stop the user from accessing the weather data if they have exceeded the limit of requests -> payments method -> free trial
// 7. Embed the user's location to fetch the weather data for their location -> current-location-geo

// import { getLocation } from "current-location-geo";

import User from "../models/user-model.js";
import mongoose from "mongoose";
import redisClient from "../redis.js";

export const getAllWeather = async (req, res) => {
  try {
    const location = req.params.location;
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json`
    );

    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch weather data" });
    }
    const data = await response.json();

    res.json(data);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// export const getCurrentWeather = async (req, res) => {
//   const { userId, location } = req.params;
//   try {
//     if (!userId) {
//       return res.status(400).json({ error: "User ID is required" });
//     }

//     if (!location) {
//       return res.status(400).json({ error: "Location is required" });
//     }

//     const loggedinUser = await User.findById(userId);
//     if (!loggedinUser) {
//       return res.status(404).json({ error: "User not found" });
//     }

//     const session = await mongoose.startSession();
//     const weatherResponse = await fetch(
//       `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json`
//     );

//     if (!weatherResponse.ok) {
//       return res
//         .status(weatherResponse.status)
//         .json({ error: "Failed to fetch weather data" });
//     }

//     const weatherData = await weatherResponse.json();

//     const currentTime = new Date().toLocaleString("en-US", {
//       timeZone: "Africa/Cairo",
//     });
//     const currentHour = currentTime.split(",")[1].split(":")[0].trim();

//     const filteredData = {
//       location: weatherData.resolvedAddress,
//       currentTime,
//       currentHour,
//       currentConditions: {
//         temperature: weatherData.currentConditions.temp,
//         humidity: weatherData.currentConditions.humidity,
//         windSpeed: weatherData.currentConditions.windspeed + " km/h",
//       },
//       description: weatherData.description,
//     };

//     session.startTransaction();
//     loggedinUser.logHistory.push({
//       location: weatherData.resolvedAddress,
//       currentTime,
//       currentHour,
//       temperature: weatherData.currentConditions.temp,
//       humidity: weatherData.currentConditions.humidity,
//       windSpeed: weatherData.currentConditions.windspeed,
//       description: weatherData.description,
//     });
//     if (loggedinUser.logHistory.length > 3) {
//       loggedinUser.logHistory.shift();
//     }
//     await loggedinUser.save({ session });
//     await session.commitTransaction();
//     res.json(filteredData);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Internal Server Error" });
//   }
// };
export const getCurrentWeather = async (req, res) => {
  const { userId, location } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }
    const loggedinUser = await User.findById(userId);
    if (!loggedinUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const session = await mongoose.startSession();
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

      const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Cairo",
    });
    const currentHour = currentTime.split(",")[1].split(":")[0].trim();
    session.startTransaction();
    loggedinUser.logHistory.push({
      location: weatherData.resolvedAddress,
      currentTime,
      currentHour,
      temperature: weatherData.currentConditions.temp,
      humidity: weatherData.currentConditions.humidity,
      windSpeed: weatherData.currentConditions.windspeed,
      description: weatherData.description,
    });
    if (loggedinUser.logHistory.length > 3) {
      loggedinUser.logHistory.shift();
    }
    await loggedinUser.save({ session });
    await session.commitTransaction();

    // Cache the data in Redis with a 12-hour expiration
    await redisClient.setEx(cacheKey, 43200, JSON.stringify(filteredData));

    res.json(filteredData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const getWeatherByHourToday = async (req, res) => {
  const { userId, location } = req.params;
  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }
    if (!location) {
      return res.status(400).json({ error: "Location is required" });
    }
    const session = await mongoose.startSession();
    const loggedinUser = await User.findById(userId);
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&include=hours&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json`
    );
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch weather data" });
    }
    const data = await response.json();

    const filteredData = {
      location: data.resolvedAddress,
      hourlyWeather: data.days[0].hours.map((hour) => {
        return {
          time: hour.datetime,
          temperature: hour.temp,
          feelslike: hour.feelslike,
          humidity: hour.humidity,
          windSpeed: hour.windspeed,
          description: hour.conditions,
        };
      }),
    };

    session.startTransaction();
    loggedinUser.logHistory.push({
      location: data.resolvedAddress,
      currentTime: new Date().toLocaleString("en-US", {
        timeZone: "Africa/Cairo",
      }),
      hourlyWeather: filteredData.hourlyWeather,
    });
    if (loggedinUser.logHistory.length > 3) {
      loggedinUser.logHistory.shift();
    }
    await loggedinUser.save({ session });
    await session.commitTransaction();
    res.json(filteredData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server Error" });
  }
};

export const getWeatherWeekly = async (req, res) => {
  try {
    const location = req.params.location;

    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${location}?unitGroup=metric&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json`
    );
    if (!response.ok) {
      return res
        .status(response.status)
        .json({ error: "Failed to fetch weather data" });
    }
    const data = await response.json();

    const filteredData = {
      location: data.resolvedAddress,
      weeklyWeather: data.days.slice(0, 7).map((day) => {
        return {
          date: day.datetime,
          DayTemperature: day.tempmax,
          NightTemperature: day.tempmin,
          feelslike: day.feelslikemax,
          rainChance: day.percip,
          humidity: day.humidity,
          windSpeed: day.windspeedmax,
          description: day.conditions,
        };
      }),
    };

    res.json(filteredData);
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "Server Error" });
  }
};

// export const getMyLocationWeather = async (req, res) => {
//     try{

//     }
//     catch(e){
//         console.log(e)
//         res.status(500).json({message: "Server Error"})
//     }}

export const getMyCurrentWeather = async (req, res) => {
  try {
    const userId = req.params.userId;
    let existingUser;

    if (!userId) {
      return res.status(404).json({ message: "UserId is required" });
    }
    existingUser = await User.findById(userId);
    if (!existingUser) {
      return res.status(404).json({ message: "User does not exist" });
    }

    // this should be handled in the frontend actually to grab the user's client location.
    // However I am not sure if im going to make a client side
    const locationdata = await fetch("http://ip-api.com/json");
    const locationData = await locationdata.json();
    const weatherResponse = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${locationData["city"]}?unitGroup=metric&key=LJBU6P5FG3UY5WB2KUV65GSSG&contentType=json`
    );

    if (!weatherResponse.ok) {
      return res
        .status(weatherResponse.status)
        .json({ error: "Failed to fetch weather data" });
    }
    const weatherData = await weatherResponse.json();

    const currentTime = new Date().toLocaleString("en-US", {
      timeZone: "Africa/Cairo",
    });
    const currentHour = currentTime.split(",")[1].split(":")[0].trim();

    const filteredData = {
      location: weatherData.resolvedAddress,
      currentTime,
      currentHour,
      currentConditions: {
        temperature: weatherData.currentConditions.temp,
        humidity: weatherData.currentConditions.humidity,
        windSpeed: weatherData.currentConditions.windspeed + " km/h",
      },
      description: weatherData.description,
    };
    const session = await mongoose.startSession();
    session.startTransaction();
    existingUser.logHistory.push({
      location: weatherData.resolvedAddress,
      currentTime,
      currentHour,
      temperature: weatherData.currentConditions.temp,
      humidity: weatherData.currentConditions.humidity,
      windSpeed: weatherData.currentConditions.windspeed,
      description: weatherData.description,
    });
    if (existingUser.logHistory.length > 3) {
      existingUser.logHistory.shift();
    }
    await existingUser.save({ session });
    await session.commitTransaction();
    res.json(filteredData);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
