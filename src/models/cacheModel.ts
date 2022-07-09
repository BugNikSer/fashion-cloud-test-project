import { model, Schema } from "mongoose";
import type { Model, Document } from "mongoose";

interface ICache extends Document {
    key: string;
    value: string;
}

const cacheSchema = new Schema<ICache>({
    key: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
});

const Cache: Model<ICache> = model("Cache", cacheSchema);

export default Cache;
