
/// <reference types="cypress" />

import { url, signature, password, postRequest, username, whitespacepaddingSignature, fullname, unregisteredCredentials } from '../support/cyRequest.functions'
import { expected412Outcome, errorMessages, successfulLoginOutcome, generateRandomString, expected401Outcome, doubleLoginOutcome, longPasswordOutcome, additionalField, unregisteredOutcome } from '../test-cases/variables'
import { validateResponse, checkResponse, logResponseIf412 } from '../support/responseHelpers'

describe('POST Request test', () => {

    const runTestCase = (requestBody, expectedOutcome, errorMessage) => {
        cy.log(`Content: ${JSON.stringify(requestBody)}`)

        postRequest(requestBody).then(response => {
            logResponseIf412(response)

            // Check if the response status matches the expected outcome
            const outcome = checkResponse(response, expectedOutcome.status, expectedOutcome.message, errorMessage, expected412Outcome)
            cy.log(outcome ? 'Passed' : 'Failed')

            // Validate response based on the expected outcome
            validateResponse(response, expectedOutcome.status, expectedOutcome.message, errorMessage, expected412Outcome)
        })
    }


    // Scenario 1: Validation for missing username
    it("Validation for missing username", () => {
        const requestBody = { password, signature }
        cy.log('Test case 1.1: Missing Username')
        runTestCase(requestBody, expected412Outcome, errorMessages.missingUsername)
    })

    // Scenario 2: Validation for missing password
    it("Validation for missing password", () => {
        const requestBody = { username, signature }
        cy.log('Test case 1.2: Missing Password')
        runTestCase(requestBody, expected412Outcome, errorMessages.missingPassword)
    })

    // Scenario 3: Validation for empty password
    it("Validation for empty password", () => {
        const requestBody = { username, password: "", signature }
        cy.log('Test case 1.3: Empty Password')
        runTestCase(requestBody, expected412Outcome, errorMessages.emptyPassword)
    })

    // Scenario 4: Validation for missing username and password
    it("Validation for missing username and password", () => {
        const requestBody = { signature }
        cy.log('Test case 1.4: Missing Username and Password')
        runTestCase(requestBody, expected412Outcome, errorMessages.missingUsernameAndPassword)
    })

    // Scenario 5: Validation for missing username, password, and signature
    it("Validation for missing username, password, and signature", () => {
        const requestBody = {}
        cy.log('Test case 1.5: Missing Username, Password, and Signature')
        runTestCase(requestBody, expected412Outcome, errorMessages.missingAll)
    })

    // Scenario 6: Validation for short username
    it("Validation for short username", () => {
        const requestBody = { username: "a", password, signature }
        cy.log('Test case 1.6: Short Username')
        runTestCase(requestBody, expected412Outcome, errorMessages.shortUsername)
    })

    // Scenario 7: Validation for short password
    it("Validation for short password", () => {
        const requestBody = { username, password: "a", signature }
        cy.log('Test case 1.7: Short Password')
        runTestCase(requestBody, expected412Outcome, errorMessages.shortPassword)
    })

    // Scenario 8: Validation with randomized username, password, and signature
    it("Validation with randomized username, password, and signature", () => {
        const randomUsername = generateRandomString(8)
        const randomPassword = generateRandomString(12)
        const randomSignature = generateRandomString(64)

        const requestBody = { username: randomUsername, password: randomPassword, signature: randomSignature }
        cy.log('Test case 1.8: Randomized Username, Password, and Signature')

        postRequest(requestBody).then(response => {
            cy.log(`Server Response Status: ${response.body.status}`)

            const expectedRemarks = response.body.data.errors[0].error.remarks
            const outcome = checkResponse(response, expected412Outcome.status, expected412Outcome.message, [{ remarks: expectedRemarks }], expected412Outcome)
            cy.log(outcome ? 'Passed' : 'Failed')
            validateResponse(response, expected412Outcome.status, expected412Outcome.message, [{ remarks: expectedRemarks }], expected412Outcome)
        })
    })

    // Scenario 9: Validation for long username
    it("Validation for long username", () => {
        const longUsername = generateRandomString(50)
        const requestBody = { username: longUsername, password, signature }
        cy.log('Test case 1.9: Long Username')
        runTestCase(requestBody, expected412Outcome, errorMessages.longUsername)
    })

    // Secnario 10: Validation for empty username
    it("Validation for empty username", () => {
        const requestBody = { username: "", password, signature }
        cy.log('Test case 1.10: Empty Username')
        runTestCase(requestBody, expected412Outcome, errorMessages.emptyUsername)
    })

    // Scenario 11: Validation for missing signature
    it("Validation for missing signature", () => {
        const requestBody = { username, password }
        cy.log("Test case 1.11 : Missing Signature")
        runTestCase(requestBody, expected412Outcome, errorMessages.missingSignature)
    })

    // Scenario 12: Validation for empty signature
    it("Validation for empty signature", () => {
        const requestBody = { username, password, signature: '' }
        cy.log("Test Case 1.12: Empty Signature")
        runTestCase(requestBody, expected412Outcome, errorMessages.emptySignature)
    })

    // Scenario 13: Successful Login
    it("Successful Login", () => {
        const requestBody = { username, password, signature }
        cy.log('Test case 1.13: Successful Login')

        postRequest(requestBody).then(response => {
            if (response.body.status !== 412) {
                cy.log(`Server Response Status: ${response.body.status}`)
            }

            const outcome = checkResponse(response, successfulLoginOutcome.status, successfulLoginOutcome.message, null, expected412Outcome)
            cy.log(outcome ? 'Passed' : 'Failed')
            validateResponse(response, successfulLoginOutcome.status, successfulLoginOutcome.message, null, expected412Outcome) 
        }) 
    }) 

    // Scenario 14: Double Login
    it("Double Login", () => {
        const requestBody = { username, password, signature }
        cy.log('Test case 1.14: Double Login')

        postRequest(requestBody).then(response => {
            if (response.body.status !== 412) {
                cy.log(`Server Response Status: ${response.body.status}`)
            }

            const expectedErrors = [{ remarks: doubleLoginOutcome.remarks }]

            const outcome = checkResponse(
                response,
                doubleLoginOutcome.status,
                doubleLoginOutcome.message,
                expectedErrors,
                expected401Outcome
            )
            cy.log(outcome ? 'Passed' : 'Failed')
            validateResponse(
                response,
                doubleLoginOutcome.status,
                doubleLoginOutcome.message,
                expectedErrors,
                expected401Outcome
            )
        })
    })

    // Scenario 15: Whitespace padding signature
    it("Validation for short username", () => {
        const requestBody = { username, password, whitespacepaddingSignature }
        cy.log('Test case 1.15: Whitespace padding Signature')
        runTestCase(requestBody, expected412Outcome)
    })


    // Scenario 16: Validation for long password
    it("Validation for long password", () => {
        const randomPassword = generateRandomString(50) // Generate a random long password
        const requestBody = { username, password: randomPassword, signature }
        cy.log('Test case 1.16: Validation for long password')

        const expectedErrorMessages = [{ remarks: longPasswordOutcome.remarks, field: longPasswordOutcome.field }]
        runTestCase(requestBody, expected412Outcome, expectedErrorMessages)
    })

    // Scenario 17: Additional field validation 
    it("Validation for additional field validation", () => {
        const requestBody = { fullname, username, password, signature }
        cy.log('Test case 1.17: Validation for Additional Field')

        const expectedErrorMessages = [{ remarks: additionalField.remarks, field: additionalField.field }]
        runTestCase(requestBody, expected412Outcome, expectedErrorMessages)
    })

    // Scenario 18: Login with unregistered credentials
    it("Login with unregistered credentials", () => {
        const requestBody = { username: unregisteredCredentials.username, password: unregisteredCredentials.password, signature: unregisteredCredentials.signature }
        cy.log('Test case 1.18: Login with unregistered credentials')

        postRequest(requestBody).then(response => {
            cy.log(`Server Response Status: ${response.body.status}`) // Log the status

            // Check if the response is 401 or 412 and assert accordingly
            if (response.body.status === 401) {
                const expectedErrorMessages = [{ remarks: unregisteredOutcome.remarks }]
                const outcome = checkResponse(response, expected401Outcome.status, expected401Outcome.message, expectedErrorMessages, expected401Outcome)
                cy.log(outcome ? 'Passed' : 'Failed')
                validateResponse(response, expected401Outcome.status, expected401Outcome.message, expectedErrorMessages, expected401Outcome)
            } else if (response.body.status === 412) {
                // Handle the case when a 412 is returned instead
                const expectedErrorMessages = [{ remarks: 'Unexpected error for unregistered credentials' }]
                const outcome = checkResponse(response, expected412Outcome.status, expected412Outcome.message, expectedErrorMessages, expected412Outcome)
                cy.log(outcome ? 'Passed' : 'Failed')
                validateResponse(response, expected412Outcome.status, expected412Outcome.message, expectedErrorMessages, expected412Outcome)
            } else {
                cy.log(`Unexpected response status: ${response.body.status}`)
            }
        })
    })
})