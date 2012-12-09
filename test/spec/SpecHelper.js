beforeEach(function() {
  this.addMatchers({
    toThrowExceptionMatching: function(expected) {
      var result = false;
      var exception;
      if (typeof this.actual != 'function') {
        throw new Error('Actual is not a function');
      }
      try {
        this.actual();
      } catch (e) {
        exception = e;
      }
      if (exception) {
          result = (expected === jasmine.undefined || ( expected instanceof RegExp && expected.test(exception.message) ) || this.env.equals_(exception.message || exception, expected.message || expected) || this.env.equals_(exception.name, expected));
      }

      var not = this.isNot ? "not " : "";

      this.message = function() {
        if (exception && (expected === jasmine.undefined || ( expected instanceof RegExp && !expected.test(exception.message) ) || !this.env.equals_(exception.message || exception, expected.message || expected))) {
          return ["Expected function " + not + "to throw", expected ? expected.name || expected.message || expected : " an exception", ", but it threw", exception.name || exception.message || exception].join(' ');
        } else {
          return "Expected function to throw an exception.";
        }
      };

      return result;
    }
  });
});
