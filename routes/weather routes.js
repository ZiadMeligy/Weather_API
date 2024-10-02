import express from 'express';
import {
  getAllWeather,
  getCurrentWeather,
  getWeatherByHourToday,
  getWeatherWeekly,
  getMyCurrentWeather,
} from "../controllers/weather-controllers.js";

const weatherRouter = express.Router();

// weatherRouter.get('/', getMyLocationWeather);
weatherRouter.get('/:location/all', getAllWeather);
weatherRouter.get('/:location/current/:userId', getCurrentWeather);
weatherRouter.get('/:location/hourly', getWeatherByHourToday);
weatherRouter.get('/:location/weekly', getWeatherWeekly); 
weatherRouter.get("/current/mylocation", getMyCurrentWeather);

export default weatherRouter;