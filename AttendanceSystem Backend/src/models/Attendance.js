const { Schema, model } = require("mongoose");

const AttendanceSchema = new Schema({
  admissionNo: {
    type: String,
    required: true,
  },
  sub_code: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  status: {
    type: String,
    enum: ["P", "A", "I"],
    required: true,
  },
});

const Attendance = model("attendancecollections", AttendanceSchema);

module.exports = Attendance;
