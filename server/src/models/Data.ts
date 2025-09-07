import mongoose from "mongoose";

const DataSchema = new mongoose.Schema({
  id: String,
  message: String,
});

export const Data = mongoose.model("Data", DataSchema);
