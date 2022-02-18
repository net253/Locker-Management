const express = require("express");
const router = express.Router();
const queryDB = require("./libs/queryDB");
const fdatetime = require("./libs/fdatetime");

//GET home page.
router.get("/", function (req, res) {
  res.send({ msg: "Welcome to Locker Management API." });
});

//GET overall page. OK
router.get("/overall", (req, res) => {
  queryDB(`SELECT * FROM v_used_overall`).then(({ query: { recordset } }) =>
    res.send(recordset)
  );
});

//GET zone page. OK
router.get("/zone-used/:zone", (req, res) => {
  const zone = req.params.zone;

  queryDB(`SELECT * FROM v_used_locker_in_zone WHERE zone='${zone}'`).then(
    ({ query: { recordset } }) =>
      res.send(
        recordset.length > 0
          ? recordset.map((record) => ({
              ...record,
              status:
                record.used / record.total === 1
                  ? "full"
                  : record.used / record.total > 0
                  ? "used"
                  : "empty",
            }))
          : []
      )
  );
});

// zone = a,b,c,d & lockerNo = 001-999  *OK
router.get("/locker-used/:zone/:lockerNo", (req, res) => {
  const { zone, lockerNo } = req.params;
  if ([..."abcdABCD"].includes(zone)) {
    queryDB(
      `SELECT * FROM v_zone_emp WHERE zone='${zone}' AND lockerNo = '${lockerNo}'`
    ).then(({ query: { recordset } }) => res.send(recordset));
  } else {
    res.send([]);
  }
});

//POST locker page. ---> check-in. *OK
router.post("/check-in", (req, res) => {
  const { zone, lockerNo, channelNo, code } = req.body;
  const status = "full";
  const action = "checkin";
  const now = fdatetime(new Date()).getFDatetime;

  queryDB(`
  SELECT * FROM t_zone_${zone} 
  WHERE lockerNo = '${lockerNo}' 
  AND channelNo = '${channelNo}' 
  AND status = 'empty'`).then(({ query: { recordset } }) => {
    if (recordset.length > 0) {
      queryDB(`SELECT * FROM v_zone_emp WHERE code = '${code}'`).then(
        ({ query: { recordset } }) => {
          if (recordset.length == 0) {
            queryDB(`
                UPDATE t_zone_${zone} 
                SET code='${code}', status='${status}', datetimeIn='${now}'
                WHERE lockerNo='${lockerNo}' AND channelNo='${channelNo}';
    
                INSERT t_history 
                VALUES (
                  '${zone}', 
                  '${lockerNo}', 
                  '${channelNo}', 
                  '${code}', 
                  '${now}', 
                  '${action}'
                  );
                `).then(({ state }) => {
              res.send({ state, msg: "Check in." });
            });
          } else {
            res.send({ state: false, msg: "Code is exist." });
          }
        }
      );
    } else {
      res.send({ state: false, msg: "Code is exist." });
    }
  });
});

//POST locker page. ---> add employee and check-in OK
router.post("/add-emp", (req, res) => {
  const {
    code,
    name,
    tel,
    position,
    gender,
    firstDate,
    zone,
    lockerNo,
    channelNo,
  } = req.body;
  const status = "full";
  const action = "checkin";
  const now = fdatetime(new Date()).getFDatetime;

  queryDB(`SELECT * FROM t_employees WHERE code='${code}'`).then(
    ({ query: { recordset } }) => {
      if (recordset.length == 0) {
        queryDB(`
        INSERT t_employees VALUES ('${code}', '${name}', '${tel}', '${position}', '${gender}', '${firstDate}');

        UPDATE t_zone_${zone} 
        SET code='${code}', status='${status}', datetimeIn='${now}' 
        WHERE lockerNo='${lockerNo}' AND channelNo='${channelNo}';

        INSERT t_history VALUES ('${zone}', '${lockerNo}', '${channelNo}', '${code}', '${now}', '${action}');
        `).then(({ state }) => {
          res.send({ state, msg: "Successfully added and check-in." });
        });
      } else {
        res.send({
          state: false,
          msg: "There is already information of this id in the system.",
        });
      }
    }
  );
});

