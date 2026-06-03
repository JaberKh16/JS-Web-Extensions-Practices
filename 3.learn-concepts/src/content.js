// Content script that runs on pages
console.log("Content script loaded");

// function to extract all links from the page and send them to the background script
function extractLinks() {
    const searchLinks = [];

    // detect which search engine is being used and extract links accordingly
     // Detect which search engine we're on
    const url = window.location.href;
    let selector = '';
    
    if (url.includes("google.com/search")) {
        // Google search results
        selector = "div.yuRUbf > a";
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
}