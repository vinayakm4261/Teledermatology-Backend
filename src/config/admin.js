import dotenv from "dotenv";
import admin from "firebase-admin";

import serviceAccount from "./firebase-admin";

dotenv.config();

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
});

export default admin;
