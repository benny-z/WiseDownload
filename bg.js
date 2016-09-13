dialogId = "safe_download_dialog";

// Loading all the JavaScript and CSS required files
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
    if (changeInfo && changeInfo.status == "complete") {
        chrome.tabs.executeScript(tabId, { file: "jquery-3.1.0.min.js" }, function() {
            chrome.tabs.executeScript(tabId, { file: "bootstrap.min.js" }, function() {
                chrome.tabs.executeScript(tabId, { file: "popup_ui.js" }, function() {
                    chrome.tabs.insertCSS(tabId, { file: "bootstrap.min.css" }, function() {
                        chrome.tabs.insertCSS(tabId, { file: "style.css" });
                    });
                });
            });
        });
    };
});

// @param      {string}  path    The path
// @return     {string}  Returns the full path of the given file
//
function fullPath(path) {
    return chrome.extension.getURL(path);
}

/**
 * Initializes the rules i.e., the mapping between the filetypes
 * and the extensions, from the local database
 */
function initRules() {
    var document_str = chrome.i18n.getMessage('document');
    var software_str = chrome.i18n.getMessage('software');
    var image_str = chrome.i18n.getMessage('image');
    var music_str = chrome.i18n.getMessage('music');
    var video_str = chrome.i18n.getMessage('video');
    var book_str = chrome.i18n.getMessage('book');
    var compressed_str = chrome.i18n.getMessage('compressed');

    var rules = {}
    rules[document_str] = {
        'icon': fullPath('document.png'),
        'exts': ['602', 'abw', 'acl', 'afp', 'ami', 'ans', 'asc', 'aww', 'ccf', 
                 'csv', 'cwk', 'dbk', 'doc', 'docm', 'docx', 'dot', 'dotx', 'egt', 
                 'epub', 'ezw', 'fdx', 'ftm', 'ftx', 'gdoc', 'html', 'hwp', 'hwpml', 
                 'log', 'lwp', 'mbp', 'md', 'mcw', 'mobi', 'nb', 'nbp', 'neis', 'odm', 
                 'odt', 'ott', 'omm', 'pages', 'pap', 'pdax', 'pdf', 'quox', 'radi', 
                 'rtf', 'rpt', 'sdw', 'se', 'stw', 'sxw', 'tex', 'info', 'troff', 
                 'txt', 'uof', 'uoml', 'via', 'wpd', 'wps', 'wpt', 'wrd', 'wrf', 
                 'wri', 'xhtml', 'xml', 'xps'],
        'bg_color': '#73ce88'
    };
    rules[software_str] = {
        'icon': fullPath('software.png'),
        'exts': ['action', 'apk', 'app', 'bat', 'bin', 'cmd', 'com', 'command', 'cpl', 
                 'csh', 'exe', 'gadget', 'inf1', 'ins', 'inx', 'ipa', 'isu', 'job', 'jse', 
                 'ksh', 'lnk', 'msc', 'msi', 'msp', 'mst', 'osx', 'out', 'paf', 'pif', 'prg', 
                 'ps1', 'reg', 'rgs', 'run', 'sct', 'shb', 'shs', 'u3p', 'vb', 'vbe', 'vbs', 
                 'vbscript', 'workflow', 'ws', 'wsf'],
        'bg_color': '#FF5252'
    };
    rules[image_str] = {
        'icon': fullPath('image.png'),
        'exts': ["ani", "bmp", "cal", "fax", "gif", "img", "jbg", "jpe", "jpeg", 
                 "jpg", "mac", "pbm", "pcd", "pcx", "pct", "pgm", "png", "ppm", 
                 "psd", "ras", "tga", "tiff", "wmf"],
        'bg_color': '#1A7CF9'
    };
    rules[compressed_str] = {
        'icon': fullPath('compressed.png'),
        'exts': ['a', 'ar', 'cpio', 'shar', 'lbr', 'iso', 'lbr', 'mar', 
                 'tar', 'bz2', 'f', 'gz', 'lz', 'lzma', 'lzo', 'rz', 'sfark', 
                 'sz', '?q?', '?z?', 'xz', 'z', 'z', 'infl', '7z', 's7z', 
                 'ace', 'afa', 'alz', 'apk', 'arc', 'arj', 'b1', 'ba', 
                 'bh', 'cab', 'car', 'cfs', 'cpt', 'dar', 'dd', 'dgc', 
                 'dmg', 'ear', 'gca', 'ha', 'hki', 'ice', 'jar', 'kgb', 
                 'lzh', 'lha', 'lzx', 'pak', 'partimg', 'paq6', 'paq7', 
                 'paq8', 'pea', 'pim', 'pit', 'qda', 'rar', 'rk', 'sda', 
                 'sea', 'sen', 'sfx', 'shk', 'sit', 'sitx', 'sqx', 
                 'targz', 'tgz', 'tarz', 'tarbz2', 'tbz2', 'tarlzma', 
                 'tlz', 'uc uc0 uc2 ucn ur2 ue2', 'uca', 'uha', 'war', 
                 'wim', 'xar', 'xp3', 'yz1', 'zip', 'zipx', 'zoo', 'zpaq', 'zz'],
        'bg_color': '#2a91a7'
    };
    rules[music_str] = {
        'icon': fullPath('music.png'),
        'exts': ['3gp', 'aa', 'aac', 'aax', 'act', 'aiff', 'amr', 'ape', 'au', 
                 'awb', 'dct', 'dss', 'dvf', 'flac', 'gsm', 'iklax', 'ivs', 'm4a', 
                 'm4b', 'm4p', 'mmf', 'mp3', 'mpc', 'msv', 'ogg', 'oga', 'mogg', 
                 'opus', 'ra', 'rm', 'raw', 'sln', 'tta', 'vox', 'wav', 'wma', 'wv', 'webm'],
        'bg_color': '#6fe2e1'
    };
    rules[video_str] = {
        'icon': fullPath('video.png'),
        'exts': ['wmv', 'webm', 'vob', 'gifv', 'svi', 'roq', 'rmvb', 'rm', 'yuv', 'mov', 
                 'qt', 'ogv', 'ogg', 'nsv', 'mng', 'mp4', 'm4p', 'm4v', 'mpg', 'mpeg', 
                 'm2v', 'mpg', 'mp2', 'mpeg', 'mpe', 'mpv', 'mkv', 'mxf', 'm4v', 'gif', 'flv', 
                 'f4v', 'f4p', 'f4a', 'f4b', 'flv', 'drc', 'avi', 'amv', 'asf', '3g2', '3gp'],
        'bg_color': '#FBBC05'
    };
    rules[book_str] = {
        'icon': fullPath('book.png'),
        'exts': ['pdf', 'epub', 'azw3', 'mobi', 'bdb2', 'opf', 'cbr', 'ibooks', 'iba', 'pdg', 
                 'azw', 'htmlz', 'mbp1', 'cbt', 'wolf', 'fb2', 'azw4', 'orb', 'lit', 'apnx', 'lrf', 
                 'edt', 'cbz', 'tpz', 'ebo', 'snb', 'umd', 'nat', 'tr', 'txtz', 'ebk', 'azw1', 
                 'vbk', 'gpf', 'mpub', 'imp', 'zno', 'bek', 'cl2arc', 'ceb', 'pobi', 'pdb', 'mart', 
                 'prc', 'cb7', 'fub', 'bfl', 'lpr', 'htxt', 'ebk2', 'tcr', 'meb', 'tk3', 'phl', 
                 'pkg', 'eba', 'lbxoeb', 'mga', 'ubk', 'cbc', 'ibook', 'lrx', 'oeb', 'sbrz', 'cebx', 
                 'kf8', 'pmlz', 'dbk', 'vellum', 'stk', 'cl2doc', 'cbcx', 'tr3', 'rb', 'dnl', 'xmdf', 
                 'webz', 'html0', 'sgf', 'bpnueb', 'tpnueb', 'aeh', 'htz4', 'bkk', 'ybk', 'cba', 'lbxcol', 
                 'ebaml', 'cbds', 'xeb', 'qmk', 'azn', 'txtc', 'ava', 'txt7', 'txtr', 'kml', 'zna', 'lrs', 
                 'lrt', 'ebx', 'hsb', 'tr2', 'gpx', 'ybhtm', 'wmga', 'brn', 'ybtxt', 'cbmv', 'pml', 'ybrar', 
                 'ybrtf', 'comictpl', 'prc', 'chmprj'],
        'bg_color': '#5b80b7'
    };


    chrome.storage.local.set({ 'rules': rules }, () => {
        if (chrome.extension.lastError) {
            alert('An error occurred: ' + chrome.extension.lastError.message);
        }
    });
}

