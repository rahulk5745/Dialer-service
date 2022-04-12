var db = require('../helpers/db.js');
const {tables, constants, time} = require('../config.js');
const CampaignsController = {};
var currentHour;
CampaignsController.createCampaign = async (req, res, next)=>{
        console.log(`Request received for CampaignID ${req.params.campaignId}:${JSON.stringify(req.params)}`);
        let checkStatusQ = `SELECT count(*) as cmpCnt from ${tables.CAMPAIGN_STATUS} where Status=${constants.RUNNING}`;
        const {campaignId, startDate, endDate, department} = req.params;
        let checkStatusR = await db.execute(db.pool, checkStatusQ);
        let activeCampCount = checkStatusR.data[0].cmpCnt;
        const response = {
                "status":"failure",
                "message":`failed due start campaign ${req.params.camp_id}`
        };
        console.log(`Result of CheckStatus Query: ${activeCampCount}`)
        if (activeCampCount > 0){
                console.log(`Another Campaign is Already running!`);
                response.message = `Another Campaign is already running!`;
        } else {
                let checkCampIDQ = `SELECT count(*) as campIdCount from ${tables.CAMPAIGN_STATUS} where CampaignId = ${campaignId}`;
                let checkCampIDR = await db.execute(db.pool, checkCampIDQ);
                let campIdCount = checkCampIDR.data[0].campIdCount;
                if (campIdCount){
                        console.log(`Campaign Exists, Updating ${campaignId}`);
                        let updateCampQ = `UPDATE ${tables.CAMPAIGN_STATUS} set Status=${constants.RUNNING}, StartTime='${startDate}', EndTime='${endDate}' where CampaignId=${campaignId}`;
                        let updateCampR = await db.execute(db.pool, updateCampQ);
                        console.log(`Update Campaign Result: ${JSON.stringify(updateCampR)}`);
                        response.status = 'success';
                        response.message = 'Campaign Started';
                } else {
                        let insertCampQ = `INSERT into ${tables.CAMPAIGN_STATUS} (CampaignId, Status, StartTime, EndTime) values(${campaignId},${constants.RUNNING},'${startDate}','${endDate}') `;
                        let insertCampR = await db.execute(db.pool, insertCampQ);
                        console.log(`Update Campaign Result: ${JSON.stringify(insertCampR)}`);
                        console.log(`Creating new campaign: ${campaignId}`);
                        response.status = 'success';
                        response.message = 'Campaign Started';
                }
        }
        res.send(JSON.stringify(response));
}

CampaignsController.stopCampaign = async (req, res, next) => {
        const response = {
                "status":"failure",
                "message":`failed due start campaign ${req.params.camp_id}`
        };
        const {campaignId} = req.params;
        let updateCampQ = `UPDATE ${tables.CAMPAIGN_STATUS} set Status=${constants.STOPPED}  where CampaignId=${campaignId}`;
        let updateCampR = await db.execute(db.pool, updateCampQ);
        console.log(`Update Campaign Result: ${JSON.stringify(updateCampR)}`);
        response.status = 'success';
        response.message = 'Campaign Stopped';
        res.send(JSON.stringify(response));
}
module.exports = {
        CampaignsController: CampaignsController
}

CampaignsController.agentLogin = async (req, res, next) => {
        const response = {
                "status":"failure",
                "message":`failed to Login Agent ${req.params.agentId}`
        };
	console.log(`Request received for agentID ${req.params.agentId}:${JSON.stringify(req.params)}`);
        const {agentId, extension, trunk, callerId} = req.params;
        let checkExtensionQ = `select count(*) as cnt from ${tables.AGENTS} where AgentId=${agentId} AND Extension=${extension}`;
        let checkExtensionR = await db.execute(db.pool, checkExtensionQ);
        let extensionCount = checkExtensionR.data[0].cnt;

        if(extensionCount > 0){
		console.log('Updating Agent Status');
                let updateAgentQ = `UPDATE ${tables.AGENTS} set Status=1, CallStatus='IDLE'  where AgentId=${agentId}`;
                let updateAgentR = await db.execute(db.pool, updateAgentQ);
                console.log(`Update Agent Status: ${JSON.stringify(updateAgentR)}`);
                response.status = 'success';
                response.message = 'Agent Logged In';
                res.send(JSON.stringify(response));
        }else{
		 console.log('Agent Not Found, Inserting new');
                 let insertAgentQ = `INSERT into ${tables.AGENTS} (AgentId,Status,CallStatus,Extension,Trunk,CallerId) values(${agentId},1,'IDLE','${extension}','${trunk}','${callerId}') `;
                 let insertAgentR = await db.execute(db.pool, insertAgentQ);
                 console.log(`Update Campaign Result: ${JSON.stringify(insertAgentR)}`);
                 response.status = 'success';
                 response.message = 'Agent Logged In';
                 res.send(JSON.stringify(response));
        }
}

CampaignsController.agentLogout = async (req, res, next) => {
        const response = {
                "status":"failure",
                "message":`failed to Logout Agent ${req.params.agentId}`
        };
	console.log(`Request received for agentID ${req.params.agentId}:${JSON.stringify(req.params)}`);
        const {agentId, extension} = req.params;
        let updateAgentQ = `UPDATE ${tables.AGENTS} set Status=0, CallStatus='IDLE'  where AgentId=${agentId}`;
        let updateAgentR = await db.execute(db.pool, updateAgentQ);
        console.log(`Update Agent Status: ${JSON.stringify(updateAgentR)}`);
        response.status = 'success';
        response.message = 'Agent Logged Out';
        res.send(JSON.stringify(response));
}

CampaignsController.updateCallStatus = async (req, res, next) => {
        const response = {
                "status":"failure",
                "message":`failed to update call status ${req.params.agentId}`
        };
	console.log(`Request received for Number ${req.params.connectedTo}:${JSON.stringify(req.params)}`);
        const {agentId, connectedTo, callStatus, callsAllocated, callsAnswered} = req.params;
        let updateAgentQ = `UPDATE ${tables.AGENTS} set ConnectedTo='${connectedTo}', CallStatus='${callStatus}', UpdateTime=getDate(), CallsAllocated+=${callsAllocated}, CallsAnswered+=${callsAnswered} where AgentId=${agentId}`;
	console.log('Update Call Status Query '+updateAgentQ);
        let updateAgentR = await db.execute(db.pool, updateAgentQ);
        console.log(`Update Agent Status: ${JSON.stringify(updateAgentR)}`);
        response.status = 'success';
        response.message = 'Call Status Updated';
        res.send(JSON.stringify(response));
}
