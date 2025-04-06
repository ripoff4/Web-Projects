import { v2 as cloudinary } from "cloudinary";
import Product from "../models/products.models.js";
import User from "../models/users.models.js";

export const addproduct = async (req, res) => {
  try {
    const { productname, productprice, productimg } = req.body;
    if (!productname || !productprice || !productimg) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (req.user.character !== "restaurant") {
      return res
        .status(403)
        .json({ message: "You are not authorized to add a product" });
    }
    if (productprice <= 0) {
      return res
        .status(400)
        .json({ message: "Product price should be greater than 0" });
    }
    let imageurl;
    try {
      const uploadedImage = await cloudinary.uploader.upload(productimg);
      imageurl = uploadedImage.secure_url;
    } catch (uploadError) {
      return res.status(500).json({
        success: false,
        msg: "Image upload failed",
        error: uploadError.message,
      });
    }
    const newproduct = await Product({
      productname,
      productprice,
      productimg: imageurl,
      restaurant: req.user,
    });
    await newproduct.save();
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { products: newproduct._id } },
      { new: true }
    );
    res.status(201).json({
      success: true,
      msg: "Product added successfully",
      data: newproduct,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in addproduct : " + err.message });
  }
};

export const deleteproduct = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (product.restaurant._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this product" });
    }
    const imagePublicId = product.image?.split("/").pop().split(".")[0];

    // Delete image from Cloudinary
    if (imagePublicId) {
      try {
        await cloudinary.uploader.destroy(imagePublicId);
      } catch (cloudinaryError) {
        console.error("Cloudinary deletion error:", cloudinaryError);
      }
    }
    await Product.findByIdAndDelete(id);
    await User.findByIdAndUpdate(req.user._id, {
      $pull: { products: id },
    });
    res.status(200).json({
      success: true,
      msg: "Product deleted successfully",
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in addproduct : " + err.message });
  }
};

export const updateproduct = async (req, res) => {
  try {
    const id = req.params.id;
    const { productname, productprice } = req.body;
    if (!productname || !productprice) {
      return res.status(400).json({ message: "All fields are required" });
    }
    if (req.user.character !== "restaurant") {
      return res
        .status(403)
        .json({ message: "You are not authorized to update a product" });
    }
    if (productprice <= 0) {
      return res
        .status(400)
        .json({ message: "Product price should be greater than 0" });
    }
    const updatedproduct = await Product.findByIdAndUpdate(
      id,
      { productname, productprice },
      { new: true }
    );
    if (!updatedproduct) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.status(200).json({
      success: true,
      msg: "Product updated successfully",
      data: updatedproduct,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in addproduct : " + err.message });
  }
};

export const getallproducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate("restaurant", "-password -myorders -products")
      .sort({ popularity: -1 });
    res.status(200).json({ all_products: products });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in addproduct : " + err.message });
  }
};

export const getmyproducts = async (req, res) => {
  try {
    const products = await Product.find({ restaurant: req.user._id })
      .sort({ popularity: -1 })
      .populate("restaurant", "-password -myorders -products");
    res.status(200).json({ my_products: products });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in addproduct : " + err.message });
  }
};

export const buyproducts = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await Product.findById(id);
    if (!product) {
      return res.status(400).json({ message: "Product ID is required" });
    }
    if (req.user.character === "restaurant") {
      return res
        .status(403)
        .json({ message: "You are not authorized to buy a product" });
    }
    if (product.restaurant._id.toString() === req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "You cannot buy your own product" });
    }
    const updatedproduct = await Product.findByIdAndUpdate(
      id,
      { $inc: { popularity: 1 } },
      { new: true }
    );
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { myorders: product } },
      { new: true }
    );
    res.status(200).json({
      success: true,
      msg: "Product bought successfully",
      data: updatedproduct,
    });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in addproduct : " + err.message });
  }
};

export const getmyorders = async (req, res) => {
  try {
    const orders = await Product.find({ _id: { $in: req.user.myorders } })
      .populate("restaurant", "-password -myorders -products")
      .sort({ popularity: -1 });
    res.status(200).json({ my_orders: orders });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error in addproduct : " + err.message });
  }
};
