var exports = module.exports = {};

exports.camelCase = function(obj, path, errors) {
    //MUST: Property names must be camelCase (and never snake_case)
    //MUST: Property names must match ^[a-z_][a-z_0-9]+$
    //I've added few things to regex e.g. forward slash, curly braces and digits
    //as swagger v2.0 can have them (in response names)

        if (!/^[a-z0-9\/\\_][a-zA-Z0-9/{}]+$/.test(obj) 
        && !/^[$][Ref]{3}?$/i.test(obj) 
        && !/^[0-9]$/i.test(obj)) {
            errors.general.notCamelCase.items.push(' '+path + '.' + obj);
        };
};

exports.trailingSlashes = function (obj, path, errors) {
    //MUST: Ignore Trailing Slashes
    //to simplify I will check that there isn't a trailing slash

    if (obj.endsWith('/')) {
        errors.paths.trailingSlash.items.push(' '+path);
    };
};

exports.queryParameters = function (obj, path, errors) {
    //MUST: Use camelCase (never snake_case) for Query Parameters
    
    if (obj.in == 'query' && !/^[a-z0-9\/\\_][a-zA-Z0-9/{}]+$/.test(obj.name)) {
        errors.parameters.queryParamsNotCamelCase.items.push(' '+path);
    };
};

exports.headerParameters = function (obj, path, errors) {
    //MUST: Use Hyphenated HTTP Headers
    
    if (obj.in == 'header' && obj.name.includes('_')) {
        errors.parameters.headerParamsNotHyphenated.items.push(' '+path);
    };
};

exports.jsonObjResponses = function (obj, path, errors) {
    //MUST: Always Return JSON Objects As Top-Level Data Structures To Support Extensibility
    
    if (obj.type && obj.type == 'array') {
        errors.responses.jsonObj.items.push(' '+path+'.type');
    };
};

exports.authApiKeyHeaders = function (obj, path, errors) {
    //Client authentication and authorization with API key
    //client ID and optionally a secret (depending on Operation) need to be specified as HTTP headers (and not as query!)

        if (obj.in != 'header') {
            errors.securityDef.notHeader.items.push(' '+path+'.in');
        };
};

exports.mediaTypeVers = function (obj, path, errors) {
    //MUST: Use Media Type Versioning

    if (!obj.includes(';')) {
        errors.produces.noVersioning.items.push(' '+path);
    };
};

