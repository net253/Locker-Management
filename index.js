const path = require("path");
const express = require("express");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res) {
  res.send({ msg: "Walcome to INDEX." });
});

// router.use(express.static(path.join(__dirname, "../clients/client-user")));

// router.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../clients/client-user/index.html"));
// });

module.exports = router;
