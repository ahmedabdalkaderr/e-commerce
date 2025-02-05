/* eslint-disable no-unreachable */
const { check, body } = require("express-validator");
const validatorMiddleware = require("../../middlewares/validatorMiddleware");
const Review = require("../../models/reviewModel");

exports.checkproductId = (req, res, next) => {
  const { productId } = req.params;
  if (productId) req.body.product = productId;
  next();
};

exports.createReviewValidator = [
  check("title").optional(),
  check("ratings")
    .notEmpty()
    .withMessage("ratings value required")
    .isFloat({ min: 1, max: 5 })
    .withMessage("Ratings value must be between 1 to 5"),
  check("user").optional().isMongoId().withMessage("Invalid user id format"),
  body("product")
    .optional()
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      // Check if logged user create review before
      Review.findOne({ user: req.user._id, product: req.body.product }).then(
        (review) => {
          if (review) {
            return Promise.reject(
              new Error("You already created a review before")
            );
          }
          req.body.user = req.user._id;

          // if (req.body.user.toString() !== req.user._id.toString()) {
          //   return Promise.reject(
          //     new Error("You are not allowed to perform this action..")
          //   );
          // }
        }
      )
    ),
  validatorMiddleware,
];

exports.getReviewValidator = [
  check("id").isMongoId().withMessage("Invalid Review id format"),
  validatorMiddleware,
];

exports.updateReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) =>
      // Check review ownership before update
      Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }

        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      })
    ),
  validatorMiddleware,
];

exports.deleteReviewValidator = [
  check("id")
    .isMongoId()
    .withMessage("Invalid Review id format")
    .custom((val, { req }) => 
      // Check review ownership before update
       Review.findById(val).then((review) => {
        if (!review) {
          return Promise.reject(new Error(`There is no review with id ${val}`));
        }
        if (review.user._id.toString() !== req.user._id.toString()) {
          return Promise.reject(
            new Error(`Your are not allowed to perform this action`)
          );
        }
      })
    ),
  validatorMiddleware,
];
