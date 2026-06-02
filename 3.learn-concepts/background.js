// this runs when Chrome starts and satys running in backgorund
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");
})


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

// listen for context menu click events
chrome.contextMenus.create({
    id: "sampleContextMenu",
    title: "Sample Context Menu",
    contexts: ["all"],
    onclick: (info, tab) => {
        console.log("Context menu item clicked:", info, tab);
    }
});