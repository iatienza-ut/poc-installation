chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
    if (request.command === "UNINSTALL"){
      chrome.management.uninstallSelf((result) => {
        console.log(result);
        sendResponse({ command: 'EXTENSION_UNINSTALLED', result });
      });
    }
  }
);
