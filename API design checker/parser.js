const formidable = require('formidable');
const fs = require('fs');
const yaml = require('js-yaml');
const ikeaApiDesignRules = require('./rules-ikea-api.js');

var exports = module.exports = {};

exports.parseYAML = function (req, res, cb) {
    var form = new formidable.IncomingForm();
    form.parse(req, function(err, fields, files) {
        
        try {
            var parsedYAML = yaml.safeLoad(fs.readFileSync(files.filetoupload.path, 'utf8'));
            var filename = files.filetoupload.name;
            var checkers = ikeaApiDesignRules.iterate(parsedYAML, '/');
        } catch (err) {
            var filename = "error in parsing_" + files.filetoupload.name;
            var checkers = err.message;
        };

        cb(res, filename, checkers);
    });
};
