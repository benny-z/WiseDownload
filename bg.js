function loadRules() {
  // var rules = localStorage.rules;
  // try {
  //   JSON.parse(rules).forEach(function(rule) {new Rule(rule);});
  // } catch (e) {
  //   localStorage.rules = JSON.stringify([]);
  // }
  console.log('loadRules!1111');
  localStorage.rules = JSON.stringify({
    'document' : ['doc', 'docx', 'pdf'],
    'software' : ['exe'],
    'image'    : ['jpg', 'jpeg', 'gif']
  });
}

function getFileExt(filename) {
  return filename.split('.').pop();
}

chrome.downloads.onDeterminingFilename.addListener(function(downloadItem, __suggest) {
  function suggest(filename, conflictAction) {
    __suggest({filename: filename,
               conflictAction: conflictAction,
               conflict_action: conflictAction});
    // conflict_action was renamed to conflictAction in
    // http://src.chromium.org/viewvc/chrome?view=rev&revision=214133
    // which was first picked up in branch 1580.
  }
  var rules = localStorage.rules;
  downloadItemExt = getFileExt(downloadItem);
  alert(1);
});

window.onload = function() {
  loadRules();
}