//POST locker page. & present page. ---> check-out *OK
router.post("/check-out", (req, res) => {
  const { zone, lockerNo, channelNo, code } = req.body;
  const status = "empty";
  const action = "checkout";
  const now = fdatetime(new Date()).getFDatetime;

  queryDB(
    `SELECT * FROM t_zone_${zone} WHERE lockerNo='${lockerNo}' AND channelNo='${channelNo}'`
  ).then(({ query: { recordset } }) => {
    if (recordset[0].status == "full") {
      queryDB(`
      UPDATE t_zone_${zone}
      SET code='', status='${status}'
      WHERE lockerNo='${lockerNo}' AND channelNo='${channelNo}';

      INSERT t_history VALUES ('${zone}', '${lockerNo}', '${channelNo}', '${code}', '${now}', '${action}');
      `).then(({ state }) =>
        res.send({ state, msg: "Successfully Check-out." })
      );
    } else {
      res.status(400).send({ state: false });
    }
  });
});

//POST search bar. & pop-up befor check-in. *OK
router.post("/search", (req, res) => {
  const { search, action } = req.body;
  let sql = `SELECT TOP 50 * FROM v_emp_used_zone WHERE (code LIKE '%${search}%' OR name LIKE '%${search}%')`;
  if (action === "checkin") {
    sql += " AND status!='full'";
  } else if (action === "used") {
    sql += " AND status='full'";
  }
  queryDB(sql).then(({ query: { recordset } }) => res.send(recordset));
});

//POST present page. *OK
router.post("/present", (req, res) => {
  const { zone, lockerNo } = req.body;
  // let sql = "SELECT TOP 50 * FROM v_emp_used_zone WHERE status='full'";
  let sql = "SELECT * FROM v_emp_used_zone WHERE status='full'";
  if (zone == "all" || zone == "") {
    sql += "";
  } else {
    sql += ` AND zone='${zone}'`;
    if (lockerNo) {
      sql += ` AND lockerNo='${lockerNo}'`;
    }
  }

  sql += " ORDER BY zone ASC";

  queryDB(sql).then(({ query: { recordset } }) => {
    // res.send(recordset);
    res.send(recordset);
  });
});

//POST history page. *OK
router.post("/history", (req, res) => {
  const { zone, lockerNo, channelNo, startDate, endDate, action } = req.body;

  let sql = "SELECT TOP 50 * FROM v_history_emp";
  if (zone == "all" || zone == "") {
    if (action || (startDate && endDate)) {
      sql += " WHERE";
      if(action){
        sql += ` action='${action}'`;
      }
      if(action && (startDate && endDate)){
        sql += " AND";
      }
      if (startDate && endDate) {
        sql += ` datetime BETWEEN '${startDate}' AND '${endDate}'`;
      }
    }
    
  } else {
    sql += ` WHERE zone='${zone}'`;
    if (lockerNo) {
      sql += ` AND lockerNo='${lockerNo}'`;
    }
    if (channelNo) {
      sql += ` AND channelNo='${channelNo}'`;
    }
    if (action) {
      sql += ` AND action='${action}'`;
    }
    if (startDate && endDate) {
      sql += ` AND datetime BETWEEN '${startDate}' AND '${endDate}'`;
    }
  }

  sql += " ORDER BY id DESC";

  queryDB(sql).then(({ query: { recordset } }) => res.send(recordset));
});

//POST present page. ---> edit-employee *OK
router.post("/edit", (req, res) => {
  const { newCode, oldCode, name, tel, gender, position, firstDate, zone } =
    req.body;
  queryDB(`
            UPDATE t_employees SET 
            code='${newCode}', 
            name='${name}', 
            tel='${tel}', 
            gender='${gender}', 
            position='${position}', 
            firstDate = '${firstDate}' 
            WHERE code ='${oldCode}';

            UPDATE t_zone_${zone} SET code='${newCode}' WHERE code='${oldCode}';

            UPDATE t_history SET code='${newCode}' WHERE code='${oldCode}';
            `).then(({ state }) =>
    res.send({ state, msg: "Successfully edited." })
  );
});

