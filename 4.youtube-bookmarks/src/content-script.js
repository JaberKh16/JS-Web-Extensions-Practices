(() => {
    let youtubeBookmarks = [];
    let youtubeLeftControls, youtubePlayer;

    // Function to initialize the extension
    function init() {
        console.log("Initializing YouTube Bookmarks Extension");
        youtubeLeftControls = document.querySelector(".ytp-left-controls");
        youtubePlayer = document.querySelector(".video-stream");

        if (youtubeLeftControls && youtubePlayer) {
            createBookmarkButton();
            loadBookmarks();
        } else {
            console.error("YouTube controls or player not found.");
        }
    }

    // Function to create the bookmark button
    function createBookmarkButton() {
        const bookmarkButton = document.createElement("button");
        bookmarkButton.textContent = "Bookmark";
        bookmarkButton.style.marginLeft = "10px";
        bookmarkButton.addEventListener("click", addBookmark);
        youtubeLeftControls.appendChild(bookmarkButton);
    }

    // Function to add a bookmark
    function addBookmark() {
        const currentTime = youtubePlayer.currentTime;
        const videoTitle = document.title;
        const videoUrl = window.location.href;

        const bookmark = {
            time: currentTime,
            title: videoTitle,
            url: videoUrl
        };

        youtubeBookmarks.push(bookmark);
        saveBookmarks();
        alert(`Bookmark added at ${formatTime(currentTime)}`);
    }

    // Function to save bookmarks to local storage
    function saveBookmarks() {
        localStorage.setItem("youtubeBookmarks", JSON.stringify(youtubeBookmarks));
    }

    // Function to load bookmarks from local storage
    function loadBookmarks() {
        const storedBookmarks = localStorage.getItem("youtubeBookmarks");
        if (storedBookmarks) {
            youtubeBookmarks = JSON.parse(storedBookmarks);
            console.log("Loaded bookmarks:", youtubeBookmarks);
        }
    }

    // Utility function to format time in mm:ss
    function formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${minutes}:${secs < 10 ? "0" : ""}${secs}`;
    }

    // Initialize the extension when the DOM is fully loaded
    document.addEventListener("DOMContentLoaded", init);
}) ();