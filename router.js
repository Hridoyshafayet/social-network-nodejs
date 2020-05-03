const express = require("express")
const router = express.Router()
const userController = require("./controllers/userController")
const postControler = require('./controllers/postController')

router.get('/',userController.home)
router.post('/login', userController.longin)
router.post('/resigter',userController.register)
router.post('/logout',userController.longout)

//profile related route

router.get('/profile/:usename',userController.isUserExits)

//post related route
router.get('/create-post',userController.logedIn,postControler.createPostView)
router.post('/create',userController.logedIn,postControler.create)

router.get('/post/:id',postControler.signlePostView)

module.exports = router