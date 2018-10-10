const ikeaRules = require('./rules-ikea.js');

var exports = module.exports = {};

exports.checkAllProperties = function(obj, path, errors){

    function iterate(obj, path, errors){
        for (var property in obj) {

            ikeaRules.camelCase(property, path, errors);

            if (typeof obj[property] == 'object') {
                if(/^[0-9]$/i.test(property)){
                    var origin = path + '[' + property + ']';
                } else {
                    var origin = path + '.' + property;
                };
                iterate(obj[property], origin, errors);
            };
        };
    };

    iterate(obj, path, errors);

};

exports.checkBasePath = function(obj, path, errors){
    
    if(!obj.basePath){
        errors.basePath.propertyMissing.items.push(' '+path);
    };
};

exports.checkSecurityDefinitions = function(obj, path, errors){
    
    if(obj.securityDefinitions){
        if (obj.securityDefinitions.constructor == Array) {
            errors.securityDef.notObject.items.push(' .securityDefinitions');
        } else {  
            var secKeys = Object.keys(obj.securityDefinitions);
            
            secKeys.forEach(function(key){

                var secObj = obj.securityDefinitions[key];
                var newPath = path + '.securityDefinitions.' + key;
                var secObjKeys = Object.keys(secObj);
                    
                    secObjKeys.forEach(function(element){
                        var secObjValue = secObj[element];
                        if (!secObjValue) {
                            errors.securityDef.isNull.items.push(' '+newPath);
                        };
                    })

                    if(/^(apikey)$/i.test(secObj.type)) {
                        if (!secObj.type) {
                            errors.securityDef.propertyMissing.items.push(' '+newPath);
                        };
                        if (!secObj.in) {
                            errors.securityDef.propertyMissing.items.push(' '+newPath);
                        };
                        if (!secObj.name) {
                            errors.securityDef.propertyMissing.items.push(' '+newPath);
                        };
                        ikeaRules.authApiKeyHeaders(secObj, newPath, errors);
                    };
            });
        };

    } else {
        if(typeof securityDefinitions == 'object'){
            errors.securityDef.notObject.items.push(' .securityDefinitions');  
        };
    }; 
};

exports.checkProduces = function(obj, path, errors){

    if(obj.produces){
        if(obj.produces.constructor != Array){
            errors.produces.notArray.items.push(' '+path+'.produces');
        } else {
            obj.produces.forEach(function(element, index){
                var newPath = path + '.produces[' + index + ']';
                ikeaRules.mediaTypeVers(element, newPath, errors);
            });
        };
    } else {
        if(typeof obj.produces == 'object'){
            errors.produces.notArray.items.push(' '+path+'.produces');
        };
    };
};

exports.checkPaths = function(obj, path, errors){
    
    if(obj.paths){
        let pathkeys = Object.keys(obj.paths);
        pathkeys.forEach(function(key){
            let pathObj = obj.paths[key];
            let parentNames = path + '.paths.'+ key;

            if(!pathObj) {
                errors.paths.notObject.items.push(' '+parentNames);
            }
            ikeaRules.trailingSlashes(key, parentNames, errors);
            checkIndPaths(pathObj, obj.definitions, parentNames, errors);
        });
    } else {
        errors.paths.noPath.items.push('/paths')
    };
};

