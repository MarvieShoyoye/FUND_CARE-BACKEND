import jwt from "jsonwebtoken";
import { errorResponse } from "../utility/error.js";

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("You are not authorized to access this resource");
    return next(
      errorResponse(401, "You are not authorized to access this resource")
    );
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    req.user = decoded;
    next();
  } catch (error) {
    return next(errorResponse(401, "Token is not valid or expired"));
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ success: false, message: "Access denied. Admins only" });
  }
  next();
};


