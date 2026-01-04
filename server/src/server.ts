

import dotenv from "dotenv";
dotenv.config();
console.log("JWT_SECRET:", process.env.JWT_SECRET);
console.log('MY NODE ENV: ', process.env.NODE_ENV);

import express from "express";
import mongoose from "mongoose";
import fs from "fs";

// At the top of your file
import path from "path";
import { fileURLToPath } from "url";

// Recreate CommonJS globals
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const MONGO_URI = process.env.MONGO_URI;
const MONGO_DUMP_PATH = process.env.MONGO_DUMP_PATH;

import { Articles } from "./models/Articles.ts";

import { Users } from "./models/Users.ts";

//  import pkg, { Secret, SignOptions } from 'jsonwebtoken';
// const { Secret, SignOptions, StringValue } = pkg;

import jwt, { Secret, SignOptions } from "jsonwebtoken";
import multer from "multer";
import bcrypt from "bcrypt";
// import { seed } from "./seedMongoDB.ts";
import cors from "cors";
import { exec } from "child_process";
import { Products } from "./models/Products.ts";
import { Settings } from "./models/Settings.ts";


function getRandomHexColor(): string {
  // Generate a random number between 0 and 0xFFFFFF
  const randomNum = Math.floor(Math.random() * 0xffffff);

  // Convert it to a hexadecimal string and pad with zeros if necessary
  const hexString = randomNum.toString(16).padStart(6, '0');

  // Return as a CSS color string
  return `${hexString}`;
}

const app = express();
const PORT = process.env.PORT || 3000;


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

// store in "uploads" folder locally
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const articleStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/articles/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/products/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });
const uploadArticle = multer({ storage: articleStorage });
const uploadProducts = multer({ storage: productStorage });

if (MONGO_URI) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err: unknown) => {
      if (err instanceof Error) console.error("MongoDB error:", err.message);
      else console.error(err);
    });
} else {
  console.error('NO mongo URI.');
}

// Serve static files from public
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.use(cors({
  origin: "http://localhost:5173", credentials: true
}));

app.use("/uploads", express.static("uploads"));

