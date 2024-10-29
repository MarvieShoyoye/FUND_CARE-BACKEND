import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import morgan from "morgan";
import cookieparser from "cookie-parser";
import helmet from "helmet";
import connectDb from "./db/db.js";
import authRoutes from "./routes/authroute.js"

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

app.use("/api/auth", authRoutes);



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
    
})
