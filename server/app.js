const express = require("express");
const cors = require("cors");
const session = require("express-session");
const path = require("path");
require("dotenv").config();

// Routes
const adminRoutes = require("./routes/admin");
const consultationRoutes = require("./routes/consultations");
const demoBookingRoutes = require("./routes/demoBookings");
const kundliRoutes = require("./routes/kundli");
const blogRoutes = require("./routes/blogs");
const testimonialRoutes = require("./routes/testimonials");
const uploadRoutes = require("./routes/upload");

const app = express();

/* =========================
CORS CONFIG
========================= */
app.use(
  cors({
    origin: (origin, callback) => {
      // allow server-to-server, Postman, health checks
      if (!origin) return callback(null, true);

      const allowedOrigins = [
        "http://localhost:5173",
        "http://localhost:5174",
        "https://accurateastro.in",
        "https://www.accurateastro.in",
        "https://slategrey-cheetah-582252.hostingersite.com",
      ];

      // allow Vercel preview + prod domains
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.error("❌ Blocked by CORS:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

/* =========================
BODY PARSERS
========================= */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* =========================
SESSION CONFIG
========================= */
app.use(
session({
name: "accurate-astro.sid",
secret: process.env.SESSION_SECRET || "dev-secret",
resave: false,
saveUninitialized: false,
cookie: {
httpOnly: true,
secure: process.env.NODE_ENV === "production",
sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
maxAge: 24 * 60 * 60 * 1000,
},
})
);

/* =========================
LOG REQUESTS
========================= */
app.use((req, res, next) => {
console.log(`📡 ${req.method} ${req.originalUrl}`);
next();
});

/* =========================
SERVE FRONTEND (VITE BUILD)
========================= */
app.use(express.static(path.join(__dirname, "../dist")));

/* =========================
API ROUTES
========================= */
app.use("/api/upload", uploadRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/consultations", consultationRoutes);
app.use("/api/demo-bookings", demoBookingRoutes);
app.use("/api/kundli", kundliRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/testimonials", testimonialRoutes);

/* =========================
HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
res.json({
success: true,
status: "healthy",
service: "Accurate Astro API",
timestamp: new Date().toISOString(),
});
});

/* =========================
SERVE REACT APP (NON-API ROUTES)
========================= */
app.get("*", (req, res, next) => {
if (req.originalUrl.startsWith("/api")) return next();

res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

/* =========================
404 HANDLER (API ONLY)
========================= */
app.use("/api", (req, res) => {
res.status(404).json({
success: false,
message: "API endpoint not found",
path: req.originalUrl,
});
});

/* =========================
ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
console.error("❌ Server Error:", err.message);

res.status(err.status || 500).json({
success: false,
message: err.message || "Internal server error",
...(process.env.NODE_ENV === "development" && { stack: err.stack }),
});
});

/* =========================
SERVER START
========================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`🚀 Server running on port ${PORT}`);
console.log(`🌐 Environment: ${process.env.NODE_ENV || "development"}`);
});
