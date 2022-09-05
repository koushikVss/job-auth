const repo = require('../repository/UserRepository');
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'cat bites dog';
const bcrypt = require('bcryptjs');

const UserModel = require('../models/UserModel');
var globalOTP = 0
function generateOTP() {
    var minm = 100000;
    var maxm = 999999;
    return Math.floor(Math
        .random() * (maxm - minm + 1)) + minm;
}
const SignUp = (req, res) => {
    repo.SignUp(req.body).then((data) => {
        res.send(data);
    });
}

const Login = (req, res) => {
    res.send({ status: 200, token: jwt.sign(req.session.passport, SECRET_KEY, { expiresIn: '1h' }), name: `${req.user.firstname} ${req.user.lastname}` });
}
// const Google=(req,res) =>{
//     res.send({status:200,token:jwt.sign(req.session.passport,SECRET_KEY,{expiresIn:'1h'})})
// }

const ChangePassword = (req, res) => {
    repo.ChangePassword(req.body).then(data => {
        res.send(data)
    })
}

//NODEMAILER
async function SendMail(email, message) {
    console.log(email, message)
    // configure transporter
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,//587,
        secure: false,  //for port 465 secure must be true
        requireTLS: true,
        auth: {
            user: "wakeuparnie7654321@gmail.com",
            pass: "kjowhquuqbgwzhkc"
        }
    })
    // configure mail message
    let maildata = {
        from: 'wakeuparnie7654321@gmail.com',
        to: email,
        subject: "CatsBiteDogs",
        html: `<h3>${message}</h3>`
    };
    //send mail
    let msg = await transporter.sendMail(maildata);
    console.log(`Message Sent : ${msg.messageId}`)
    console.log(`Preview url : ${nodemailer.getTestMessageUrl(msg)}`)
}

const checkMail = (userdata) => {
    console.log(userdata);
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userdata }, (err, user) => {
            if (!user) {
                resolve({ status: 409, message: 'User with specified email doesnt exist! You can register first' });
            } else if (user) {
                resolve({ status: 200, message: "User Found", data: userdata })
            }
            else {
                throw error
            }
        });
    });
}
const OtpVerification = (req, res) => {
    if (req.body.otp.toString() != globalOTP) {
        res.send({ status: "400", message: "Invalid OTP" })
    }
    else {
        globalOTP = generateOTP()
        res.send({ status: 200, msg: "otp verified" })
    }
}

const CheckGAuth = (req, res) => {
    console.log("id", req.params.id)
    let id = req.params.id
    // if (req.params.id === null)
    // id = "1"
    repo.CheckGAuth(id).then(data => res.send(data))
}
const ResetPassword = (req, res) => {
    console.log("logging in")
    // console.log(req.body.email)
    //  console.log(globalOTP)
    // console.log(req.body.otp!==globalOTP)
    // if (req.body.otp.toString() != globalOTP) {
    //     res.send({ status: "400", message: "Invalid OTP" })
    // }
    // else {
    repo.ResetPassword(req.body).then(data => {
        if (data.status === 400) {
            res.send({ status: 400, msg: "Passowords dont match" })
        }
        else if (data.status === 200) {
            res.send({ status: 200, msg: "Password reset succesffuly" })
        }
    })
    console.log("password reset")
    // }

}

const ForgotPassword = (req, res) => {
    var otp = generateOTP().toString();
    globalOTP = otp
    let result = checkMail(req.body.email)
    result.then(data => {
        if (data.status === 200) {
            SendMail(req.body.email, otp)
            res.send({ status: 200, msg: "otp sent" });

        }
        else if (data.status === 409) {
            console.log("No User exists")
            res.send({ status: 409, msg: "No user with that mail is registered" });
        }
        else {
            throw err
        }
    })
}
const Logout = (req, res) => {
    
    req.logout(function (err) {
        console.log(err)
        if (req.session) {
            req.session.destroy(err => {
                if (err) {
                    console.log(err)
                    res.status(400).send('Unable to log out')
                } else {
                    console.log("logged out")
                    res.send({ status: 200, message: 'Logout successful' })
                }
            })
        }
        res.send({ status: 400, message: 'Unable to log out' })

    })
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 0 * 1000),
        httpOnly: true,
    })
    res.cookie('session', 'none', {
        expires: new Date(Date.now() + 0 * 1000),
        httpOnly: true,
    })
    res.cookie('session.sig', 'none', {
        expires: new Date(Date.now() + 0 * 1000),
        httpOnly: true,
    })
    req.session=null
    res.send({ status: 200, message: 'Logout successful' })

}
const DelGAuth = (req,res)=>{
    console.log(id)
    repo.DelGAuth(req.params.id).then(data=>res.send(data));
}

module.exports = { SignUp, Login, ChangePassword, ResetPassword, ForgotPassword, OtpVerification, Logout, CheckGAuth, DelGAuth }