var exports = module.exports = {};

exports.homeHBS = function (res) {
    res.render('home.hbs', {
        pageTitle: 'API design checker!!',
        currentYear: new Date().getFullYear(),
    });
};

exports.homeUploadedHBS = function (res, filename, ikeaCheck, swaggerCheck) {
    if (filename.startsWith('error in parsing_')) {
        res.render('home-parsing-failed.hbs', {
            pageTitle: 'API design checker!!',
            currentYear: new Date().getFullYear(),
            uploadedFile: 'Your YAML file: ' + filename.replace('error in parsing_', '') + 
            ' could not be checked due to following formatting errors: "' 
            + ikeaCheck + '." Please correct!',
        });
    } else {
        //i need to sort this one too
        res.render('home-uploaded.hbs', {
            pageTitle: 'API design checker!!',
            currentYear: new Date().getFullYear(),
            uploadedFile: 'Here are the results for the file: ' + filename + ':',
            swaggerCheck: swaggerCheck,
            ikeaCheck: ikeaCheck,
        });
    };
};
