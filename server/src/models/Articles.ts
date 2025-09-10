import mongoose from "mongoose";

const ArticlesSchema = new mongoose.Schema({
  body: String,
  category: String,
  headlineImage: String,
  title: String,
  user_id: String
});

export const Articles = mongoose.model("Articles", ArticlesSchema);

