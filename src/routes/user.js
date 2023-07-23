const { Router } = require('express');
const User = require("./../models/user");
const jwt = require("jsonwebtoken");
const auth = require("../middleware/auth");
require("dotenv").config();
const bcrypt = require('bcrypt');

const router = Router();

router.post("/register", async (req, res) => {

    try {
        const {first_name, last_name, email, password} = req.body;

        if (!(email && password && first_name && last_name)) {
           return res.status(400).json("All input is required");
        }
        const oldUser = await User.findOne({email});
        if (oldUser) {
            return res.status(409).json("User Already Exist. Please Login");
        }

        let encryptedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            first_name,
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });
        const callback = (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
            } else {
                return  res.json({user:user,token : token});

            }
        };
        const token = jwt.sign(
            {user_id: user._id, email},
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h",
            },callback
        );

    } catch (err) {
        console.error(err); // Log the error to the console
        if (err.code === 11000 && err.keyPattern && err.keyPattern.email) {
            // Handle duplicate key error
            res.status(409).json("User Already Exists. Please Login");
        } else {
            // Handle other errors
            res.status(500).json("Internal Server Error");
        } }
});
router.get("/login", async (req, res) => {

    try {
        const { email, password } = req.body;

        if (!(email && password)) {
           return res.status(400).json("All input is required");
        }
        const user = await User.findOne({ email });
        const callback = (err, token) => {
            if (err) {
                console.error('Error generating JWT:', err);
            } else {
                return  res.status(200).json({user:user,token : token});

            }
        };
        if (user && (await bcrypt.compare(password, user.password))) {
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                },callback
            );

        }
    } catch (err) {
        console.log(err);
        res.status(500).json("Internal Server Error");

    }
});
router.get("/welcome", auth, (req, res) => {
    res.status(200).json({user_id:req.user.user_id});
});
module.exports = router;