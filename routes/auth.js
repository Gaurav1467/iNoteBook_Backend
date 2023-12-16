const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User')
const router = express.Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = "aksfnkjasnnfansn"



//Route-1 Create a User : POST "/api/auth/createuser". No login
router.post('/createuser', [
    body('name', 'Name lenght must be greater than 2').isLength({ min: 2 }),
    body('email', 'Invaild email').isEmail(),
    body('password', 'Password must be greater than 7').isLength({ min: 7 }),
], async (req, res) => {

    let success = false;

    // If errors exist return bad request
    const error = validationResult(req);


    if (!error.isEmpty()) {
        return res.status(404).json({success : success, error: error.array() });
    }

    try {


        // Check whether this email exist or not. 

        let user = await User.findOne({ email: req.body.email });

        if (user) {
            return res.status(404).json({success: success, error: "Sorry a user with this email already exist." })
        }

        const salt = await bcrypt.genSalt(10);

        const secPass = await bcrypt.hash(req.body.password, salt);



        // Creating the user
        user = await User.create({
            name: req.body.name,
            password: secPass,
            email: req.body.email
        })

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);

        // console.log(jwtData);


        res.json({ success: true, authToken })


    } catch (error) {
        res.status(500).json({success : success,  error: "Internal server error" })
        console.log(error)
    }


})

//Route -2 Aunthenticate a User using : POST "/api/auth/login, no login". 
router.post('/login', [
    body('email', 'Invaild email').isEmail(),
    body('password', 'Password cannot be blank ').exists(),
], async (req, res) => {

    let success = false;

    // If errors exist return bad request
    const error = validationResult(req);


    if (!error.isEmpty()) {
        return res.status(404).json({ success :success, error: error.array() });
    }

    const { email, password } = req.body;

    try {

        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({success : success, error :"Please try to login with correct credentials."});
        }
        const passwordCompare = await bcrypt.compare(password, user.password);

        if (!passwordCompare) {
            return res.status(400).json({success : success, error :"Please try to login with correct credentials."});
        }

        const data = {
            user: {
                id: user.id
            }
        }

        const authToken = jwt.sign(data, JWT_SECRET);

        // console.log(jwtData);


        res.json({success:true, authToken })


    } catch (error) {
        res.status(500).json({success : success, error: "Internal server error" })
        console.log(error)
    }


})


//Route-3 Create a User : POST "/api/auth/getuser".  Login required

router.post('/getuser', fetchuser, async (req, res) => {
    let success = false;
    try {
        const userID = req.user.id;
        const user = await User.findById(userID).select("-password");

        res.send({success : true, user});

    } catch (error) {
        res.status(500).json({success : success, error: "Internal server error" })
        console.log(error)
    }

})

module.exports = router