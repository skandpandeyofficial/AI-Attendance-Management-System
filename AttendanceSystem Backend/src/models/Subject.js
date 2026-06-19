const { Schema, model } = require("mongoose");

const subjectSchema = new Schema({
  sub_code: {
    type: String,
    required: true,
    uppercase: true,
  },
  name: {
    type: String,
    required: true,
  },
});

const subSchema = model("subjects", subjectSchema);

module.exports = subSchema;
