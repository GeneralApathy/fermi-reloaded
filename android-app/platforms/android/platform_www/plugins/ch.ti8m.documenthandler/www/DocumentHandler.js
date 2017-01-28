cordova.define("ch.ti8m.documenthandler.DocumentHandler", function(require, exports, module) {
var myFunc = function (
  successHandler, 
  failureHandler, 
  url) {
  cordova.exec(
      successHandler, 
      failureHandler, 
      "DocumentHandler", 
      "HandleDocumentWithURL", 
      [{"url" : url}]);
};

window.handleDocumentWithURL = myFunc;

if(module && module.exports) {
  module.exports = myFunc;
}


});
