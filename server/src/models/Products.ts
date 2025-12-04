import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  productDescription: String,
  category: String,
  mainImage: String,
  readyToPublish: Boolean,
  productName: String,
});

export const Products = mongoose.model("products", ProductsSchema);

