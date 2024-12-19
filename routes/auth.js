const router = require("express").Router();

const bcrypt = require("bcrypt");

const jwt = require("jsonwebtoken");

const User = require("../models/User");
module.exports = router;

router.post("/register", async (req, res) => {
  //step 1----------------------------------------------------
  const { name, email, password } = req.body;
  // validate empty feilds

  if (!name || !password || !email)
    return res.status(400).json({ error: "please enter all required feilds" });

  //name validation
  if (name.length > 20)
    return res
      .status(400)
      .json({ error: "name can be only lessthe 20 characters" });

  // validate email

  // check email is valid or not by using rejex -> search -> regex for javascript email validation
  const emailRegx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegx.test(email))
    return res.status(400).json({ error: "please enter a valid email" });
  // validate password
  if (password.length < 6)
    return res
      .status(400)
      .json({ error: "password must be atleast 6 characters" });

  //step 2----------------------------------------------------

  try {
    //step 4----------------------------------------------------

    // does user already exists
    const doesUserAlreadyExists = await User.findOne({ email });
    if (doesUserAlreadyExists)
      return res.status(400).json({
        error:
          "a user with that email already exists so please try another email",
      });
    //step 3----------------------------------------------------
    const hashedPassword = await bcrypt.hash(password, 12); //hash(password(plain text), salting round );
    // we dont won't to show password in plain text fomat later on or if by any chance hacker can clearly see password in plain text format so we can use library
    // bcryptjs for hashing the password [plain text is converted to nothumen understandable] for security purpose we use

    // create a  model then save the user
    const newUser = new User({ name, email, password: hashedPassword });
    //save the user
    const result = await newUser.save();
    // we won't get any password
    result._doc.password = undefined;

    return res.status(201).json({ ...result._doc });
    // status 200 means successfull creation | _ doc defines all documnets likename, emeil, password
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});

//step 5----------------------------------------------------

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // email and password validation for empty feilds

  if (!email || !password)
    return res
      .status(400)
      .json({ error: "please enter the all required feilds" });
  // validate email

  // check email is valid or not by using rejex -> search -> regex for javascript email validation
  const emailRegx =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  if (!emailRegx.test(email))
    return res.status(400).json({ error: "please enter a valid email" });

  try {
    const doesUserExist = await User.findOne({ email });
    if (!doesUserExist)
      return res.status(400).json({ error: "Invalid email or password" });

    // if there were any user present

    const doesPasswordMatch = await bcrypt.compare(
      password,
      doesUserExist.password
    ); //compare(plainTextPassword,encryptedTextPassword);
    if (!doesPasswordMatch)
      return res.status(400).json({ error: "Invalid email or password" });

    // generate a token
    const payload = { _id: doesUserExist._id };

    const token = jwt.sign(payload, process.env.JWR_SECRET, {
      expiresIn: "1h",
    });

    return res.status(200).json({ token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ error: err.message });
  }
});
