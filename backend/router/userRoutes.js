const express = require("express");

const router = express.Router();

const AuthContoller = require('../controllers/authController')


router.get("/", AuthContoller.getUsers);
router.post("/signup", AuthContoller.signup);
router.post("/login", AuthContoller.login);

module.exports = router;