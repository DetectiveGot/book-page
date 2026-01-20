import mongoose, { Schema, models, model } from "mongoose";

const bannerSchema = new Schema({
    imageUrl: {
        type: String,
        require: true,
    },
    bookId: {
        type: mongoose.Types.ObjectId,
        require: true,
    }
})

export default models.banners || model("banners", bannerSchema);