/* eslint-disable import/no-unresolved */
const express = require("express");

const authService = require("../services/authServices");

const {
  addAddress,
  removeAddress,
  getLoggedUserAddresses,
} = require("../services/addressServices");

const router = express.Router();

router.use(authService.protect, authService.allowedTo("user"));

router.route("/").post(addAddress).get(getLoggedUserAddresses);

router.delete("/:addressId", removeAddress);

module.exports = router;
