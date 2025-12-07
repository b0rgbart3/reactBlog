import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  productDescription: String,
  beauty: String,
  category: String,
  productImages: [],
  readyToPublish: Boolean,
  productName: String,
  thumbnail: String
});

export const Products = mongoose.model("products", ProductsSchema);

