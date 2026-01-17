import {Schema, models, model} from "mongoose";

const BookSchema = new Schema({
    title: {
        type: String,
        require: true,
        index: true,
    },
    author: {
        type: String,
        require: true,
    },
    chapter: {
        type: Number,
        require: true,
    },
    currentChapter: {
        type: Number,
        require: true,
        default: 1
    },
    genre: {
        type: [String],
        require: true,
    },
    description: {
        type: String,
        require: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
})

export default models.books || model("books", BookSchema);