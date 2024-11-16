import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import helmet from "helmet";
import connectDb from "./db/db.js";
import authRoutes from "./routes/authroute.js";
import userRoutes from "./routes/userroute.js";
import adminRoutes from "./routes/adminroutes.js";
import campaignRoutes from "./routes/campaignroutes.js";
import projectRoutes from "./routes/projectroutes.js";
import donationRoutes from "./routes/donationroutes.js";
import paymentRoutes from "./routes/paymentroute.js";
import communityengagementRoutes from "./routes/communityenagagement.js";
import passport from "./passport.js";
import session from "express-session";

dotenv.config();

const app = express();

connectDb();

app.use(express.json());
app.use(cors());
app.use(helmet());
app.use(cookieparser());
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms")
);

// Middleware for handling sessions
app.use(
  session({
    secret: "your-session-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// Initialize Passport and session support
app.use(passport.initialize());
app.use(passport.session());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/admin", adminRoutes);
app.use("./api/campaign", campaignRoutes);
app.use("./api/project", projectRoutes);
app.use("/api/donation", donationRoutes);
app.use("/api/community-enagagement", communityengagementRoutes);

app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  return res.status(statusCode).json({
    success: false,
    message,
    statusCode,
  });
});

const port = process.env.PORT || 8080;
app.listen(port, () => {
  console.log(`Server is running at port ${port}`);
});
