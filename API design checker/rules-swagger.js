var exports = module.exports = {};

exports.allProperties = function(obj) {

    var allYAMLProperties = [];

    function reiterate(obj) {
        for (var property in obj) { 
            
            if (!/^[0-9]$/.test(property)) {
            allYAMLProperties.push(property);
            };

            if (typeof obj[property] == 'object') {
                reiterate(obj[property]);
            };
        };
    };

    reiterate(obj);

    return allYAMLProperties;
};

exports.onlyBasePath = function(obj) {

    var onlyBasePath = {basePath: []};

    function reiterate(obj) {
        for (var property in obj) { 
            
            if (property == 'basePath') {
                
                obj[property] = obj[property] || [];
                onlyBasePath = {basePath: obj[property]};
            };

            if (typeof obj[property] == 'object') {
                reiterate(obj[property]);
            };
        };
    };

    reiterate(obj);

    return onlyBasePath
};

exports.onlyParameters = function(obj) {

    var Params = [];
    var parsingErrors = '';

    function reiterate(obj, path) {
        
        for (var property in obj) { 

            if (property == 'parameters') {
                
                if (obj[property] == null) {
                    parsingErrors = parsingErrors + 'The following parameters have not been defined properly (null value): ' +
                    path + '. Please correct!'
                } else {
                    
                    if (obj[property].constructor != Array) {
                        parsingErrors = parsingErrors + 'Following parameters have not been defined as an array (using dash "-"): ' + 
                        path + '. Please correct!';
                    } else {
                        obj[property].forEach(function(element) {
                            if (!Object.keys(element).includes('name') || !Object.keys(element).includes('in')) {
                                parsingErrors = parsingErrors + 'Following parameters have not been defined properly' +
                                ' (no location and/or name declared): ' 
                                + path + '.' + element.name + '. Please correct!';
                            } else {
                                Params.push({name: element.name, in: element.in});
                            };
                        });
                    };
                };
            };

            if (typeof obj[property] == 'object') {
                var origin = path + '.' + property;
                reiterate(obj[property], origin);
            };

        };
        
        return {
            Params,
            parsingErrors
        };
    };

    var onlyParams = reiterate(obj, '/');

    //var paramsLoc = onlyParams.Params.map(function(a){return a.in})

    // if (onlyParams.Params.length == 0) {
    //     onlyParams.parsingErrors = onlyParams.parsingErrors + 'No parameters defined.';
    // } else if (!paramsLoc.includes('query')) {
    //     onlyParams.parsingErrors = onlyParams.parsingErrors + 'No query parameters defined.';
    // } else if (!paramsLoc.includes('header')) {
    //     onlyParams.parsingErrors = onlyParams.parsingErrors + 'No header parameters defined.';
    // };

    return onlyParams;
};

exports.onlyResponsesSchema = function(obj) {

    var Resp = [];
    var parsingErrors = '';

    function reiterate(obj, path) {
        
        for (var property in obj) { 

            if (property == 'responses') {
                
                if (obj[property] == null) {
                    parsingErrors = parsingErrors + 'The following responses have not been defined properly (null value): ' +
                    path + '. Please correct!'
                } else {
                    
                    if (obj[property].constructor == Array) {
                        parsingErrors = parsingErrors + 'Following responses have been defined as an array (using dash "-"): ' + 
                        path + '. Please correct!';
                    } else {
                        
                        for (var item in obj[property]) {
                            
                            var newOrigin = path + '.' + item;
                            
                            if (Object.keys(obj[property][item]).includes('schema')) {

                                if (Object.keys(obj[property][item].schema).includes('$ref') &&
                                !obj[property][item].schema.$ref.startsWith('#/definitions/')) {

                                    parsingErrors = parsingErrors + 'Following responses\' references have ' +
                                    ' not been defined properly (incorrect $ref naming - must ' +
                                    'start with \'#/definitions/\'): ' + newOrigin + '. Please correct!' 

                                } else if (Object.keys(obj[property][item].schema).includes('$ref') &&
                                obj[property][item].schema.$ref == null) {
                                    
                                    parsingErrors = parsingErrors + 'Following responses\' references have ' +
                                    ' not been defined properly ($ref declared but null): ' 
                                    + newOrigin + '. Please correct!' 
                                
                                } else if (Object.keys(obj[property][item].schema).includes('type') &&
                                obj[property][item].schema.type == null) {
                                    
                                    parsingErrors = parsingErrors + 'Following responses have ' +
                                    ' not been defined properly (type declared but null): ' 
                                    + newOrigin + '. Please correct!'
                                
                                } else {
                                    Resp.push({name: newOrigin, schema: obj[property][item].schema})
                                };

                            } else {
                                parsingErrors = parsingErrors + 'Following responses have not been defined properly '
                                + '(schema missing): ' + newOrigin + '. Please correct!'
                            };
                        };
                    };
                };
            };

            if (typeof obj[property] == 'object') {
                var origin = path + '.' + property
                reiterate(obj[property], origin);
            };
        };
        
        return {
            Resp,
            parsingErrors
        };
    };

    var onlyResp = reiterate(obj, '/');

    return onlyResp;
};

