class App {
  constructor() {
    this.extensionId = '';
    this.installedVersion = null;
    this.token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.output = document.getElementById('result');
    this.uninstallBtn = document.getElementById('uninstall');
    this.sendControlBtn = document.getElementById('send-controll');
    this.listen();
    this.run();
  }

  listen() {
    this.uninstallBtn.addEventListener("click", () => this.sendEvent('uninstallExtension'));
    this.sendControlBtn.addEventListener("click", () => this.sendEvent('redirectToExtesion', { token: this.token }));
    window.addEventListener('extensionVersionResponse', (ev) => {
      const { type:command, detail:data } = ev;
      this.extensionHandler({ command, data });
    });
    window.addEventListener('extensionUninstalled', (ev) => {
      const { type:command, detail:data } = ev;
      this.extensionHandler({ command, data });
    });
    window.addEventListener('extensionUpdated', (ev) => {
      const { type:command, detail:data } = ev;
      this.extensionHandler({ command, data });
    });
  }

  async run() {
    await this.askForInstalledVersion();
    if (this.installedVersion) {
      this.output.innerHTML = this.installedVersion + ' ' + this.installedName + ' ' + this.extensionBrowser;
    } else {
      this.output.innerHTML = 'NO EXTENSION IS INSTALLED';
    }
  }

  async askForInstalledVersion() {
    this.sendEvent('checkExtensionVersion');
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  }

  extensionHandler(message) {
    const { command, data } = message;
    switch (command) {
      case 'extensionVersionResponse':
        this.installedVersion = data.version;
        this.installedName = data.name;
        this.extensionBrowser = data.browser;
        break;
      case 'extensionUninstalled':
        console.log(message);
        this.output.innerHTML = 'EXTENSION UNINSTALLED SUCCESFUYLLY!!!!';
        break;
      case 'extensionUpdated':
        console.log(message);
        this.output.innerHTML = 'EXTENSION UPDATED SUCCESFUYLLY!!!!';
        break;
      default:
        console.log('>>>>>>>>>>>>>>>>>>>>>', message);
        return;
    }
  }

  sendEvent (name, detail = {}) {
    const event = new CustomEvent(name, {
      detail,
    });
    window.dispatchEvent(event);
  }
}


const pageApp = new App();
