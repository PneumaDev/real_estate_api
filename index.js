import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRouter from "./routes/user.route.js";
import authRouter from "./routes/auth.route.js";
import listingRouter from "./routes/listing.route.js";
import cookieParser from "cookie-parser";
import serverless from "serverless-http";
import cors from "cors";


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// _Enable CORS middleware
app.use(cors({
  origin: ['https://stlc.vercel.app', 'http://localhost:5173'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
}));

// Middleware
app.use(cookieParser());
app.use(express.json()); // Parse JSON requests

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("✅ Connected to Database"))
  .catch((err) => console.error("❌ Database Connection Error:", err));

// Define Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

app.get('/', (req, res) => {
  res.send("RealEstate API Working ✅")
})

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  return res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});

// ✅ Export for Vercel (Serverless)
export default app;
export const handler = serverless(app);

// ✅ Start server for local development
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
}
