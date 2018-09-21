const express = require('express');
const renders = require('./API design checker/renders.js');
const ApiValidationTool = require('./API design checker/parser.js');

var app = express();

app.set('view engine', 'hbs');
//app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    renders.homeHBS(res);
});

app.listen(3000, () => {
    console.log('Server is up on port 3000');
});

app.post('/', function (req, res){
    ApiValidationTool.parseYAML(req, res, renders.homeUploadedHBS);
});