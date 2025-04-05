const express = require("express");
const { searchProducts } = require("../../controllers/users/search.controller");


const router = express.Router();

router.get("/:keyword", searchProducts);

module.exports = router;