const express = require("express");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Serve static files from public
app.use(express.static(path.join(__dirname, "public")));

// Example API
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from Express!" });
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


