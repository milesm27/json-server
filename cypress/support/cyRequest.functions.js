/// <reference types="cypress" />

const username = 'l.manaloto'
const fullname = 'test'
const url = "https://dev-backend1.azurewebsites.net/api/v1.0.0/authentication/userCredentials"
const signature = "5f01f71f3f32742038ed66145599735905725f91d730427ab09ba9fcbf3511f49909063e7f7aa5c682e0d2af5a04f3381e77362cbe609cda09acfdb00beeb28f";
const whitespacepaddingSignature = " 5f01f71f3f32742038ed66145599735905725f91d730427ab09ba9fcbf3511f49909063e7f7aa5c682e0d2af5a04f3381e77362cbe609cda09acfdb00beeb28f";
const password = Cypress.env('PASSWORD');
const wrongPassword = 'test123'
const wrongSignature = "7bdc8ad465e3463fa213cab5ff4a56285c7dab55cdc137e0d98db8289499f644fe7df263be80a81bc485d55df23f55336cfa559c3bca1e48d8ca6c8ec4762be5";

const postRequest = (body) => {
  return cy.request({
    method: "POST",
    url,
    body,
    failOnStatusCode: false
  });
  
};


const unregisteredCredentials = {
    username: 'test1',
    password: 'test2',
    signature: 'e7e4d64405f4328243421425b177cc8a615a69e5d76233826d63c0ab1da0f6657c456bea2fa9e7663468af73a87bc5c67b0f39aeb651f2169a7d118bceb7cc3c'
  
}

export { url, signature, whitespacepaddingSignature, password, postRequest, username, fullname,unregisteredCredentials, wrongPassword, wrongSignature };
