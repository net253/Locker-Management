const express = require("express");
const router = express.Router();
const queryDB = require("./libs/queryDB");
const bcrypt = require("bcrypt");

router.post("/checklogin", (req, res) => {
  const { username, password: passwordIn } = req.body;
  queryDB(`SELECT * FROM t_accounts WHERE username='${username}'`).then(
    ({ state, query: { recordset } }) => {
      if (!state) return res.send({ state });
      if (recordset.length === 0) return res.send({ state: false });
      const [{ name, password }] = recordset;
      bcrypt
        .compare(passwordIn, password)
        .then((state) => {
          const isLoggedIn = state;
          req.session = { ...req.session, isLoggedIn, name };
          res.send({ state, name, isLoggedIn });
        })
        .catch((err) => {
          req.session = null;
          res.send({ state: false });
        });
    }
  );
});

router.get("/recheck", (req, res) => {
  //session destroy
  const { isLoggedIn, name } = req.session;
  res.send({ isLoggedIn, name });
});

// LOGOUT
router.post("/logout", (req, res) => {
  //session destroy
  req.session = null;
  res.send({ state: true });
});
// END OF LOGOUT

module.exports = router;
