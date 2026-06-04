chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    // if (changeInfo.status === "complete" && tab.url.includes("youtube.com/watch")) {
    //     console.log("YouTube video page loaded:", tab.url);
    //     // You can also send a message to the content script here if needed
    //     // chrome.tabs.sendMessage(tabId, { action: "youtubeVideoPageLoaded", url: tab.url });
    // }
    if(tab.url && tab.url.includes("youtube.com/watch")) {
        console.log("YouTube video page loaded:", tab.url);
        // Send a message to the content script to initialize the bookmark button and load bookmarks
        chrome.tabs.sendMessage(tabId, { action: "initializeBookmarks", url: tab.url });

        const queryParams = tab.url.split("v=")[1]?.split("&")[0]; // Extract video ID from URL
        // const urlParams = new URL(tab.url).searchParams.get("v");
        const urlParams = new URL(queryParams);
        console.log("Video ID:", queryParams);

        chrome.tabs.sendMessage(
            tabId, 
            { 
                action: "videoIdExtracted", 
                videoId: queryParams ,
                type: "videoId"
            }
        ) ;
    }
});