// Save new data
app.post("/api/articles", uploadArticle.single("headlineImage"), async (req, res) => {
  try {
    const doc = new Articles(req.body);
    const imagePath = req.file ? `/uploads/articles/${req.file.filename}` : null;
    if (imagePath) {
      doc.headlineImage = imagePath;
    }

    doc.randomColor = getRandomHexColor();
    doc.originDate = new Date().toISOString().split("T")[0];

    await doc.save();
    res.json(doc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/products", uploadProducts.fields([
  { name: "images", maxCount: 10 },
  { name: "newBeauty", maxCount: 1 },
  { name: "newThumbnail", maxCount: 1 }
]), async (req, res) => {
  try {



    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    const images = files?.images ?? [];
    const thumbnailFiles = files?.newThumbnail ?? [];
    const thumbnail = thumbnailFiles[0];

    const uploadedImages = images?.map((file) => `/uploads/products/${file.filename}`);

    req.body.productImages = uploadedImages;

    const beautyFiles = files?.beauty ?? [];
    const beauty = beautyFiles[0];

    if (beauty) {
      req.body.beauty = `/uploads/products/${beauty.filename}`;
    }

    if (thumbnail) {
    req.body.thumbnail = `/uploads/products/${thumbnail.filename}`;
    }

    const doc = new Products(req.body);
    console.log('BD: about to save a product: ', req.body);
    // const imagePath = req.file ? `/uploads/${req.file.filename}` : null;
    // if (imagePath) {
    //   doc.mainImage = imagePath; }

    await doc.save();
    res.json(doc);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.patch("/api/products/:id", uploadProducts.fields([
  { name: "images", maxCount: 10 },
  { name: "newBeauty", maxCount: 1 },
  { name: "newThumbnail", maxCount: 1 }
]), async (req, res) => {
  try {
    const { id } = req.params;
    const images = req.files["images"] || [];
    const beauty = req.files["newBeauty"]?.[0] || null;
    const thumbnail = req.files["newThumbnail"]?.[0] || null;


    const uploadedImages = images?.map((file) => `/uploads/products/${file.filename}`);
    const newImageArray = req.body.productImages ? req.body.productImages : [];
    const combined = newImageArray.length ? [newImageArray, ...uploadedImages] : uploadedImages;

    req.body.productImages = combined;
    if (beauty) {
      req.body.beauty = `/uploads/products/${beauty.filename}`;
    }
    if (thumbnail) {
      req.body.thumbnail = `/uploads/products/${thumbnail.filename}`;
    }

    // console.log('BD: req: ', req.body);

    const updated = await Products.findByIdAndUpdate(
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


app.patch("/api/articles/:id", uploadArticle.single("headlineImage"), async (req, res) => {
  try {
    const { id } = req.params;
    let headlineImage;

    const imagePath = req.file ? `/uploads/articles/${req.file.filename}` : null;
    if (imagePath) {
      headlineImage = imagePath;
    }

    req.body.headlineImage = headlineImage;
    req.body.lastModifiedDate = new Date().toISOString().split("T")[0];
    req.body.randomColor = getRandomHexColor();

    // console.log('BD: REQ body: ', req.body);

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

app.patch("/api/user/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // console.log('BD: REQ body: ', req.body);

    const updated = await Users.findByIdAndUpdate(
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


  let match = false;
  let foundUser = undefined;
  const newUser = req.body;
  // console.log('BD: about login user: ', newUser);
  try {
    const all = await Users.find();
    // console.log('BD: all: ', all);
    // console.log('BD: looking for: ', newUser.userName);

    foundUser = all.find((user) => user.userName === newUser.userName);
    // console.log('Found user: ', foundUser);

    if (foundUser?.phash) {
      match = await bcrypt.compare(newUser.loginWord, foundUser.phash);
    }

    // console.log('Match: ', match);
    if (match) {
      // console.log('BD: returning: ', foundUser);


      const payload = {
        autoGenerated: foundUser?.autoGenerated, _id: foundUser?._id, userName: foundUser?.userName, userEmail: foundUser?.userEmail,
        author: foundUser?.author, status: foundUser?.status, sensi: foundUser?.sensi
      };

      const secret: Secret = process.env.JWT_SECRET as string;

      const options: SignOptions = {
        expiresIn: (process.env.JWT_EXPIRES_IN || "2h"),
      };

      const token = jwt.sign(payload, secret, options);

      // console.log('payload: ', payload);
      // console.log('SECRET: ', process.env.JWT_SECRET);

      // const token = jwt.sign(payload, process.env.JWT_SECRET as string, {
      //   expiresIn: process.env.JWT_EXPIRES_IN || "1h",
      // });
      // console.log('TOKEN: ', token);

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

app.get("/api/showMerch", async (req: any, res: any) => {
  try {
    const settings = await Settings.find();
    const showMerch = settings.find((setting) => setting.name === "showMerch");
    res.json({ data: showMerch });
  }
  catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/settings", async (req: any, res: any) => {
  try {
    const settings = await Settings.find();
    res.json({ data: settings });
  }
  catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


app.post("/api/toggleMerch", async (req: any, res: any) => {
  console.log('BD: toggleing showMerch.');

  const showMerchSetting = {
    name: 'showMerch', booleanValue: true
  }
  try {
    const settings = await Settings.find();
    const showMerch = settings.find((setting) => setting.name === "showMerch");
    console.log('BD: showMerch: ', JSON.stringify(showMerch));

    if (showMerch) {
      // toggle it
      showMerch.booleanValue = !showMerch.booleanValue;

      const updated = await Settings.findByIdAndUpdate(
        showMerch._id,
        showMerch
      );

    } else {
      // set it
      const setting = new Settings(showMerchSetting);
      await setting.save();
      res.json(setting);
    }
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});


app.get("/api/users", async (req: any, res: any) => {
  try {
    // console.log('BD: GOT request for users.');

    const all = await Users.find();
    res.json({ data: all });
    // console.log('BD: all users: ', all);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/contact", (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing fields" });
  }

  console.log('BD: got contact from: ', name);
  console.log(email);
  console.log(message);
  // 1) send an email
  // 2) save to DB
  // 3) log somewhere

  res.status(200).json({ success: true });
});


app.get("/api/products", async (req: any, res: any) => {
  try {
    // console.log('BD: GOT request for users.');

    const all = await Products.find();
    res.json({ data: all });
    // console.log('BD: all users: ', all);
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.get("/api/articles", async (req: any, res: any) => {
  try {
    const all = await Articles.find();
    // console.log('Articles: ', all);
    res.json({ data: all });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

// Kill (Full delete)
app.delete("/api/articles/:_id", async (req: any, res: any) => {
  try {
    const { _id } = req.params;
    // console.log('Got the kill request.');
    // console.log('About to kill: ', _id);
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

app.delete("/api/products/:_id", async (req: any, res: any) => {
  try {
    const { _id } = req.params;
    const deleted = await Products.findByIdAndDelete(_id);

    if (!deleted) {
      return res.status(404).json({ error: "Product to kill was not found" });
    }

    res.json({ success: true, deleted });

  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/api/wipe", async (req: any, res: any) => {
  const auth = req.body;
  let wipeStatus = 500;
  // console.log('Got request to wipe, with auth: ', auth);
  try {
    mongoose.connection.dropDatabase();
    // await Articles.insertMany(articles);
    // console.log("Seeded articles.");

    // await Users.insertMany(users);
    // console.log('Seeded users.');
    wipeStatus = 200;
  } catch (e) { console.log('BD:unable to wipe the db.'); wipeStatus = 500; } finally {
    res.status(wipeStatus).send();
  }
});

function getIsoFolderName() {
  return new Date().toISOString().split("T")[0];
}

app.post("/api/backup", async (req: any, res: any) => {
  const auth = req.body;
  let backupStatus = 500;
  try {
    const todaysDate = new Date();
    let localeString = todaysDate.toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    // console.log('BD: todays date: ', localeString);

    // Optional: build an absolute output path

    const folderName = getIsoFolderName();
    const backupPath = path.join(process.cwd(), "adminBackup", folderName);


    //  const backupPath = path.join(process.cwd(), "adminBackup");


    // Your MongoDB backup command


    // console.log('BD: MONGO DUMP PATH: ', MONGO_DUMP_PATH);

    if (!fs.existsSync(backupPath)) {
      fs.mkdirSync(backupPath, { recursive: true });
    }

    const cmd = `${MONGO_DUMP_PATH}/mongodump --uri="mongodb://127.0.0.1:27017/myblog" --out="${backupPath}"`;

    exec(cmd, (error, stdout, stderr) => {
      if (error) {
        console.error("Backup failed:", error);
        console.error("stderr:", stderr);
        return res.status(500).json({ message: "Backup failed" });
      }

      console.log("Backup completed:", stdout);
      res.status(200).json({ message: "Backup completed", output: stdout });
    });




    backupStatus = 200;
  } catch (e) {
    // console.log('BD:unable to backup the db.'); backupStatus = 500;

    res.status(backupStatus).send();
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


