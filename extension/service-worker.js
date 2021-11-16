const requestUpdateCheck = () => {
  const { UPDATE_AVAILABLE, THROTTLED, NO_UPDATE } = chrome.runtime.RequestUpdateCheckStatus;
  chrome.runtime.requestUpdateCheck((status, details) => {
    switch (status) {
      case UPDATE_AVAILABLE: {
        const { version } = details;
        logger.info('W00E002', `The extension ${manifest.name} with version ${manifest.version} 
          has available a new version ${version}. The reason is ${UPDATE_AVAILABLE}`);
        this.checkToUpdate(version);
        break;
      }
      case THROTTLED:
        logger.info('W00E004',
          `The store has blocked the update requests for ${manifest.name} ${manifest.version}. 
          The reason is ${THROTTLED}`);
        this.coordinator.responseToServer(THROTTLED);
        break;
      default: case NO_UPDATE:
        logger.info('W00E002', `The extension ${manifest.name} with version ${manifest.version} 
          has not available new version. The reason is ${NO_UPDATE}`);
        this.coordinator.responseToServer(NO_UPDATE);
        break;
    }
  });
}

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    console.log(sender.tab ? 'from a content script:' + sender.tab.url : 'from the extension');
    if (request.command === 'uninstallExtension'){
      chrome.management.uninstallSelf((result) => {
        console.log(result);
        sendResponse({ command: 'EXTENSION_UNINSTALLED', result });
      });
    } else if (request.command === '' ) {

    }
  }
);
