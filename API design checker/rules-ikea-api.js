const swaggerApiDesignRules = require('./rules-swagger.js')

var exports = module.exports = {};

function camelCase(obj) {
    //MUST: Property names must be camelCase (and never snake_case)
    //MUST: Property names must match ^[a-z_][a-z_0-9]+$
    //I've added few things to regex e.g. forward slash, curly braces and digits
    //as swagger v2.0 can have them (in response names)

    var asciiCheck = [];
    var target = swaggerApiDesignRules.allProperties(obj);

    target.forEach(function(element) {
        if (!/^[a-z0-9\/\\_][a-zA-Z0-9/{}]+$/.test(element) && !/^[$][Ref]{3}?$/i.test(element)) {
            if (!asciiCheck.includes(' '+element)) {
                asciiCheck.push(' '+element);
            };
        };
    });

    return asciiCheck;
};

function basePath(obj) {
    //MUST: Use base path
    //checking there is a property named basePath + that this property's value is not empty

    var basePathCheck = 'no';
    var target = swaggerApiDesignRules.onlyBasePath(obj);

    if (target && target.basePath.length > 0) {
        basePathCheck = 'yes';
    };

    return basePathCheck;
};

function queryParameters(obj) {
    //MUST: Use camelCase (never snake_case) for Query Parameters

    var queryParamsCheck = [];
    var target = swaggerApiDesignRules.onlyParameters(obj).Params;

    target.forEach(function(element) {
        
        if (element.in == 'query') {
            if (!/^[a-z0-9\/\\_][a-zA-Z0-9/{}]+$/.test(element.name) 
            && !/^[$][Ref]{3}?$/i.test(element.name) && !queryParamsCheck.includes(' '+element.name)) {
                queryParamsCheck.push(' '+element.name);
            };
        };
    });

    return queryParamsCheck;

};

function headerParameters(obj) {
    //MUST: Use Hyphenated HTTP Headers

    var headerParamsCheck = [];
    var target = swaggerApiDesignRules.onlyParameters(obj).Params;

    target.forEach(function(element) {
        
        if (element.in == 'header') {
            if (element.name.includes('_') && !headerParamsCheck.includes(' '+element.name)) {
                headerParamsCheck.push(' '+element.name);
            };
        };
    });

    return headerParamsCheck;

};

function jsonObjResponses(obj) {
    //MUST: Always Return JSON Objects As Top-Level Data Structures To Support Extensibility

    var jsonObjCheck = [];
    var target = swaggerApiDesignRules.onlyResponsesSchema(obj).Resp;
    var targetRef = swaggerApiDesignRules.onlyDefinitionsType(obj).Def

    target.forEach(function(element) {

        var elementSchema = element.schema;

        if (Object.keys(elementSchema).includes('type')) {

            if (elementSchema.type == 'array' && !jsonObjCheck.includes(' '+element.name)) {
                jsonObjCheck.push(' '+element.name);
            };

        } else {

            var locRefName = elementSchema.$ref.split("/")[2];

            targetRef.forEach(function(elementRef) {
                
                if (elementRef.name == locRefName && elementRef.type == 'array' && !jsonObjCheck.includes(' '+element.name)) {
                    jsonObjCheck.push(' '+element.name);
                };
            });
        };
    });

    return jsonObjCheck
};

function trailingSlashes(obj) {
    //MUST: Ignore Trailing Slashes
    //to simplify I will check that there isn't a trailing slash
    
    var trailingSlashCheck = [];
    var target = swaggerApiDesignRules.onlyPaths(obj).Paths;

    target.forEach(function(element) {

        if (element.path.endsWith('/') && !trailingSlashCheck.includes(' '+element.name)) {
            trailingSlashCheck.push(' '+element.name);
        };
    });

    return trailingSlashCheck;

};

