const express =require ('express');
const userConterol = require ('./../controllers/usercontroller');
const authControl = require('./../controllers/authController');
const router = express.Router() ;


router.post('/signup' , authControl.signup);
router.post('/login' , authControl.login);
router.post('/forgotpassword' , authControl.forgotpassword);
router.post('/resetPassword' , authControl.resetPassword);

router.use(authControl.protect);
router.patch('/updatePassword' , authControl.updatePassword);
router.patch('/updates' , authControl.updateMe);
router.delete('/delete' , authControl.deleteMe);
router
.route('/').get(userConterol.getUsers)
router
.route('/:id').get(userConterol.getUser)

module.exports = router ;
