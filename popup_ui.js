dialogNum = 0;

/**
 * Converts the given component id, to such that JQuery would relate to as an id 
 *
 * @param      {string}  id      The identifier
 * @return     {string}  The same id, just with a leading '#'
 */
function toJQueryId(id) {
    return '#' + id;
}

/**
 * Adds the advanced options for the general download
 *
 * @param      {string}  parentId  The identifier of the parent component
 */
function addAdvancedOption(parentId) {
    var advancedDivId = "advancedDiv";

    var $advancedDivWarper = $('<div />').appendTo(toJQueryId(parentId));
    var advancedDivWarperId = 'advancedDivWarper';
    $advancedDivWarper.attr('id', advancedDivWarperId);

    var $advancedButton = $('<button />').appendTo(toJQueryId(advancedDivWarperId));
    $advancedButton.attr('type', "button");
    $advancedButton.attr('class', "btn btn-default btn-danger pull-left");
    $advancedButton.attr('data-toggle', "collapse");
    $advancedButton.attr('data-target', toJQueryId(advancedDivId));
    $advancedButton.attr('style', "background:#D9534F;");
    var advanced_str = chrome.i18n.getMessage('advanced');
    $advancedButton.text(advanced_str);

    var $advancedDiv = $('<div />').appendTo(toJQueryId(advancedDivWarperId));
    $advancedDiv.attr('class', "collapse");
    $advancedDiv.attr('id', advancedDivId);

    var $inputGroupDiv = $('<div />').appendTo(toJQueryId(advancedDivId));
    var inputGroupDivId = 'inputGroupDiv';
    $inputGroupDiv.attr('id', inputGroupDivId);
    $inputGroupDiv.attr('class', "input-group");

    var $textBox = $('<input />').appendTo(toJQueryId(inputGroupDivId));
    var textBoxId = 'manSpecTxt'
    $textBox.attr('id', textBoxId);
    $textBox.attr('type', "text");
    $textBox.attr('class', "form-control");
    var manualExtSpec = chrome.i18n.getMessage('manualExtSpec');
    $textBox.attr('placeholder', manualExtSpec);

    var $inputGroupBtnSpan = $('<span />').appendTo(toJQueryId(inputGroupDivId));
    var inputGroupBtnSpanId = 'inputGroupBtnSpan';
    $inputGroupBtnSpan.attr('id', inputGroupBtnSpanId);
    $inputGroupBtnSpan.attr('class', "input-group-btn");

    var $okButton = $('<button />').appendTo(toJQueryId(inputGroupBtnSpanId));
    var okButtonId = "manSpecBtnOK";
    $okButton.attr('id', okButtonId);
    $okButton.attr('class', "btn btn-default");
    $okButton.attr('type', "button");
    var ok_str = chrome.i18n.getMessage('ok');
    $okButton.text(ok_str);

    $(toJQueryId(okButtonId)).click(() => {
        let txtBxValue = $(toJQueryId(textBoxId)).val();
        chrome.runtime.sendMessage({
            extension: txtBxValue,
            is_ext: true
        });
    });
}

/**
 * Creates a bootstrap enable div. This is required so that in case of a name collision
 * in the HTML/CSS classes, our injected code would not affect the rest of the page that
 * the user sees
 *
 * @param      {string}  parentDivId  Identifier of the component the bootstrap
 *                                    enable div would be embeded to
 * @param      {string}  divId        Identifier of the bootstrap div
 */
function createBootstrapEnableDiv(parentDivId, divId) {
    var $boostrapEnableDiv = $('<div />').appendTo(parentDivId);
    $boostrapEnableDiv.attr('id', divId);
    $boostrapEnableDiv.attr('class', 'enable-bootstrap');
}

/**
 * Creates the buttons on the UI embedded on the current tab the user sees
 *
 * @param      {string}  btnPanelId  The button panel identifier, on which the buttons would be placed
 */
