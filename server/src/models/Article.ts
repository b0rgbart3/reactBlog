import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema({
  id: String,
  body: String,
  category: String,
  headlineImage: String,
  title: String,
  user_id: String
});

export const Article = mongoose.model("Data", ArticleSchema);

