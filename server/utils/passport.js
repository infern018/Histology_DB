const GitHubStrategy = require("passport-github2").Strategy;
const User = require("../models/User");
const passport = require("passport");

console.log("CALLBACK URL")
console.log(`${process.env.API_URL}/auth/github/callback`)

passport.use(
	new GitHubStrategy(
		{
			clientID: process.env.GITHUB_CLIENT_ID,
			clientSecret: process.env.GITHUB_CLIENT_SECRET,
			callbackURL: `${process.env.API_URL}/auth/github/callback`,
		},
		async (accessToken, refreshToken, profile, done) => {
			try {
				// Check if the user already exists in the database
				let user = await User.findOne({ githubId: profile.id });
				if (user) {
					return done(null, user);
				}

				// If user doesn't exist, create a new user
				const newUser = new User({
					username: profile.username, // GitHub username
					email: profile.emails[0].value, // Use the first email from the GitHub profile
					// Add other fields if necessary
					githubId: profile.id, // Add githubId field to your schema
				});
				await newUser.save();
				done(null, newUser);
			} catch (err) {
				done(err, null);
			}
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
	User.findById(id, (err, user) => {
		done(err, user);
	});
});

// Export the configured passport instance
module.exports = passport;
