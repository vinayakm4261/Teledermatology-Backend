import { Router } from "express";
import { check } from "express-validator";
import multer from "multer";
import fs from "fs";

import {
  loginDoctor,
  registerDoctor,
  fetchDoctor,
  updateDoctor,
  deleteDoctor,
  updateProfile,
} from "../controllers/doctorController";

import validate from "../middlewares/validate";

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

const router = Router();

router.post(
  "/login",
  [check("_id").not().isEmpty().withMessage("Please provide a user ID")],
  validate,
  loginDoctor
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

// router.put("/updateProfile", updateProfile);

router.put("/updateProfile", upload.single("photos"), updateProfile);

export default router;
