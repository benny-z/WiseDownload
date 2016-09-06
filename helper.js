function toJQueryId(id) {
	return '#' + id;
}

function addAdvancedOption(componentId) {
	var $div = $('<div />').appendTo(toJQueryId(componentId));
	$div.html('<button type="button" class="btn btn-info" data-toggle="collapse" data-target="#advancedDiv">\
		Advanced\
		</button>\
    <div id="advancedDiv" class="collapse">\
      <div class="input-group">\
          <input type="text" class="form-control" placeholder="Search for...">\
          <span class="input-group-btn">\
            <button class="btn btn-default" type="button">Go!</button>\
          </span>\
      </div>\
    </div>');
}

function createDialogDiv(dialogId) {
	var $boostrapEnableDiv = $('<div />').appendTo('body');
	var boostrapEnableId = 'boostrapEnable';
	$boostrapEnableDiv.attr('id', boostrapEnableId);
	$boostrapEnableDiv.attr('class', 'enable-bootstrap');

	var $dialogDiv = $('<div />').appendTo(toJQueryId(boostrapEnableId));
	$dialogDiv.attr('id', dialogId);
	$dialogDiv.attr('class', 'modal fade');
	$dialogDiv.attr('role', 'dialog');

	var $modalDialogDiv = $('<div />').appendTo(toJQueryId(dialogId));
	var modalDialogId = 'modal-dialog';
	$modalDialogDiv.attr('class', 'modal-dialog');
	$modalDialogDiv.attr('id', modalDialogId);

	var $modalContentDiv = $('<div />').appendTo(toJQueryId(modalDialogId));
	var modalContentId = 'modal-content';
	$modalContentDiv.attr('id', modalContentId);
	$modalContentDiv.attr('class', 'modal-content');

	var $modalHeaderDiv = $('<div />').appendTo(toJQueryId(modalContentId));
	var modalHeaderId = 'modal-header';
	$modalHeaderDiv.attr('id', modalHeaderId);
	$modalHeaderDiv.attr('class', 'modal-header');
	$modalHeaderDiv.html('<button type="button" class="close" data-dismiss="modal">&times;</button>\
						  <h4 class="modal-title">What did you download?</h4>');

	var $modalBodyDiv = $('<div />').appendTo(toJQueryId(modalContentId));
	var modalBodyId = 'modal-body';
	$modalBodyDiv.attr('id', modalBodyId);
	$modalBodyDiv.attr('class', 'modal-body');

	var $modalFooterDiv = $('<div />').appendTo(toJQueryId(modalContentId));
	var modalFooterId = 'modal-footer';
	$modalFooterDiv.attr('id', modalFooterId);
	$modalFooterDiv.attr('class', 'modal-footer');

	var $ul = $('<ul />').appendTo(toJQueryId(modalBodyId));
	var ulId = dialogId + '_ul';
	$ul.attr('id', ulId);
	$ul.attr('class', "flex-container");

	chrome.storage.local.get('rules', (result)=> {
		var rules = result.rules;
		for (let rule in rules) {
			let liId = 'rule_' + rule;
			let $li = $('<li />').appendTo(toJQueryId(ulId));
			$li.attr('id', liId);
			$li.attr('class', "flex-item");
			$li.html(rule);

			$(toJQueryId(liId)).click(() => {
				chrome.runtime.sendMessage({selected : rule});
			});
		}
	});
	
	addAdvancedOption(modalFooterId);
}

function isDialogDivExists(dialogId) {
	return 0 < $(toJQueryId(dialogId)).length;
}

function openDialog(dialogId) {
	if (!isDialogDivExists(dialogId)) {
		createDialogDiv(dialogId);
	}
	$(toJQueryId(dialogId)).modal({
  		keyboard: false,
  	});
}

function closeDialog(dialogId) {
	$(toJQueryId(dialogId)).modal("hide");
}

function showDldAbortedMsg(dialogId) {
	var $boostrapEnableDiv = $('<div />').appendTo('body');
	var bootstrapEnableId = 'modal_alert_bootstrap_enable';
	$boostrapEnableDiv.attr('id', bootstrapEnableId);
	$boostrapEnableDiv.attr('class', 'enable-bootstrap');

	var $modalDiv = $('<div />').appendTo(toJQueryId(bootstrapEnableId));
	var messageAlertId = 'message_alert';
	$modalDiv.attr('id', messageAlertId);
	$modalDiv.attr('class', 'modal fade');
	$modalDiv.attr('role', 'dialog');
	$modalDiv.html('<div class="modal-dialog modal-sm">\
      <div class="modal-content">\
        <div class="modal-header">\
          <button type="button" class="close" data-dismiss="modal">&times;</button>\
          <h4 class="modal-title">Download aborted</h4>\
        </div>\
        <div class="modal-body">\
          <p>You are probably downloading not what you think you do</p>\
        </div>\
        <div class="modal-footer">\
          <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>\
        </div>\
      </div>\
    </div>');

	$(toJQueryId('message_alert')).modal();

	$(toJQueryId(messageAlertId)).on('hide.bs.modal', function (e) {
	  closeDialog(dialogId);
	});
}