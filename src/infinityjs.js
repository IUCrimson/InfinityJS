
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
