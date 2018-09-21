var exports = module.exports = {};

var asciiCheck = [];
var basePathCheck = 'no';
var queryCheck = [];
var headerCheck = [];
var objJSON = [];
var trailingSlash = [];
var mediaType = [];
var clientAPI = [];

var origin = '';
var checkerAscii = '';
var checkerBasePath = '';
var checkerQuery = '';
var checkerQuery1 = '';
var checkerQuery2 = '';
var checkerSlashes = '';
var checkerSlashes1 = '';
var checkerSlashes2 = '';
var checkerObjJSON = '';
var checkerObjJSON1 = '';
var checkerObjJSON2 = '';
var checkerHeader = '';
var checkerHeader1 = '';
var checkerHeader2 = '';
var checkerMediaType = '';
var checkerMediaType1 = '';
var checkerMediaType2 = '';
var checkerClientAPI = '';
var checkerClientAPI1 = '';
var checkerClientAPI2 = '';

function camelCaseASCII(property) {
    //MUST: Property names must be camelCase (and never snake_case)
    //MUST: Property names must match ^[a-z_][a-z_0-9]+$
    //I've added forward slash, curly braces and digits (for the beginning of the name)
    //as swagger v2.0 can have them (in response names)

    if (!/^[a-z0-9\/\\_][a-zA-Z0-9/{}]+$/.test(property)) {
        if (!asciiCheck.includes(" "+property)) {
        asciiCheck.push(" "+property);
        };
    };

    if(asciiCheck.length >0) {
        checkerAscii = 'The following property names are not written in camelCase and/or are not using only ASCII characters: ' 
        + asciiCheck + '. Please correct!';
    } else {
        checkerAscii = 'All property names are written in camelCase and use only ASCII characters. Good job!!';
    };
};

function basePath(property, obj) {
    //MUST: Use base path
    //checking there is a property named basePath + that this propery's value is not empty
    
    if (property == 'basePath' && obj[property]) {
        basePathCheck = 'yes';
    };

    if(basePathCheck == 'yes') {
        checkerBasePath = 'basePath is defined. Good job!';
    } else {
        checkerBasePath = 'basePath is not defined. Please correct!';
    };
};

function booleanNull(property, obj) {
    //MUST: Boolean property values must not be null
    if (typeof obj[property] === "boolean" && /^(true|false)$/.test(obj[property])) {
        //this should be a run-time check...so aborted...
    };
};

function queryParams(property, obj, upper) {
    //MUST: Use camelCase (never snake_case) for Query Parameters
    if (property == 'parameters' ) {

        //if parameters are declared I move the check from undefined to empy
        if(!Object.keys(queryCheck).length) {
            queryCheck.notCamelCase = [];
            queryCheck.notProper = [];
            queryCheck.noQueryParams = [];
        };
        
        try {
            obj[property].forEach(function (element) {
                //basically checking there is no underscore in the name (snake_case)
                if (!element.hasOwnProperty("in") || !element.hasOwnProperty("name")) {
                    if (!queryCheck.notProper.includes(" "+upper)) {
                        queryCheck.notProper.push(" "+upper);
                    };
                } else if (element.in == 'query') {
                    queryCheck.noQueryParams.push(" "+element.name)
                    if (!/^[a-z][a-zA-Z0-9]+$/.test(element.name) && !queryCheck.notCamelCase.includes(" "+element.name)) {
                        queryCheck.notCamelCase.push(" "+element.name);
                    };
                };
            });
        } catch(err) {
            var param = obj[property];
            param = param || [];
            if (param.length == 0) {
                if (!queryCheck.notProper.includes(" "+upper)) {
                    queryCheck.notProper.push(" "+upper);
                };
            };
        };
    };

    if(!Object.keys(queryCheck).length) {
        checkerQuery = 'Your YAML file has no parameters defined.';
    } else if(queryCheck.notCamelCase.length == 0 && queryCheck.notProper.length == 0 
    && queryCheck.noQueryParams.length > 0) {
        checkerQuery = 'All query parameters are written in camelCase and use only ASCII characters. Good job!';
    } else if(queryCheck.noQueryParams.length == 0) {
        checkerQuery = 'Your YAML file has no query parameters defined.';
    } else {
        if (queryCheck.notCamelCase.length > 0) {
            checkerQuery1 = 'The following query parameters are not written in camelCase and/or ' +
            'are not using only ASCII characters: ' + queryCheck.notCamelCase + '.';
        };
        if (queryCheck.notProper.length > 0) {
            checkerQuery2 = 'Parameters for the following operations have not been defined properly ' +
            '(loction and/or name  are not declared): ' +
            queryCheck.notProper + '.';
        };
        checkerQuery = checkerQuery1 + " " + checkerQuery2 + ' Please correct!';
    };
};

