const extensionAPI = chrome ? chrome: browser;
const browser = chrome ? 'Chrome' : 'Firefox';

class Extension {
  constructor() {
    this.listen();
    const { name, version } = extensionAPI.runtime.getManifest();
    this.version = version;
    this.name = name;
    this.browser = browser;
    this.host = extensionAPI.runtime.getURL('');
  }

  listen() {
    window.addEventListener('checkExtensionVersion', (ev) => {
      const { type:command, detail:data } = ev;
      this.websiteMessageHandler({ command, data });
    });
    window.addEventListener('updateExtension', (ev) => {
      const { type:command, detail:data } = ev;
      this.websiteMessageHandler({ command, data });
    });
    window.addEventListener('uninstallExtension', (ev) => {
      const { type:command, detail:data } = ev;
      this.websiteMessageHandler({ command, data });
    });
    window.addEventListener('redirectToExtension', (ev) => {
      const { type:command, detail:data } = ev;
      this.websiteMessageHandler({ command, data });
    });
  }

  websiteMessageHandler(message) {
    const { command, data } = message;
    switch (command) {
      case 'checkExtensionVersion':
        this.sendEvent('extensionVersionResponse', {
          version: this.version,
          name: this.name,
          browser: this.browser,
        })
        break;
      case 'redirectToExtension':
        this.redirectExtensionUrl(data);
        break;
      case 'uninstallExtension':
        chrome.runtime.sendMessage({ command }, (response) => {
          this.sendEvent('extensionUninstalled', {
            version: this.version,
            name: this.name,
            browser: this.browser,
          });
        });
        break;
      default:
    }
  }

  sendEvent (name, detail = {}) {
    const event = new CustomEvent(name, {
      detail,
    });
    window.dispatchEvent(event);
  }

  redirectExtensionUrl({ token = null }) {
    // const extensionURL
    extensionAPI.storage.local.set({ studyToken: token });
    // alert('REDIRECT TO ' + token);
    window.location.href = `${this.host}popup/index.html`
  }
}

new Extension();
