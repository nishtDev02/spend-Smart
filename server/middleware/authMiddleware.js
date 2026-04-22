import jwt from "jsonwebtoken";
import User from "../models/User_model.js";

const protect = async (req, res, next) => {
  try {
    // taking token from header
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      res.status(401).json({ message: "Not authorized, No token" });
    }

    // verifying token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.userId).select("-password");

    next();
  } catch (error) {
    res.status(401).json({ message: "Not authorized, Token failed" });
  }
};

export default protect;
