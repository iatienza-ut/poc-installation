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
    window.addEventListener("message", (event) => {
      if (event.source == window && event.data && event.data.command) {
        this.extensionHandler(event.data);
      }
    });
    this.uninstallBtn.addEventListener("click", () => this.sendMessage('UNINSTALL') );
    this.sendControlBtn.addEventListener("click", () => this.sendMessage('SEND_CONTROL', { token: this.token }) );
  }

  async run() {
    await this.askForInstalledVersion();
    if (this.installedVersion) {
      this.output.innerHTML = this.installedVersion;
    } else {
      this.output.innerHTML = 'NO EXTENSION IS INSTALLED';
    }
  }

  async askForInstalledVersion() {
    this.sendMessage('ASK_VERSION');
    return new Promise((resolve) => {
      setTimeout(() => resolve(), 1000);
    });
  }

  extensionHandler(message) {
    const { command, data } = message;
    switch (command) {
      case 'RESPONSE_VERSION':
        this.installedVersion = data.version;
        break;
      default:
        return;
    }
  }

  sendMessage(command, data = {}) {
    window.postMessage({
      command,
      data
    }, "*");
  }
}


const pageApp = new App();
