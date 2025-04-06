import express from "express";
import {
  addproduct,
  deleteproduct,
  updateproduct,
  getallproducts,
  getmyproducts,
  buyproducts,
  getmyorders,
} from "../controllers/products.controller.js";
import { protectroute } from "../middleware/protectroute.js";

const routes = express.Router();

routes.post("/add", protectroute, addproduct);
routes.delete("/:id", protectroute, deleteproduct);
routes.put("/logout", protectroute, updateproduct);
routes.get("/all", protectroute, getallproducts);
routes.get("/myproducts", protectroute, getmyproducts);
routes.post("/buy/:id", protectroute, buyproducts);
routes.get("/getmyorders", protectroute, getmyorders);
export default routes;
