const router = require("express").Router();
const authController = require("../controllers/authController");
const passport = require("passport");
const config = require("../config");

router.post("/register", authController.register);

router.post("/login", authController.login);

router.post("/logout", authController.logout);

router.get("/github", passport.authenticate("github"));

router.get("/github/callback",
    passport.authenticate("github", { failureRedirect: "/" }),
    (req, res) => {
        // only extract username, githubId
        userData = {
            username: req.user.username,
            githubId: req.user.githubId
        }

        // Redirect to your frontend application with user data in session or through a URL parameter
        res.redirect(`${config.react_url}/login/github?user=${encodeURIComponent(JSON.stringify(userData))}`); // Use encodeURIComponent to safely encode the user data
    }
);

module.exports = router;
