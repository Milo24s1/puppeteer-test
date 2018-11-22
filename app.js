const express =  require('express');
var bodyParser = require('body-parser');
const apiRouter = require('./routes/api');

const app = express();
const port = process.env.PORT || 9999;


app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(bodyParser.json({limit: '50mb'}));
app.set('view engine', 'ejs');


app.use('/api',apiRouter);

app.use(express.static('public'));
app.get('/test',(req,res)=>{
    res.render('test');

});
app.listen(port, function(){

    console.log('Server is running on port:', port);
});




