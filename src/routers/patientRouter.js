import { Router } from "express";
import { check } from "express-validator";
import multer from "multer";
import fs from "fs";

import validate from "../middlewares/validate";

import {
  loginPatient,
  registerPatient,
  fetchPatients,
  updatePatient,
  deletePatient,
  getAppointments,
  newAppointment,
  loadPatientData,
  fetchDoctors,
  updateProfile,
  uploadConsent,
  fetchAppointment,
} from "../controllers/patientController";

const router = Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "photos") {
      fs.mkdirSync(`${__dirname}../../uploads/photos`, { recursive: true });
      cb(null, `${__dirname}../../uploads/photos`);
    } else if (file.fieldname === "videos") {
      fs.mkdirSync(`${__dirname}../../uploads/videos`, { recursive: true });
      cb(null, `${__dirname}../../uploads/videos/`);
    } else if (file.fieldname === "audio") {
      fs.mkdirSync(`${__dirname}../../uploads/audio`, { recursive: true });
      cb(null, `${__dirname}../../uploads/audio/`);
    } else {
      fs.mkdirSync(`${__dirname}../../uploads/misc`, { recursive: true });
      cb(null, `${__dirname}../../uploads/misc/`);
    }
  },
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

router.put(
  "/newAppointment",
  upload.fields([
    {
      name: "photos",
    },
    {
      name: "videos",
    },
    {
      name: "audio",
    },
  ]),
  newAppointment
);

router.post("/fetchDoctors", fetchDoctors);

router.put("/updateProfile", upload.single("photos"), updateProfile);

router.post(
  "/uploadConsent",
  upload.fields([
    {
      name: "videos",
      maxCount: 1,
    },
    {
      name: "audio",
      maxCount: 1,
    },
  ]),
  uploadConsent
);

router.post(
  "/fetchAppointment",
  [
    check("appointmentID")
      .not()
      .isEmpty()
      .withMessage("Please send appointmentID"),
  ],
  validate,
  fetchAppointment
);

export default router;
