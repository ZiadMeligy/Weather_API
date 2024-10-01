import express from 'express';
import {getAllWeather,getCurrentWeather,getWeatherByHourToday,getWeatherWeekly} from '../controllers/weather-controllers.js';

const weatherRouter = express.Router();

// weatherRouter.get('/', getMyLocationWeather);
weatherRouter.get('/:location/all', getAllWeather);
weatherRouter.get('/:location/current/:userId', getCurrentWeather);
weatherRouter.get('/:location/hourly', getWeatherByHourToday);
weatherRouter.get('/:location/weekly', getWeatherWeekly); 

export default weatherRouter;