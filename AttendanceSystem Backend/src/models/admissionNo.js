const { Schema, model } = require("mongoose");

const admissionNoSchema = new Schema({
  admissionNo: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },

  subjectCode: {
    type: [String],
    required: true,
    trim: true,
  },

  branch: {
    type: String,
    required: true,
    trim: true,
  },

  gender: {
    type: String,
    required: true,
    enum: ["Male", "Female", "Other"],
  },

  profileImage: {
    type: String,
    required: true,
  },
});

const admissionNo = model("admissiondatas", admissionNoSchema);

module.exports = admissionNo;
