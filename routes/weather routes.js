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
weatherRouter.get('/:location/all/:userId', getAllWeather);
weatherRouter.get('/:location/current/:userId', getCurrentWeather);
weatherRouter.get('/:location/hourly/:userId', getWeatherByHourToday);
weatherRouter.get('/:location/weekly/:userId', getWeatherWeekly); 
weatherRouter.get("/current/mylocation/:userId", getMyCurrentWeather);

export default weatherRouter;