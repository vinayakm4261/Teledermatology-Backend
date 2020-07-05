import { Router } from "express";
import multer from "multer";

import {
  uploadImage,
  uploadVideo,
  uploadAudio,
  uploadMedia,
} from "../controllers/mediaController";

const router = Router();

var upload = multer({ dest: "./uploads" });
var audio = multer({ dest: "./audio" });
var video = multer({ dest: "./video" });
var media = multer({ dest: "./media" });

router.post("/upload", upload.single("my_photo"), uploadImage);

router.post("/audio", audio.single("soundBlob"), uploadAudio);

router.post("/video", video.single("videoBlob"), uploadVideo);

router.post("/media", media.single("mediaBlob"), uploadMedia);

export default router;
