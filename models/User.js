const mongoose = require("mongoose");

const UserScema = new mongoose.Schema({
  name: {
    type: "string",
    require: [true, "name isrequired"],
  },
  email: {
    type: "string",
    require: [true, "email is required"],
  },
  password: {
    type: "string",
    require: [true, "password is required"],
  },
});

const User = new mongoose.model("Uesr", UserScema);

module.exports = User;
