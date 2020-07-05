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

export { uploadImage, uploadAudio };
