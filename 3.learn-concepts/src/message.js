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



// listen for messages from other extensions
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message from another extension:", message);
});

// listen for click events on the extension's browser action
chrome.action.onClicked.addListener((tab) => {
    console.log("Browser action clicked:", tab, tab.url, tab.title, tab.id, tab.windowId);
});

// listen for messages from content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message from content script:", message);
    // send a response back to the content script
    sendResponse({ message: "Message received in background script" });
});



// listen for messages from other extensions OR content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Received message:", message);
    console.log("From sender:", sender);
    
    // send a response back
    sendResponse({ message: "Message received in background script" });
    
    // Return true to indicate you want to send a response asynchronously
    return true;
});

// listen for click events on the extension's browser action
chrome.action.onClicked.addListener((tab) => {
    console.log("Browser action clicked:", tab);
    console.log("URL:", tab.url);
    console.log("Title:", tab.title);
    console.log("Tab ID:", tab.id);
    console.log("Window ID:", tab.windowId);
});