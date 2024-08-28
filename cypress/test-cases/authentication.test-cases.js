/// <reference types="cypress" />

import { 
    signature, 
    password, 
    postRequest, 
    username, 
    whitespacepaddingSignature, 
    fullname, 
    unregisteredCredentials, 
    wrongPassword, 
    wrongSignature 
} from '../support/cyRequest.functions';
import { 
    expected412Outcome, 
    expected401Outcome, 
    successfulLoginOutcome, 
    doubleLoginOutcome, 
    unregisteredOutcome, 
    wrongPasswordOutcome, 
    errorMessages, 
    longPasswordOutcome, 
    additionalField, 
    generateRandomString 
} from '../test-cases/variables';
import { validateResponse, checkResponse, logResponseIf412 } from '../support/responseHelpers';

describe('POST Request Test', () => {

    // Consolidated test case for all scenarios expecting a 412 outcome
    it("Handles Expected Status: 412 Outcome Scenarios", () => {
        const testCases = [
            { description: 'Validation for missing username', requestBody: { password, signature }, expectedError: errorMessages.missingUsername },
            { description: 'Validation for missing password', requestBody: { username, signature }, expectedError: errorMessages.missingPassword },
            { description: 'Validation for empty password', requestBody: { username, password: "", signature }, expectedError: errorMessages.emptyPassword },
            { description: 'Validation for missing username and password', requestBody: { signature }, expectedError: errorMessages.missingUsernameAndPassword },
            { description: 'Validation for missing username, password, and signature', requestBody: {}, expectedError: errorMessages.missingAll },
            { description: 'Validation for short username', requestBody: { username: "a", password, signature }, expectedError: errorMessages.shortUsername },
            { description: 'Validation for short password', requestBody: { username, password: "a", signature }, expectedError: errorMessages.shortPassword },
            { description: 'Validation for long username', requestBody: { username: generateRandomString(50), password, signature }, expectedError: errorMessages.longUsername },
            { description: 'Validation for empty username', requestBody: { username: "", password, signature }, expectedError: errorMessages.emptyUsername },
            { description: 'Validation for missing signature', requestBody: { username, password }, expectedError: errorMessages.missingSignature },
            { description: 'Validation for empty signature', requestBody: { username, password, signature: '' }, expectedError: errorMessages.emptySignature },
            { description: 'Validation for whitespace padding signature', requestBody: { username, password, signature: whitespacepaddingSignature }, expectedError: [{ remarks: 'Invalid data signature (username + password). Valid: 5f01f71f3f32742038ed66145599735905725f91d730427ab09ba9fcbf3511f49909063e7f7aa5c682e0d2af5a04f3381e77362cbe609cda09acfdb00beeb28f' }] },
            { description: 'Validation for long password', requestBody: { username, password: generateRandomString(50), signature }, expectedError: [{ remarks: longPasswordOutcome.remarks, field: longPasswordOutcome.field }] },
            { description: 'Validation for additional field', requestBody: { fullname, username, password, signature }, expectedError: [{ remarks: additionalField.remarks, field: additionalField.field }] },
            { description: 'Validation with randomized username, password, and signature', requestBody: { username: generateRandomString(10), password: generateRandomString(10), signature: generateRandomString(64) } }
        ];

        testCases.forEach(({ description, requestBody, expectedError }) => {
            cy.log(`Content: ${JSON.stringify(requestBody)}`);
            cy.log(description);
            postRequest(requestBody).then(response => {
                logResponseIf412(response);

                // Remove the logging of the response body
                cy.log('Expected Error:', JSON.stringify(expectedError));

                const outcome = checkResponse(response, expected412Outcome.status, expected412Outcome.message, expectedError, expected412Outcome);
                cy.log(outcome ? 'Passed' : 'Failed');
                
                // Additional logging for errors
                if (!outcome) {
                    cy.log('Error Details:', JSON.stringify(response.body.data.errors));
                }

                validateResponse(response, expected412Outcome.status, expected412Outcome.message, expectedError, expected412Outcome);
            });
        });
    });

    // Consolidated test case for successful login (200 outcome)
    it("Handles Expected status: 200 Outcome Scenarios", () => {
        const requestBody = { username, password, signature };
        cy.log('Content: ' + JSON.stringify(requestBody));
        cy.log('Successful Login');

        postRequest(requestBody).then(response => {
            // Remove the logging of the response body
            if (response.body.status !== 200) {
                cy.log(`Unexpected Response Status: ${response.body.status}`);
            }

            const outcome = checkResponse(response, successfulLoginOutcome.status, successfulLoginOutcome.message, null);
            cy.log(outcome ? 'Passed' : 'Failed');
            validateResponse(response, successfulLoginOutcome.status, successfulLoginOutcome.message, null);
        });
    });

    // Consolidated test case for scenarios expecting a 401 outcome
    it("Handles Expected status: 401 Outcome Scenarios", () => {
        const testCases = [
            { description: 'Double Login', requestBody: { username, password, signature }, expectedError: [{ remarks: doubleLoginOutcome.remarks }] },
            { description: 'Login with unregistered credentials', requestBody: { username: unregisteredCredentials.username, password: unregisteredCredentials.password, signature: unregisteredCredentials.signature }, expectedError: [{ remarks: unregisteredOutcome.remarks }] },
            { description: 'Wrong Password', requestBody: { username, password: wrongPassword, signature: wrongSignature }, expectedError: [{ remarks: wrongPasswordOutcome.remarks }] }
        ];

        testCases.forEach(({ description, requestBody, expectedError }) => {
            cy.log(`Content: ${JSON.stringify(requestBody)}`);
            cy.log(description);
            postRequest(requestBody).then(response => {
                // Remove the logging of the response body
                if (response.body.status !== 401) {
                    cy.log(`Unexpected Response Status: ${response.body.status}`);
                }

                const outcome = checkResponse(response, expected401Outcome.status, expected401Outcome.message, expectedError, expected401Outcome);
                cy.log(outcome ? 'Passed' : 'Failed');
                
                // Additional logging for errors
                if (!outcome) {
                    cy.log('Error Details:', JSON.stringify(response.body.data.errors));
                }

                validateResponse(response, expected401Outcome.status, expected401Outcome.message, expectedError, expected401Outcome);
            });
        });
    });

    // Additional non-412, non-401, non-200 scenarios
    it("Handles Additional Scenarios", () => {
        // If there are additional test cases, add them here
        // For now, just a placeholder for further extension
    });
});