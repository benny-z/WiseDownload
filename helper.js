function toJQueryId(id) {
	return '#' + id;
}

function customizeDialog(dialogId){
	$(toJQueryId(dialogId)).dialog({
		autoOpen: true,
		modal: true,
		dialogClass: 'dlg-no-close',
		width: 500,
		height: 350,
		closeOnEscape: false
 });
}

function openDialog(dialogId) {
	$(toJQueryId(dialogId)).dialog('open');
}

function closeDialog(dialogId) {
	$(toJQueryId(dialogId)).dialog('close');
}

function createDiv(dialogId) {
	var $div = $('<div />').appendTo('body');
	$div.attr('id', dialogId);
	$div.attr('title', 'test title');

	var $ul = $('<ul />').appendTo(toJQueryId(dialogId));
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
}
