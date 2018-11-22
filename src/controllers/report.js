const ReportController = {};
const puppeteer = require("puppeteer");
const loginUrl = 'https://accounting.sageone.co.za/Landing/Default.aspx';
const PASSWORD = process.env.PASSWORD;
const USERNAME = process.env.USERNAME;
const reportUrl = `https://accounting.sageone.co.za/Reports/HTMLReportFilter.aspx?encqry=POVm97O0+iW4ekO2VNbRHK9f8tCkqCwrVX7bkYddM/XO3eGYlO4wLiDjA+zYRf8T`;


ReportController.getProfitReportData = async function(req,res){

    try{
        const {msg,filteredData} = filteredPostData(req.body);


        try {
            browser = await puppeteer.launch({
                args: ['--no-sandbox','--disable-setuid-sandbox'],
                headless: true,
                ignoreHTTPSErrors: true
            });

            const page = await browser.newPage();
            await page.setViewport({ 'width':1366, 'height':768 } );
            await page.goto(loginUrl, { ignoreHTTPSErrors: true, timeout: 60000 });
            await page.waitFor(2000);
            await page.type('input[name="ctl00$cphFullWidthDocumentContainer$LoginControl$txtUserName_vertical"]', USERNAME, { delay: 100 });
            await page.type('#ctl00_cphFullWidthDocumentContainer_LoginControl_txtPassword_vertical', PASSWORD, { delay: 100 });
            await page.click('#ctl00_cphFullWidthDocumentContainer_LoginControl_btnSignIn_vertical');
            await page.waitFor(4000);

            await page.goto(reportUrl, { ignoreHTTPSErrors: true, timeout: 60000 });
            await page.waitForSelector('#ctl00_cphFullWidthDocumentContainerBelowSearch_btnViewReport', { timeout: 3000 });

            await page.evaluate((a) => {
                document.getElementById("ctl00_cphFullWidthDocumentContainerBelowSearch_hidFilters").value = a;
                var theForm = document.forms['aspnetForm'];
                theForm.__EVENTTARGET.value = "ctl00$cphFullWidthDocumentContainerBelowSearch$btnViewReport";
                theForm.__EVENTARGUMENT.value = '';
                theForm.submit();
            }, filteredData);

            //await page.click('#ctl00_cphFullWidthDocumentContainerBelowSearch_btnViewReport');
            await page.waitForNavigation();
            await page.waitForSelector('.jqtree-tree', { timeout: 30000 });
            console.log('going to click download button');
            const csvData = await page.evaluate((a)=>{

                var contentTable = $('#htmlContentTable');
                var headingDiv = $('#divHeading');
                var divTableHeader = $('#divTableHeaderRow');
                var reportName = '<tr><td colspan="2"><div><h2>Profit and Loss Report</h2></div></td></tr>';



                var listToExport = contentTable;
                var headerTable = headingDiv;
                var periodLine = divTableHeader;
                var reverse = true;
                var multiPeriodTB = false;
                var noGroupingIndent = false;
                var fileName = 'ProfitAndLossReport';


                var divToPrint = listToExport.clone();
                divToPrint.attr('id', 'cloneContentTable');

                var periodRow = periodLine.clone();

                //remove currency formats
                $(divToPrint).find('.value').each(function () {
                    var number = isNaN(parseFloat($(this).html().replace(/[^0-9-.]/g, ''))) ? '' : parseFloat($(this).html().replace(/[^0-9-.]/g, ''));
                    $(this).html(number);
                });

                divToPrint = divToPrint.tablerizeHTML(false, periodRow, reverse, multiPeriodTB, reportName);
                divToPrint.find('img').replaceWith('-'); //This is to still display a range indicator when they are not showing images.
                divToPrint = removeAttributes(divToPrint, '*', ['data-', 'class', 'id']);

                var lastdata =$(divToPrint).TableCSVExport({ delivery: 'value' });

                return lastdata;


            },'down');

            await browser.close();
            res.status(200).send(csvData);



        }
        catch (e) {
            console.log(e);
            res.status(500).send({'csvData':''});
        }
    }
    catch (e) {
        console.log('catch'+e);
        res.status(500).send({'csvData':''});
    }
};


