require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = express();
const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
//const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const bcrypt = require("bcrypt");
const saltRounds = 10;

app.use(express.static("public"));
app.set('view engine','ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/userDb', {
    //  userNewUrlParser:true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected!!!!!');
}).catch((e) => {
    console.log(e);
});


const userSchema = new mongoose.Schema({
    email: String,
    password: String
});


//userSchema.plugin(encrypt,{secret:process.env.SECRET, encryptedFields: ["password"]});

const User = new mongoose.model("User",userSchema);

app.get("/",(req,res)=>{
    res.render("home");
});

app.get("/login",(req,res)=>{
    res.render("login");
});

app.get("/register",(req,res)=>{
    res.render("register");
});

app.post("/register",(req,res)=>{
// usnig bcrypt and salting to make passwords more secure
    bcrypt.hash(req.body.password, saltRounds, function(err, hash) {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });
        newUser.save((err)=>{
            if(err){
                console.log(err);
            }else{
                res.render("secrets");
            }
        })
    });
});

app.post("/login",(req,res)=>{
    const username =   req.body.username;
  //  const password = md5(req.body.password);
    const password = req.body.password;
   
    User.findOne({email: username}, (err, foundUser)=>{
        if(err){
            console.log(err);
        }else{
            // if(foundUser.password === password){
            //     res.render("secrets");
            // }
            bcrypt.compare(password, foundUser.password, function(err, result) {
                if(result === true){
                    res.render("secrets");
                }
            });
        }
    })

    
});

app.listen(3000,()=>{
    console.log("Server Started on Port 3000.");
})