function httpHeaders(property, obj, upper) {
    //MUST: Use Hyphenated HTTP Headers
    if (property == 'parameters' ) {
        
        //if parameters are declared I move the check from undefined to empy
        if(!Object.keys(headerCheck).length) {
            headerCheck.notHyphenated = [];
            headerCheck.notProper = [];
            headerCheck.noHeaderParams = [];
        };
        
        try {
            obj[property].forEach(function (element) {
                //basically checking there is no underscore in the name (snake_case)
                if (!element.hasOwnProperty("in") || !element.hasOwnProperty("name")) {
                    if (!headerCheck.notProper.includes(" "+upper)) {
                        headerCheck.notProper.push(" "+upper);
                    };
                } else if (element.in == 'header') {
                    headerCheck.noHeaderParams.push(" "+element.name)
                    if (/_/.test(element.name) && !headerCheck.notHyphenated.includes(" "+element.name)) {
                    headerCheck.notHyphenated.push(" "+element.name);
                    };
                };
            });
        } catch(err) {
            var param = obj[property];
            param = param || [];
            if (param.length == 0) {
                if (!headerCheck.notProper.includes(" "+upper)) {
                    headerCheck.notProper.push(" "+upper);
                };
            };
        };
    };

    if(!Object.keys(headerCheck).length) {
        checkerHeader = 'Your YAML file has no parameters defined.';
    } else if(headerCheck.notHyphenated.length == 0 && headerCheck.notProper.length == 0 
    && headerCheck.noHeaderParams.length > 0) {
        checkerHeader = 'All HTTP headers are hyphenated. Good job!';
    } else if(headerCheck.noHeaderParams.length == 0) {
        checkerHeader = 'Your YAML file has no HTTP headers defined.';
    } else {
        if (headerCheck.notHyphenated.length > 0) {
            checkerHeader1 = 'The following HTTP headers are not hyphenated: ' + headerCheck.notHyphenated + '.';
        };
        if (headerCheck.notProper.length > 0) {
            checkerHeader2 = 'Parameters for the following operations have not been defined properly (loction and name not declared): ' +
            headerCheck.notProper + '.';
        };
        checkerHeader = checkerHeader1 + " " + checkerHeader2 + ' Please correct!';
    };
};

