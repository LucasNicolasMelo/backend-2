import { Schema, model } from "mongoose";

const userSchema = new Schema({
    first_name: {
        type: String,
        required: true
    },

    last_name: {
        type: String,
        required: true
    },

    email: {
        type: String,
        unique: true,
        required: true,
        lowercase: true,
        trim: true,
        match: [
            /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
            "El formato de email no es válido"
        ]
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        enum: ["user", "organizer", "admin"],
        default: "user"
    }
});

const userModel = model("user", userSchema);

export default userModel;