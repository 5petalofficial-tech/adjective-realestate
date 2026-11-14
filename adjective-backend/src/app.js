const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const helmet = require("helmet");
const morgan = require("morgan");

const path = require("path");

const routes = require("./routes");

const errorMiddleware = require("./middlewares/error.middleware");
const sanitizeRequest = require("./middlewares/sanitize.middleware");
const ApiError = require("./utils/ApiError");

const app = express();

// Debug
console.log({
    NODE_ENV: process.env.NODE_ENV,
    CLIENT_URL: process.env.CLIENT_URL,
    PORT: process.env.PORT,
});

// --- Security & parsing middleware ---
app.use(helmet({ crossOriginResourcePolicy: false }));
// `cors` expects a single origin (or a callback), not an array. Accept a
// comma-separated CLIENT_URL so local development can use more than one
// frontend (for example localhost:3000 and localhost:8081).
const allowedOrigins = (process.env.CLIENT_URL || "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean);

app.use(
    cors({
        origin: (origin, callback) => {
            // Allow server-to-server requests and browser requests without an
            // Origin header, while validating browser origins explicitly.
            if (!origin || allowedOrigins.includes(origin)) {
                return callback(null, true);
            }
            return callback(null, false);
        },
        credentials: true, // required so the refresh-token cookie is sent
    })
);
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));
app.use(cookieParser());
app.use(sanitizeRequest);

if (process.env.NODE_ENV !== "production") {
    app.use(morgan("dev"));
}

// --- Health check ---
app.get("/health", (_req, res) => {
    res.status(200).json({ success: true, message: "Adjective API is running" });
});

// --- Static assets ---
// Serve uploaded files; if a file is missing return 404 image (not JSON)
app.use("/uploads", express.static(path.join(__dirname, "../uploads"), {
  fallthrough: false, // return 404 immediately if file not found
}));
// Catch static 404s and return a plain 404 (not the JSON ApiError handler)
app.use("/uploads", (err, _req, res, _next) => {
  res.status(404).end("File not found");
});

// --- API routes ---
app.use("/api", routes);

// --- 404 handler ---
app.use((req, _res, next) => {
    next(ApiError.notFound(`Route ${req.originalUrl} not found`));
});

// --- Global error handler (must be last) ---
app.use(errorMiddleware);

module.exports = app;
