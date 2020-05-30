import { Router } from "express";

import {
  doctorInsertReq,
  updateDoctorReq,
  deleteDoctorReq,
  fetchDoctorReq,
} from "../controllers/doctorController";

const router = Router();

router.route("/insert").post(doctorInsertReq);
router.route("/update").put(updateDoctorReq);
router.route("/delete").delete(deleteDoctorReq);
router.route("/fetch").get(fetchDoctorReq);

export default router;
