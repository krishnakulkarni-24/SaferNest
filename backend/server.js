// server.js
import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import { fileURLToPath } from "url";

dotenv.config();

const app = express();

// Get __dirname in ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// --- Middleware ---
app.use(express.json());

// CORS: allow all origins (reflect request origin) and handle preflight
// This is safe since we use bearer tokens, not cookies. If you later use cookies,
// keep credentials: true and ensure trusted origins only.
const corsOptions = {
  origin: (origin, callback) => callback(null, true), // reflect any origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: [
    "Content-Type",
    "Authorization",
    "X-Requested-With",
    "Accept",
    "Origin"
  ],
  optionsSuccessStatus: 204,
};
app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGO_URI||'mongodb://localhost:27017/safernest' )
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// --- API routes ---
import userRoutes from "./routes/userRoutes.js";
import alertRoutes from "./routes/alertRoutes.js";
import helpRequestRoutes from "./routes/helpRequestRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

app.use("/api/users", userRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/help-requests", helpRequestRoutes);
app.use("/api/contact", contactRoutes);

const frontendPath = path.join(__dirname, "public", "browser");
app.use(express.static(frontendPath));

// Serve Angular for non-API routes only
app.get(/^\/(?!api).*/, (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


// --- Start server ---
const PORT = process.env.PORT || 5000;

// Bind to all network interfaces (0.0.0.0) so it works locally and on Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
