module.exports = {
    getError(errors, prop) {
        try {
            return errors.mapped()[prop].msg;
        } catch (err) {
            return '';
        }
    }
}

    // // errors.mapped() === {
    //     email: {
    //         msg: 'Invalid Email'
    //     },
    //     password: {
    //         msg: 'Password too short'
    //     },
    //     passwordConfirmation: {
    //         msg: "Password must match"
    //     }
    // }
