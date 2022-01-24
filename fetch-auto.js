const axios = require("axios");
const queryDB = require("./libs/queryDB");

module.exports = (timer) =>
  setInterval(async () => {
    try {
      const { data } = await axios.post(
        "http://3.1.29.26/snc-locker-register/php/action.php",
        {
          action: "getAllRequests",
        }
      );

      if (data.length > 0) {
        const allId = data.map((info) => {
          queryDB(
            `SELECT * FROM t_employees_new WHERE codeNew='${info.code}'`
          ).then(({ query: { recordset } }) => {
            if (recordset.length === 0) {
              queryDB(`
              INSERT t_employees_new 
              VALUES (
                '${info.code}',
                '${info.name}',
                '${info.tel}',
                '${info.position}',
                '${info.gender}',
                '${info.firstDate}'
                );
        
              INSERT t_request 
              VALUES (
                '${info.code}',
                '${info.zone}',
                'new',
                GETDATE()
                );
            `);
            }
          });

          return Number(info.id);
        });

        // console.log(allId);

        setTimeout(async () => {
          const res = await axios.post(
            "http://3.1.29.26/snc-locker-register/php/action.php",
            {
              minId: Math.min(...allId),
              maxId: Math.max(...allId),
              action: "deleteId",
            }
          );

          // console.log(res.data);
        }, 1000);
      }
    } catch (err) {
      return false;
    }
  }, timer);