function jsonObjects(property, obj, upper, rObj) {
    //MUST: Always Return JSON Objects As Top-Level Data Structures To Support Extensibility

        if (/responses.*schema$/i.test(upper)) {
            //if responses are declared I move the check from undefined to empy
            //&& obj[property] != null
            if(!Object.keys(objJSON).length) {
                objJSON.notObject = [];
                objJSON.refNotProper = [];
            };

            if (/type/i.test(property)) {

                if (obj[property] == 'array') {
                    if (!objJSON.notObject.includes(" "+upper)) {   
                    objJSON.notObject.push(" "+upper);
                    };
                } else if (!obj[property] && !objJSON.refNotProper.includes(" "+upper)) {
                    objJSON.refNotProper.push(" "+upper);
                };

            } else if (/[$]Ref/i.test(property)) {
            //NOTE: this will only work for local references I guess - so all YAML files that are uploaded must be RESOLVED!!
            //NOTE: so this needs to be added to the requirements

                var reff = reff || ''
                //splitting the reference into an array of elements 
                //(e.g #/definitions/Error -> [definitions, Error])
                if (obj[property].startsWith('#/definitions/')) {

                    var refr = obj[property].substr(2, obj[property].length).split("/");
                    
                    if (refr[1].length == 0) {
                        if (!objJSON.refNotProper.includes(" "+upper)) {
                            objJSON.refNotProper.push(" "+upper);
                        };
                    };

                    function newiterate(newObj, reff) {
                        for (var elem in newObj) {
    
                            if (elem == refr[0] && typeof newObj[elem] == 'object') {
                                reff = reff+'.'+elem
                                newiterate(newObj[elem], reff);
                            };
                            
                            if (elem == refr[1] && typeof newObj[elem] == 'object') {
                                reff = reff+'.'+elem
                                newiterate(newObj[elem], reff);
                            };
                            
                            if (elem == 'type' && newObj[elem] == 'array' && !objJSON.notObject.includes(" "+reff)) {
                                objJSON.notObject.push(" "+reff);
                            };

                            //if type is null, or undefined or empty etc...
                            if (elem == 'type' && !newObj[elem] && !objJSON.refNotProper.includes(" "+reff)) {
                                objJSON.refNotProper.push(" "+reff);
                            };
                        };
                    };
    
                    newiterate(rObj, '/');

                } else {
                    if (!objJSON.refNotProper.includes(" "+upper)) {
                        objJSON.refNotProper.push(" "+upper);
                    };
                };
            };
        };

    if(!Object.keys(objJSON).length) {
        checkerObjJSON = '';
    } else if (objJSON.notObject == 0 && objJSON.refNotProper == 0) {
        checkerObjJSON = 'All responses are returning JSON object as top level data structure. Good job!!';
    } else {
        if (objJSON.notObject.length > 0) {
            checkerObjJSON1 = 'The following responses are returning an array as top level data structure: ' 
            + objJSON.notObject + '.'
        };
        if (objJSON.refNotProper.length > 0) {
            checkerObjJSON2 = 'The following responses have invalid local reference '
            + '("#/definitions/" omitted or invalid reference): ' 
            + objJSON.refNotProper + '.'
        };

        checkerObjJSON = checkerObjJSON1 + ' ' + checkerObjJSON2 + ' Please correct!'
    };
};

function trailingSlashes(property, obj) {
    //MUST: Ignore Trailing Slashes
    if (/^[paths]{4,5}?$/i.test(property)) {
        
        //if paths are declared I move the check from undefined to empy
        if(!Object.keys(trailingSlash).length && obj[property] != null) {
            trailingSlash.notObject = [];
            trailingSlash.slash = [];
        };

        try {
            obj[property].forEach(function(element) {
                if (!trailingSlash.notObject.includes(" "+element)) {
                    trailingSlash.notObject.push(" "+element);
                };
            });
        } catch(err) {
            
            for (var key in obj[property]) {
                //It would also need to be a runtime check so to simplify I will check that there isn't a trailing slash
                if (obj[property].hasOwnProperty(key) && key.endsWith('/')) {
                    if (!trailingSlash.slash.includes(" "+key)) {
                    trailingSlash.slash.push(" "+key);
                    };
                };
            };
        };
    };

    if(!Object.keys(trailingSlash).length) {
        checkerSlashes = 'Your API does not define any paths. Please correct!';
    } else if(trailingSlash.notObject.length == 0 && trailingSlash.slash.length == 0) {
        checkerSlashes = 'No paths include trailing slashes. Good job!';
    } else {
        if (trailingSlash.notObject.length > 0) {
            checkerSlashes1 = 'Your paths are formatted as a list (using dash "-" sign). Please correct!';
        };
        if (trailingSlash.slash.length > 0 && trailingSlash.notObject.length == 0) {
            checkerSlashes2 = 'The following paths include trailing slashes: ' + trailingSlash.slash + '.';
        };
        
        checkerSlashes1 + ' ' + checkerSlashes2 + ' Please correct!'
    };
    
    // } else if(trailingSlash.notObject.length > 0 && trailingSlash.slash.length == 0) {
    //     checkerSlashes = 'Your paths are formatted as a list (using dash "-" sign). Please correct!';
    // } else if(trailingSlash.slash.length > 0 && trailingSlash.notObject.length == 0) {
    //     checkerSlashes = 'The following paths include trailing slashes: ' + trailingSlash.slash + '. Please correct!';
    // } else if(trailingSlash.slash.length > 0 && trailingSlash.notObject.length > 0) {
    //     checkerSlashes = 'Your  paths are formatted as a list (using dash "-" sign). ' + 
    //     'The following paths include trailing slashes: ' + trailingSlash.slash + '. Please correct';
    // } else {
    //     checkerSlashes = 'No paths include trailing slashes. Good job!';
    // };
};

