const mongoose = require("mongoose");
const connectDB = async () => {
  return mongoose
    .connect("mongodb://localhost/cms_mern")
    .then(() => console.log("mongoDB database connected successfully "))
    .catch((err) => console.log(err));
};

module.exports = connectDB;
