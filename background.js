const url = "https://loaners.codeths.dev"

chrome.runtime.onInstalled.addListener(async ({ reason }) => {
    if (reason !== 'install') {
      return;
    }
    const response = await fetch(`${url}/api/v1/ext/register`, {method: "POST", body: JSON.stringify({"serial": serial, "alertToken": alertToken})})
});
  