const AmiClient = require('asterisk-ami-client');
let client = new AmiClient();


var AsteriskClient = {
	ami: null
};

const evtHandlerDefault = (e)=> {
	console.log("Received Asterisk Event:" + JSON.stringify(e));
}

AsteriskClient.connect = ({ip, port, user, password})=> {
	var AsteriskManager = require('asterisk-manager');
        AsteriskClient.ami = new AsteriskManager(port, ip, user, password, true);
//        ami.keepConnected();
//	AsteriskClient.ami.on('managerevent', evtHandlerDefault);
//	AsteriskClient.ami.on('hangup', evtHandlerDefault);
//	AsteriskClient.ami.on('confbridgejoin', evtHandlerDefault);
		console.log("gggggggggggggggggggggggggggggggggg");
	AsteriskClient.ami.on('close', evtHandlerDefault);
	AsteriskClient.ami.on('disconnect', evtHandlerDefault);
	AsteriskClient.ami.on('connect', function(e) {
		if (e){
			console.log("Unable to connect to Asterisk:",e);
		} else {
			console.log("Successfully Connected to Asterisk.");
		}
	});
}


AsteriskClient.dial = ({number,trunk,context,extension,priority,agentId,callerId}, callBack) => {
	console.log(`${number},${trunk},${context},${extension},${priority},${agentId},${callerId}`);
	AsteriskClient.ami.action({
	  'action':'originate',
	  'channel': "SIP/"+number+"@"+trunk,
	  'exten': extension,
	  'context': context,
	  'priority': priority,
	  'Variable': {"AGENTID":agentId,"DEST":number},
	  'CallerID': "\""+callerId+"\" <"+callerId+">",
	 // 'Account': dialObj.accountCode,
      'Async':'yes'
}, function(err, res) {
	console.log("Call Originated:", "SIP/"+number+"@"+trunk, ", ="+agentId, " Err:", err);
	callBack(err, res);
});
}


//AsteriskClient.connect();
module.exports = AsteriskClient;
