import randomstring from 'randomstring';
import Cache from 'src/models/cacheModel';
import config from '../config';
const { UpdateIntervalSeconds, TimeToLeaveSeconds } = config;

class Updater {
    static interval;

    constructor() {
        this.runUpdater();
    }

    public runUpdater() {
        if (!Updater.interval) {
            Updater.interval = setInterval(() => {
                Cache.find({}).then((items) => {
                    const outdated: string[] = items.reduce(
                        (result, { key, created }) => {
                            if (
                                +new Date() >
                                created + TimeToLeaveSeconds * 1000
                            ) {
                                result.push(key);
                            }
                            return result;
                        },
                        []
                    );

                    this.updateItems(outdated);
                });
            }, UpdateIntervalSeconds * 1000);
        }
    }

    public stopUpdater() {
        clearInterval(Updater.interval);
    }

    public restartUpdater() {
        this.stopUpdater();
        this.runUpdater();
    }

    private updateItems(keys: string[]) {
        keys.forEach((key) => {
            Cache.findOneAndUpdate(
                { key },
                {
                    key,
                    value: randomstring.generate({
                        length: 12,
                    }),
                    created: +new Date(),
                },
                (error, doc) => {
                    if (error) {
                        console.log('can not update item', key);
                    } else if (doc) {
                        console.log('item', key, 'updated');
                    } else {
                        console.log(
                            'Deleted item successfully updated. Check',
                            key,
                            'again. Something strange happened.'
                        );
                    }
                }
            );
        });
    }
}

export default Updater;
