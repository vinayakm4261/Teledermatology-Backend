import { Router } from "express";
import { check } from "express-validator";

import validate from "../middlewares/validate";

import { loginUser } from "../controllers/commonController";

const router = Router();

router.post(
  "/login",
  [check("_id").not().isEmpty().withMessage("Please provide a user ID")],
  validate,
  loginUser
);

export default router;
