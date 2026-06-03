// Background service worker
chrome.runtime.onInstalled.addListener(() => {
    console.log("Search Links Extractor installed");
});

// Listen for messages from popup or content script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "extractLinks") {
        // Execute content script to extract links
        chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
            chrome.scripting.executeScript({
                target: {tabId: tabs[0].id},
                function: extractSearchLinks
            }, (results) => {
                if (results && results[0]) {
                    sendResponse({links: results[0].result});
                }
            });
        });
        return true; // Keep message channel open for async response
    }
});

// This function will be injected into the page
function extractSearchLinks() {
    // This will be overridden by content script
    return window.getAllSearchLinks();
}