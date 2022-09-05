const UserModel = require('../models/UserModel');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local');


const SignUp = (userdata) => {
    return new Promise((resolve, reject) => {
        UserModel.findOne({ email: userdata.email }, (err, user) => {
            if (user) {
                resolve({ status: 409, message: 'User with specified email already exists' });
            } else if (!user) {
                let usermodel = new UserModel();
                usermodel.firstname = userdata.firstname;
                usermodel.lastname = userdata.lastname;
                usermodel.email = userdata.email;
                usermodel.password = bcrypt.hashSync(userdata.password, 10);
                usermodel.save((err) => {
                    if (!err) {
                        resolve({ status: 200, message: 'User registered successfully' });
                    } else {
                        throw err;
                    }
                });
            } else {
                reject(err);
            }
        });
    });
}

// Middleware for passportjs login
const Login = () => {
    return new LocalStrategy({ usernameField: 'email', passwordField: 'password' }, function (username, password, done) {
        UserModel.findOne({ email: username }, (err, user) => {
            // console.log(user)
            if (err) {
                return done(err);
            }
            if (!user) {

                return done(null, false, { message: 'Incorrect Email' });
            }
            if (!bcrypt.compareSync(password, user.password)) {

                return done(null, false, { message: 'Incorrect Password' });
            }
            return done(null, user);
        });
    });
}



const ChangePassword = (userdata, email) => {
    return new Promise((resolve, reject) => {
        if (userdata.confirmpassword !== userdata.newpassword) {
            resolve({ status: 400, message: "Passwords don't match" })
        }
        else {
            console.log(userdata)
            UserModel.findOneAndUpdate({ email: userdata.email }, { password: bcrypt.hashSync(userdata.confirmpassword, 10) }, (err, user) => {
                if (!err)
                    resolve({ status: 200, message: "Password changed successfully" })
                else
                    reject({ status: 400, msg: err })
            });
        }

    });
}

const ResetPassword = (data) => {
    return new Promise((resolve, reject) => {
        if (data.confirmpassword !== data.newpassword) {
            resolve({ status: 400, message: "Passwords dont match" })
        }
        console.log(data)


        UserModel.findOneAndUpdate({ email: data.email }, { password: bcrypt.hashSync(data.confirmpassword, 10) }, (err, user) => {
            if (!err) {
                resolve({ status: 200, message: 'Password reset' });
            }
            else {
                throw error
            }
        });
    });
}

const CheckGAuth = (id) => {
    console.log("Google used id", id)
    return new Promise((resolve, reject) => {
        UserModel.findOne({ _id: id }, (err, user) => {
            if (!err) {
                if (user)
                    resolve({ status: 200, message: 'User found' });
                else
                    resolve({ status: 400, message: 'User not found' });
            }
            else {
                throw error
            }
        });
    });
}

const DelGAuth = (id) => {
    return new Promise((resolve, reject) => {
        UserModel.deleteOne({ _id: id }, (err, data) => {
            if (!err) {
                resolve({ status: 200, message: "Logged out from gauth", data: data });
            }
            else {
                reject(err);
            }
        });
    });
}


module.exports = { SignUp, Login, ChangePassword, ResetPassword, CheckGAuth, DelGAuth }



