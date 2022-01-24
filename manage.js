const express = require("express");
const router = express.Router();
const queryDB = require("./libs/queryDB");
// const fdatetime = require("./libs/fdatetime");

router.get("/", function (req, res) {
  res.send({ msg: "Walcome to Locker Management API." });
});

router.post("/save-employees", (req, res) => {
  let { code, name, tel, position, gender, firstDate } = req.body;
  queryDB(`SELECT * FROM t_employees WHERE code='${code}'`).then(
    ({ query: { recordset } }) => {
      if (recordset.length > 0)
        return res.send({ state: false, msg: "Code is exist ready!!" });
      queryDB(
        // `INSERT INTO t_employees VALUES ('${code}', '${name}', '${tel}', '${position}', '${gender}', '${firstDate}')`
        `INSERT INTO t_employees VALUES ('${code}', '${name}', '${tel}', '${position}', '${gender}', NULL)`
      ).then(({ state }) => res.send({ state, msg: "Insert successfully." }));
    }
  );
});

module.exports = router;
