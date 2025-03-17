const express = require('express');
const authController = require('../controllers/authController');
const blogController = require('../controllers/blogController');
const commentController = require('../controllers/commentController');
const auth = require('../middlewares/auth');

const router = express.Router();

// testing
router.get('/test', (req, res) => {
    res.json({msg: "Working"})
})

//  user //////////////////////////////////////////////////

// register
router.post('/register',authController.register);

// login
router.post('/login',authController.login);

// logout
router.post('/logout', auth, authController.logout);

// refresh
router.get('/refresh', authController.refresh);


// blog ////////////////////////////////////////////////////

// Create 
router.post('/blog', auth, blogController.create);

// get all blogs
router.get('/blog/all', auth, blogController.getAll);

// get blog by id
router.get('/blog/:id', auth, blogController.getById);

// Update
router.put('/blog', auth, blogController.update);

// Delete
router.delete('/blog/:id', auth, blogController.delete);


// comments ///////////////////////////////////////////////
// create comments
router.post('/comments', auth, commentController.create);

// get comments by blog id 
router.get("/comment/:id", auth, commentController.getById)




module.exports = router;
