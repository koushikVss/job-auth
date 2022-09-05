const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken")
const SECRET_KEY = "cat bites dog"
const cors = require("cors")
// const CLIENT_URL = process.env.FRONT;
const CLIENT_URL = "https://huntjob.netlify.app/"

// router.use(
//   cors({
//       // origin: process.env.FRONT,//"http://localhost:3000",
//       origin: "http://localhost:3000",
//       methods: "GET,POST,PUT,DELETE",
//       credentials: true,
//   })
// )

router.get("/login/success", (req, res) => {
  if (req.user) {
    token=jwt.sign(req.session.passport, SECRET_KEY, { expiresIn: '1h' })
    res.cookie('token', token, {
      maxAge: 7200000, // 2 hours
      secure: false, // set to true if you're using https
      httpOnly: true,
  })
    res.status(200).json({
      success: true,
      message: "successfull",
      user: req.user,
      token:token
      
      //   cookies: req.cookies
    });
  }
});

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    success: false,
    message: "failure",
  });
});

router.get("/logout", async(req, res) => {
 
//   res.cookie('token', 'none', {
//     expires: new Date(Date.now() + 5 * 1000),
//     httpOnly: true,
// })

  res.redirect(CLIENT_URL);
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"], prompt: "select_account" }));

router.get(
  "/google/callback",
  passport.authenticate("google", {
    successRedirect: CLIENT_URL,
    failureRedirect: "/login/failed",
  })
);




module.exports = router