function mediaTypeVersioning(obj) {
    //MUST: Use Media Type Versioning
    //checking the lack of response media type versioning, i.e. that there is no semicolon

    var mediaTypeVersCheck = [];
    var target = swaggerApiDesignRules.onlyProduces(obj).Produces;

    target.forEach(function(element) {

        if (!element.produces.includes(';') && !mediaTypeVersCheck.includes(' '+element.name)) {
            mediaTypeVersCheck.push(' '+element.name);
        };
    });

    return mediaTypeVersCheck;
};

function clientAuthorisation(obj) {
    //Client authentication and authorization with API key
    //client ID and optionally a secret (depending on Operation) need to be specified as HTTP headers (and not as query!)
    //this basically means to check if there is securitydefinitions declared 
    //and that all params there have header specified as their location

    var clientAuthCheck = [];
    var target = swaggerApiDesignRules.onlySecurityDefinitions(obj).SecDef;

    target.forEach(function(element) {

        var secDefBody = element.body
        if (secDefBody.in != 'header' && !clientAuthCheck.includes(' '+element.name)) {
            clientAuthCheck.push(' '+element.name);
        };
    });

    return clientAuthCheck;
};

exports.checkIKEARules = function (obj) {

    var camelCaseRule = camelCase(obj);
    var basePathRule = basePath(obj);
    var queryParametersRule = queryParameters(obj);
    var headerParametersRule = headerParameters(obj);
    var jsonObjResponsesRule = jsonObjResponses(obj);
    var trailingSlashesRule = trailingSlashes(obj);
    var mediaTypeVersioningRule = mediaTypeVersioning(obj);
    var clientAuthorisationRule = clientAuthorisation(obj);

    if (camelCaseRule.length == 0) {
        var asciiCheck = '';
    } else {
        var asciiCheck = '//MUST: Property names must be camelCase (and never snake_case)// The following property names ' +
        'are not written in camelCase and/or are not using only ASCII characters: ' 
        + camelCaseRule + '. Please correct!';
    };

    if (basePathRule = 'yes') {
        basePathCheck = '';
    } else {
        basePathCheck = '//MUST: Use base path// Base path is not defined! Please correct!';
    };

    if (queryParametersRule.length == 0) {
        var queryParamsCheck = ''
    } else {
        var queryParamsCheck = '//MUST: Use camelCase (never snake_case) for Query Parameters// The following query parameters are not written in camelCase and/or ' +
        'are not using only ASCII characters: ' + queryParametersRule + '. Please correct!'
    };

    if (headerParametersRule.length == 0) {
        var headerParamsCheck = ''
    } else {
        var headerParamsCheck = '//MUST: Use Hyphenated HTTP Headers// The following header parameters are not hyphenated: ' +
        headerParametersRule + '. Please correct!'
    };

    if (jsonObjResponsesRule.length == 0) {
        var jsonObjCheck = ''
    } else {
        var jsonObjCheck = '//MUST: Always Return JSON Objects As Top-Level Data Structures To Support Extensibility// ' +
        'The following responses are returning an array as top level data structure' + jsonObjResponsesRule 
        + '. Please correct!'
    };

    if (trailingSlashesRule.length == 0) {
        var slashesCheck = '';
    } else {
        var slashesCheck = '//MUST: Ignore Trailing Slashes// The follwoing paths include a trailing slash: ' +
        trailingSlashesRule + '. Please correct!';
    };

    if (mediaTypeVersioningRule.length == 0) {
        var mediaTypeVersCheck = '';
    } else {
        var mediaTypeVersCheck = '//MUST: Use Media Type Versioning// The following responses ' +
        'do not include media type versioning:' + mediaTypeVersioningRule + '.';
    };

    if (clientAuthorisationRule.length == 0) {
        var clientAuthCheck = '';
    } else {
        var clientAuthCheck = 'The following security definitions do not use HTTP headers: ' + 
        clientAuthorisationRule + '. Please correct!';
    };

    var checkers = asciiCheck + '\r\n' + basePathCheck + '\r\n' + queryParamsCheck + '\r\n' 
                + headerParamsCheck + '\r\n' + jsonObjCheck + '\r\n' + slashesCheck + '\r\n' 
                + mediaTypeVersCheck + '\r\n' + clientAuthCheck;
    
    return checkers;

};