import jwt from "jsonwebtoken";
import { User } from "../models/users.models.js";

export const protectroute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res.status(500).json({ message: "Token not Provided" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(500).json({ message: "Some Fault in Token" });
    }
    const user = await User.findById(decoded.userid);
    if (!user) {
      return res.status(500).json({ message: "User not Provided" });
    }
    req.user = user;
    next();
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in protectroute : " + error.message });
  }
};
