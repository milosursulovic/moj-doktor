import express from "express";
import {
  addUser,
  getUsers,
  modifyUser,
} from "../controllers/usersController.js";

const router = express.Router();

router.post("/", addUser);
router.get("/", getUsers);
router.patch("/", modifyUser);

export default router;
