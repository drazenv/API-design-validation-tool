var exports = module.exports = {};

exports.checkedError = function(file, error){

    message = {};

    var errorKeys = Object.keys(error);

    errorKeys.forEach(function(key){

        for(var element in error[key]){

            if (error[key][element].items.length>0){
                message[key] = 
                    '\n'
                    + error[key][element].header.toUpperCase()
                    + '\n' + error[key][element].items
                    + '\n' + error[key][element].message.toUpperCase();
            };
        };

    });

    var messageKey = Object.keys(message)
    var finalMessageBody = '';

    messageKey.forEach(function(item){
        finalMessageBody = 
        finalMessageBody
        + '\n'
        + message[item];
    });

    var finalMessage = 
    '\n'
    + '########### IKEA API design validation results ###########'
    + '\n\n'
    + 'checked file: ' + file 
    + '\n\n'
    + 'RESULT'
    + '\n'
    + '_________________________________________________________'
    + finalMessageBody
    + '\n'
    + '_________________________________________________________'
    + '\n\n' 
    + 'PLEASE CORRECT'
    + '\n\n'
    + '##########################################################';
    
    return finalMessage
};

exports.parsingError = function(file, error){
    var message = 
        '\n'
        + '########### IKEA API design validation results ###########'
        + '\n\n'
        + 'checked file: ' + file 
        + '\n\n'
        + 'RESULT'
        + '\n'
        + '_________________________________________________________'
        + '\n'
        + 'error in parsing file' 
        + '\n' + error 
        + '\n'
        + '_________________________________________________________'
        + '\n\n' 
        + 'PLEASE CORRECT'
        + '\n\n'
        + '##########################################################';
    return message
};
