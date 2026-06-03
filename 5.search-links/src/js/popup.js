// Popup script
document.getElementById('extractBtn').addEventListener('click', () => {
    extractLinks();
});

document.getElementById('copyAllBtn').addEventListener('click', () => {
    copyAllLinks();
});

document.getElementById('exportJSONBtn').addEventListener('click', () => {
    exportJSON();
});

document.getElementById('exportCSVBtn').addEventListener('click', () => {
    exportCSV();
});

let currentLinks = [];

function extractLinks() {
    showStatus('Extracting links...', '#2196F3');
    
    chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {action: "getLinks"}, (response) => {
            if (chrome.runtime.lastError) {
                showStatus('Error: Please refresh the page and try again', '#f44336');
                console.error(chrome.runtime.lastError);
                return;
            }
            
            if (response && response.links) {
                currentLinks = response.links;
                displayLinks(currentLinks);
                showStats(currentLinks);
                showStatus(`✅ Found ${currentLinks.length} links!`, '#4CAF50');
            } else {
                showStatus('No links found. Make sure you\'re on a search results page.', '#ff9800');
            }
        });
    });
}

function displayLinks(links) {
    const container = document.getElementById('linksContainer');
    
    if (links.length === 0) {
        container.innerHTML = '<p>No links found. Try extracting again.</p>';
        return;
    }
    
    container.innerHTML = links.map(link => `
        <div class="link-item">
            <div class="link-index">#${link.index}</div>
            <div class="link-title">${escapeHtml(link.title)}</div>
            <div class="link-url">${escapeHtml(link.url)}</div>
            <div class="link-source">Source: ${link.source || 'Unknown'}</div>
            <button class="copy-btn" data-url="${escapeHtml(link.url)}" data-title="${escapeHtml(link.title)}">
                📋 Copy URL
            </button>
        </div>
    `).join('');
    
    // Add copy functionality to individual buttons
    document.querySelectorAll('.copy-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const url = btn.getAttribute('data-url');
            copyToClipboard(url);
            showStatus('URL copied to clipboard!', '#4CAF50');
            e.stopPropagation();
        });
    });
}

function showStats(links) {
    const statsDiv = document.getElementById('stats');
    const sources = {};
    links.forEach(link => {
        const source = link.source || 'Unknown';
        sources[source] = (sources[source] || 0) + 1;
    });
    
    let statsHtml = `📊 Total Links: ${links.length} | `;
    for (const [source, count] of Object.entries(sources)) {
        statsHtml += `${source}: ${count} | `;
    }
    
    statsDiv.innerHTML = statsHtml.slice(0, -3);
    statsDiv.style.display = 'block';
}

function copyAllLinks() {
    if (currentLinks.length === 0) {
        showStatus('No links to copy. Extract links first.', '#ff9800');
        return;
    }
    
    let text = 'Search Results:\n\n';
    currentLinks.forEach(link => {
        text += `${link.index}. ${link.title}\n   URL: ${link.url}\n   Source: ${link.source}\n\n`;
    });
    
    copyToClipboard(text);
    showStatus(`✅ Copied ${currentLinks.length} links to clipboard!`, '#4CAF50');
}

function exportJSON() {
    if (currentLinks.length === 0) {
        showStatus('No links to export. Extract links first.', '#ff9800');
        return;
    }
    
    const dataStr = JSON.stringify(currentLinks, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search_links_${new Date().toISOString().slice(0,19)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('JSON exported successfully!', '#4CAF50');
}

function exportCSV() {
    if (currentLinks.length === 0) {
        showStatus('No links to export. Extract links first.', '#ff9800');
        return;
    }
    
    const headers = ['Index', 'Title', 'URL', 'Source'];
    const rows = currentLinks.map(link => [
        link.index,
        `"${link.title.replace(/"/g, '""')}"`,
        `"${link.url}"`,
        link.source || 'Unknown'
    ]);
    
    const csvContent = [headers, ...rows].map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], {type: 'text/csv'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `search_links_${new Date().toISOString().slice(0,19)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showStatus('CSV exported successfully!', '#4CAF50');
}

function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        console.log('Copied to clipboard');
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function showStatus(message, color) {
    const statusDiv = document.getElementById('status');
    statusDiv.textContent = message;
    statusDiv.style.backgroundColor = color;
    statusDiv.style.display = 'block';
    statusDiv.style.color = 'white';
    statusDiv.style.padding = '10px';
    statusDiv.style.borderRadius = '5px';
    
    setTimeout(() => {
        statusDiv.style.display = 'none';
    }, 3000);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}