function checkIndPaths(indPath, definitions, path, errors) {
    
    for (var property in indPath) {  

        var pathBody = indPath[property];
        var newPath = path + '.' + property;

        //in paths following rules are to apply:
        //must be objects: HTTP methods, responses, externalDocs
        //must be arrays: tags, produces, parameters, security
        //must be strings: summary, description, operationId
        if(/((.parameters)$|(.tags)$|(.security)$|(.produces)$)/i.test(newPath) 
        && (pathBody == null || pathBody.constructor != Array)) {
            errors.paths.notArray.items.push(' '+newPath);
        };
        
        if(/((.responses)$|(.externalDocs)$|(.paths)$|(.get)$|(.post)$|(.put)$|(.delete)$|(.patch)$|(.head)$|(.options)$)/i.test(newPath) 
        && (pathBody == null || pathBody.constructor != Object)) {
            errors.paths.notObject.items.push(' '+newPath);
        };
        
        if(/((.summary)$|(.description)$|(.operationId)$)/i.test(newPath) 
        && (pathBody == null || pathBody.constructor != String)) {
            errors.paths.notString.items.push(' '+newPath);
        };

        if(pathBody && /((.get)$|(.post)$|(.put)$|(.delete)$|(.patch)$|(.head)$|(.options)$)/i.test(newPath) 
        && (!Object.keys(pathBody).includes('responses') || !pathBody.responses)) {
            errors.paths.noResponses.items.push(' '+newPath);
        };   
        
        if (property == 'produces') {
            exports.checkProduces(pathBody, newPath, errors);
        };

        if (property == 'parameters') {
            checkParameters(pathBody, newPath, errors);
        };

        if (path.endsWith('.responses')) {
            checkResponses(pathBody, definitions, newPath, errors);
        };

        if (typeof pathBody == 'object' 
        && !path.endsWith('.parameters') 
        && !path.endsWith('.produces')
        && !path.endsWith('.responses')) {
            var origin = path + '.' + property;
            checkIndPaths(pathBody, definitions, origin, errors);
        };
    };
};

function checkParameters(parameters, path, errors) {

    parameters.forEach(function(parameter, index) {
        
        //parameters are described using following properties
        //must properties: name, location, type or schema
        //optional properties: description, required

        if(parameter.name) {
            var newPath = path + '.' + parameter.name;
        } else {
            var newPath = path + '[' + index + ']';
            errors.parameters.propertyMissing.items.push(' '+newPath);
        };

        var indParamKeys = Object.keys(parameter);
        indParamKeys.forEach(function(element){
            var indParamObj = parameter[element];
            if (!indParamObj) {
                errors.parameters.isNull.items.push(' '+newPath+'.'+element)
            };
        });

        if(!parameter.in) {
            errors.parameters.propertyMissing.items.push(' '+newPath);
        };

        if(!parameter.type && !parameter.schema) {
            errors.parameters.propertyMissing.items.push(' '+newPath);
        };

        ikeaRules.queryParameters(parameter, newPath, errors);
        ikeaRules.headerParameters(parameter, newPath, errors);
    });

};

function checkResponses(indResponse, definitions, path, errors) {

    if(!indResponse) {
        errors.responses.isNull.items.push(' '+path);
    } else {
        
        if((!indResponse.schema || !indResponse.description)) {
            errors.responses.propertyMissing.items.push(' '+path);
        };
    
        if(indResponse.schema && !indResponse.schema.type && !indResponse.schema.$ref) {
            errors.responses.schemaMissing.items.push(' '+path+'.schema');
        };
    
        if(indResponse.schema && indResponse.schema.$ref){
            if(indResponse.schema.$ref.startsWith('#/definitions/')) {
                if(definitions){
                    var defName = indResponse.schema.$ref.split("/")[2];
                    var defKeys = Object.keys(definitions);
                    var defObj = definitions[defName];
                    var defPath = ' /.definitions.' + defName;

                    if(!defKeys.includes(defName)){
                        errors.responses.refInvalid.items.push(' '+path+'.schema.$ref');
                    } else {
                        if(defObj.type){
                            ikeaRules.jsonObjResponses(defObj, defPath, errors);
                        } else {
                            if(typeof defObj.type == 'object' 
                            && !errors.responses.defNotString.items.includes(defPath+'.type')){
                                errors.responses.defNotString.items.push(defPath+'.type');
                            };
                        };
                    };
                };
            } else {
                errors.responses.refNaming.items.push(' '+path+'.schema.$ref');
            };
        }; 
    
        if (indResponse.schema && indResponse.schema.type) {
            ikeaRules.jsonObjResponses(indResponse.schema, path, errors);
        };    
    };
};