const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const { email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email: email, password: hashedPassword });
    await user.save();
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await User.findOne({ email });
    if(!existingUser){
        return res.status(400).json({ error: "Invalid email or Password" });
    }
      const isMatch= await bcrypt.compare(password, existingUser.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Invalid email or Password" });
      }
      const jwtoken = jwt.sign
      ({ id:existingUser._id }, process.env.JWT_SECRET, 
        {
        expiresIn: "7d",
      });
      return res.json({token:jwtoken});
        
    } catch (error) {
        return res.status(500).json({error:'Error in logging '});
    }
});

module.exports=router;
