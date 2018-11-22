const express =  require('express');
var bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json({limit: '50mb'}));

const port = process.env.PORT || 9999;

app.listen(port, function(){
    console.log('Server is running on port:', port);
});

app.get('/',(req,res)=>{
    res.send('home');
});