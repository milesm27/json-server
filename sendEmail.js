require('dotenv').config(); // Load environment variables from .env


const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { generate } = require('mochawesome-report-generator');

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Use environment variable
    pass: process.env.EMAIL_PASS, // Use environment variable
  },
});


// Define the paths to the report files
const reportJsonPath = path.join(__dirname, 'cypress/reports/report.json'); // Update to match your JSON report location
const reportHtmlPath = path.join(__dirname, 'cypress/reports/report.html'); // Ensure this path matches your HTML report location

// Function to generate the HTML report from JSON
const generateHtmlReport = async () => {
  if (fs.existsSync(reportJsonPath)) {
    await generate(reportJsonPath);
  }
};

// Function to check if there are test failures
const checkForFailures = () => {
  if (fs.existsSync(reportJsonPath)) {
    const report = JSON.parse(fs.readFileSync(reportJsonPath, 'utf8'));
    return report.results.some(result => result.stats.failures > 0);
  }
  return false;
};

// Email options
const mailOptions = {
  from: process.env.EMAIL_USER, // Use environment variable
  to: process.env.RECIPIENT_EMAIL, // Use environment variable
  subject: 'Cypress Test Report',
  text: 'Please find the attached Cypress test report.',
  attachments: [
    {
      filename: 'report.html',
      path: reportHtmlPath,
    },
  ],
};

// Function to send the email
const sendEmail = () => {
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Main function to run after tests
const main = async () => {
  await generateHtmlReport(); // Generate HTML report from JSON
  if (checkForFailures()) { // Check if there are failures
    sendEmail(); // Send email with the report
  }
};

main();
