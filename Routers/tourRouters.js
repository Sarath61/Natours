const express = require('express');

const tourControllers = require('../Controllers/tourControllers');
const authController = require('../Controllers/authControllers');

const router = express.Router();

// router.param("id", tourControllers.checkID);

router
  .route('/top-5-cheap')
  .get(tourControllers.aliasTop5, tourControllers.getAllTours);

router.route('/tour-stats').get(tourControllers.getTourstats);
router.route('/months/:year').get(tourControllers.getMonths);

router
  .route('/')
  .get(authController.protect, tourControllers.getAllTours)
  .post(tourControllers.createTour);

router
  .route('/:id')
  .get(tourControllers.getTour)
  .patch(tourControllers.updateTour)
  .delete(
    authController.protect,
    authController.restrictTo('admin', 'lead-guide'),
    tourControllers.deleteTour
  );

module.exports = router;
