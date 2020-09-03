import { Router } from "express";
import { check } from "express-validator";
import multer from "multer";

import {
  loginPatient,
  registerPatient,
  fetchPatients,
  updatePatient,
  deletePatient,
  getAppointments,
  newAppointment,
  loadPatientData,
} from "../controllers/patientController";

import validate from "../middlewares/validate";

const router = Router();

const storage = multer.diskStorage({
  destination: `${__dirname}../../uploads`,
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

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

router.get("/getAppointments/:_id", getAppointments);

router.get("/loadPatientData/:_id", loadPatientData);

router.put("/newAppointment", upload.array("media"), newAppointment);

export default router;
