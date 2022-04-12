var express = require('express');
var router = express.Router();
const {CampaignsController} = require('../controllers/campaigns_controller');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/v1/call/status/:agentId/:connectedTo/:callStatus/:callsAllocated/:callsAnswered',CampaignsController.updateCallStatus);

module.exports = router;
