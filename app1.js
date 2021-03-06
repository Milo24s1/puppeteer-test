const express =  require('express');
var bodyParser = require('body-parser');
const puppeteer = require("puppeteer");

const app1 = express();

app1.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app1.use(bodyParser.json({limit: '50mb'}));

const port = process.env.PORT || 9999;

app1.listen(port, function(){
    console.log('Server is running on port:', port);
});

app1.get('/',(req, res)=>{

    run(req,res);
});


async function run(req,res) {
    try {
        browser = await puppeteer.launch({
            args: ['--no-sandbox','--disable-setuid-sandbox'],
            headless: true,
            ignoreHTTPSErrors: true
        });

        const page = await browser.newPage();
        await page.goto('http://m.facebook.com/', { ignoreHTTPSErrors: true, timeout: 60000 });
        await page.waitFor(2000);
        const title=await page.evaluate((a) => {
            return document.querySelector('title').text;
        },'test');
        browser.close();
        res.status(200).send(title);
    }
    catch (e) {
        console.log('catch');
        console.log(e);
        res.status(500).send(e);
    }
}