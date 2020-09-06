import admin from "../config/admin";

const bucket = admin.storage().bucket();

const fileUpload = async (file, path, fileName) => {
  const options = {
    destination: `${path}/${fileName}`,
  };

  const [bucketFile] = await bucket.upload(file.path, options);

  const [url] = await bucketFile.getSignedUrl({
    action: "read",
    expires: "01-01-2040",
  });

  return url;
};

export default fileUpload;
