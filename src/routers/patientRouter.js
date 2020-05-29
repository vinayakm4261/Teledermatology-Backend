import { Router } from "express";

import {
  testReq,
  patientInsertReq,
  updatePatientReq,
  deletePatientReq,
} from "../controllers/patientController";

const router = Router();

router.route("/test").post(testReq);
router.route("/insert").post(patientInsertReq);
router.route("/update").put(updatePatientReq);
router.route("/delete").delete(deletePatientReq);

export default router;
