var astclient = require('../helpers/ast_man');
var db = require('../helpers/db.js');
const {tables, constants,time,astconfig} = require('../config.js');
const SchedulerController = {};
SchedulerController.StartInterval = async function StartInterval() {
	const date = new Date();
	var now = date.getHours()
	currentHour = now;
	if(currentHour >= time.startHour && currentHour < time.endHour) {
		let runningCampaignsQ = `Select TOP 1 CampaignId, Department  from ${tables.CAMPAIGN_STATUS}  where Status = ${constants.RUNNING} and StartTime <=getDate() AND Endtime >  getDate();` ;

		let runningCampaignsR = await db.execute(db.pool, runningCampaignsQ);
		// var numofrows=runningCampaignsR.length;
		//console.log("fffffff:"+runningCampaignsQ.length);
		if(!runningCampaignsR.data[0] || !runningCampaignsR.data[0].CampaignId){
			console.log('no campaign is currently running');
		}else {


			let activeCampaign = runningCampaignsR.data[0].CampaignId;
			let department = runningCampaignsR.data[0].Department;
			console.log(`Result of CampaignId --> ${activeCampaign}`);
			console.log('campaign count'+ runningCampaignsR.data.length);
			//console.log("Result of CheckStatus Query--------------:"+JSON.stringify(runningCampaigns1.data[0]));
			let freeAgentsQ=`SELECT AgentId, Extension, Trunk, CallerId from ${tables.AGENTS} where Status ='${constants.LOGIN}' and CallStatus='IDLE' and Department=${department}`;
			let freeAgentsR = await db.execute(db.pool, freeAgentsQ);
			if(!freeAgentsR.data[0]){
				console.log('no active agents');
			}else {

				//if(!runningfreeAgentsRCampaignsR.data[0] || !runningCampaignsR.data[0].CampaignId){
				//	                 console.log('no campaign is currently running');
				//	         }

				//	let freeAgentCount = freeAgents1.AgentId;
				console.log("freeagentsssss+++"+JSON.stringify(freeAgentsR));
				let count = 0;
				for (count=0;count<freeAgentsR.data.length;count++){
					let element = freeAgentsR.data[count];
					console.log("free Agents Ids------>"+element.AgentId);
					let updateAgentQ = `UPDATE ${tables.AGENTS} set CallStatus='TRYING' where AgentId=${element.AgentId}`;
	                		let updateAgentR = await db.execute(db.pool, updateAgentQ);
					//{number,trunk,context,extension,priority,agentId,callerId}
					const selectNumberQ = `SELECT Phone1 as phone, ID as contactId from ${tables.CONTACTS} where Status = '${constants.NOT_DIALED}' and CampaignID=${activeCampaign}`;
					const selectNumberR = await db.execute(db.pool,selectNumberQ);
					console.log(`Select Number Query: ${selectNumberQ}, Result: ${JSON.stringify(selectNumberR)}`);	
					if (selectNumberR.data[0]){
						const contact = selectNumberR.data[0];
						const updateNumberQ = `UPDATE ${tables.CONTACTS} set Status = '${constants.DIALED}' where ID=${contact.contactId}`;
						const updateNumberR = await db.execute(db.pool, updateNumberQ);
						astclient.dial(
							{
								"number":'0'+contact.phone,
								"trunk":element.Trunk,
								"context":astconfig.context,
								"extension":element.Extension,
								"priority":1,
								"agentId":element.AgentId,
								"callerId":element.CallerId
							},
							(err, res)=>{
								console.log(`error: ${err}, response: ${JSON.stringify(res)}`);
							}
						);
					} else {
						console.log(`End of Campaign Base: ${activeCampaign}`);
						const updateCampQ = `UPDATE ${tables.CAMPAIGN_STATUS} set Status = '${constants.FINISHED}' where CampaignId=${activeCampaign}`;
                                                const updateCampR = await db.execute(db.pool, updateCampQ);
						let updateAgentQ = `UPDATE ${tables.AGENTS} set CallStatus='IDLE' where AgentId=${element.AgentId}`;
	                			let updateAgentR = await db.execute(db.pool, updateAgentQ);
					}
					//console.log("########"+array.length); 
				}
			}
			console.log("freeAgents Count:"+freeAgentsR.data.length);
		}

	}else{
		console.log('not started');
		
		return

	}
}
//console.log("time" + currentHour);


module.exports = {
	SchedulerController: SchedulerController
}
