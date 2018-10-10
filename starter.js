const fs = require('fs');
const yaml = require('js-yaml');
const starter = require('./API design checker/checker.js');
const display = require('./API design checker/display.js')

var yamlFilePath = process.argv[2]; 
var yamlFileName = yamlFilePath.substring(yamlFilePath.lastIndexOf('\\')+1);
var result;

try {
    var parsedYAML = yaml.safeLoad(fs.readFileSync(yamlFilePath, 'utf8'));
    var checkedYAML = starter.checker(parsedYAML, yamlFileName);
    result = display.checkedError(yamlFileName, checkedYAML);
} catch (err) {
    result = display.parsingError(yamlFileName,err.message);
};

console.log(result);