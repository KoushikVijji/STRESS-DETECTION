const { Router } = require("express");
const authController = require('../controllers/authController');
const { requireAuth, checkUserRole, redirectIfLoggedIn, checkUser } = require("../middleware/authMiddleware");
const multer = require("multer");

const router = Router();

const storage = multer.memoryStorage(); ;
const upload = multer({ storage: storage });

router.get('/signup', redirectIfLoggedIn, authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', redirectIfLoggedIn, authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

// Protected Routes
router.get('/upload', requireAuth, checkUserRole, authController.upload_get);
router.post('/upload', requireAuth, checkUser, checkUserRole, upload.single('image'), authController.upload_post);

module.exports = router;