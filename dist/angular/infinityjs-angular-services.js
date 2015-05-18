(function(container) {
  'use strict';

  var InfinityJS = BBUI.ns('InfinityJS');

  angular.module('infinityjs.services', [])
    /**
     * Common logic between services.
     */
    .factory('Common', ['$timeout', function($timeout) {
      var self = this;
      self.refreshUi = function() {
        $timeout(function() {});
      };
      return self;
    }])

  /**
   * Service methods for retrieving DataLists.
   */
  .factory('DataList', ['$timeout', 'Common', function($timeout, Common) {
    var self = this;

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
    self.load = function(dataListId, contextRecordId, options) {
      return InfinityJS.DataList.load(dataListId, contextRecordId, options).then(Common.refreshUi);
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
    self.loadAsObjects = function(dataListId, contextRecordId, options) {
      return InfinityJS.DataList.loadAsObjects(dataListId, contextRecordId, options).then(Common.refreshUi);
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
    self.getOutputDefinition = function(dataListId, options) {
      return InfinityJS.DataList.getOutputDefinition(dataListId, options).then(Common.refreshUi);
    };

    return self;
  }])

  /**
   * Service methods for calling DataForms.
   */
  .factory('DataForm', ['Common', function(Common) {
    var self = this;

    /**
     * Wraps for BBUI.pages.Dialogs.showDataForm.
     *
     * @param {String} dataFormInstanceId The ID of the data form instance to load.
     * @param {Object} options (optional) An object that my contain any of the following properties:
     *   recordId : The ID of the record for the data form.
     *	 defaultValues : An array of name:value pairs that will be used as the form's default values.
     *   scope : See class description for more information.
     */
    self.show = function(dataFormInstanceId, options) {
      return InfinityJS.DataForm.show(dataFormInstanceId, options).then(Common.refreshUi);
    };

    /**
     * Wraps show without a recordId
     *
     * @param {String} dataFormInstanceId The ID of the data form instance to load.
     * @param {Array} defaultValues An array of name:value pairs that will be used as the form's default values.
     */
    self.showAddForm = function(dataFormInstanceId, defaultValues) {
      return InfinityJS.DataForm.show(dataFormInstanceId, {
        defaultValues: defaultValues
      }).then(Common.refreshUi);
    };

    /**
     * Wraps show, setting the recordId in the options.
     *
     * @param {String} dataFormInstanceId The ID of the data form instance to load.
     * @param {String} recordId The ID of the record being edited.
     * @param {Array} defaultValues An array of name:value pairs that will be used as the form's default values.
     */
    self.showEditForm = function(dataFormInstanceId, recordId, defaultValues) {
      return InfinityJS.DataForm.show(dataFormInstanceId, {
        recordId: recordId,
        defaultValues: defaultValues
      }).then(Common.refreshUi);
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
    self.load = function(dataFormInstanceId, recordId) {
      return InfinityJS.DataForm.load(dataFormInstanceId, recordId).then(Common.refreshUi);
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
    self.save = function(dataFormInstanceId, recordId, values) {
      return InfinityJS.DataForm.save(dataFormInstanceId, recordId, values).then(Common.refreshUi);
    };

    return self;
  }])

  /**
   * Service methods for performing RecordOperations.
   */
  .factory('RecordOperation', ['Common', function(Common) {
    var self = this;

    /**
     * Performs a record operation without prompting the user for a Yes/No
     * confirmation.
     *
     * @param {String} dataFormInstanceId The ID of the data form instance to load.
     * @param {String} recordId The ID of the record being edited.
     * @param {Array} parameters Array of name:value pairs used as parameters: [ { name: 'FIELD1', value: 'Some val' }, ... ]
     */
    self.do = function(operationId, recordId, parameters) {
      return InfinityJS.RecordOperation.do(operationId, recordId, parameters).then(Common.refreshUi);
    };

    /**
     * Performs a record operation and prompts the user to confirm first.
     *
     * @param {String} dataFormInstanceId The ID of the data form instance to load.
     * @param {String} recordId The ID of the record being edited.
     * @param {Array} parameters Array of name value pairs used as parameters: [ { name: 'FIELD1', value: 'Some val' }, ... ]
     */
    self.doWithConfirm = function(operationId, recordId, parameters) {
      return InfinityJS.RecordOperation.doWithConfirm(operationId, recordId, parameters).then(Common.refreshUi);
    };

    return self;
  }])

  /**
   * Service methods for going to pages and sections.
   */
  .factory('Navigation', [function() {
    var self = this;

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
    self.goToPage = function (pageId, tabId, recordId, options) {
        InfinityJS.UI.goToPage(pageId, tabId, recordId, options);
    };

    /**
     * Refreshes the current page.
     */
    self.refreshPage = function() {
        InfinityJS.UI.refreshPage();
    };

    return self;
  }]);
}());
