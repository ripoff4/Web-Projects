import { generatetoken } from "../lib/generatetoken.js";
import { User } from "../models/users.models.js";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";

export const signup = async (req, res) => {
  try {
    const { username, email, password, image } = req.body;
    if (!username || !email || !password) {
      return res.status(500).json({ message: "Require all fields" });
    }
    const userexist2 = await User.findOne({ email });
    if (userexist2) {
      return res.status(500).json({ message: "email exist" });
    }
    if (password.length < 6) {
      return res.status(500).json({ message: "Password.length>6" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    let imageurl = "";
    if (image) {
      try {
        const uploadedImage = await cloudinary.uploader.upload(image);
        imageurl = uploadedImage.secure_url;
      } catch (uploadError) {
        return res.status(500).json({
          success: false,
          msg: "Image upload failed",
          error: uploadError.message,
        });
      }
    }

    const newuser = new User({
      username,
      email,
      password: hashed,
      image: imageurl,
    });
    generatetoken(newuser._id, res);
    await newuser.save();
    res.status(201).json({ user: newuser });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in Singup : " + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(500).json({ message: "Require all fields" });
    }
    const userexist = await User.findOne({ email });
    if (!userexist) {
      return res.status(500).json({ message: "Username exist" });
    }
    const passwordcorrect = await bcrypt.compare(password, userexist.password);
    if (!passwordcorrect) {
      return res.status(500).json({ message: "password Invalid" });
    }
    generatetoken(userexist._id, res);
    res.status(201).json({ user: userexist });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in login : " + error.message });
  }
};

export const logout = async (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Logout Succesful" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in logut : " + error.message });
  }
};

export const getme = async (req, res) => {
  try {
    const userexist = await User.findById(req.user._id).select("-password");
    res.status(201).json({ user: userexist });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in getme : " + error.message });
  }
};
