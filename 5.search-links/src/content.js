// Content script that runs on pages
console.log("Content script loaded");

// Function to extract search results from different search engines
function extractSearchLinks() {
    const searchLinks = [];
    
    // Detect which search engine we're on
    const url = window.location.href;
    let selector = '';
    
    if (url.includes('google.com')) {
        // Google search results
        const results = document.querySelectorAll('div.g');
        results.forEach((result, index) => {
            const titleElement = result.querySelector('h3');
            const linkElement = result.querySelector('a');
            const urlElement = linkElement?.href;
            
            if (titleElement && urlElement && !urlElement.includes('google.com/url')) {
                searchLinks.push({
                    index: index + 1,
                    title: titleElement.innerText,
                    url: urlElement,
                    source: 'Google'
                });
            }
        });
    } 
    else if (url.includes('bing.com')) {
        // Bing search results
        const results = document.querySelectorAll('li.b_algo');
        results.forEach((result, index) => {
            const titleElement = result.querySelector('h2 a');
            if (titleElement) {
                searchLinks.push({
                    index: index + 1,
                    title: titleElement.innerText,
                    url: titleElement.href,
                    source: 'Bing'
                });
            }
        });
    }
    else if (url.includes('yahoo.com')) {
        // Yahoo search results
        const results = document.querySelectorAll('div.algo');
        results.forEach((result, index) => {
            const titleElement = result.querySelector('h3 a');
            if (titleElement) {
                searchLinks.push({
                    index: index + 1,
                    title: titleElement.innerText,
                    url: titleElement.href,
                    source: 'Yahoo'
                });
            }
        });
    }
    else if (url.includes('duckduckgo.com')) {
        // DuckDuckGo search results
        const results = document.querySelectorAll('article.result');
        results.forEach((result, index) => {
            const titleElement = result.querySelector('a.result__a');
            if (titleElement) {
                searchLinks.push({
                    index: index + 1,
                    title: titleElement.innerText,
                    url: titleElement.href,
                    source: 'DuckDuckGo'
                });
            }
        });
    }
    else {
        // Generic fallback - looks for common link patterns
        const links = document.querySelectorAll('a');
        let linkIndex = 1;
        links.forEach(link => {
            const title = link.innerText.trim();
            const url = link.href;
            if (title && url && !url.startsWith('javascript:') && !url.startsWith('#') && title.length > 5) {
                searchLinks.push({
                    index: linkIndex++,
                    title: title.substring(0, 100), // Limit title length
                    url: url,
                    source: 'Generic'
                });
            }
        });
    }
    
    return searchLinks;
}

// Make function available globally
window.getAllSearchLinks = extractSearchLinks;

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "getLinks") {
        const links = extractSearchLinks();
        sendResponse({links: links});
    }
    return true;
});

// Auto-extract when page loads (optional)
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        const links = extractSearchLinks();
        console.log(`Found ${links.length} search links`);
        console.log(links);
    });
} else {
    const links = extractSearchLinks();
    console.log(`Found ${links.length} search links`);
    console.log(links);
}