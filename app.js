import express from 'express';
import bodyParser from 'body-parser';
import weatherRouter from './routes/weather routes.js';

const app = express();

app.use(bodyParser.json());

app.use('/weather', weatherRouter);

app.listen(3100, () => {
    console.log('Server is running on http://localhost:3000');
    });

