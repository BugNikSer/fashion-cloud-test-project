import express from 'express';
import mongoose from 'mongoose';
import CacheRouter from './routes/cache';

mongoose.connect('mongodb://127.0.0.1:27017/FashionCloud', (error) => {
    if (error) {
        console.log(error.message)
    } else {
        console.log('Connected to database')
    }
});

const app = express();
app.use(express.json());
app.get('/', (request, response) => {
    response.send('Hello there!');
});
app.use('/cache', CacheRouter);

const port = 3000;
app.listen(port, () => console.log(`Running on port ${port}`));