exports.onlyDefinitionsType = function(obj) {

    var Def = [];
    var parsingErrors = '';

    function reiterate(obj, path) {
        
        for (var property in obj) { 

            if (property == 'definitions') {
                
                newPath = path + '.' + property;

                if (obj[property] == null) {
                    parsingErrors = parsingErrors + 'Definitions (local references) have not been defined properly ' +
                    '(null value): ' + newPath + '. Please correct!'
                } else {
                    
                    if (obj[property].constructor == Array) {
                        parsingErrors = parsingErrors + 'Definitions (local references) have been defined ' +
                        'as an array (using dash "-"): ' + newPath + '. Please correct!';
                    } else {
                        
                        for (var item in obj[property]) {
                            
                            if (Object.keys(obj[property][item]).includes('type')) {
                                Def.push({name: item, type: obj[property][item].type})
                            } else {
                                Def.push({name: item, type: 'object'})
                            };
                        };
                    };
                };
            };

            if (typeof obj[property] == 'object') {
                var origin = path + '.' + property
                reiterate(obj[property], origin);
            };

        };
        
        return {
            Def,
            parsingErrors
        };
    };

    var onlyDef = reiterate(obj, '/');

    return onlyDef;
};

exports.onlyPaths = function(obj) {
    
    var Paths = [];
    var parsingErrors = '';

    function reiterate(obj, path) {
        
        for (var property in obj) {  

            if (property == 'paths') {
                
                var path = path + '.' + property; 

                if (obj[property] == null) {

                    parsingErrors = parsingErrors + 'No path parameters specified!';

                } else {
                    
                    if (obj[property].constructor == Array) {
                    
                        parsingErrors = parsingErrors + 'Paths are defined as an array. Please correct!';

                    } else {

                        for (var item in obj[property]) {

                            Paths.push({name: path +'.' + item, path: item});
                        };
                        
                    };
                };
            };

            if (typeof obj[property] == 'object') {
                var origin = path + '.' + property;
                reiterate(obj[property], origin);
            };
        };

        return {
            Paths,
            parsingErrors
        };
    };

    var onlyPaths = reiterate(obj, '/');

    if(onlyPaths.Paths.length == 0) {
        onlyPaths.parsingErrors = onlyPaths.parsingErrors + 'No paths have been defined!';
    };
    

    return onlyPaths;
};

exports.onlyProduces = function(obj) {
    
    var Produces = [];
    var parsingErrors = '';

    function reiterate(obj, path) {
        
        for (var property in obj) {  

            if (property == 'produces') {
                
                var newPath = path + '.' + property; 

                if (obj[property] == null) {

                    parsingErrors = parsingErrors + 'Produces section (' + newPath + ') not specified!';

                } else {
                    
                    if (obj[property].constructor != Array) {
                    
                        parsingErrors = parsingErrors + 'Produces section (' + newPath 
                        + ') is not defined as an array. Please correct!';

                    } else {
                        
                        obj[property].forEach(function(element) {
                            Produces.push({name: newPath, produces: element});
                        });
                    };
                };
            };

            if (typeof obj[property] == 'object') {
                var origin = path + '.' + property;
                reiterate(obj[property], origin);
            };
        };

        return {
            Produces,
            parsingErrors
        };
    };

    var onlyProduces = reiterate(obj, '/');
    
    if(onlyProduces.Produces.length == 0) {
        onlyProduces.parsingErrors = onlyProduces.parsingErrors + 'No produces section defined!';
    };

    return onlyProduces;
};

exports.onlySecurityDefinitions = function(obj) {
    
    var SecDef = [];
    var parsingErrors = '';

    function reiterate(obj, path) {
        
        for (var property in obj) {  

            if (/^[securitydefinitions]{19}$/i.test(property)) {
                
                var newPath = path + '.' + property; 

                if (obj[property] == null) {

                    parsingErrors = parsingErrors + 'Security definitions are not specified!';

                } else {
                    
                    if (obj[property].constructor == Array) {
                    
                        parsingErrors = parsingErrors + 'Security definitions are specified as' +  
                        + 'an array. Please correct!';

                    } else {
                        
                        for (var element in obj[property]) {
                            
                            var secDefObj = obj[property][element];
                            var newOrigin = newPath + '.' + element;

                            if (Object.keys(secDefObj).includes('in')) {
                                
                                if (secDefObj.in == null) {

                                    parsingErrors = parsingErrors + 'The following security definition: ' 
                                    + newOrigin + ', is not defined properly (location is null). ' +
                                    'Please correct!';

                                } else {
                                    
                                    SecDef.push({name: newOrigin, body: secDefObj});
                                };

                            } else {
                                
                                parsingErrors = parsingErrors + 'The following security definition: ' 
                                + newOrigin + ', is not defined properly (location is missing). ' +
                                'Please correct!';
                            };
                        };
                    };
                };
            };

            if (typeof obj[property] == 'object') {
                var origin = path + '.' + property;
                reiterate(obj[property], origin);
            };
        };

        return {
            SecDef,
            parsingErrors
        };
    };

    var onlySecDef = reiterate(obj, '/');
    
    if(onlySecDef.SecDef.length == 0) {
        onlySecDef.parsingErrors = onlySecDef.parsingErrors + 'No security definitions defined!';
    };

    return onlySecDef;
};

exports.swaggerErrors = function(obj) {

    var swaggerErrors = exports.onlyParameters(obj).parsingErrors + ' ' + 
    exports.onlyResponsesSchema(obj).parsingErrors + ' ' + exports.onlyDefinitionsType(obj).parsingErrors +
    exports.onlyPaths(obj).parsingErrors + exports.onlyProduces(obj).parsingErrors +
    exports.onlySecurityDefinitions(obj).parsingErrors;

    return swaggerErrors;
};