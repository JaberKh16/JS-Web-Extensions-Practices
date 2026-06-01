// setup download button
const elementId = "watch8-secondary-actions";
var container = document.getElementById(elementId);
const btn = document.createElement("button");
btn.className = "yt-uix-button yt-uix-button-size-default yt-ux-button-opacity";
btn.id = "downloadVideo";
btn.setAttribute("role", "button");
btn.innerText = "Download";

container.appendChild(btn);
