import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productname: {
      type: String,
      required: true,
      unique: true,
    },
    productprice: {
      type: Number,
      required: true,
    },
    productimg: {
      type: String,
      required: true,
    },
    popularity: {
      type: Number,
      default: 0,
    },
    restaurant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Product = mongoose.model("Product", productSchema);
export default Product;
