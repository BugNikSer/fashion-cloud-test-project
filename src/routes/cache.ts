import express, { response } from 'express';
import Cache from '../models/cacheModel';
import config from '../config';

const { CacheItemsLimit } = config;
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

                    Cache.find({}).then((items) => {
                        if (items.length > CacheItemsLimit) {
                            console.log('Cache limit overflow');

                            const oldest = items.sort((a, b) =>
                                a > b ? 1 : a == b ? 0 : -1
                            )[0];

                            console.log(oldest)
                            Cache.deleteOne({ key: oldest.key }, (error) => {
                                if (error) {
                                    console.log('can not delete item', oldest.key);
                                } else {
                                    console.log('Item', oldest.key, 'deleted');
                                }
                            });
                        }
                    });

                    response.send('Cache miss');
                }
            }
        );
    } else {
        response.status(404).send('wrong format');
    }
});

export default router;
