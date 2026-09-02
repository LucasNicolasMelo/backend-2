import { Schema, model } from "mongoose";

const eventSchema = new Schema({
    name: String,
    date: Date,
    place: String,
    price: Number,
    capacity: Number,
    status: Boolean,

    organizer: {
        type: Schema.Types.ObjectId,
        ref: "user",
        required: true
    }
});

export const eventModel = model("event", eventSchema);