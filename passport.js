const GoogleStrategy = require("passport-google-oauth20").Strategy;

const passport = require("passport");
const UserModel = require('./models/UserModel');


passport.use(
  new GoogleStrategy(
    {
      // clientID:"722347014840-45cb9bhp503algqv594p7dhtnjjdgkgu.apps.googleusercontent.com" ,
      // clientSecret: "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",

      clientID:"217618555359-stl8aao0tgs93j0i6j3gh20b4l5grupl.apps.googleusercontent.com" ,
      clientSecret: "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",

      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {

      console.log(profile)
      UserModel.findOrCreate({ profile:profile }, function (err, user) {
        if (err) {
          return done(err);
      }
      done(null, user);
      });
  
      
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
