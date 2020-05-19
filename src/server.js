import dotenv from "dotenv";
import express from "express";
import morgan from "morgan";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
// import sio from "socket.io";

import admin from "./config/admin";
import patientRouter from "./routers/patientRouter";

dotenv.config();

// Express Setup
const app = express();

app.use(bodyParser.json());

app.use(cors());

app.use(morgan("combined"));

mongoose
  .connect(process.env.DB_STRING, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database Connected"))
  .catch((err) => console.log(err));

function authReq(req, res, next) {
  if (req.headers.authtoken) {
    admin
      .auth()
      .verifyIdToken(req.headers.authtoken)
      .then(() => {
        next();
      })
      .catch(() => {
        res.status(403).send("Unauthorized");
      });
  } else {
    res.status(403).send("Unauthorized");
  }
}

app.use("/", authReq);

app.use("/patient", patientRouter);

app.get("/status", (req, res) => {
  res.send({ status: "Up" });
});

const server = app.listen(process.env.PORT || 3000, () => {
  const { address, port } = server.address();
  console.log(`Server started at http://${address}:${port}`);
});

// Socket.io setup
/* const socketio = sio(server);

const sockets = {};

socketio.of("/socket").on("connection", (socket) => {
  socket.on("init", (data) => {
    sockets[data.senderID] = socket;
  });

  socket.on("typing", (data) => {
    if (sockets[data.senderID]) {
      sockets[data.senderID].emit("typing", { name: data.name });
    }
  });

  socket.on("message", (data) => {
    if (sockets[data.receiverID]) {
      console.log(data);
      sockets[data.receiverID].emit("message", data);
      // handle message storage
    }
  });

  socket.on("disconnect", (data) => {
    delete sockets[data.senderID];
  });
}); */
