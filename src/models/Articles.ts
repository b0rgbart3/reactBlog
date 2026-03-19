import mongoose from "mongoose";

const ArticlesSchema = new mongoose.Schema({
  body: String,
  category: String,
  headlineImage: String,
  originDate: String,
  lastModifiedDate: String,
  randomColor: String,
  readyToPublish: Boolean,
  summary: String,
  title: String,
  userID: String
});

export const Articles = mongoose.models.articles || mongoose.model("articles", ArticlesSchema);

