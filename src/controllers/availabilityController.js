import moment from "moment";
import Availability from "../models/availability";

const availDoctor = async (req, res) => {
  try {
    const { startDate, endDate } = req.body;

    if (moment(endDate).isAfter(startDate)) {
      const availability = new Availability({ ...req.body });

      availability.save((err, av) => {
        if (err) {
          return res.status(500).send({
            message: "Internal Server Error. Please try again later",
            details: err.message,
          });
        }

        res.send(av);
      });
    } else {
      console.log("Invalid Date");
    }
  } catch (err) {
    console.log(err);
    res.status(500).send({
      message: "Internal Server Error. Please try again later",
      details: err.message,
    });
  }
};

export { availDoctor };
