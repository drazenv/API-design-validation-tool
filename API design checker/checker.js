const swaggerRules = require('./rules-swagger.js');

var exports = module.exports = {};

exports.checker = function(obj) {
    
    obj = obj || {};

let errors = {
        general: {
            notCamelCase: {items: [], header: 'IKEA API design error at: ', message: 'property names must be camelCase (and never snake_case)'}
        },
        basePath: {
            propertyMissing: {items: [], header: 'IKEA API design error at: ', message: 'should have required property \'basePath\''}
        },
        securityDef: {
            notHeader: {items: [], header: 'IKEA API design error at: ', message: 'should specify client ID and optionally a secret as HTTP header'},
            notObject: {items: [], header: 'schema error at: ', message: 'should be object'},
            propertyMissing: {items: [], header: 'schema error at: ', message: 'should have required property \'name\', \'type\', and \'location\''},
            isNull: {items: [], header: 'schema error at: ', message: 'should not be null.'}
        },
        produces: {
            noVersioning: {items: [], header: 'IKEA API design error at: ', message: 'should use media type versioning'},
            notArray: {items: [], header: 'schema error at: ', message: 'should be array.'}
        },
        paths: {
            trailingSlash: {items: [], header: 'IKEA API design error at: ', message: 'should not include trailing slash'},
            notObject: {items: [], header: 'schema error at: ', message: 'should be object'},
            notString: {items: [], header: 'schema error at: ', message: 'should be string'},
            notArray: {items: [], header: 'schema error at: ', message: 'should be array'},
            noPath: {items: [], header: 'schema error at: ', message: 'should have required property \'paths\''},
            noResponses: {items: [], header: 'schema error at: ', message: 'should have required property \'responses\''}
        },
        parameters: {
            queryParamsNotCamelCase: {items: [], header: 'IKEA API design error at: ', message: 'should use camelCase (never snake_case) for query parameters'},
            headerParamsNotHyphenated: {items: [], header: 'IKEA API design error at: ', message: 'should use hyphenated header parameters'},
            propertyMissing: {items: [], header: 'schema error at: ', message: 'should have required property \'name\', \'location\' and \'type\'/\'schema\''},
            isNull: {items: [], header: 'schema error at: ', missing: 'should not be null'}
        },
        responses: {
            jsonObj: {items: [], header: 'IKEA API design error at: ', message: 'should always return JSON objects as top-level data structures'},
            propertyMissing: {items: [], header: 'schema error at: ', message: 'should have required property \'description\' and \'schema\''},
            schemaMissing: {items: [], header: 'schema error at: ', message: 'should have required property \'type\' or \'$ref\''},
            refNaming: {items: [], header: 'schema error at: ', message: 'should follow naming pattern \'#/definitions/{name}\''},
            isNull: {items: [], header: 'schema error at: ', message: 'should not be null'},
            refInvalid: {items: [], header: 'schema error at: ', message: 'should reference a valid location in the document'},
            defNotString: {items: [], header: 'schema error at: ', message: 'should be a string'},
        }
    };

    swaggerRules.checkAllProperties(obj, './', errors);

    swaggerRules.checkBasePath(obj, './', errors);

    swaggerRules.checkSecurityDefinitions(obj, '/', errors);

    swaggerRules.checkProduces(obj, './', errors);

    swaggerRules.checkPaths(obj, './', errors);

    //handler in case object has other proprerties than the one handled in functions above is not included...
    return errors;
};