function createButtons(btnPanelId) {
    chrome.storage.local.get('rules', (result) => {
        var rules = result.rules;
        for (let rule in rules) {
            let curRuleItem = rules[rule];

            let liId = 'rule_' + rule;
            let $li = $('<li />').appendTo(toJQueryId(btnPanelId));
            $li.attr('id', liId);
            $li.attr('class', "flex-item");
            $li.attr('style', "background: " + curRuleItem.bg_color + ";")

            let $ruleFix = $('<figure />').appendTo(toJQueryId(liId));
            $ruleFix.html('<img src="' + curRuleItem.icon + '" />\
				<figcaption>' + rule + '</figcaption>');

            $(toJQueryId(liId)).click(() => {
                chrome.runtime.sendMessage({
                    selected: rule,
                    is_ext: false
                });
            });
        }
    });
}

/**
 * Creates a buttons panel. The panel on which the buttons with
 * the various file types descriptions would be placed
 *
 * @param      {string}  parentId  The parent identifier, on which the panel would be placed
 */
function createButtonsPanel(parentId) {
    var $ul = $('<ul />').appendTo(toJQueryId(parentId));
    var panelId = 'buttonsPanelId';
    $ul.attr('id', panelId);
    $ul.attr('class', "flex-container");

    var $iconsCopyrightParagraph = $('<p />').appendTo(toJQueryId(parentId));
    $iconsCopyrightParagraph.attr('class', "text-muted text-right");
    $iconsCopyrightParagraph.attr('style', "padding-bottom: 0px; margin-bottom: 0px;");
    var iconcourtesyStr = chrome.i18n.getMessage('iconCourtesy');
    $iconsCopyrightParagraph.html('<small> ' + iconcourtesyStr + ' <a href="https://icons8.com">icons8</a></small>');

    createButtons(panelId);
}

/**
 * Creates a general bootstrap modal div.
 *
 * @param      {string}  parentId             The parent identifier, on which the modal would be embedded
 * @param      {string}  dialogId             Identifier of the dialog component
 * @param      {string}  headerId             Identifier of the header component, which is on the top of the dialog one
 * @param      {string}  bodyId               Identifier of the body component, which is in the middle of the dialog one
 * @param      {string}  footerId             Identifier of the footer component, which is on the bottom of the dialog one
 * @param      {string}  extendedDialogStyle  A string containing any extra style guidances, if any, for the dialog panel
 */
function createModalDiv(parentId, dialogId, headerId, bodyId, footerId, extendedDialogStyle) {
    var $dialogDiv = $('<div />').appendTo(toJQueryId(parentId));
    $dialogDiv.attr('id', dialogId);
    $dialogDiv.attr('class', 'modal fade');
    $dialogDiv.attr('role', 'dialog');

    var $modalDialogDiv = $('<div />').appendTo(toJQueryId(dialogId));
    var modalDialogId = 'modal-dialog_' + dialogNum; // making sure that he id is unique
    $modalDialogDiv.attr('class', 'modal-dialog' + ' ' + extendedDialogStyle);
    $modalDialogDiv.attr('id', modalDialogId);

    var $modalContentDiv = $('<div />').appendTo(toJQueryId(modalDialogId));
    var modalContentId = 'modal-content_' + dialogNum; // making sure that he id is unique
    $modalContentDiv.attr('id', modalContentId);
    $modalContentDiv.attr('class', 'modal-content');

    var $modalHeaderDiv = $('<div />').appendTo(toJQueryId(modalContentId));
    $modalHeaderDiv.attr('id', headerId);
    $modalHeaderDiv.attr('class', 'modal-header');

    var $modalBodyDiv = $('<div />').appendTo(toJQueryId(modalContentId));
    $modalBodyDiv.attr('id', bodyId);
    $modalBodyDiv.attr('class', 'modal-body');

    var $modalFooterDiv = $('<div />').appendTo(toJQueryId(modalContentId));
    $modalFooterDiv.attr('id', footerId);
    $modalFooterDiv.attr('class', 'modal-footer');

    ++dialogNum; // making sure that he id is unique
}

/**
 * Creates a dialog div, the main UI that would be injected into the current tab's context
 *
 * @param      {string}  dialogId  The dialog identifier
 */
