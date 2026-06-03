// this runs when Chrome starts and satys running in backgorund
chrome.runtime.onInstalled.addListener(() => {
    console.log("Extension installed");

    // listen for context menu click events
    // create a context menu item => context menu can be found when you right click on a webpage, and it can have custom options added by extensions
    chrome.contextMenus.create({
        id: "sampleContextMenu",
        title: "Sample Context Menu",
        contexts: ["all"], 
        // manifest v3 does not support onclick in context menu, so we need to listen for click events in the background script
        // onclick: (info, tab) => {
        //     console.log("Context menu item clicked:", info, tab);
        // }
    });

})




// Listen for context menu click events
chrome.contextMenus.onClicked.addListener((info, tab) => {
    // console.log("Context menu item clicked:", info, tab);
    if (info.menuItemId === "sampleContextMenu") {
        console.log("Context menu item clicked:");
        console.log("Info:", info);
        console.log("Tab:", tab);
    }
});

// listen for messages from content scripts or popup scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    console.log("Message received in background script:", message);
    if(message.action === "extraLinks") {
        // Handle the "extraLinks" action
        chrome.tabs.quuery({ active: true, currentWindow: true }, (tabs) => {
            chrome.scrpting.executeScript({
                target: { tabId: tabs[0].id },
                function: () => {
                    const links = document.querySelectorAll("a");
                    const linkData = Array.from(links).map(link => ({
                        href: link.href,
                        text: link.textContent
                    }));
                    return linkData;
                }
            }, (results) => {
                console.log("Links extracted from the page:", results[0].result);
            });
        });
    }
});


// This function will be injected into the page
function extractSearchLinks() {
    // This will be overridden by content script
    return window.getAllSearchLinks();
}