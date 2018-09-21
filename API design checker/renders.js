var exports = module.exports = {};

exports.homeHBS = function (res) {
    res.render('home.hbs', {
        pageTitle: 'API design checker!!',
        currentYear: new Date().getFullYear(),
    });
};

exports.homeUploadedHBS = function (res, filename, checkers) {
    if (filename.startsWith('error in parsing_')) {
        res.render('home-parsing-failed.hbs', {
            pageTitle: 'API design checker!!',
            currentYear: new Date().getFullYear(),
            uploadedFile: 'Your YAML file: ' + filename.replace('error in parsing_', '') + 
            ' could not be checked due to following formatting errors: "' 
            + checkers + '." Please correct!',
        });
    } else {
        res.render('home-uploaded.hbs', {
            pageTitle: 'API design checker!!',
            currentYear: new Date().getFullYear(),
            uploadedFile: 'Your file: ' + filename + ' has been checked against the follwoing API design guidelines: ',
            checkString1: checkers[0],
            checkString2: checkers[1],
            checkString3: checkers[2],
            checkString4: checkers[3],
            checkString5: checkers[4],
            checkString6: checkers[5],
            checkString7: checkers[6],
            checkString8: checkers[7]
        });
    };
};
