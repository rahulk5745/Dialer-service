var express = require('express');
var router = express.Router();
const {CampaignsController} = require('../controllers/campaigns_controller');
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/v1/campaign/:campaignId/:startDate/:endDate/:department',CampaignsController.createCampaign);
router.delete('/v1/campaign/:campaignId',CampaignsController.stopCampaign);

module.exports = router;
