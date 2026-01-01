import mongoose from "mongoose";

const Setting = new mongoose.Schema({
  name: String,
  booleanValue: Boolean,
  stringValue: String
});

export const Settings = mongoose.model("Settings", Setting);
