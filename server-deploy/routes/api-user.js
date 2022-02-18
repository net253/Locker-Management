const express = require("express");
const router = express.Router();
const queryDB = require("./libs/queryDB");
const fdatetime = require("./libs/fdatetime");

//GET register app. sign-in.
router.get("/register/:code", (req, res) => {
  const code = req.params.code;
  queryDB(`SELECT * FROM v_emp_request WHERE code ='${code}'`).then(
    ({ query: { recordset } }) => {
      res.send(recordset.length > 0 ? recordset : []);
    }
  );
});

//POST add-new-employees.
router.post("/add-employee", (req, res) => {
  const {
    codeNew,
    nameNew,
    telNew,
    positionNew,
    genderNew,
    firstDateNew,
    zoneNew,
  } = req.body;
  const now = fdatetime(new Date()).getFDatetime;
  const action = "new";

  queryDB(`SELECT * FROM t_employees_new WHERE codeNew ='${codeNew}'`).then(
    ({ query: { recordset } }) => {
      if (recordset.length == 0) {
        queryDB(`
      INSERT t_employees_new 
      VALUES (
        '${codeNew}',
        '${nameNew}',
        '${telNew}',
        '${positionNew}',
        '${genderNew}',
        '${firstDateNew}'
        );

      INSERT t_request 
      VALUES (
        '${codeNew}',
        '${zoneNew}',
        '${action}',
        '${now}'
        );
      `).then(({ state }) => res.send({ state }));
      } else {
        res.status(400).send({ state: false });
      }
    }
  );
});

//POST register app.
router.post("/register", (req, res) => {
  const { code, zoneNew, action } = req.body;
  const now = fdatetime(new Date()).getFDatetime;
  queryDB(`
          INSERT t_request 
          VALUES (
            '${code}',
            '${zoneNew}',
            '${action}',
            '${now}'
            );
          `).then(({ state }) => res.send({ state }));
});

//GET drop-down list. ---> zone = a,b,c,d
// router.get("/zone-used/:zone", (req, res) => {
//   const zone = req.params.zone;

//   queryDB(`SELECT * FROM v_used_locker_in_zone WHERE zone='${zone}'`).then(
//     ({ query: { recordset } }) =>
//       res.send(
//         recordset.length > 0
//           ? recordset.map((record) => ({
//               ...record,
//               status:
//                 record.used / record.total === 1
//                   ? "full"
//                   : record.used / record.total > 0
//                   ? "used"
//                   : "empty",
//             }))
//           : []
//       )
//   );
// });

//GET drop-down list. ---> zone = a,b,c,d & lockerNo = 001-999
// router.get("/locker-used/:zone/:lockerNo", (req, res) => {
//   const { zone, lockerNo } = req.params;
//   if ([..."abcdABCD"].includes(zone)) {
//     queryDB(
//       `SELECT * FROM v_locker_request WHERE zone='${zone}' AND lockerNo = '${lockerNo}'`
//     ).then(({ query: { recordset } }) =>
//         res.send(recordset.map((record) => ({
//           ...record,
//             status:
//               record.action && record.status == "empty" ?
//               "reserve": record.status,
//           })
//         ))
//       );
//   } else {
//     res.send([]);
//   }
// });

//POST delete.
router.post("/register-delete", (req, res) => {
  const { code } = req.body;
  queryDB(`
  DELETE FROM t_request WHERE code = '${code}';
  DELETE FROM t_employees_new WHERE codeNew = '${code}';
  `).then(({ state }) =>
    res.send({ state })
  );
});

module.exports = router;