function filteredPostData(body){
    let queryString = ``;
    let dateRangeFrom = body.dateRangeFrom;
    //TODO check this dd-mm-yyyy format
    queryString += `dateRangeFrom=${dateRangeFrom}`;

    let dateRangeTo = body.dateRangeTo;
    //TODO check this dd-mm-yyyy format
    queryString += `&dateRangeTo=${dateRangeTo}`;

    let a = body.a;
    //TODO check this is a possible value
    queryString += `&a=${a}`;

    let b = body.b;
    //TODO check this is a default one or not
    queryString += `&b=${b}`;

    let c = body.c;
    //TODO check this is a default one or not
    queryString += `&c=${c}`;

    let d = body.d;
    //TODO check this is a default one or not
    queryString += `&d=${d}`;

    let e = body.e;
    //TODO check this is a default one or not
    queryString += `&e=${e}`;

    let f = body.f;
    //TODO check this is a default one or not
    queryString += `&f=${f}`;

    let DateRangeType = body.DateRangeType;
    //TODO check this is a possible value
    queryString += `&DateRangeType=${DateRangeType}`;

    let costOfSalesValue = body.costOfSalesValue;
    //TODO check this is a possible value
    queryString += `&DateRangeType=${costOfSalesValue}`;

    let groupByValue = body.groupByValue;
    //TODO check this is a possible value
    queryString += `&groupByValue=${groupByValue}`;

    let compareValue = body.compareValue;
    //TODO check this is a possible value
    queryString += `&compareValue=${compareValue}`;

    let DisplayDecimalValues = body.DisplayDecimalValues;
    //TODO check this is a possible value

    let GroupByAnalysisCategoryID1 = body.GroupByAnalysisCategoryID1;
    //TODO check this is a possible value
    queryString += `&GroupByAnalysisCategoryID1=${GroupByAnalysisCategoryID1}`;

    let GroupByAnalysisCategoryID2 = body.GroupByAnalysisCategoryID2;
    //TODO check this is a possible value
    queryString += `&GroupByAnalysisCategoryID2=${GroupByAnalysisCategoryID2}`;

    let GroupByAnalysisCategoryID3 = body.GroupByAnalysisCategoryID3;
    //TODO check this is a possible value
    queryString += `&GroupByAnalysisCategoryID3=${GroupByAnalysisCategoryID3}`;

    queryString += `&DisplayDecimalValues=${DisplayDecimalValues}`;

    let budgetValue = body.budgetValue;
    //TODO check this is a possible value (true,false)
    queryString += `&budgetValue=${budgetValue}`;

    if(budgetValue=='true'){
        let budgetIdValue = body.budgetIdValue;
        //TODO check this is a possible value
        queryString += `&budgetIdValue=${budgetIdValue}`;
    }

    let varianceValue = body.varianceValue;
    //TODO check this is a possible value (true,false)
    queryString += `&varianceValue=${varianceValue}`;


    let DisplayReportingGroupDetail = body.DisplayReportingGroupDetail;
    //TODO check this is a possible value (true,false)
    queryString += `&DisplayReportingGroupDetail=${DisplayReportingGroupDetail}`;

    let AnalysisCategoryID1 = body.AnalysisCategoryID1;
    //TODO check this is a possible value
    queryString += `&AnalysisCategoryID1=${AnalysisCategoryID1}`;

    let AnalysisCategoryID2 = body.AnalysisCategoryID2;
    //TODO check this is a possible value
    queryString += `&AnalysisCategoryID2=${AnalysisCategoryID2}`;

    let AnalysisCategoryID3 = body.AnalysisCategoryID3;
    //TODO check this is a possible value
    queryString += `&AnalysisCategoryID3=${AnalysisCategoryID3}`;

    let AccountsExclude = body.AccountsExclude;
    //TODO check this is a possible value
    queryString += `&AccountsExclude=${AccountsExclude}`;


    return {msg:'error',filteredData:queryString};




}
module.exports = ReportController;