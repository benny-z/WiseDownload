dialogId = "dialog"; // + Math.random();

chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  if(changeInfo && changeInfo.status == "complete"){
      chrome.tabs.executeScript(tabId, {file: "jquery-3.1.0.min.js"}, function(){
          chrome.tabs.executeScript(tabId, {file: "jquery-ui.min.js"}, function() {
            chrome.tabs.insertCSS(tabId, {file: "jquery-ui.min.css"}, function () {
              chrome.tabs.executeScript(tabId, {file: "helper.js"}, function() {
                chrome.tabs.insertCSS(tabId, {file: "bg.css"}, function () {});
              });
            });
          });
      });
  }}
);

function initRules() {
  var rules = {
        'document' : ['doc', 'docx', 'pdf'],
        'software' : ['exe'],
        'image'    : ['jpg', 'jpeg', 'gif', 'png'],
        'music'    : ['mp3'],
        'video'    : ['mpeg']
      };

  chrome.storage.local.set({'rules' : rules} , ()=> { 
    if (chrome.extension.lastError) {
      alert('An error occurred: ' + chrome.extension.lastError.message);
    }
  });
}

function getFileExt(filename) {
  return filename.split('.').pop();
}

function checkValidity(selectedLst, curFileExt) {
  if (-1 < selectedLst.indexOf(curFileExt)) {
    chrome.downloads.download({
      url : curDownloadItem.url,
      filename : curDownloadItem.filename,
      saveAs : true });
    trigger_dld_hook = true;
  } else { 
    alert
    alert("Download aborted");
    trigger_dld_hook = false;
  }
  injectCode('closeDialog("' + dialogId + '")');
  curDownloadItem = null;
}

function statusHandler(message) {
  if (typeof curDownloadItem === 'undefined' || curDownloadItem === null) {
    alert('An error occurred: current download file is undefined');
    return;
  }
  var selected = message.selected;

  chrome.storage.local.get('rules', (result)=> {
    var rules = result.rules;
    if (-1 < Object.keys(rules).indexOf(selected)){
      let curFileExt = getFileExt(curDownloadItem.filename);
      checkValidity(rules[selected], curFileExt);
    } else {
      alert('An error occurred: no such option ' + selected);
    }
  });
}

function injectCode(codeToInject) {
  chrome.tabs.executeScript({ code :  codeToInject});
}

function foo(downloadItem, suggest) {
  if (trigger_dld_hook) {
    trigger_dld_hook = false;
  } else {
    chrome.downloads.cancel(downloadItem.id);

    if (div_initialized) {
      injectCode('openDialog("' + dialogId + '")');
    } else {
      injectCode('createDiv("' + dialogId + '")');
      injectCode('customizeDialog("' + dialogId + '")');
      div_initialized = true;
    }
    curDownloadItem = downloadItem;
  }
}

window.onload = function() {
  // making sure jQuery is loaded (injected) correctly
  if (!jQuery) {  
    alert('An error occurred: failed to inject jQuery');
    return;
  }
  
  initRules();

  // init. globals
  trigger_dld_hook = false;
  div_initialized = false;

  // setting listeners
  chrome.downloads.onDeterminingFilename.addListener(foo);
  chrome.runtime.onMessage.addListener(statusHandler);
}