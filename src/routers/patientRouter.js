import { Router } from "express";
import { check } from "express-validator";

import {
  loginPatient,
  registerPatient,
  fetchPatients,
  updatePatient,
  deletePatient,
} from "../controllers/patientController";

import validate from "../middlewares/validate";

const router = Router();

router.post(
  "/login",
  [check("_id").not().isEmpty().withMessage("Please provide a user ID")],
  validate,
  loginPatient
);

router.post(
  "/register",
  [
    check("_id").not().isEmpty().withMessage("Please provide a user ID"),
    check("phoneNumber")
      .matches(/^\+[1-9]{1}[0-9]{3,14}$/, "i")
      .withMessage("Provide a valid phone number"),
    check("name").not().isEmpty().withMessage("Please provide a name"),
    check("dob").not().isEmpty().withMessage("Please provide a date of birth"),
    check("gender").not().isEmpty().withMessage("Please provide a gender"),
  ],
  validate,
  registerPatient
);

router.put("/update", updatePatient);

router.delete("/delete", deletePatient);

router.get("/fetch", fetchPatients);

export default router;
