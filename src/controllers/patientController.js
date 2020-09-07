import fs from "fs";
import moment from "moment";

import Patient from "../models/patient";
import Appointment from "../models/appointment";
import Doctor from "../models/doctor";

import fileUpload from "../helpers/fileUpload";
import getAge from "../helpers/getAge";

const loginPatient = async (req, res) => {
  try {
    const { _id } = req.body;

    const user = await Patient.findById(_id);

    if (!user) return res.send({ new: true, message: "Register Patient" });

    res.send({ new: false, user });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const registerPatient = async (req, res) => {
  try {
    const { dob } = req.body;

    const age = getAge(dob);

    const patient = new Patient({ ...req.body, age });

    patient.save((err, pt) => {
      if (err) {
        return res.status(500).send({
          message: "Internal Server Error. Please try again later",
          details: err.message,
        });
      }

      res.send(pt);
    });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const updatePatient = async (req, res) => {
  try {
    const { id, appointments } = req.body;

    const patient = await Patient.findOneAndUpdate(
      { _id: id },
      { $set: { appointments } }
    );

    if (!patient)
      return res.status(400).send({
        message: "Patient not found. Please check the patient ID.",
        details: null,
      });

    res.send(patient);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const deletePatient = async (req, res) => {
  try {
    const { id } = req.query;

    const patient = await Patient.findOneAndDelete({ _id: id });

    if (!patient)
      return res.status(400).send({
        message: "Patient not found. Please check the patient ID.",
        details: null,
      });

    res.send(patient);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const fetchPatients = async (req, res) => {
  try {
    const { count } = req.query;
    if (count === 1) {
      const { id } = req.query;

      const patients = await Patient.findOne({ _id: id });

      if (!patients)
        return res.status(400).send({
          message: "Patient not found. Please check the patient ID.",
          details: null,
        });

      res.send(patients);
    } else {
      const { date } = req.query;

      const patients = await Patient.find({
        appointments: { $elemMatch: { date } },
      });

      if (!patients)
        return res
          .status(500)
          .send({ message: "No patients found", details: null });

      res.send(patients);
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const getAppointments = async (req, res) => {
  try {
    const { _id } = req.params;

    const appointments = await Appointment.find({ patientID: _id });

    res.send(appointments);
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const loadPatientData = async (req, res) => {
  try {
    const { _id } = req.params;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const appointments = await Appointment.aggregate([
      {
        $match: { patientID: _id, date: { $gte: today } },
      },
      {
        $lookup: {
          from: "doctors",
          localField: "doctorID",
          foreignField: "_id",
          as: "doctorDataArray",
        },
      },
      {
        $addFields: {
          doctorData: {
            $arrayElemAt: ["$doctorDataArray", 0],
          },
        },
      },
      {
        $project: {
          date: 1,
          time: 1,
          status: 1,
          symptoms: 1,
          doctorData: {
            _id: 1,
            name: 1,
            hospital: 1,
            department: 1,
            profilePic: 1,
          },
        },
      },
      {
        $sort: {
          date: 1,
        },
      },
    ]);

    res.send({ appointments });
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

const newAppointment = async (req, res) => {
  try {
    const {
      doctorID,
      patientID,
      date,
      time,
      symptoms,
      additionalInfo = "",
      photos,
      videos,
      audio,
    } = req.body;

    const patient = await Patient.findOne({ _id: patientID });
    const doctor = await Doctor.findOne({ _id: doctorID });

    if (!patient)
      return res.status(400).send({
        message: "Patient not found. Please check the patient ID.",
        details: null,
      });

    if (!doctor)
      return res.status(400).send({
        message: "Doctor not found. Please check the doctor ID.",
        details: null,
      });

    if (
      moment(date, "DD/MM/YYYY").isBetween(
        moment(doctor.availability.startDate, "DD/MM/YYYY"),
        moment(doctor.availability.endDate, "DD/MM/YYYY")
      )
    ) {
      const appointment = new Appointment({
        doctorID,
        patientID,
        date,
        time,
        symptoms,
        additionalInfo,
        photos,
        videos,
        audio,
      });

      const apptID = appointment._id;

      Object.values(req.files).forEach((field) => {
        field.forEach((file, index) => {
          fs.rename(
            file.path,
            `${__dirname}../../uploads/${file.fieldname}/${apptID}-${index}.${
              file.mimetype.split("/")[1]
            }`,
            () => {}
          );
        });
      });

      appointment.save((err, appt) => {
        if (err) {
          return res.status(500).send({
            message: "Internal Server Error. Please try again later",
            details: err.message,
          });
        }

        res.send(appt);
      });
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

export {
  loginPatient,
  registerPatient,
  updatePatient,
  deletePatient,
  fetchPatients,
  getAppointments,
  newAppointment,
  loadPatientData,
};

// const url = await fileUpload(req.file, "test", req.file.filename);
