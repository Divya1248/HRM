const { Schema, model } = require("mongoose");
const EmpSchma = new Schema({
  empname: {
    type: String,
    required: true,
  },
  emp_id: {
    type: String,
    required: true,
  },
  emp_photo: {
    type: [""],
    required: true,
    // default: "",
  },
  email: {
    type: String,
    required: true,
    // default: "",
  },
  loc: {
    type: String,
    required: true,
    // default: "",
  },
  emp_salary: {
    type: Number,
    required: true,
  },
  phone: {
    type: Number,
    required: true,
  },
  emp_education: {
    type: String,
    required: true,
  },
  gender: {
    type: String,
    required: true,
    enum: ["male", "female"],
  },
  skills: {
    type: Array,
    required: true,
  },
  user: {
    type: [""],
    required: true,
  },
});

module.exports = model("EmpSchma", EmpSchma);
