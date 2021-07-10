import dotenv from "dotenv";
import admin from "firebase-admin";

import serviceAccount from "./firebase-admin";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
});

export default admin;
