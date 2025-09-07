"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
const __dirname = path_1.default.dirname(__filename);
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const Data_1 = require("./models/Data");
const articleData = [
    { id: '0', body: "The bitcoin issuance equation is more mysterious than you might have realized.", category: 'bitcoin', title: "Issuance Equation", user_id: "001" },
    { id: '1', body: "The rule of 72", category: 'bitcoin', title: "The Rule of 72", user_id: "001" },
    { id: '3', body: "Article 3.", category: 'general', title: "Article 3", user_id: "001" },
    { id: '4', body: "Article 4", category: 'general', title: "Article 4", user_id: "001" },
];
mongoose_1.default.connect("mongodb://127.0.0.1:27017/myapp")
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) => {
    if (err instanceof Error)
        console.error("MongoDB error:", err.message);
    else
        console.error(err);
});
// Serve static files from public
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
app.use(express_1.default.json());
// Example API
// app.get("/api/myData", (req, res) => {
//   res.json({ articles: articleData});
// });
// Save new data
app.post("/api/myData", async (req, res) => {
    try {
        const doc = new Data_1.Data(req.body);
        await doc.save();
        res.json(doc);
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Fetch all data
app.get("/api/myData", async (req, res) => {
    try {
        const all = await Data_1.Data.find();
        res.json({ data: all });
    }
    catch (err) {
        res.status(500).json({ error: err.message });
    }
});
// Serve React build if it exists (production)
// Serve React in production
if (process.env.NODE_ENV === "production") {
    app.use(express_1.default.static(path_1.default.join(__dirname, "../../client/dist")));
    app.get("*", (req, res) => {
        res.sendFile(path_1.default.join(__dirname, "../../client/dist/index.html"));
    });
}
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
// Default route to public/index.html if exists
app.get("/index.html", (req, res) => {
    const indexPath = path_1.default.join(__dirname, "public", "index.html");
    res.sendFile(indexPath);
});
//# sourceMappingURL=server.js.map