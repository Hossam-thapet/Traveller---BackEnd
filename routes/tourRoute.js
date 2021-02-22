const express = require ('express');
const tourControl = require ('./../controllers/tourcontroller');
const authController = require ('./../controllers/authController');
const reviewController = require('./../controllers/reviewcontroller');
const reviewRouter = require('./reviewroute');
const router = express.Router() ;


router.use('/:tourId/reviews', reviewRouter)
router
.route('/stats').get(authController.protect,authController.restrictTo('admin'),tourControl.getToursState)

router
.route('/')
.get(tourControl.getTours)
.post(authController.protect,authController.restrictTo('admin','lead-guide'),tourControl.addTour);
router
.route('/:id')
.get(tourControl.getTour)
.patch(authController.protect,authController.restrictTo('admin','lead-guide'),tourControl.updateTour)
.delete(
    authController. protect ,
    authController.restrictTo('admin' , 'lead-guide'),
    tourControl.deleteTour);


module.exports =router ;
