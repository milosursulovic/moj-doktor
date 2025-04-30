import express from "express";
import {
  addUser,
  getUsers,
  getUser,
  modifyUser,
  changeRole
} from "../controllers/usersController.js";

const router = express.Router();

router.post("/", addUser);
router.get("/", getUsers);
router.get("/:id", getUser);
router.patch("/:id", modifyUser);
router.patch("/:id/role", changeRole);

export default router;
