import mongoose from "mongoose";

const ArticlesSchema = new mongoose.Schema({
  body: String,
  category: String,
  headlineImage: String,
  title: String,
  authorEmail: String,
  authorID: String
});

export const Articles = mongoose.model("articles", ArticlesSchema);

