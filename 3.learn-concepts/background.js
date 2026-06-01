// this runs when Chrome starts and satys running in backgorund
chrome.runtime.onInstalled.addEventListener(() => {
    console.log("Extension installed");
})


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
})