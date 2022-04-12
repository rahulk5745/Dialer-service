
const astconfig = {
                "user":"nsnode",
                "password":"nsnode",
                "ip":"127.0.0.1",
                "port":"5038",
		"trunk":"albsip-123",
		"context":"dialout",
		"callerId":"+35542333123"
};
const dbconfig = {
  user: "asteriskuser",
  password: "Asterisk@2022",
  database: "SalesCRMTest",
  server: 'atemak12.c8kumftnoykl.eu-central-1.rds.amazonaws.com',
  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // for azure
    trustServerCertificate: true // change to true for local dev / self-signed certs
  }
};
/*const dbconfig  = {
                "poolSize":5,
                "host":"3.121.173.225 1433",
                "dbName":"SalesCRMTest",
                "user":"asteriskuser",
                "pass":"Asterisk@2022"
};*/
const tables = {
		"CAMPAIGN_STATUS":"RunningCampaigns",
		"AGENTS":"Agents",
		"CONTACTS":"contacts"
};
const constants = {
		"RUNNING":1,
		"STOPPED":0,
		"LOGIN":"1",
		"LOGOUT":"0",
		"DIALED":"1",
		"NOT_DIALED":"0",
		"FINISHED":2
};

const time = {
    "startHour":'1',
    "endHour":'20'
};

module.exports = {
	astconfig: astconfig,
	dbconfig: dbconfig,
	tables: tables,
	constants: constants,
    time: time
}
