import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generatetoken = async (userid, res) => {
  try {
    const token = jwt.sign({ userid }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.cookie("jwt", token, {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      sameSite: "Lax",
      secure: process.env.SECURE != "development",
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in generatetoken : " + error.message });
  }
};
