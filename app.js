const express = require("express");

require("dotenv").config({ path: "./config/config.env" });

const morgan = require("morgan");

const connectDB = require("./config/db.js");

const app = express();

// middleware

app.use(express.json()); //express.json() is a middleware is used send responses in JSON Format

app.use(morgan("tiny")); // morgan is a middle ware is used for loging any api endpoints in our console

app.use("/api", require("./routes/auth.js"));
//basic localhost route [http://localhost:8000/]

app.get("/", (req, res) => {
  res.send("Hello Karthi");
});
//server configuration

let PORT = process.env.PORT || 8000;

app.listen(PORT, async () => {
  //  app starts after mongoDB connection
  try {
    await connectDB();
    console.log(`server is listening on http://localhost:${PORT}`);
  } catch (err) {
    console.log(err);
  }
});

/*changes in package.json file

 "main": "app.js",

 "scripts": {
    "dev":"nodemon app.js"
  },

  */
