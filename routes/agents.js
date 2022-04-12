var express = require('express');
var router = express.Router();
const {CampaignsController} = require('../controllers/campaigns_controller');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/v1/agent/login/:agentId/:extension/:trunk/:callerId',CampaignsController.agentLogin);
router.post('/v1/agent/logout/:agentId/:extension',CampaignsController.agentLogout);

module.exports = router;
