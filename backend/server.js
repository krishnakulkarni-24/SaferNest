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
// CORS setup: allow Angular dev server and deployed frontend
/*const allowedOrigins = [
  "http://localhost:4200",            // Angular dev
  process.env.FRONTEND_URL || ""      // deployed frontend URL from env
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow server-to-server requests
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "CORS policy does not allow access from this origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);*/

app.use(cors({ credentials: true }));
// --- MongoDB connection ---
mongoose
  .connect(process.env.MONGO_URI)
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

app.get("*", (req, res) => {
  res.sendFile(path.join(frontendPath, "index.html"));
});


// --- Start server ---
const PORT = process.env.PORT || 5000;

// Bind to all network interfaces (0.0.0.0) so it works locally and on Render
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
