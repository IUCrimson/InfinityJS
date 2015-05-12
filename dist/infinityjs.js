(function(container){ 

 
var InfinityJS = BBUI.ns('InfinityJS'),
  baseUrl,
  databaseName;

// Determine context and pull out the connection info.
if (!container) {
  baseUrl = BBUI.pages.ActionUtility.nav.baseUrl;
  databaseName = BBUI.pages.ActionUtility.nav.databaseName;
} else {
  baseUrl = container.svc.baseUrl;
  databaseName = container.svc.databaseName;
}

// Services being wrapped.
var WebSvc = new BBUI.webshell.Service(baseUrl, databaseName),
  UiSvc = new BBUI.uimodeling.Service.fromSvc(WebSvc),
  DialogSvc = BBUI.pages.Dialogs;

/**
 * Returns a new promise with resolve logic for BBUI calls built in.
 */
InfinityJS.NewPromise = function() {
  var promise = $.Deferred();
  promise.resolvePromise = function(data, error) {
    return error ? promise.reject(error.message) : promise.resolve(data);
  };
  return promise;
};

/**
 * Wraps the default BBUI.xhr GET request in a jQuery promise.
 *
 * Submits an XMLHttpRequest to the specified URL.
 *
 * One difference between this and BBUI.xhr is this will default to a JSON reply instead of XML
 * and you do not specify the callback in the xhr options.
 *
 * @param {String} method The request method (GET or POST).
 * @param {String} url The URL to request.
 * @param {Object} options An object literal containing one or more of the following properties:
 * @return {Object} A jQuery promise (https://api.jquery.com/promise/) (http://api.jquery.com/category/deferred-object/)
 */
InfinityJS.xhr = function(method, url, options) {
  var deferred = $.Deferred();

  options = options || {
    responseFormat: "JSON"
  };

  options.successCallback = function(data) {
    deferred.resolved(data);
  };

  BBUI.xhr(method, url, options);
  return deferred.promise();
};

/**
 * Appends a new stylesheet to the bottom of all stylesheets in the document's HEAD.
 *
 * @param {String} url The href value of the stylesheet element being added.
 */
InfinityJS.addCss = function(url) {
  $("head").last().after("<link rel='stylesheet' href='" + url + "' type='text/css' media='screen'>");
};

/**
 * Appends a new script to the bottom of the page BODY.
 *
 * @param {String} url The href value of the script being added.
 * @param {Function} cb A callback function that is executed if the request succeeds.
 */
InfinityJS.addJs = function(url, cb) {
  return $.getScript(url, cb);
};

/**
 * Returns an object or collection of objects whose
 * property value matches that specified.
 *
 * @param {Array} sourceArray The array of objects to search.
 * @param {String} propertyName The property name to check.
 * @param {Object} propertyValue The value to check for.
 */
InfinityJS.findByProp = function(sourceArray, propertyName, propertyValue) {
  return $.grep(sourceArray, function(item) {
    return item[propertyName] == propertyValue;
  });
};

/**
 * Returns an object or collection of objects whose
 * property value matches that specified.
 *
 * @param {Array} sourceArray The array of objects to search.
 * @param {Array} searchProperties List of name:value pairs to search on.  Does an AND (&&).
 */
InfinityJS.findByProps = function(sourceArray, properties) {
  var results = sourceArray;
  $.each(properties, function(index, prop) {
    results = InfinityJS.findByProp(results, prop.name, prop.value);
  });
  return results;
};

/**
 * Same as findByProp except it returns exactly one object instead of
 * an array of matches.  If multiple matches are found, it will return
 * the first result.
 *
 * @param {Array} sourceArray The array of objects to search.
 * @param {String} propertyName The property name to check.
 * @param {Object} propertyValue The value to check for.
 */
InfinityJS.findOneByProp = function(sourceArray, propertyName, propertyValue) {
  return InfinityJS.findByProp(sourceArray, propertyName, propertyValue)[0];
};

/**
 * Transforms the parameters array in an Action's host object to a single object containing the paramters.
 *
 * host.parameters = [
 *   { name: 'Param1', value: 'foo' },
 *   { name: 'Param2', value: 'bar' }
 * ]
 *
 * becomes
 * {
 *   Param1: 'foo',
 *   Param2: 'bar'
 * }
 *
 * @param {Object} host Required.  The host object that is injected into a Custom Action.
 */
InfinityJS.getHostParameters = function(host) {
  var parameters = {};

  if (!host.parameters)
    return parameters;

  $.each(host.parameters, function(index, param) {
    parameters[param.name] = param.value;
  });

  return parameters;
};

/**
 * Given a UIModel container and field name, will dig out the fields value.
 *
 * @param {object} container The `container` object passed into the Custom UI model.
 * @param {string} fieldName The name of a FormField associated with the UI model.
 * @returns The value given via the form field.
 */
InfinityJS.getFormValue = function(container, fieldName) {
  var filtered = container.createFormResult.formComponent.model.fields.filter(function(f) {
    return f.name === fieldName;
  });
  return filtered && filtered.length ? filtered[0].value : null;
};

/**
 * Returns true if the string is a valid email address.
 * @param {String} emailAddress A string to test.
 */
InfinityJS.IsValidEmailAddress = function(emailAddress) {
  var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(emailAddress);
};

InfinityJS.UI = {};

/**
 * Triggers a black gritter message.
 * @param {string} subject The subject of the message.
 * @param {string} message The message content.
 */
InfinityJS.UI.toast = function(subject, message) {
  BBUI.pages.Dialogs.notify(subject, message, {
    position: 'top-right',
    life: 6000
  });
};

/**
 * Wrapper for call to BBUI.forms.Utility.beginWait
 * Shows the Loading overlay over the whole page.
 */
InfinityJS.UI.beginWait = function() {
  BBUI.forms.Utility.beginWait();
};

/**
 * Wrapper for call to BBUI.forms.Utility.endWait
 * Hides the Loading overlay.
 */
InfinityJS.UI.endWait = function() {
  BBUI.forms.Utility.endWait();
};

/**
 * Creates a yes/no confirmation dialog.
 */
InfinityJS.UI.confirm = function(promptText, yesCallback, noCallback) {
  BBUI.forms.Utility.confirm(promptText, {
    callback: function(promptResult) {
      if (promptResult <= 1)
        yesCallback();
      else
        noCallback();
    }
  });
};

/**
 * Opens the users default email client as if they'd clicked a mailto: link.
 * Lets you programatically open an email the user will send.
 *
 * @param {String} mailTo The email recipient.
 * @param {String} subject Optional. The email subject.
 * @param {String} body Optional. The email body.  HTML is not supported in mailto links.
 *                      Newlines can be put in, but remember to escape them ' \\n '.
 */
InfinityJS.UI.mailTo = function(mailTo, subject, body) {
  window.open('mailto:' + mailTo + '?subject=' + encodeURIComponent(subject) + '&body=' + encodeURIComponent(body));
};

/**
 * Refreshes the current page.
 */
InfinityJS.UI.refreshPage = function() {
  container.invokePageRefresh();
};

/**
 * Navigates to the specified page.
 *
 * @param {String} pageId The ID of the page to which to navigate.
 * @param {String} tabId (optional) The ID of the page tab to focus when the page is loaded.
 * @param {String} recordId (optional) The ID of the record to load for the page.
 * @param {Object} options (optional) An object containing one or more of the following properties:
 *   parameters : An array of objects containing name and value parameters to pass to the page.
 *   parameterTargetSectionId : The ID of the section to wich to apply the parameters.
 */
InfinityJS.UI.goToPage = function(pageId, tabId, recordId, options) {
  container.invokePageNavigation({
    mode: 3,
    destinationId: pageId,
    tabId: tabId,
    contextId: recordId,
    options: options
  });
};

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

InfinityJS.DataList = {};

/**
 * Wraps for the WebShellService dataListLoad.
 *
 * Loads the results of the specified data list and passes the {@link BBUI.webshell.servicecontracts.DataListLoadReply reply object}
 * to the successCallback function.
 *
 * @param {String} dataListId The ID of the data list to load.
 * @param {String} contextRecordId (optional) The ID of the data list's context record.
 * @param {Object} options (optional) An object that my contain any of the following properties:
 *   pageRecordId : The ID of the page's context record where the data list is rendered.
 *   parameterFormSessionId : The ID of the form session that provides parameters to the data list.
 *   parameters : An array of objects containing name and value properties used to filter the data list results.
 *   returnFlotData : A flag indicating the data should be returned in a format readable by flot charts.
 *   returnFormattedValues : Flag indicating the data list should return formatted values along with the raw values.
 *   scope : See class description for more information.
 *   userSettingsPath : The path used as the key to store user information about the data list, such as column sizes or the last filter values used.
 * @returns {Object} DataListLoad result containing the row data for this list.  Does not include column/output def information.
 */
InfinityJS.DataList.load = function(dataListId, contextRecordId, options) {
  var promise = InfinityJS.NewPromise();
  options = options || {};
  options.returnFormattedValues = true;

  WebSvc.dataListLoad(dataListId, contextRecordId, promise.resolvePromise, promise.resolvePromise, options);
  return promise.promise();
};

/**
 * Promise based wrapper for the WebShellService (undocumented) dataListGetOutputDefinition.
 *
 * Loads a data form from the server and passes the {@link BBUI.webshell.servicecontracts.DataFormLoadReply reply object} to the successCallback function.
 *
 * @param {String} dataFormInstanceId The ID of the data form instance to load.
 * @param {Object} options (optional) An object that my contain any BBUI.xhr options
 * @returns {Object} Contains output definition and field info for this data list.
 */
InfinityJS.DataList.getOutputDefinition = function(dataListId, options) {
  var promise = InfinityJS.NewPromise();
  WebSvc.dataListGetOutputDefinition(dataListId, promise.resolvePromise, promise.resolvePromise, options);
  return promise.promise();
};

/**
 * Wraps for the WebShellService dataListLoad and dataListGetOutputDefinition.
 *
 * Loads the results as a named object array.  The property names correspond to the fieldId in the
 * datalist's output definition.
 *
 * @param {String} dataListId The ID of the data list to load.
 * @param {String} contextRecordId (optional) The ID of the data list's context record.
 * @param {Object} options (optional) An object that my contain any of the following properties:
 *   pageRecordId : The ID of the page's context record where the data list is rendered.
 *   parameterFormSessionId : The ID of the form session that provides parameters to the data list.
 *   parameters : An array of objects containing name and value properties used to filter the data list results.
 *   returnFlotData : A flag indicating the data should be returned in a format readable by flot charts.
 *   returnFormattedValues : Flag indicating the data list should return formatted values along with the raw values.
 *   scope : See class description for more information.
 *   userSettingsPath : The path used as the key to store user information about the data list, such as column sizes or the last filter values used.
 * @returns {Object} DataListLoad result containing the row data for this list.  Does not include column/output def information.
 */
InfinityJS.DataList.loadAsObjects = function(dataListId, contextRecordId, options) {
  var promise = InfinityJS.NewPromise();

  $.when(InfinityJS.DataList.load(dataListId, contextRecordId, options),
      InfinityJS.DataList.getOutputDefinition(dataListId))
    .done(function(dataListLoadReply, outputDefinition) {
      var rows = dataListLoadReply.rows;

      var namedResults = [];

      for (var i = 0, j = dataListLoadReply.rowCount; i < j; i++) {
        var namedResult = {};

        for (var k = 0, l = outputDefinition.outputFields.length; k < l; k++) {
          var def = outputDefinition.outputFields[k];
          var val = rows[i].values[k];

          switch (def.dataType) {
            case 1: // Integer
            case 2: // Long
            case 3: // TinyInt
            case 15: // SmallInt
              val = parseInt(val);
              break;
            case 5: // Money
            case 6: // Decimal
              val = parseFloat(val);
              break;
            case 7: // Boolean
              val = val === "True";
          }

          namedResult[def.fieldId] = val;
        }

        namedResults.push(namedResult);
      }

      promise.resolvePromise(namedResults);
    });

  return promise.promise();
};

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
 
 })();