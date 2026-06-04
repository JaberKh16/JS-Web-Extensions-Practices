(() => {
    let youtubeLeftControls, youtubePlayer;
    let currentVideo = null;

    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        const { action, url, videoId, type } = message;
        if(type === "videoId" && action === "videoIdExtracted") {
            console.log("Video ID extracted:", videoId);
            currentVideoId = videoId;
            newVideoLoaded();

        }
    });

    function newVideoLoaded() {
        // Initialize the bookmark button and load bookmarks for the new video
        const bookmarkButtonId = "youtube-bookmark-button";
        let bookmarkButton = document.getElementById(bookmarkButtonId);

        if (!bookmarkButton) {
            bookmarkButton = document.createElement("button");
            bookmarkButton.id = bookmarkButtonId;
            bookmarkButton.innerText = "Bookmark";
            bookmarkButton.style.position = "absolute";
            bookmarkButton.style.top = "10px";
            bookmarkButton.style.right = "10px";
            bookmarkButton.style.zIndex = "1000";
            bookmarkButton.style.padding = "10px 20px";
            bookmarkButton.style.backgroundColor = "#ff0000";
            bookmarkButton.style.color = "#fff";
            bookmarkButton.style.border = "none";
            bookmarkButton.style.borderRadius = "5px";
            bookmarkButton.style.cursor = "pointer";

            youtubeLeftControls.appendChild(bookmarkButton);

            // Add click event listener to the button
            bookmarkButton.addEventListener("click", () => {
                console.log("Bookmark button clicked for video ID:", currentVideoId);
                // Here you can implement the logic to save the bookmark for the current video
                // For example, you can send a message to the background script to save the bookmark
                chrome.runtime.sendMessage({
                    action: "saveBookmark",
                    videoId: currentVideoId,
                    videoUrl: window.location.href,
                    timestamp: new Date().toISOString()
                });
            });
        }
    }
}) ();