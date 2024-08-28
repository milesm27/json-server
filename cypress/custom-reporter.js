const Mochawesome = require('mochawesome');

class CustomReporter extends Mochawesome {
  constructor(runner, options) {
    super(runner, options);
    runner.on('end', () => {
      const failures = this.stats.failures;
      if (failures > 0) {
        console.log('Test cases failed.');
        // Add logic to trigger the email notification
        require('./sendEmail');
      }
    });
  }
}

module.exports = CustomReporter;
