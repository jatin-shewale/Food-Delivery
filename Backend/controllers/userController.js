import userModel from "../models/userModel.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import express from "express";
import "dotenv/config"

//Login User:
const loginUser = async (req, res) => {
    const {email, password} = req.body;
    try {
        const user = await userModel.findOne({email});

        if(!user) {
            return res.json({success : false, message: "User Doesn't exists"});
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch) {
            return res.json({success : false, message: "Invalid Password"});
        }

        const token = createToken(user._id);
        res.json({success : true, token: token, message: "User logged in successfully"});

    } catch (error) {
        res.json({success : false, message: "Error Occured"});
    }
}

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

//Register New user:
const registerUser = async (req, res) => {
    const {name, email, password} = req.body;

    try {
        //Checking if user already exits
        const exits = await userModel.findOne({email});
        if (exits) {
            return res.json({success : false, message : "User already exits"});
        }

        //Validating email format and storng password:
        if(!validator.isEmail((email))) {
            return res.json({success : false, message : "Enter valid email"});
        }

        //Strong password:
        if (password.length < 8) {
            return res.json({success : false, message : "Enter strong password"});
        }

        //Hashing user password:
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        //New user:
        const newUser = userModel({
            name : name,
            email : email,
            password : hashedPassword
        })

        const user = await newUser.save();
        const token = createToken(user._id);
        res.json({success : true, token})

    } catch (error) {
        console.log(error);
        res.json({success : false, message : "Failed to create new user"});
    }
}

export { loginUser, registerUser }