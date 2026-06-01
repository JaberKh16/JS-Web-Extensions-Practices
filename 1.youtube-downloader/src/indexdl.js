/**
 * YouTube Video URL Extractor with Download Button
 *
 * This script adds a download button to YouTube's video page that shows available
 * video qualities and provides download links for each format.
 *
 * Syntax explanations:
 * - `window.onload`: Runs code after full page load to ensure YouTube's player exists
 * - `getElementById()`: Finds DOM element by its ID attribute
 * - `createElement()`: Creates new HTML elements dynamically
 * - `classList` properties (`add`, `remove`, `toggle`): Modern way to manipulate CSS classes
 * - `addEventListener()`: Attaches event handlers to DOM elements
 * - Arrow functions `() => {}`: Concise function syntax
 * - Template literals (${}): String interpolation with variables
 */

// Main extraction function that gets video URLs from YouTube player
function extractVideoUrls() {
  // Check if ytplayer and its config exist (prevents errors on non-YouTube pages)
  if (
    !window.ytplayer ||
    !window.ytplayer.config ||
    !window.ytplayer.config.args
  ) {
    console.error("YouTube player configuration not found");
    return [];
  }

  // Try multiple possible locations for video stream data
  let encodedStreamMap = ytplayer.config.args.url_encoded_fmt_stream_map;

  // Fallback for newer YouTube player versions
  if (!encodedStreamMap && ytplayer.config.args.player_response) {
    try {
      const playerResponse = JSON.parse(ytplayer.config.args.player_response);
      const formats = playerResponse.streamingData?.formats || [];
      const adaptiveFormats =
        playerResponse.streamingData?.adaptiveFormats || [];
      const allFormats = [...formats, ...adaptiveFormats];

      // Convert formats to similar structure as old method
      return allFormats.map((format) => ({
        url: format.url,
        quality: format.qualityLabel || format.quality,
        type: format.mimeType,
        itag: format.itag,
      }));
    } catch (e) {
      console.error("Failed to parse player_response:", e);
      return [];
    }
  }

  // Check if the stream map exists
  if (!encodedStreamMap) {
    console.error("No video streams found");
    return [];
  }

  // Parse each video stream entry
  var videoUrls = encodedStreamMap
    .split(",") // Split multiple streams (separated by commas)
    .map((item) => {
      // Process each individual stream entry
      return item
        .split("&") // Split each stream's parameters (separated by "&")
        .reduce((previous, current) => {
          // Convert parameters string to object
          // Split parameter into key-value pair at "="
          let [key, encodedValue] = current.split("=");

          // Decode the value and add to the accumulated object
          return Object.assign(previous, {
            [key]: encodedValue ? decodeURIComponent(encodedValue) : "",
          });
        }, {}); // Start with empty object for each stream
    });

  return videoUrls;
}

// Function to populate dropdown with available video qualities
function populateDropdown(videoStreams) {
  const dropdownList = document.querySelector("#videoDownloadDropdown ul");
  if (!dropdownList) return;

  // Clear existing list items
  dropdownList.innerHTML = "";

  if (videoStreams.length === 0) {
    const noStreamsItem = document.createElement("li");
    noStreamsItem.textContent = "No streams available";
    noStreamsItem.className = "dropdown-item disabled";
    dropdownList.appendChild(noStreamsItem);
    return;
  }

  // Group streams by quality for better organization
  const uniqueQualities = new Map();

  videoStreams.forEach((stream, index) => {
    const quality =
      stream.quality || stream.quality_label || `Format ${index + 1}`;
    const url = stream.url;
    const type = stream.type || "video/mp4";

    // Only add if URL exists and not duplicate quality
    if (url && !uniqueQualities.has(quality)) {
      uniqueQualities.set(quality, { stream, index });
    }
  });

  // Create dropdown items for each unique quality
  uniqueQualities.forEach((value, quality) => {
    const { stream, index } = value;
    const listItem = document.createElement("li");
    listItem.className = "dropdown-item";

    const downloadLink = document.createElement("a");
    downloadLink.href = stream.url;
    downloadLink.download = `youtube_video_${quality.replace(/\s+/g, "_")}.mp4`;
    downloadLink.textContent = quality;
    downloadLink.target = "_blank";

    // Add type indicator for audio-only streams
    if (stream.type && stream.type.includes("audio")) {
      const audioBadge = document.createElement("span");
      audioBadge.textContent = " 🎵 Audio";
      audioBadge.style.fontSize = "10px";
      audioBadge.style.opacity = "0.7";
      downloadLink.appendChild(audioBadge);
    }

    // Handle click to close dropdown after selection
    downloadLink.addEventListener("click", () => {
      toggleDropdown(false);
    });

    listItem.appendChild(downloadLink);
    dropdownList.appendChild(listItem);
  });
}

