import express from 'express';
import {getAllWeather,getCurrentWeather,getWeatherByHourToday,getMyLocationWeather} from '../controllers/weather-controllers.js';

const weatherRouter = express.Router();

weatherRouter.get('/', getMyLocationWeather);
weatherRouter.get('/:location/all', getAllWeather);
weatherRouter.get('/:location/current', getCurrentWeather);
weatherRouter.get('/:location/hourly', getWeatherByHourToday);

export default weatherRouter;