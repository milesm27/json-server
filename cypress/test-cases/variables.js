// Outcome Constants
export const expected412Outcome = {
    status: 412,
    message: 'error',
    errorMessage: 'Data validation failed!'
};

export const expected401Outcome = {
    status: 401,
    message: 'error',
    errorMessage: 'Unable to login'
};

export const successfulLoginOutcome = {
    status: 200,
    message: 'success',
    buildVersion: 'v1.7.1',
    token: 'string',
    user: {
        name: 'MANALOTO,LENNYLENE',
        email: 'l.manaloto@servoitsolutions.ph',
        id: '86f440ca-df77-11ee-87f6-00155dab1609'
    },
    device: {
        verified: false
    }
};

export const doubleLoginOutcome = {
    status: 401,
    message: 'error',
    errorMessage: 'Unable to login',
    remarks: 'Account is already logged-in on another device'
};

// Error Messages
export const errorMessages = {
    emptyUsername: [{ remarks: '"username" is not allowed to be empty', field: 'username' }],
    emptySignature: [{ remarks: '"signature" is not allowed to be empty', field: 'signature' }],
    emptyPassword: [{ remarks: '"password" is not allowed to be empty', field: 'password' }],
    missingSignature: [{ remarks: '"signature" is required', field: 'signature' }],
    missingUsername: [{ remarks: '"username" is required', field: 'username' }],
    missingPassword: [{ remarks: '"password" is required', field: 'password' }],
    missingUsernameAndPassword: [
        { remarks: '"username" is required', field: 'username' },
        { remarks: '"password" is required', field: 'password' }
    ],
    missingAll: [
        { remarks: '"username" is required', field: 'username' },
        { remarks: '"password" is required', field: 'password' },
        { remarks: '"signature" is required', field: 'signature' }
    ],
    shortUsername: [{ remarks: '"username" length must be at least 3 characters long', field: 'username' }],
    shortPassword: [{ remarks: '"password" length must be at least 3 characters long', field: 'password' }],
    longUsername: [{ remarks: '"username" length must be less than or equal to 45 characters long', field: 'username' }],
    spaceSignatureError: [{remarks: '"Invalid data signature (username + password). Valid: 5f01f71f3f32742038ed66145599735905725f91d730427ab09ba9fcbf3511f49909063e7f7aa5c682e0d2af5a04f3381e77362cbe609cda09acfdb00beeb28f"'}]
};

// Other Constants
export const longPasswordOutcome = {
    remarks: '"password" length must be less than or equal to 45 characters long',
    field: 'password'
};

export const additionalField = {
    remarks: '"fullname" is not allowed',
    field: 'fullname'
};

export const unregisteredOutcome = {
    remarks: 'Username/Email Address not found!'
};

export const wrongPasswordOutcome = {
    remarks: 'Invalid Password'
};

// Utility Function
export const generateRandomString = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};
