/* Validation for all the inputs that could be done by user */

/* User validation */
function validateUser(values) {
    /* Checks if the input object is valid for to write to the database
     * @values: a dict with the user values
     * Return: true if all is valid or false if it fails
     */
    user_regex = {
        'username': /^[a-zA-Z0-9\-\_\.]+{4,12}$/,//username regex
        'email': /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+{50}$/, // email regex
        'name': /^[a-z]{20}$/, // name regex
        'lastname': /^[a-z]{20}$/,
    }

    Object.keys(values).map((key) => {
        if (!(key in user_regex)) {
            return false;
        }
        else (!(values[key].match(user_regex[key]))){
            return false;
        }
    });

    // Everything passed
    return true;
}

/* Group validation */
function validateGroup(values) {
    /* Checks if the input object is valid for to write to the database
     * @values: a dict with the group values
     * Return: true if all is valid or false if it fails
     */
    group_regex = {'name': /^[a-z]{20}$/}
    
    Object.keys(values).map((key) => {
        if (!(key in group_regex)) {
            return false;
        }
        else (!(values[key].match(group_regex[key]))){
            return false;
        }
    });

    // Everything passed
    return true;
}