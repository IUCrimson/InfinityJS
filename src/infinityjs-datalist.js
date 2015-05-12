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
