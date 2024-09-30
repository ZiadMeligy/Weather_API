import express from 'express';
import {getAllWeather,getCurrentWeather} from '../controllers/weather-controllers.js';

const weatherRouter = express.Router();

weatherRouter.get('/all', getAllWeather);
weatherRouter.get('/current', getCurrentWeather);

export default weatherRouter;