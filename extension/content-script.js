/*
Listen for messages from the page.
If the message was from the page script, show an alert.
*/
// window.addEventListener("message", (event) => {
//   if (event.source == window &&
//     event.data &&
//     event.data.direction == "from-page-script") {
//     alert("Content script received message: \"" + event.data.message + "\"");
//   }
// });
//
// /*
// Send a message to the page script.
// */
// function messagePageScript() {
//   window.postMessage({
//     direction: "from-content-script",
//     message: "Message from the content script"
//   }, "https://mdn.github.io");
// }
//
// /*
// Add messagePageScript() as a listener to click events on
// the "from-content-script" element.
// */
// var fromContentScript = document.getElementById("from-content-script");
// fromContentScript.addEventListener("click", messagePageScript);

const extensionAPI = chrome ? chrome: browser;

class Extension {
  constructor() {
    this.listen();
    this.version = extensionAPI.runtime.getManifest().version;
    this.host = extensionAPI.runtime.getURL('');
  }

  listen() {
    window.addEventListener("message", (event) => {
      if (event.source == window && event.data && event.data.command) {
        this.websiteMessageHandler(event.data);
      }
    });
  }

  websiteMessageHandler(message) {
    const { command, data } = message;
    switch (command) {
      case 'ASK_VERSION':
        this.sendMessageToWebsite({ command: 'RESPONSE_VERSION', data: { version: this.version } });
        break;
      case 'SEND_CONTROL':
        this.redirectExtensionUrl(data);
        break;
      case 'UNINSTALL':
        chrome.runtime.sendMessage({ command }, (response) => {
          this.sendMessageToWebsite({ command: 'EXTENSION_UNINSTALLED' });
          console.log(response);
        });
        break;
      default:
    }
  }

  sendMessageToWebsite(message, origin = '*') {
    window.postMessage(message, origin);
  }

  redirectExtensionUrl({ token = null }) {
    // const extensionURL
    extensionAPI.storage.local.set({ studyToken: token });
    // alert('REDIRECT TO ' + token);
    window.location.href = `${this.host}popup/index.html`
  }
}

new Extension();
