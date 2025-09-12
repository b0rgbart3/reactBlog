import mongoose from "mongoose";
import { Articles } from "./models/Articles";
import { Users } from "./models/Users";


// MongoDB connection string
const MONGO_URI = "mongodb://127.0.0.1:27017/myblog"; // replace "myblog" with your DB name

// Seed data
const articles = [
  {  headlineImage: "", body: "The bitcoin issuance equation is more mysterious than you might have realized.", category: 'bitcoin', title: "Issuance Equation", user_id: "001"},
  {  headlineImage: "", body: "The rule of 72", category: 'bitcoin', title: "The Rule of 72", user_id: "001" },
  {  headlineImage: "", body: "Article 3.", category: 'general', title: "Article 3", user_id: "001"},
  { headlineImage: "", body: "Article 4", category: 'general', title: "Article 4", user_id: "001" },
];

const users = [
{ sensi: true, author: true, phash: '$2b$10$wk1yvgv2aSN0oJWAG0Oyy.vy7MNZQaB60tMmIu1oA5oNEOzXQfcjm', user_name: "bart", status: "active", user_email: "b0rgbart3Wgmail.com" },
{ sensi: false, author: true, phash: '$2b$10$o8cwVPnN5llecMAg.5UvZOroV7Pmf/nvtIp5oGp4CKutESCn8qDpW', user_name: "dumbo", status: "active", user_email: "dumbo@somewhere.org" }
];

async function seed() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Optional: drop the entire database
    await mongoose.connection.dropDatabase();
    console.log("Database dropped");

    // Insert seed data
    await Articles.insertMany(articles);
    console.log("Seeded articles.");

    await Users.insertMany(users);
    console.log('Seeded users.');

    // Close connection
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (err) {
    console.error("Error seeding data:", err);
    process.exit(1);
  }
}

// Run the seed function
seed().catch(err => {
  console.error(err);
  process.exit(1);
});
