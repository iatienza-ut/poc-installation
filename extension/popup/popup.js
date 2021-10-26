const extensionAPI = chrome ? chrome: browser;
const output = document.getElementById('token')

chrome.storage.local.get('studyToken', ({studyToken = null}) => {
  output.innerHTML = studyToken;
});
