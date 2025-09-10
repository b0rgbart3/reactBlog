import mongoose from "mongoose";

const UsersSchema = new mongoose.Schema({
  sensi: Boolean,
  author: Boolean,
  phash: String,
  status: String,
  user_name: String,
  user_email: String
});

export const Users = mongoose.model("Users", UsersSchema);

