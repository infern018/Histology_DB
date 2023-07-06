// const passport = require('passport')
// const GitHubStrategy = require('passport-github2').Strategy;
// const config = require('./config')

// console.log("MGONGO", config.dbURL)

// passport.use(new GitHubStrategy({
//     clientID: process.env.GITHUB_CLIENT_ID,
//     clientSecret:process.env.GITHUB_CLIENT_SECRET,
//     callbackURL: `${process.env.API_URL}/auth/github/callback`
//   },
//   function(accessToken, refreshToken, profile, cb) {
//     // User.findOrCreate({ githubId: profile.id }, function (err, user) {
//     //   return cb(err, user);
//     // });
//     console.log(profile)
//     cb(null,profile);
//   }
// ));

// passport.serializeUser((user, done) => {
//     // Serialize the user object and store any necessary information in the session
//     console.log("serializing user", user)
//     done(null, user);
//   });
  
//   passport.deserializeUser((user, done) => {
//     // Deserialize the user object from the session
//     console.log("deserializing user", user)
//     done(null, user);
//   });
  
//   module.exports = passport;