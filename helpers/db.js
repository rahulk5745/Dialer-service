var db = {};

db.pool = null;
db.pool = require("mssql");
db.init = async dbCfg => {
		try {
			await db.pool.connect(dbCfg)
		} catch (err) {
         console.log(`Error: ${err}`);
 }
};
db.execute = async (pool, query) => {
	const returnObj = {};
	const result = await db.pool.query(query);
	returnObj.data = result.recordset;	
	return returnObj;
};
console.log("##"+JSON.stringify(db))
module.exports = db;
