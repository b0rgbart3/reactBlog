import express from "express";
import mongoose from "mongoose";
import path from "path";
import { Articles } from "./models/Articles";
import { Users } from "./models/Users";
import bcrypt from "bcrypt";

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect("mongodb://127.0.0.1:27017/myblog")
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
  try {
    const all = await Users.find();
    foundUser = all.find((user) => user.user_name === newUser.user_name);

    if (foundUser?.phash) {
      match = await bcrypt.compare(newUser.loginWord, foundUser.phash);
    }

     if (match) {
      console.log('BD: returning: ', foundUser); 
      res.json( foundUser );
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


