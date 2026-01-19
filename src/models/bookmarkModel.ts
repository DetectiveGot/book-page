import mongoose, {Schema, models, model} from "mongoose";

const BookmarkSchema = new Schema({
    userSub: {
        type: String,
        require: true,
        index: true,
    },
    bookId: {
        type: mongoose.Types.ObjectId,
        ref: "books",
        require: true,
        index: true,
    },
}, {
    timestamps: {
        createdAt: true,
        updatedAt: true,
    }
})

BookmarkSchema.index({userSub: 1, bookId: 1}, {unique: true});

export default models.bookmarks || model("bookmarks", BookmarkSchema);