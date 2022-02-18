const mssql = require("mssql");
const config = require("./dbconfig");

// const queryDB = async (sql) => {
//   try {
//     const pool = await mssql.connect(config);
//     const query = await pool.request().query(sql);

//     return { state: true, query };
//   } catch (err) {
//     console.log(err);
//     return { state: false, query: {} };
//   }
// };

const queryDB = (sql) => {
  return new Promise(async (revolve, reject) => {
    try {
      const pool = await mssql.connect(config);
      const query = await pool.request().query(sql);

      revolve({ state: true, query });
    } catch (error) {
      console.log(error);
      reject({ state: false, query: {} });
    }
  });
};

module.exports = queryDB;
