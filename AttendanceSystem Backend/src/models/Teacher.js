const { Schema, model } = require("mongoose");

const TeacherSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  password: {
    type: String,
    required: true,
  },
  teaching_sub:{
    type:String,
    required:true,
  }

});

const teacher = model("teachers", TeacherSchema);

module.exports = teacher;
