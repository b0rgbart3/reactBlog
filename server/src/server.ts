

import dotenv from "dotenv";
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);


import express from "express";
import mongoose from "mongoose";
import path from "path";
import { Articles } from "./models/Articles";
import { Users } from "./models/Users";
import jwt, { Secret, SignOptions, StringValue } from "jsonwebtoken";
import bcrypt from "bcrypt";
import { seed } from "./seedMongoDB";



const app = express();
const PORT = process.env.PORT || 3000;
const MONGO_URI = "mongodb://127.0.0.1:27017/myblog";

const articles = [
  { headlineImage: "", body: "The bitcoin issuance equation is more mysterious than you might have realized.", category: 'bitcoin', title: "Issuance Equation", user_id: "001" },
  { headlineImage: "", body: "The rule of 72", category: 'bitcoin', title: "The Rule of 72", user_id: "001" },
  { headlineImage: "", body: "Article 3.", category: 'general', title: "Article 3", user_id: "001" },
  { headlineImage: "", body: "Article 4", category: 'general', title: "Article 4", user_id: "001" },
];

const users = [
  { sensi: true, author: true, phash: '$2b$10$C/DrFUhLR66fNX7WhC2KL.i.Uw9Hh/9QUMvxCxGrByzqin834lEe.', user_name: "bart", status: "active", user_email: "b0rgbart3@gmail.com" },
  { sensi: false, author: true, phash: '$2b$10$pOl0QkbiBcE6JeRiOvEJ6e0mcv8YnzfdmFABSALR70Fk4S5q2r44G', user_name: "dumbo", status: "active", user_email: "dumbo@somewhere.org" }
];



mongoose.connect(MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err: unknown) => {
    if (err instanceof Error) console.error("MongoDB error:", err.message);
    else console.error(err);
  });

// Serve static files from public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Save new data
app.post("/api/articles", async (req: any, res: any) => {
  try {
    const doc = new Articles(req.body);
    await doc.save();
    res.json(doc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/articles/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await Articles.findByIdAndUpdate(
      id,
      req.body,
      { new: true } // return the updated document
    );

    if (!updated) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json(updated);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});



// Fetch all data

app.post("/api/login", async (req: any, res: any) => {
  console.log('-----------------');
  console.log('GOT Login request: ', JSON.stringify(req.body));

  let match = false;
  let foundUser = undefined;
  const newUser = req.body;
  console.log('BD: about login user: ', newUser);
  try {
    const all = await Users.find();
    console.log('BD: all: ', all);
    foundUser = all.find((user) => user.user_name === newUser.user_name);
    console.log('Found user: ', foundUser);

    if (foundUser?.phash) {
      match = await bcrypt.compare(newUser.loginWord, foundUser.phash);
    }

    console.log('Match: ', match);
    if (match) {
      console.log('BD: returning: ', foundUser);


      const payload = {
        _id: foundUser?._id, user_name: foundUser?.user_name, user_email: foundUser?.user_email,
        author: foundUser?.author, status: foundUser?.status, sensi: foundUser?.sensi
      };

      const secret: Secret = process.env.JWT_SECRET as string;

      const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || "1h") as StringValue,
      };

      const token = jwt.sign(payload, secret, options);

      console.log('payload: ', payload);
      console.log('SECRET: ', process.env.JWT_SECRET);

      // const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      //   expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      // });
      console.log('TOKEN: ', token);

      // 5. Return token (instead of full user object)
      res.json({ token });


      // res.json(foundUser);
    }
    else {

      res.status(401).json({ error: "Invalid username or password" });

    };
  } catch (e) {
    res.status(401).json({ error: "Error retrieving the user info from the DB." });
  }
});

app.post("/api/users", async (req: any, res: any) => {
  try {
    const newUser = req.body;
    const newHash = await bcrypt.hash("mypassword", 10);
    newUser.phash = newHash;
    const doc = new Users(req.body);
    await doc.save();
    res.json(doc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/users", async (req: any, res: any) => {
  try {
    console.log('BD: GOT request for users.');

    const all = await Users.find();
    res.json({ data: all });
    console.log('BD: all users: ', all);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/articles", async (req: any, res: any) => {
  try {
    const all = await Articles.find();
    console.log('Articles: ', all);
    res.json({ data: all });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Kill (Full delete)
app.delete("/api/articles/:_id", async (req: any, res: any) => {
  try {
    const { _id } = req.params;
    console.log('Got the kill request.');
    console.log('About to kill: ', _id);
    // Use Mongoose's findByIdAndDelete
    const deleted = await Articles.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).json({ error: "Article not found" });
    }

    res.json({ success: true, deleted });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/wipe", async (req: any, res: any) => {
  const auth = req.body;
  let wipeStatus = 500;
  console.log('Got request to wipe, with auth: ', auth);
  try {
    mongoose.connection.dropDatabase();
    await Articles.insertMany(articles);
    console.log("Seeded articles.");

    await Users.insertMany(users);
    console.log('Seeded users.');
    wipeStatus = 200;
  } catch (e) { console.log('BD:unable to wipe the db.'); wipeStatus = 500; } finally {
    res.status(wipeStatus).send();
  }
});


// Serve React build if it exists (production)
// Serve React in production
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../../client/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
  });
}

// Default route to public/index.html if exists
app.get("/index.html", (req: any, res: any) => {
  const indexPath = path.join(__dirname, "public", "index.html");

  res.sendFile(indexPath);

});


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));


