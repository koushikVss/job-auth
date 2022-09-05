const jwt = require("jsonwebtoken");
const SECRET_KEY = 'cat bites dog';

const VerifyToken = (req, res, next) => {
     console.log(req.session)
    let result = jwt.verify(req.headers.authorization, SECRET_KEY, (err, decode) => {
        if (decode !== undefined)
            return decode
        else
            return err
    })
    if (result instanceof Error) {
        res.send({ status: 401, message: "Not Authorized" })
    }
    else {
        console.log(result);
        next();
    }
}

const Authenticate = (req, res) => {
    console.log(res.session)
    let result = jwt.verify(req.headers.authorization, SECRET_KEY, (err, decode) => {
        if (decode !== undefined)
            return decode
        else
            return err
    })
    if (result instanceof Error) {
        res.send({ status: 401, isAuthenticated:false })
    }
    else {
        console.log(result);
        res.send({status:200,isAuthenticated:true})
    }
}

// const googleauth = (req, res) => {
//     let result = jwt.verify(req.headers.authorization, SECRET_KEY, (err, decode) => {
//         if (decode !== undefined)
//             return decode
//         else
//             return err
//     })
//     if (result instanceof Error) {
//         res.send({ status: 401, isAuthenticated:false })
//     }
//     else {
//         console.log(result);
//         res.send({status:200,isAuthenticated:true})
//     }
// }


module.exports = { VerifyToken,Authenticate }
