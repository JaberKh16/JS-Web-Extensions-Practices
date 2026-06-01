// listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message from content script:", message);
});

// listen for messages from popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message from popup:", message);
    // send a response back to the popup
    sendResponse({ message: "Message received in background script" });
});

// listen for messages from options page
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message from options page:", message);
});
