import { Router } from "express";
import multer from "multer";

import { uploadImage } from "../controllers/mediaController";
import { uploadAudio } from "../controllers/mediaController";

const router = Router();

var upload = multer({ dest: "./uploads" });
var audio = multer({ dest: "./audio" });

router.post("/upload", upload.single("my_photo"), uploadImage);

router.post("/audio", audio.single("soundBlob"), uploadAudio);

export default router;
