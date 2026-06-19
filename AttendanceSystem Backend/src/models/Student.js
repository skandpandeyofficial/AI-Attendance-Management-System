const { Schema, model } = require("mongoose");

const studentSchema = new Schema({
  admissionNo: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const student = model("students", studentSchema);

module.exports = student;
