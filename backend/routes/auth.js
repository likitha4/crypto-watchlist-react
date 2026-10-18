const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middleware/authMiddleware");

const isProd=process.env.NODE_ENV==='production'
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
		if (!existingUser) {
			return res.status(400).json({ error: "Invalid email or Password" });
		}
		const isMatch = await bcrypt.compare(password, existingUser.password);
		if (!isMatch) {
			return res.status(400).json({ error: "Invalid email or Password" });
		}
		const jwtoken = jwt.sign({ id: existingUser._id }, process.env.JWT_SECRET, {
			expiresIn: "7d",
		});
		res.cookie('token', jwtoken,{
			httpOnly:true, secure:isProd, sameSite:isProd ?"none":"lax", path:'/',maxAge:7*24*60*60*1000
		});
 return res.json({message:'Login Successful'})
	} catch (error) {
		return res.status(500).json({ error: "Error in logging " });
	}
});
router.get('/me', authMiddleware, async(req,res)=>{
	try{
		console.log('req.user:', req.user)
		const user= await User.findById(req.user.id).select('-password')
		console.log("user found", user)
		if(!user){
			return res.status(404).json({error:'User not found'})
		}
		res.set("Cache-control","no-store");
		return res.json({user})

	}catch(error){
		console.log("me error",error);
		res.status(401).json({error:'Not authorized'})
	}
})

router.post('/logout',(req,res)=>{
	res.clearCookie('token',{
		httpOnly:true,
		secure:true,
		sameSite:'none'
	})
	res.json({message:'Logged out successfully'})
})
module.exports = router;
