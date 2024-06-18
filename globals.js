module.exports = {
    beforeEach: function (browser, done) {
      done();
    },
  
    afterEach: function (browser, done) {
      if (browser.currentTest.results.errors > 0 || browser.currentTest.results.failed > 0) {
        const testFailure = {
          name: browser.currentTest.name,
          error: browser.currentTest.results.lastError ? browser.currentTest.results.lastError.message : 'Unknown error',
          stackTrace: browser.currentTest.results.lastError ? browser.currentTest.results.lastError.stack : 'No stack trace available',
        };
  
        require('./nightwatch-plugins/test-failure-handler').onTestFailure(testFailure);
      }
      done();
    }
  };
  