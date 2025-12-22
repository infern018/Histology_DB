const router = require("express").Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const { verifyToken } = require('./verifyToken');

console.log("API URL ENV");
console.log(process.env.API_URL);

// Verification Route, if the user is authenticated (verified by JWT token)
router.get("/verify", verifyToken, (req, res) => {
	res.status(200).json(req.user);
});

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/github", passport.authenticate("github"));

router.get("/github/callback", passport.authenticate("github", { failureRedirect: "/" }), (req, res) => {
	// only extract username, githubId
	userData = {
		username: req.user.username,
		githubId: req.user.githubId,
	};

	// Redirect to your frontend application with user data in session or through a URL parameter
	res.redirect(`${process.env.REACT_URL}/github_login?user=${encodeURIComponent(JSON.stringify(userData))}`); // Use encodeURIComponent to safely encode the user data
});

module.exports = router;
