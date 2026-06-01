s = document.createElement("script");
s.src = chrome.extension.getURL("./indexdl.js");

s.onload = function () {
  this.remove();
};

document.head.appendChild(s);
