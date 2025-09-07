import express from "express";
import mongoose from "mongoose";
import path from "path";
import { Data } from "./models/Data";

const app = express();
const PORT = process.env.PORT || 3000;


mongoose.connect("mongodb://127.0.0.1:27017/myapp")
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err: unknown) => {
    if (err instanceof Error) console.error("MongoDB error:", err.message);
    else console.error(err);
  });

// Serve static files from public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

// Save new data
app.post("/api/myData", async (req: any, res:any) => {
  try {
    const doc = new Data(req.body);
    await doc.save();
    res.json(doc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Fetch all data
app.get("/api/myData", async (req: any, res: any) => {
  try {
    const all = await Data.find();
    res.json({ data: all });
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


app.listen( PORT, () => console.log(`Server running on http://localhost:${PORT}`));


