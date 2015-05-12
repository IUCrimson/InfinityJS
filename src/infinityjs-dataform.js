InfinityJS.DataForm = {};

/**
 * Wraps for BBUI.pages.Dialogs.showDataForm.
 *
 * @param {String} dataFormInstanceId The ID of the data form instance to load.
 * @param {Object} options (optional) An object that my contain any of the following properties:
 *   recordId : The ID of the record for the data form.
 *	defaultValues : An array of name:value pairs that will be used as the form's default values.
 *   scope : See class description for more information.
 */
InfinityJS.DataForm.show = function(dataFormInstanceId, options) {
  var promise = InfinityJS.NewPromise();

  options = options || {};
  options.confirmCallback = promise.resolvePromise;
  options.cancelCallback = promise.resolvePromise;
  options.returnDataFormItem = true;

  DialogSvc.showDataForm(UiSvc, dataFormInstanceId, options);
  return promise.promise();
};

/**
 * Wraps show without a recordId
 *
 * @param {String} dataFormInstanceId The ID of the data form instance to load.
 * @param {Array} defaultValues An array of name:value pairs that will be used as the form's default values.
 */
InfinityJS.DataForm.showAddForm = function(dataFormInstanceId, defaultValues) {
  return InfinityJS.DataForm.show(dataFormInstanceId, {
    defaultValues: defaultValues
  });
};

/**
 * Wraps show, setting the recordId in the options.
 *
 * @param {String} dataFormInstanceId The ID of the data form instance to load.
 * @param {String} recordId The ID of the record being edited.
 * @param {Array} defaultValues An array of name:value pairs that will be used as the form's default values.
 */
InfinityJS.DataForm.showEditForm = function(dataFormInstanceId, recordId, defaultValues) {
  return InfinityJS.DataForm.show(dataFormInstanceId, {
    recordId: recordId,
    defaultValues: defaultValues
  });
};

/**
 * Wraps BBUI.webshell.Service.dataFormLoad.
 *
 * Loads a data form from the server and passes the {@link BBUI.webshell.servicecontracts.DataFormLoadReply reply object}
 * to the successCallback function.
 *
 * @param {String} dataFormInstanceId The ID of the data form instance to load.
 * @param {String} recordId The ID of the record being loaded.
 */
InfinityJS.DataForm.load = function(dataFormInstanceId, recordId) {
  var promise = InfinityJS.NewPromise();

  var customResolver = function(data) {
    var returnObject = {};

    $.each(data.values, function() {
      returnObject[this.name] = this.value;
    });

    promise.resolvePromise(returnObject);
  };

  WebSvc.dataFormLoad(dataFormInstanceId, customResolver, promise.resolvePromise, {
    recordId: recordId
  });
  return promise.promise();
};

/**
 * Wraps BBUI.webshell.Service.dataFormSave.
 *
 * Saves an add data form on the server and returns the ID.
 *
 * @param {String} dataFormInstanceId The ID of the data form instance to load.
 * @param {String} recordId The ID of the record being edited.
 * @param {Array} values Array of name value pairs: [ { name: 'FIELD1', value: 'Some val' }, ... ]
 */
InfinityJS.DataForm.save = function(dataFormInstanceId, recordId, values) {
  var promise = InfinityJS.NewPromise();

  var options = {
    recordId: recordId,
    values: values
  };

  WebSvc.dataFormSave(dataFormInstanceId, promise.resolvePromise, promise.resolvePromise, options);
  return promise.promise();
};
