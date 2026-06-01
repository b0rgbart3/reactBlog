import mongoose from "mongoose";

const ProductsSchema = new mongoose.Schema({
  productDescription: String,
  beauty: String,
  category: String,
  productImages: [],
  readyToPublish: Boolean,
  productName: String,
  thumbnail: String,
  price: { type: Number, default: 0 },
});

export const Products = mongoose.models.products || mongoose.model("products", ProductsSchema);

