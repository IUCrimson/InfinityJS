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
InfinityJS.UI.goToPage = function (pageId, tabId, recordId, options) {
  container.invokePageNavigation({
    mode: 3,
    destinationId: pageId,
    tabId: tabId,
    contextId: recordId,
    options: options
  });
};