function createDialogDiv(dialogId) {
    var modalFooterId = 'dialog_modal-footer';
    var bootstrapEnableId = 'dialog_boostrapEnable';
    var modalHeaderId = 'dialog_modal-header';
    var modalBodyId = 'dialog_modal-body';
    createBootstrapEnableDiv('body', bootstrapEnableId);
    createModalDiv(bootstrapEnableId, dialogId, modalHeaderId, modalBodyId, modalFooterId, '');

    var $closeButton = $('<button />').appendTo(toJQueryId(modalHeaderId));
    $closeButton.attr('type', "button");
    $closeButton.attr('style', "font-size: 30px;");
    $closeButton.attr('class', "close");
    $closeButton.attr('data-dismiss', "modal");
    $closeButton.html('&times;')

    var $headerTitle = $('<span />').appendTo(toJQueryId(modalHeaderId));
    $headerTitle.attr('style', "font-size: 30px;font-family: Arial;");
    var headerTitle = chrome.i18n.getMessage('headerTitle');
    $headerTitle.text(headerTitle);

    createButtonsPanel(modalBodyId);
    addAdvancedOption(modalFooterId);
}

/**
 * @param      {string}   componentId  The identifier of the component
 * @return     {boolean}  True iff the component with the identifier given in componentId exists
 */
function isModalDivExists(componentId) {
    return 0 < $(toJQueryId(componentId)).length;
}

/**
 * Opens a dialog. In case it is not yet injected into the DOM, it first injectes it.
 *
 * @param      {string}  dialogId  Identifier of the dialog component
 */
function openDialog(dialogId) {
    if (!isModalDivExists(dialogId)) {
        createDialogDiv(dialogId);
    }
    $(toJQueryId(dialogId)).modal();
}

/**
 * Closes the dialog.
 * @note       The dialog doesn't really disappear from the DOM, just hidden from the user
 * @param      {<type>}  dialogId  The identifier of the dialog we would like to close
 */
function closeDialog(dialogId) {
    $(toJQueryId(dialogId)).modal("hide");
}

/**
 * Creates a message regarding the abort of the download the user requested
 *
 * @param      {string}  messageAlertId  The message alert component identifier
 */
function createDldAbortedMsg(messageAlertId) {
    var bootstrapEnableId = 'dldAlert_boostrapEnable';
    var modalFooterId = 'dldAlert_modal-footer';
    var modalHeaderId = 'dldAlert_modal-header';
    var modalBodyId = 'dldAlert_modal-body';

    createBootstrapEnableDiv('body', bootstrapEnableId);
    createModalDiv(bootstrapEnableId, messageAlertId, modalHeaderId, modalBodyId, modalFooterId, 'modal-sm');

    var $xCloseButton = $('<button />').appendTo(toJQueryId(modalHeaderId));
    $xCloseButton.attr('type', "button");
    $xCloseButton.attr('class', "close");
    $xCloseButton.attr('data-dismiss', "modal");
    $xCloseButton.html('&times;')

    var $titleH4 = $('<h4 />').appendTo(toJQueryId(modalHeaderId));
    var downloadAbortedTitle = chrome.i18n.getMessage('downloadAbortedTitle');
    $titleH4.text(downloadAbortedTitle);

    var $messagePragraph = $('<p />').appendTo(toJQueryId(modalBodyId));
    var downloadAbortedMessage = chrome.i18n.getMessage('downloadAbortedMessage');
    $messagePragraph.text(downloadAbortedMessage);

    var $closeButton = $('<button />').appendTo(toJQueryId(modalFooterId));
    $closeButton.attr('type', "button");
    $closeButton.attr('class', "btn btn-default");
    $closeButton.attr('data-dismiss', "modal");
    var closeMessage = chrome.i18n.getMessage('close');
    $closeButton.text(closeMessage);
}

/**
 * Shows the dld aborted message. In case it is not yet injected into the DOM, it first injectes it.
 *
 * @param      {string}  dialogId  The identifier of the dialog to be closed once the 
 *                                 abort message is withdrawn
 */
function showDldAbortedMsg(dialogId) {
    var messageAlertId = 'message_alert';
    if (!isModalDivExists(messageAlertId)) {
        createDldAbortedMsg(messageAlertId);
    }

    $(toJQueryId(messageAlertId)).modal();

    $(toJQueryId(messageAlertId)).on('hide.bs.modal', function(e) {
        closeDialog(dialogId);
    });
}
