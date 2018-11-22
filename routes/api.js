const express = require('express');
const router = express.Router();
const ReportController = require('../src/controllers/report');


router.post('/profitReport',function (req,res) {
    ReportController.getProfitReportData(req,res);
});

router.get('/test',function (req,res) {
    res.send('test');
});

module.exports = router;