//POST request page(admin). ---> show.
router.post("/request", (req, res) => {
  const { search } = req.body;
  let sql = "SELECT TOP (50) * FROM v_emp_request WHERE action !='' ";
  if (search) {
    sql += `AND code LIKE '%${search}%' OR (action !='' AND name LIKE '%${search}%') `;
  }
  queryDB(sql).then(({ query: { recordset } }) =>
    res.send(recordset.length > 0 ? recordset : [])
  );
});

//POST request page(admin). ---> confirm
router.post("/request-confirm", (req, res) => {
  const {
    action,
    channelNo,
    channelNoNew,
    code,
    firstDate,
    gender,
    lockerNo,
    lockerNoNew,
    name,
    position,
    tel,
    zone,
    zoneNew,
  } = req.body;
  const now = fdatetime(new Date()).getFDatetime;

  // const name = recordset[0].name;
  // const tel = recordset[0].tel;
  // const position = recordset[0].position;
  // const gender = recordset[0].gender;
  // const firstDate = recordset[0].firstDate;
  // const zone = recordset[0].zone;
  // const zoneNew = recordset[0].zoneNew;
  // const lockerNoOld = recordset[0].lockerNo;
  // const channelNoOld = recordset[0].channelNo;
  // const action = recordset[0].action;

  // const [{
  //   name,
  //   tel,
  //   position,
  //   gender,
  //   firstDate,
  //   zone,
  //   zoneNew,
  //   lockerNoOld,
  //   channelNoOld,
  //   action
  // }] = recordset;

  // const firstDateNew = fdatetime(firstDate).getFDate;
  queryDB(`SELECT * FROM t_request WHERE code = '${code}'`).then(
    ({ query: { recordset } }) => {
      if (recordset.length > 0) {
        queryDB(`
    SELECT * FROM t_zone_${zoneNew} 
    WHERE lockerNo='${lockerNoNew}' 
    AND channelNo='${channelNoNew}'
    `).then(({ query: { recordset } }) => {
          if (recordset[0].status == "empty") {
            let sql = "";

            if (action == "new") {
              sql += `
          INSERT t_employees 
          VALUES (
            '${code}',
            '${name}', 
            '${tel}', 
            '${position}', 
            '${gender}',
            '${firstDate}'
            );
          
          DELETE FROM t_employees_new WHERE codeNew = '${code}';
          `;
            }

            if (action == "move") {
              sql += `
          UPDATE t_zone_${zone} 
          SET code ='', status ='empty', datetimeIn = ''
          WHERE lockerNo='${lockerNo}' 
          AND channelNo='${channelNo}';
        
          INSERT t_history 
          VALUES (
            '${zone}', 
            '${lockerNo}', 
            '${channelNo}', 
            '${code}', 
            '${now}', 
            'checkout');
          `;
            }

            sql += `
        UPDATE t_zone_${zoneNew}
        SET code = '${code}', status = 'full', datetimeIn = '${now}'
        WHERE lockerNo = '${lockerNoNew}'
        AND channelNo = '${channelNoNew}';
      
        INSERT t_history 
        VALUES (
          '${zoneNew}', 
          '${lockerNoNew}', 
          '${channelNoNew}', 
          '${code}', 
          '${now}', 
          'checkin'
          );
        
        DELETE FROM t_request WHERE code = '${code}';
        `;

            queryDB(sql).then(({ state }) => res.send({ state }));
          } else {
            res.send({ state: false });
          }
        });
      } else {
        res.send({ state: false });
      }
    }
  );
});

//POST request page(admin). ---> delete.
router.post("/request-delete", (req, res) => {
  const { code } = req.body;
  queryDB(`
  DELETE FROM t_request WHERE code = '${code}';
  
  DELETE FROM t_employees_new WHERE codeNew = '${code}';
  `).then(({ state }) => res.send({ state }));
});

module.exports = router;
