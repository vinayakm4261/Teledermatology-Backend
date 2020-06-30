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

export { uploadImage };
