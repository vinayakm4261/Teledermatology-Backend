import { Router } from "express";
import multer from "multer";

import { uploadImage } from "../controllers/mediaController";

const router = Router();

var upload = multer({ dest: "./uploads" });

router.post("/upload", upload.single("my_photo"), uploadImage);

export default router;
