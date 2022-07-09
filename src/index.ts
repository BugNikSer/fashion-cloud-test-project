import express, { response } from 'express';
import mongoose from 'mongoose';
import CacheRouter from './routes/cache';
import { DatabaseURL, ServerPort } from './config';

mongoose.connect(DatabaseURL, (error) => {
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
app.use('*', () => {
    response.status(404).send('No such route exists')
})

app.listen(ServerPort, () => console.log(`Running on port ${ServerPort}`));
