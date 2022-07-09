import Cache from 'src/models/cacheModel';
import config from '../config';
const { CleanInterval, TimeToLeave } = config;

class Cleaner {
    static interval;

    constructor() {
        this.runCleaner();
    }

    runCleaner() {
        if (!Cleaner.interval) {
            Cleaner.interval = setInterval(() => {
                Cache.find({}).then((items) => {
                    const outdated: string[] = items.reduce(
                        (result, { key, created }) => {
                            if (+new Date() > created + TimeToLeave * 1000) {
                                result.push(key);
                            }
                            return result;
                        },
                        []
                    );

                    this.ClearOutdatedItems(outdated);
                });
                this.ClearOutdatedItems;
            }, CleanInterval * 1000);
        }
    }

    stopCleaner() {
        clearInterval(Cleaner.interval);
    }

    resetCleaner() {
        this.stopCleaner();
    }

    private ClearOutdatedItems(keys: string[]): void {
        keys.forEach((key) => {
            Cache.deleteOne({ key }, (error) => {
                if (error) {
                    console.log('can not delete item', key);
                } else {
                    console.log('item', key, 'outdated');
                }
            });
        });
    }
}

export default Cleaner;
