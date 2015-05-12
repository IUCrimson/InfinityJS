InfinityJS.RecordOperation = {};

/**
 * Performs a record operation without prompting the user for a Yes/No
 * confirmation.
 *
 * @param {String} dataFormInstanceId The ID of the data form instance to load.
 * @param {String} recordId The ID of the record being edited.
 * @param {Array} parameters Array of name:value pairs used as parameters: [ { name: 'FIELD1', value: 'Some val' }, ... ]
 */
InfinityJS.RecordOperation.do = function(operationId, recordId, parameters) {
  var promise = InfinityJS.NewPromise();
  WebSvc.recordOperationPerform(operationId, recordId, promise.resolvePromise, promise.resolvePromise, {
    parameters: parameters
  });
  return promise.promise();
};

/**
 * Performs a record operation and prompts the user to confirm first.
 *
 * @param {String} dataFormInstanceId The ID of the data form instance to load.
 * @param {String} recordId The ID of the record being edited.
 * @param {Array} parameters Array of name value pairs used as parameters: [ { name: 'FIELD1', value: 'Some val' }, ... ]
 */
InfinityJS.RecordOperation.doWithConfirm = function(operationId, recordId, parameters) {
  var promise = InfinityJS.NewPromise();

  WebSvc.recordOperationGetPrompt(operationId, recordId, function(prompt) {
    InfinityJS.UI.confirm(prompt.promptText,
      function() {
        InfinityJS.RecordOperation.do(operationId, recordId, parameters).then(promise.resolvePromise);
      },
      promise.resolvePromise);
  }, promise.resolvePromise);

  return promise.promise();
};