function mediaTypeVersioning(property, obj, upper) {
    //MUST: Use Media Type Versioning
    if (property == 'produces') {
        
        //if response media type is declared I move the check from undefined to empy
        if(!Object.keys(mediaType).length) {
            mediaType.noMediaType = [];
            mediaType.notAList = [];
        };

        try {
            obj[property].forEach(function (element) {

                //basically checking the lack of response media type versioning, i.e. that there is no semicolon
                if (!/;/.test(element)) {
                    if (!mediaType.noMediaType.includes(" "+upper+"."+property)) {

                        mediaType.noMediaType.push(" "+upper+"."+property);
                    };
                };
            });
        } catch(err) {
            if (!mediaType.notAList.includes(" "+upper+"."+property)) {
                mediaType.notAList.push(" "+upper+"."+property);
            };
        };
    };

    if(!Object.keys(mediaType).length) {
        checkerMediaType = 'Your API does not define the media response format. Please correct!';
    } else if(mediaType.noMediaType.length == 0 && mediaType.notAList.length == 0) {
        checkerMediaType = 'All responses include media type versioning.';
    } else {
        if(mediaType.noMediaType.length > 0) {
            checkerMediaType1 = 'The following responses do not include media type versioning: ' 
            + mediaType.noMediaType + '.';
        };
        if(mediaType.notAList.length > 0) {
            checkerMediaType2 = 'The following responses are not defined as a list: ' + mediaType.notAList + '.'
        };
        
        checkerMediaType = checkerMediaType1 + ' ' + checkerMediaType2 + ' Please correct!'
    };
    
    // else if(mediaType.noMediaType.length > 0 && mediaType.notAList.length == 0) {
    //     checkerMediaType = 'The following responses do not include media type versioning: ' + mediaType.noMediaType + '.';
    // } else if(mediaType.notAList.length > 0 && mediaType.noMediaType.length == 0) {
    //     checkerMediaType = 'The following responses are not defined as a list: ' + mediaType.notAList + '. Please correct';
    // } else if(mediaType.noMediaType.length > 0 && mediaType.notAList.length > 0) {
    //     checkerMediaType = 'The following responses do not include media type versioning: ' + mediaType.noMediaType + 
    //     '. The following responses are not defined as a list: ' + mediaType.notAList + '. Please correct';
    // } else {
    //     checkerMediaType = 'All responses include media type versioning.';
    // };
};

