import { model, Schema } from "mongoose";
import type { Model, Document } from "mongoose";

export interface ICache extends Document {
    key: string;
    value: string;
    created: number;
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
    created: {
        type: Number,
        required: true
    }
});

const Cache: Model<ICache> = model("Cache", cacheSchema);

export default Cache;
