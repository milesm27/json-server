/// <reference types="cypress" />

export const validateResponse = (response, status, message, errorMessages, expected412Outcome) => {
    expect(response.body.status).to.eq(status);
    expect(response.body.message).to.eq(message);

    if (errorMessages) {
        // Check if errorMessages is an array
        if (Array.isArray(errorMessages)) {
            // Validate the error message in the response
            expect(response.body.data.error_message).to.eq(expected412Outcome.errorMessage);

            // Validate each error in the response
            response.body.data.errors.forEach((error, index) => {
                expect(error.error.remarks).to.eq(errorMessages[index].remarks);
                expect(error.error.field).to.eq(errorMessages[index].field);
            });
        } else {
            // If errorMessages is an object, validate against it
            expect(response.body.data.error_message).to.eq(errorMessages.errorMessage);

            if (errorMessages.errors) {
                response.body.data.errors.forEach((error, index) => {
                    expect(error.error.remarks).to.eq(errorMessages.errors[index].remarks);
                    expect(error.error.field).to.eq(errorMessages.errors[index].field);
                });
            }
        }
    }
};

export const checkResponse = (response, status, message, errorMessages, expected412Outcome) => {
    const isStatusCorrect = response.body.status === status;
    const isMessageCorrect = response.body.message === message;

    if (errorMessages) {
        const isErrorMessageCorrect = response.body.data.error_message === (errorMessages.errorMessage || expected412Outcome.errorMessage);

        const errorsCorrect = errorMessages.every((expectedError) =>
            response.body.data.errors.some((error) =>
                error.error.field === expectedError.field &&
                error.error.remarks === expectedError.remarks
            )
        );

        return isStatusCorrect && isMessageCorrect && isErrorMessageCorrect && errorsCorrect;
    }

    return isStatusCorrect && isMessageCorrect;
};

export const logResponseIf412 = (response) => {
    if (response.body.status === 412) {
        cy.log(`Server Response Status: ${response.body.status}`);
    }
};
