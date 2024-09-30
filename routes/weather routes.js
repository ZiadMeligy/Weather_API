import express from 'express';
import {getAllWeather,getCurrentWeather,getWeatherByHour} from '../controllers/weather-controllers.js';

const weatherRouter = express.Router();

weatherRouter.get('/all', getAllWeather);
weatherRouter.get('/current', getCurrentWeather);
weatherRouter.get('/hourly', getWeatherByHour);

export default weatherRouter;