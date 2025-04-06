import express from "express";
import {
  getme,
  login,
  logout,
  signup,
} from "../controllers/auth.controller.js";
import { protectroute } from "../middleware/protectroute.js";

const routes = express.Router();

routes.post("/login", login);
routes.post("/signup", signup);
routes.post("/logout", logout);
routes.get("/check", protectroute, getme);
export default routes;
