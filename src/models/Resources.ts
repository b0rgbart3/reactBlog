import mongoose from "mongoose";

const ResourcesSchema = new mongoose.Schema({
  title: String,
  author: String,
  type: String,
  description: String,
  imageURL: String,
  linkURL: String,
  readyToPublish: Boolean,
});

export const Resources =
  mongoose.models.resources || mongoose.model("resources", ResourcesSchema);
