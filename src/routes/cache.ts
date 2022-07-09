import express, { response } from 'express';
import { request } from 'http';
import Cache from '../models/cacheModel';

const router = express.Router();

// GET
router.get('', (request, response) => {
    Cache.find({})
        .then((cache) => {
            response.json(cache.map(({ key }) => key));
        })
        .catch((e) => {
            response.status(404).send(e.toString());
        });

    // response.send('Get all');
});

router.get('/key/:key', (request, response) => {
    const { key } = request.params;
    Cache.findOne({ key }).then((item) => {
        if (item) {
            response.json(item);
        } else {
            response.json({
                message: 'not found',
            });
        }
    });
});

// DELETE
router.delete('', (request, response) => {
    Cache.deleteMany({}, (error) => {
        if (error) {
            console.log(error);
            response.send('Can not clear. Check logs.');
        } else {
            response.send('cleared');
        }
    });
});

router.delete('/key/:key', (request, response) => {
    const { key } = request.params;
    Cache.deleteOne({ key }, (error) => {
        if (error) {
            console.log(error);
            response.send('Can not removed. Check logs.');
        } else {
            response.send('removed');
        }
    });
});

//POST
router.post('/', (request, response) => {
    const body = request.body;
    if (
        body.hasOwnProperty('key') &&
        typeof body.key === 'string' &&
        body.hasOwnProperty('value') &&
        typeof body.value === 'string'
    ) {
        const { key, value } = body;
        Cache.findOneAndUpdate(
            { key },
            { key, value, created: +new Date() },
            { upsert: true },
            (error, doc) => {
                if (error) {
                    console.log(error);
                    response
                        .status(404)
                        .send('something went wrong. check logs');
                } else if (doc) {
                    console.log('Cache hit');
                    response.send('Cache hit');
                } else {
                    console.log('Cache miss');
                    response.send('Cache miss');
                }
            }
        );
    } else {
        response.status(404).send('wrong format');
    }
});

export default router;
