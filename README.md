InfinityJS
==========

InfinityJS is a set of wrappers around BBUI intended to ease access to CRM services from
Custom UIModel or Action Javascript.

## Including
Place `dist/infinityjs.min.js` in your custom HTML folder and include as you would any other Javascript dependency.

### Custom UIModel
```html
<div id="#MAP#MyCustomUIModel">
    ...
</div>

<!--SCRIPT:/browser/htmlforms/custom/js/infinityjs.min.js-->
```

### Custom Actions
```xml
<c:ExecuteCLRAction>
  <c:ScriptIdentifier Url="browser/htmlforms/custom/actions/MyCustomAction.js"
                      ObjectName="MyOrg.Actions.MyCustomAction">

    <c:Dependencies>
      <c:Dependency Url="browser/htmlforms/custom/js/infinityjs.min.js" />
    </c:Dependencies>
  </c:ScriptIdentifier>
</c:ExecuteCLRAction>
```

### In Code
```js
// Full API
var InfinityJS = BBUI.ns('InfinityJS');
```

```js
// Just a piece
var datalist = BBUI.ns('InfinityJS').DataList;
```

## Documentation

### DataList

* [`loadAsObjects`](#loadAsObjects)
* [`load`](#load)
* [`getOutputDefinition`](#getOutputDefinition)

### DataForm

* [`show`](#show)
* [`showAddForm`](#showAddForm)
* [`showEditForm`](#showEditForm)
* [`load`](#load)

### RecordOperation

* [`do`](#do)
* [`doWithConfirm`](#doWithConfirm)

### UI

* [`toast`](#toast)
* [`beginWait`](#beginWait)
* [`endWait`](#endWait)
* [`confirm`](#confirm)
* [`gotoPage`](#gotoPage)
* [`refreshPage`](#refreshPage)
* [`mailTo`](#mailTo)

## DataList

<a name="load" />
### load(dataListId, [contextRecordId], [options])
Loads the results of the specified data list.  Returns the data values only.  Use `getOutputDefiniton`
for column information or `loadAsObjects` to get data back as a collection.

__Arguments__

* `dataListId` - The ID of the data list to load.
* `contextRecordId` - The ID of the data list's context record.
* `options` An object that my contain any of the following properties:
  * `pageRecordId` : The ID of the page's context record where the data list is rendered.
  * `parameterFormSessionId` : The ID of the form session that provides parameters to the data list.
  * `parameters` : An array of objects containing name and value properties used to filter the data list results.
  * `returnFlotData` : A flag indicating the data should be returned in a format readable by flot charts.
  * `returnFormattedValues` : Flag indicating the data list should return formatted values along with the raw values.
  * `scope` : See class description for more information.
  * `userSettingsPath` : The path used as the key to store user information about the data list, such as column sizes or the last filter values used.

__Example__

```js
datalist.load('D38B7630-A6F8-4F87-82C1-CAA49AFC04F5').then(function(result) {
  // result is
  // {
  //    rowCount: 485,
  //    rowCountFormatted:"485",
  //    rows: [
  //      { values: ["3506b24f-ff4e-42a1-9e89-73586f6cb2c2", "A Site", "The best site"] },
  //      ...
  //    ]
  // }  
});
```
---------------------------------------

<a name="loadAsObjects" />
### loadAsObjects(dataListId, [contextRecordId], [options])
Combines [`load`](#load) and [`getOutputDefinition`](#getOutputDefinition) to return the datalist as a
collection of objects.

__Example__

```js
datalist.loadAsObjects('D38B7630-A6F8-4F87-82C1-CAA49AFC04F5').then(function(result) {
  // result is
  // [
  //  { ID: "3506b24f-ff4e-42a1-9e89-73586f6cb2c2", Name: "A Site", Description: "The best site" },
  //  ...
  // ]  
});
```
---------------------------------------

<a name="getOutputDefinition" />
### getOutputDefinition(dataListId, [options])
Promise based wrapper for the WebShellService dataListGetOutputDefinition.

__Example__

```js
datalist.getOutputDefinition('D38B7630-A6F8-4F87-82C1-CAA49AFC04F5').then(function(outputDefinition) {
  // outputDefinition is
  // {
  //    primaryKeyFieldId: "ID",
  //    outputFields: [
  //      { caption: "ID", dataType: 8, displaySequence: 0, fieldId: "ID", isHidden: "true", textAlign: 0 },
  //      ...
  //    ]
  // }  
});
```

## DataForm

<a name="show" />
### show(dataFormInstanceId, [options])
Wraps for `BBUI.pages.Dialogs.showDataForm`.

---------------------------------------

<a name="showAddForm" />
### showAddForm(dataFormInstanceId, [defaultValues])
Wraps `show` without a `recordId`.

__Example__

```js
var addFormId = '00000000-0000-0000-0000-000000000000';
var addFormParameters = [
    { name: 'LASTNAME', value: 'Joe' },
    { name: 'FIRSTNAME', value: 'Miller' }
];

dataform.showAddForm(addFormId, addFormParameters).then(function(result){
  // result is where recordId is the inserted recordId.  
  // Todo: see if return values can be populated.
  // { recordId: "99CEC916-A5F5-47E0-914A-ADE479827DE3",
  //   savedDataFormItemXml: undefined,
  //   dataFormItemKey: undefined,
  //   returnValues: undefined
  // }
});
```

---------------------------------------

<a name="showEditForm" />
### showEditForm(dataFormInstanceId, recordId, [defaultValues])
Wraps `show`, setting the `recordId` in the `options`.

__Example__

```js
var editFormId = '00000000-0000-0000-0000-000000000000',
    recordId = '5a83d78c-2417-4694-8cf3-c5ca1814447e';

dataform.showEditForm(editFormId, recordId).then(function(result){
  // result is
  // { recordId: "5a83d78c-2417-4694-8cf3-c5ca1814447e",
  //   savedDataFormItemXml: undefined,
  //   dataFormItemKey: undefined,
  //   returnValues: undefined
  // }
});
```
---------------------------------------

<a name="load" />
### load
Wraps `BBUI.webshell.Service.dataFormLoad`

__Example__

```js

var viewFormId = '00000000-0000-0000-0000-000000000000',
    recordId = '5a83d78c-2417-4694-8cf3-c5ca1814447e';

dataform.load(viewFormId, recordId).then(function (result) {
  // result is an object representing a single row/view data form result.
  // {
  //   ID: "5a83d78c-2417-4694-8cf3-c5ca1814447e"
  //   DESCRIPTION: "Gifts to this account will be used to support Indiana University."
  //   DESIGNATIONID: "35287a05-6672-4ddb-8345-236ea6e88ed5"
  //   ...
  // }
});

```

## RecordOperation

<a name="do" />
### do(operationId, [recordId], [parameters])
Performs a record operation without prompting the user for a Yes/No confirmation.

__Example__

```js
var recordOperationId = '00000000-0000-0000-0000-000000000000',
    recordId = '00000000-0000-0000-0000-000000000000',
    parameters = [
      {name: 'PARAM1', value: 'Value 1'},
      {name: 'PARAM2', value: 'Value 2'}
    ];

recordoperation.do(recordOperationId, recordId, parameters).then(function(result){
  // result is
  //
});
```
---------------------------------------

<a name="doWithConfirm" />
### doWithConfirm(operationId, [recordId], [parameters])
Same as [`do`](#do) only with a user confirmation first.

## UI

<a name="toast" />
### toast(subject, message)
Triggers a black gritter message.

__Example__

```js
ui.toast('Good job', 'Here is a message.');
```
---------------------------------------

<a name="beginWait" />
### beginWait()
Wrapper for call to `BBUI.forms.Utility.beginWait`

__Example__

```js
ui.beginWait();
```
---------------------------------------

<a name="endWait" />
### endWait()
Wrapper for call to `BBUI.forms.Utility.endWait`

__Example__

```js
ui.endWait();
```
---------------------------------------

<a name="confirm" />
### confirm(message, yesCallback, noCallback)
Creates a yes/no confirmation dialog.

__Example__

```js
ui.confirm('Are you sure?', function(){
  // Yes, they are sure.  
}, function() {
  // No, not sure.
});
```
---------------------------------------

<a name="gotoPage" />
### gotoPage(pageId, [tabId], [recordId], [options])
Navigates to the specified page.

__Example__

```js
// Goes to a Constituent's page.  Change the 3rd recordId parameter to match a real GUID.
ui.gotoPage('88159265-2b7e-4c7b-82a2-119d01ecd40f', null, '62993c2c-9c45-43e4-a40d-986e008fb855');
```
---------------------------------------

<a name="refreshPage" />
### refreshPage()
Refreshes the current page.

__Example__

```js
ui.refreshPage();
```
---------------------------------------

<a name="mailTo" />
### mailTo(address, subject, body)
Opens the users default email client as if they'd clicked a `mailto` link.
Lets you programatically open an email the user will send.

__Example__

```js
ui.mailTo('someperson@email.com', 'My  Email Subject', 'Email body - text only.');
```

## Roadmap
* CodeTable support
* SimpleDataList support
* ListBuilder support (API would look like DataList)
* Hook into Section UI actions such as refresh.
