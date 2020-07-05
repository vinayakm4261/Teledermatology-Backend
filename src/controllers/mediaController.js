import sharp from "sharp";
import fs from "fs";

const uploadImage = async (req, res) => {
  try {
    var img = fs.readFileSync(req.file.path);
    sharp(img)
      .toFile("uploads/output.png")
      .then(() => {
        console.log("Done!");
      });
  } catch (e) {
    console.log("Error");
  }
};

const uploadAudio = async (req, res) => {
  try {
    var ad = fs.readFileSync(req.file.path);
    console.log(ad);
    let uploadLocation = "audio/song1.mp3";

    fs.writeFileSync(uploadLocation, ad);

    res.sendStatus(200);
  } catch (e) {
    console.log("Error");
  }
};

const uploadVideo = async (req, res) => {
  try {
    var vd = fs.readFileSync(req.file.path);
    console.log(vd);
    let uploadLocation = "video/vid.mp4";

    fs.writeFileSync(uploadLocation, vd);

    res.sendStatus(200);
  } catch (e) {
    console.log("Error");
  }
};

const uploadMedia = async (req, res) => {
  try {
    var md = fs.readFileSync(req.file.path);
    console.log(md);

    res.sendStatus(200);
  } catch (e) {
    console.log("Error");
  }
};

export { uploadImage, uploadAudio, uploadVideo, uploadMedia };
