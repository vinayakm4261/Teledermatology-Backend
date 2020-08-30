import { Router } from "express";
import { availDoctor } from "../controllers/availabilityController";

const router = Router();

router.post("/insert", availDoctor);

export default router;
