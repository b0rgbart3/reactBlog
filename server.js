const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const articleData = [
    { id: '0', body: "The bitcoin issuance equation is more mysterious than you might have realized.", category: 'bitcoin', title: "Issuance Equation", user_id: "001"},
    { id: '1', body: "The rule of 72", category: 'bitcoin', title: "The Rule of 72", user_id: "001" },
    { id: '3', body: "Article 3.", category: 'general', title: "Article 3", user_id: "001"},
    { id: '4', body: "Article 4", category: 'general', title: "Article 4", user_id: "001" },
    
  ]

// Serve static files from public
app.use(express.static(path.join(__dirname, "public")));

// Example API
app.get("/api/myData", (req, res) => {
  res.json({ articles: articleData});
});

// Serve React build if it exists (production)
const reactBuildPath = path.join(__dirname, "client", "dist");
const fs = require("fs");
if (fs.existsSync(reactBuildPath)) {
  app.use(express.static(reactBuildPath));
  // catch-all route for React SPA
  app.get("/*", (req, res) => {
    res.sendFile(path.join(reactBuildPath, "index.html"));
  });
} else {
  console.log("React build not found. Skipping React serving.");
}

// Default route to public/index.html if exists
app.get("/index.html", (req, res) => {
  const indexPath = path.join(__dirname, "public", "index.html");
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send("<h1>Welcome! Put an index.html in public/ or build React.</h1>");
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});


