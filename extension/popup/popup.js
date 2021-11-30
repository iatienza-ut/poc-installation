const extensionAPI = chrome ? chrome: browser;
const output = document.getElementById('token')
const outputApiEndpoint = document.getElementById('apiEndpoint')

chrome.storage.local.get('studyToken', ({studyToken = null}) => {
  output.innerHTML = chrome.i18n.getMessage('popup_token_description', [studyToken]);
});

chrome.storage.local.get('apiEndpoint', ({apiEndpoint = null}) => {
  outputApiEndpoint.innerHTML = apiEndpoint;
});

window.document.title = chrome.i18n.getMessage('popup_title');