function clientAuthHeaders(property, obj, upper) {
    //Client authentication and authorization with API key
    //client ID and optionally a secret (depending on Operation) need to be specified as HTTP headers (and not as query!)
    //this basically means to check if there is securitydefinitions declared 
    //and that all params there have header specified as their location

    if (/^[securitydefinitions]{19}$/i.test(property) && obj[property]) {
        if(!Object.keys(clientAPI).length) {
            clientAPI.notProper = [];
            clientAPI.notHeader = [];
        };

        function anotherIteration(property, upper) {
            for (var elems in property) {
                
                if (typeof property[elems] == 'object') {
                    
                    pathT = upper + "." + elems;

                    try {
                        //this will throw an error if location property is declared but empty - 
                        //meaning the security definition is not declared properly
                        if (!Object.keys(property[elems]).includes('in')) {

                            if (!clientAPI.notProper.includes(" "+pathT)) {
                                clientAPI.notProper.push(" "+pathT);
                            };
                        } else {
                            anotherIteration(property[elems], pathT);
                        };
                    } catch (err) {
                        if (!clientAPI.notProper.includes(" "+upper)) {
                            clientAPI.notProper.push(" "+upper);
                        };
                    };


                } else if (elems == 'in' && property[elems] != 'header' && !clientAPI.notHeader.includes(" "+pathT)) {
                    clientAPI.notHeader.push(" "+pathT);
                };
            };
        };

        if (typeof obj[property] == 'object') {
            var pathT = upper + "." + property;
            anotherIteration(obj[property], pathT);
        };

    };

    if(!Object.keys(clientAPI).length) {
        checkerClientAPI = 'Your YAML file has no security definitions defined.';
    } else if(clientAPI.notHeader.length == 0 && clientAPI.notProper.length == 0) {
        checkerClientAPI = 'All security definitions use HTTP headers. Good job!';
    } else {
        if (clientAPI.notHeader.length > 0) {
            checkerClientAPI1 = 'The following security definitions do not use HTTP headers: ' 
            + clientAPI.notHeader + '.';
        };
        if (clientAPI.notProper.length > 0) {
            checkerClientAPI2 = 'The following security definitions are not defined properly '
            + '(location empty or not declared): ' + clientAPI.notProper + '.';
        };
        checkerClientAPI = checkerClientAPI1 + ' ' + checkerClientAPI2 + ' Please correct!';
    };
};

exports.iterate = function (obj, upper) {
    
    asciiCheck = [];
    basePathCheck = 'no';
    queryCheck = [];
    headerCheck = [];
    objJSON = [];
    trailingSlash = [];
    mediaType = [];
    clientAPI = [];

    origin = '';
    checkerAscii = '';
    checkerBasePath = '';
    checkerQuery = '';
    checkerQuery1 = '';
    checkerQuery2 = '';
    checkerSlashes = '';
    checkerSlashes1 = '';
    checkerSlashes2 = '';
    checkerObjJSON = '';
    checkerObjJSON1 = '';
    checkerObjJSON2 = '';
    checkerHeader = '';
    checkerHeader1 = '';
    checkerHeader2 = '';
    checkerMediaType = '';
    checkerMediaType1 = '';
    checkerMediaType2 = '';
    checkerClientAPI = '';
    checkerClientAPI1 = '';
    checkerClientAPI2 = '';

    const rObj = obj;

    function reiterate(obj, upper, rObj) {

        for (var property in obj) {

            //skip one iteration if property name is a $ref (e.g in case of domain refs)
            //or if property name is one digit - this happens in case of an arrray containing objects
            if (!/^[0-9]$/.test(property)) {

                if (!/^[$][Ref]{3}?$/i.test(property)) {

                    camelCaseASCII(property);

                    basePath(property, obj);
    
                    booleanNull(property, obj);
    
                    queryParams(property, obj, upper);
    
                    httpHeaders(property, obj, upper);
    
                    trailingSlashes(property, obj);

                    mediaTypeVersioning (property, obj, upper);

                    clientAuthHeaders(property, obj, upper)

                };

                //for this rule I need to loop through $Ref too
                jsonObjects(property, obj, upper, rObj);

            };

            // if property's value is of type object, do the iteration on it too 
            if (typeof obj[property] == "object") {
                origin = upper+"."+property;
                reiterate(obj[property], origin, rObj);
            };
        };
    };

    reiterate (obj, upper, rObj)
    
    var checkers = [checkerAscii, checkerBasePath, checkerQuery, checkerSlashes, 
                    checkerObjJSON, checkerHeader, checkerMediaType, checkerClientAPI];
    return checkers

};
