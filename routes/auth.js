const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");


const joi = require("@hapi/joi");

const RegisterSchema = joi.object({
    username: joi.string().min(3).required(),
    password: joi.string().min(8).required(),
});

// sign up to access API
router.post("/register", async (req, res) => {

    // check if username already exists
    const userExist =  await User.findOne({username: req.body.username});

    if(userExist) {

        // user exists response
        res.status(400).send("user already exists");
        return;
    }

    // hash password for new user
    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(req.body.password, salt);

    // create user object
    const user = new User({
        username: req.body.username,
        password: hashedpassword
    });

    try {
        const { error } = await RegisterSchema.validateAsync(req.body);

        // if error send to user
        if(error) {
            res.status(400).send(error.details[0].message);
            return;
        } else {

            const saveUser = await user.save();
            res.status(200).send("user registered");
        }
    } catch(error) {
        console.log(error);
        res.status(500).send(error);
    }
});

const loginSchema = joi.object({
    username: joi.string().min(3).required(),
    password: joi.string().min(8).required(),
});

//user login

router.post("/login", async (req, res) => {
    console.log(process.env.TOKEN_SECRET)
     
  
    try {
      //check if user exists  
    const user = await User.findOne({ username: req.body.username });
    console.log(user)
    if (!user) return res.status(400).send("Incorrect username");
  
    //verify password  
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    console.log(validPassword)
    if (!validPassword) {
        return res.status(400).send("Incorrect Password");
    }
        
      //validation of login request
  
      const { error } = await loginSchema.validateAsync(req.body);
      console.log(error)
      if (error) {
        return res.status(400).send(error.details[0].message);
      }
      else {
        //share token to be used
        console.log("84"+process.env.TOKEN_SECRET)
        const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
        console.log(token);
        res.header("auth-token", token).send({token:token});
      }
    } catch (error) {
      res.status(500).send(error);
    }
  });

module.exports = router;