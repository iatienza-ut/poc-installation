const extensionAPI = chrome ? chrome: browser;
const output = document.getElementById('token')
const outputApiEndpoint = document.getElementById('apiEndpoint')

chrome.storage.local.get('studyToken', ({studyToken = null}) => {
  output.innerHTML = studyToken;
});

chrome.storage.local.get('apiEndpoint', ({apiEndpoint = null}) => {
  outputApiEndpoint.innerHTML = apiEndpoint;
});
