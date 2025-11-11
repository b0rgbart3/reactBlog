import { MongoClient } from "mongodb";
import { usersSeed } from "./users.js";
import { articlesSeed } from "./articles.js";

const MONGO_URI = "mongodb://127.0.0.1:27017";
const DB_NAME = "myblog";

async function seed() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);

  // clean existing data
  await db.collection("users").deleteMany({});
  await db.collection("articles").deleteMany({});

  console.log("🌱 Seeding users...");
  const userMap = {}; // email → ObjectId
  for (const user of usersSeed) {
    console.log('BD: about to seed: ', user);
    const { insertedId } = await db.collection("users").insertOne(user);
    userMap[user.userEmail] = insertedId;
  }

  console.log("🌱 Seeding articles...");
  for (const article of articlesSeed) {
    const authorId = userMap[article.authorEmail];
    if (!authorId) {
      console.warn(`⚠️ No user found for ${article.authorEmail}, skipping article "${article.title}"`);
      continue;
    }
    await db.collection("articles").insertOne({
      ...article,
      author: authorId,
      createdAt: new Date(),
      updatedAt: new Date()
    });
  }

  console.log("✅ Seeding complete.");
  await client.close();
}

seed().catch(err => {
  console.error(err);
  process.exit(1);
});
