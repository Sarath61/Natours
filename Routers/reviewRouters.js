const express = require('express');

const reviewControllers = require('../Controllers/reviewControllers');

const authControllers = require('../Controllers/authControllers');

const router = express.Router();

router
  .route('/')
  .get(reviewControllers.getAllReviews)
  .post(
    authControllers.protect,
    authControllers.restrictTo('user'),
    reviewControllers.postReviews
  );

module.exports = router;
