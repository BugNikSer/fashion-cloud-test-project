import express from 'express';
import Cache from '../models/cacheModel';

const router = express.Router();

// GET
router.get('', (request, response) => {
    console.log('get /cache');
    Cache.find({})
        .then((cache) => {
            console.log('got cache', cache);
            response.json(cache);
        })
        .catch((e) => {
            response.status(404).send(e.toString());
        });

    // response.send('Get all');
});
router.get('/:key', (request, response) => {
    const { key } = request.params;
    response.send('Get' + key);
});

// DELETE
router.delete('', (request, response) => {
    response.send('Deleted');
});
router.delete('/:key', (request, response) => {
    const { key } = request.params;
    response.send('Deleted' + key);
});

//POST
router.post('/', (request, response) => {
    const body = request.body;
    console.log(body);
    if (
        body.hasOwnProperty('key') &&
        typeof body.key === 'string' &&
        body.hasOwnProperty('value') &&
        typeof body.value === 'string'
    ) {
        const { key, value } = body;
        const record = new Cache({ key, value });
        record.save().then(() => {
            response.send('saved new item')
        }).catch(e => {
            console.log(e)
        });
        
    } else {
        response.status(404).send('wrong format')
    }
    // console.log(request)
    // console.log(Object.keys(body))
    // const record = new Cache({ key, value: request.body })
    // record.save()
    // response.send('Posted' + key);
});

export default router;