// Toggle dropdown visibility
function toggleDropdown(show = null) {
  const dropdown = document.getElementById("videoDownloadDropdown");
  if (!dropdown) return;

  if (show === true) {
    dropdown.classList.add("shown");
  } else if (show === false) {
    dropdown.classList.remove("shown");
  } else {
    // Toggle
    dropdown.classList.toggle("shown");
  }
}

// Download button click handler
function handleDownloadClick(event) {
  event.stopPropagation(); // Prevent event from bubbling
  toggleDropdown(); // Toggle dropdown visibility

  // Extract fresh video URLs each time the button is clicked
  const videoStreams = extractVideoUrls();
  populateDropdown(videoStreams);

  // Log for debugging
  console.log(`Found ${videoStreams.length} video streams`);
}

// Close dropdown when clicking outside
function setupOutsideClickHandler() {
  document.addEventListener("click", function (event) {
    const dropdown = document.getElementById("videoDownloadDropdown");
    const button = document.getElementById("downloadVideo");

    if (dropdown && button) {
      // Check if click is outside both dropdown and button
      if (!dropdown.contains(event.target) && !button.contains(event.target)) {
        dropdown.classList.remove("shown");
      }
    }
  });
}

// Create and inject download button and dropdown into YouTube page
function setupDownloadButton() {
  // Wait for YouTube's container to be available (YouTube loads dynamically)
  const checkInterval = setInterval(() => {
    const container = document.getElementById("watch8-secondary-actions");

    if (container) {
      clearInterval(checkInterval);

      // Check if button already exists to avoid duplicates
      if (document.getElementById("downloadVideo")) {
        return;
      }

      // Create download button
      const btn = document.createElement("button");
      btn.className =
        "yt-uix-button yt-uix-button-size-default yt-uix-button-opacity";
      btn.id = "downloadVideo";
      btn.setAttribute("role", "button");
      btn.innerText = "Download Video";

      // Create dropdown container
      const dropdown = document.createElement("div");
      dropdown.id = "videoDownloadDropdown";
      dropdown.className = "videoDownloadDropdown";

      const dropdownList = document.createElement("ul");
      dropdown.appendChild(dropdownList);

      // Add initial loading message
      const loadingItem = document.createElement("li");
      loadingItem.textContent = "Loading streams...";
      loadingItem.className = "dropdown-item loading";
      dropdownList.appendChild(loadingItem);

      // Append elements to container
      container.appendChild(btn);
      container.appendChild(dropdown);

      // Add event listener to button
      btn.addEventListener("click", handleDownloadClick);

      // Setup outside click handler
      setupOutsideClickHandler();

      // Pre-load streams on page load for faster access
      setTimeout(() => {
        const videoStreams = extractVideoUrls();
        populateDropdown(videoStreams);
      }, 1000);
    }
  }, 500); // Check every 500ms for container
}

// CSS styles for dropdown (injected automatically)
function injectStyles() {
  const styles = `
    <style>
      .videoDownloadDropdown {
        position: absolute;
        background: white;
        border: 1px solid #ccc;
        border-radius: 4px;
        min-width: 150px;
        z-index: 1000;
        display: none;
        box-shadow: 0 2px 8px rgba(0,0,0,0.15);
      }

      .videoDownloadDropdown.shown {
        display: block;
      }

      .videoDownloadDropdown ul {
        list-style: none;
        margin: 0;
        padding: 0;
      }

      .videoDownloadDropdown .dropdown-item {
        padding: 8px 12px;
        border-bottom: 1px solid #eee;
      }

      .videoDownloadDropdown .dropdown-item:last-child {
        border-bottom: none;
      }

      .videoDownloadDropdown .dropdown-item a {
        text-decoration: none;
        color: #333;
        display: block;
        cursor: pointer;
      }

      .videoDownloadDropdown .dropdown-item a:hover {
        color: #065fd4;
      }

      .videoDownloadDropdown .dropdown-item.loading {
        color: #999;
        font-style: italic;
      }

      .videoDownloadDropdown .dropdown-item.disabled {
        color: #999;
        cursor: not-allowed;
      }

      #downloadVideo {
        margin-left: 8px;
        cursor: pointer;
      }

      #downloadVideo:hover {
        opacity: 0.8;
      }
    </style>
  `;

  if (!document.querySelector("#youtube-download-styles")) {
    const styleElement = document.createElement("div");
    styleElement.innerHTML = styles;
    document.head.appendChild(styleElement.firstChild);
  }
}

// Initialize everything when page loads
window.onload = function () {
  injectStyles();
  setupDownloadButton();
};

// Also run setup when YouTube performs navigation (for single-page app navigation)
let lastUrl = location.href;
new MutationObserver(() => {
  const url = location.href;
  if (url !== lastUrl) {
    lastUrl = url;
    setTimeout(() => {
      setupDownloadButton();
    }, 1000);
  }
}).observe(document, { subtree: true, childList: true });
