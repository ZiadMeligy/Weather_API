import express from 'express';
import bodyParser from 'body-parser';
import weatherRouter from './routes/weather routes.js';
import userRouter from './routes/user-routes.js';
import mongoose from 'mongoose';

const app = express();

app.use(bodyParser.json());
app.use('/user', userRouter);
app.use('/weather', weatherRouter);

mongoose
  .connect(
    "mongodb+srv://ziadmeligy:ziadlol4321@cluster0.4q1zk.mongodb.net/WeatherAPI"
  )
  .then(() => app.listen(3100))
  .then(() => console.log("connected to db and listening on port 3100"))
  .catch((err) => console.log(err));

