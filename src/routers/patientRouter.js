import { Router } from "express";

import { testReq } from "../controllers/patientController";

const router = Router();

router.route("/test").post(testReq);

export default router;
