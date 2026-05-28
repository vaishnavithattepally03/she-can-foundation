const express = require("express");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

const User = require("../models/User");

const router = express.Router();

router.post("/register", async(req, res) => {

    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if(existingUser){

        return res.json({
            message: "User already exists"
        });

    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({

        name,
        email,
        password: hashedPassword

    });

    await user.save();

    res.json({
        message: "Registration Successful"
    });

});

router.post("/login", async(req, res) => {

    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if(!user){

        return res.json({
            message: "User not found"
        });

    }

    const isMatch = await bcrypt.compare(password, user.password);

    if(!isMatch){

        return res.json({
            message: "Invalid Password"
        });

    }

    const token = jwt.sign(

        {
            id: user._id,
            role: user.role
        },

        process.env.JWT_SECRET,

        {
            expiresIn: "1d"
        }

    );

    res.json({

        token,
        message: "Login Successful"

    });

});

module.exports = router;