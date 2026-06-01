import mongoose from "mongoose";

const MemesSchema = new mongoose.Schema({
  title: String,
  description: String,
  image: String,
  category: String,
  readyToPublish: Boolean,
  originDate: String,
});

export const Memes = mongoose.models.memes || mongoose.model("memes", MemesSchema);