/**
 * @param      {string}  filename  The filename
 * @return     {string}  The file extension
 */
function getFileExt(filename) {
    return filename.split('.').pop();
}

/**
 * Resume a download which previousely was canceled
 * @note  The global variable curDownloadItem should be
 *        initialized to an instance of DownloadItem
 */
function resumeDownload() {
    chrome.downloads.download({
        url: curDownloadItem.url,
        filename: curDownloadItem.filename,
        saveAs: true
    });
    trigger_dld_hook = true;
    injectCode('closeDialog("' + dialogId + '")');
}

/**
 * Showing the "Abort Download" message box
 */
function abortDownload() {
    injectCode('showDldAbortedMsg("' + dialogId + '")');
    trigger_dld_hook = false;
}

/**
 * Handles the user's actions. i.e., this is the mediator between the user's 
 * actions, messages that he sends, and the BL
 *
 * @param      {object}  message  The message that was sent from the current tab
 */
function usrOutputHandler(message) {
    if (typeof curDownloadItem === 'undefined' || curDownloadItem === null) {
        alert('An error occurred: current download file is undefined');
        return;
    }
    var selected = message.selected;
    var ext = message.extension;
    var is_ext = message.is_ext;

    chrome.storage.local.get('rules', (result) => {
        let rules = result.rules;

        let curFileExt = getFileExt(curDownloadItem.filename).toLowerCase();
        let extLst;
        if (!is_ext && -1 < Object.keys(rules).indexOf(selected)) {
            extLst = rules[selected].exts;
        } else if (is_ext) {
            extLst = [ext.toLowerCase()];
        } else {
            alert('An error occurred: no such option ' + selected);
        }
        if (-1 < extLst.indexOf(curFileExt)) {
            resumeDownload();
        } else {
            abortDownload();
        }
        curDownloadItem = null;
    });
}

/**
 * Runs code in the current tab's context
 *
 * @param      {string}  codeToInject  The code to be injected into the current tab's context
 */
function injectCode(codeToInject) {
    chrome.tabs.executeScript({ code: codeToInject });
}

/**
 * Called once a user tries to download a file. 
 * This method cancels the current download, initializes the global curDownloadItem,
 * and displays the GUI in the current tab's context
 *
 * @param      {DownloadItem}  downloadItem  Instance of the DownloadItem that contains
 *                                           info. regarding the file the user wishes to download
 * @param      {<type>}  suggest       Not used in the code
 */
function fileDownloadHandler(downloadItem, suggest) {
    if (trigger_dld_hook) {
        trigger_dld_hook = false;
    } else {
        chrome.downloads.cancel(downloadItem.id);
        injectCode('openDialog("' + dialogId + '")');
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

    // setting listeners
    chrome.downloads.onDeterminingFilename.addListener(fileDownloadHandler);
    chrome.runtime.onMessage.addListener(usrOutputHandler);
}
