import { Router } from "express";
import { check } from "express-validator";

import {
  loginDoctor,
  registerDoctor,
  fetchDoctor,
  updateDoctor,
  deleteDoctor,
} from "../controllers/doctorController";

import validate from "../middlewares/validate";

const router = Router();

router.post(
  "/login",
  [
    check("uid").not().isEmpty().withMessage("Please provide a user ID"),
    check("phone").isMobilePhone().withMessage("Provide a valid phone number"),
  ],
  validate,
  loginDoctor
);

router.post(
  "/register",
  [
    check("uid").not().isEmpty().withMessage("Please provide a user ID"),
    check("phone").isMobilePhone().withMessage("Provide a valid phone number"),
    check("name").not().isEmpty().withMessage("Please provide a name"),
    check("dob").not().isEmpty().withMessage("Please provide a date of birth"),
    check("gender").not().isEmpty().withMessage("Please provide a gender"),
    check("department")
      .not()
      .isEmpty()
      .withMessage("Please provide a department"),
    check("hospital").not().isEmpty().withMessage("Please provide a hospital"),
  ],
  validate,
  registerDoctor
);

router.put("/update", updateDoctor);

router.delete("/delete", deleteDoctor);

router.get("/fetch", fetchDoctor);

export default router;
