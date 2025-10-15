let currentEndpoint = 'manifest';
let lastResponse = null;
let manifestData = null;
let videosData = null;

function selectEndpoint(endpoint) {
    currentEndpoint = endpoint;

    // Update button states
    document.querySelectorAll('.endpoint-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.querySelector(`[data-endpoint="${endpoint}"]`).classList.add('active');

    // Show/hide relevant parameters
    document.getElementById('videosParams').style.display = endpoint === 'videos' ? 'block' : 'none';
    document.getElementById('detailParams').style.display = endpoint === 'detail' ? 'block' : 'none';

    updateRequestUrl();
}

function loadExample(url) {
    document.getElementById('baseUrl').value = url;
    updateRequestUrl();
    // Auto-load manifest when example is selected
    loadManifest();
}

async function loadManifest() {
    const baseUrl = document.getElementById('baseUrl').value.trim();
    if (!baseUrl) return;

    try {
        const response = await fetch(`${baseUrl}/manifest`);
        if (!response.ok) {
            console.warn('Could not load manifest');
            manifestData = null;
            updateDynamicUI();
            return;
        }

        manifestData = await response.json();
        updateDynamicUI();

        // Show notification
        showNotification('Manifest loaded! Filters and options populated.', 'success');
    } catch (error) {
        console.warn('Error loading manifest:', error);
        manifestData = null;
        updateDynamicUI();
    }
}

function updateDynamicUI() {
    updateFiltersUI();
    updateSortUI();
    updateSearchUI();
    updateFeedInfo();
}

function updateFeedInfo() {
    const container = document.getElementById('feedInfo');
    if (!container) return;

    if (!manifestData) {
        container.innerHTML = '<p class="feed-info-placeholder">Enter a base URL and click "Load Manifest" to see feed capabilities</p>';
        return;
    }

    const capabilities = [];
    if (manifestData.search) capabilities.push('Search');
    if (manifestData.filters && manifestData.filters.length > 0) capabilities.push(`${manifestData.filters.length} Filter${manifestData.filters.length > 1 ? 's' : ''}`);
    if (manifestData.sort && manifestData.sort.options) capabilities.push(`${manifestData.sort.options.length} Sort Option${manifestData.sort.options.length > 1 ? 's' : ''}`);

    container.innerHTML = `
        <div class="feed-info-card ${manifestData.active ? 'feed-active' : 'feed-inactive'}">
            ${manifestData.logo ? `<img src="${manifestData.logo}" alt="${manifestData.name}" class="feed-logo">` : ''}
            <div class="feed-info-content">
                <h4>${manifestData.name}</h4>
                ${manifestData.description ? `<p>${manifestData.description}</p>` : ''}
                <div class="feed-meta">
                    <span class="feed-badge">${manifestData.xtor_version}</span>
                    <span class="feed-badge ${manifestData.active ? 'badge-success' : 'badge-error'}">${manifestData.active ? 'Active' : 'Inactive'}</span>
                    ${capabilities.length > 0 ? `<span class="feed-badge">${capabilities.join(' • ')}</span>` : ''}
                </div>
            </div>
        </div>
    `;
}

function updateFiltersUI() {
    const container = document.getElementById('dynamicFilters');
    if (!container) return;

    if (!manifestData || !manifestData.filters || manifestData.filters.length === 0) {
        container.innerHTML = '<p class="filter-placeholder">No filters available. Enter filters manually or load a manifest.</p>';
        return;
    }

    let html = '<div class="filter-groups">';
    manifestData.filters.forEach(filter => {
        html += `
            <div class="filter-group">
                <label>${filter.label}</label>
                <select class="filter-select" data-filter-id="${filter.id}">
                    <option value="">All ${filter.label}</option>
                    ${filter.options.map(opt => `<option value="${opt.id}">${opt.label}</option>`).join('')}
                </select>
            </div>
        `;
    });
    html += '</div>';
    html += '<button class="apply-filters-btn" onclick="applyDynamicFilters()">Apply Filters</button>';

    container.innerHTML = html;
}

function updateSortUI() {
    const container = document.getElementById('dynamicSort');
    if (!container) return;

    if (!manifestData || !manifestData.sort || !manifestData.sort.options) {
        container.innerHTML = '<p class="sort-placeholder">No sort options available.</p>';
        return;
    }

    let html = `
        <label>Sort By</label>
        <select id="sortSelect" class="sort-select" onchange="applySortOption()">
            ${manifestData.sort.options.map(opt => `
                <option value="${opt.id}" ${opt.id === manifestData.sort.default ? 'selected' : ''}>${opt.label}</option>
            `).join('')}
        </select>
    `;

    container.innerHTML = html;
}

function updateSearchUI() {
    const searchInput = document.getElementById('search');
    const searchGroup = searchInput?.parentElement;

    if (!searchGroup) return;

    if (manifestData && manifestData.search === false) {
        searchGroup.style.opacity = '0.5';
        searchInput.disabled = true;
        searchInput.placeholder = 'Search not supported by this feed';
    } else {
        searchGroup.style.opacity = '1';
        searchInput.disabled = false;
        searchInput.placeholder = manifestData?.search ? 'Search videos...' : 'Search query (if supported)';
    }
}

function applyDynamicFilters() {
    const selects = document.querySelectorAll('.filter-select');
    const filters = [];

    selects.forEach(select => {
        if (select.value) {
            filters.push(`${select.dataset.filterId}:${select.value}`);
        }
    });

    document.getElementById('filters').value = filters.join(',');
    updateRequestUrl();
    showNotification('Filters applied!', 'success');
}

function applySortOption() {
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        document.getElementById('sort').value = sortSelect.value;
        updateRequestUrl();
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.add('show');
    }, 10);

    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function updateRequestUrl() {
    const baseUrl = document.getElementById('baseUrl').value.trim();
    if (!baseUrl) {
        document.getElementById('requestUrl').textContent = 'Enter a base URL';
        return;
    }

    let url = baseUrl;

    if (currentEndpoint === 'manifest') {
        url += '/manifest';
    } else if (currentEndpoint === 'videos') {
        url += '/videos';
        const params = new URLSearchParams();

        const page = document.getElementById('page').value;
        const limit = document.getElementById('limit').value;
        const search = document.getElementById('search').value;
        const filters = document.getElementById('filters').value;
        const sort = document.getElementById('sort').value;

        if (page) params.append('page', page);
        if (limit) params.append('limit', limit);
        if (search) params.append('query', search);
        if (filters) {
            filters.split(',').forEach(filter => {
                const trimmed = filter.trim();
                if (trimmed) params.append('filter', trimmed);
            });
        }
        if (sort) params.append('sort', sort);

        const queryString = params.toString();
        if (queryString) url += '?' + queryString;
    } else if (currentEndpoint === 'detail') {
        const videoId = document.getElementById('videoId').value.trim();
        url += '/videos/' + (videoId || ':id');
    }

    document.getElementById('requestUrl').textContent = url;
}

// Update URL when inputs change
document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('baseUrl').addEventListener('input', updateRequestUrl);
    ['page', 'limit', 'search', 'filters', 'sort', 'videoId'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.addEventListener('input', updateRequestUrl);
    });

    // Initialize
    updateRequestUrl();
});

async function testEndpoint() {
    const baseUrl = document.getElementById('baseUrl').value.trim();
    if (!baseUrl) {
        alert('Please enter a base URL');
        return;
    }

    const statusBadge = document.getElementById('statusBadge');
    const responseContent = document.getElementById('responseContent');
    const validationChecklist = document.getElementById('validationChecklist');

    statusBadge.textContent = 'Loading...';
    statusBadge.className = 'status-badge status-pending';
    responseContent.textContent = 'Fetching data...';

    const requestUrl = document.getElementById('requestUrl').textContent;

    try {
        const response = await fetch(requestUrl);
        const data = await response.json();
        lastResponse = data;

        // Store response data for later use
        if (currentEndpoint === 'manifest') {
            manifestData = data;
            updateDynamicUI();
        } else if (currentEndpoint === 'videos') {
            videosData = data;
            updateVideoIdSelector();
        }

        // Display response
        responseContent.textContent = JSON.stringify(data, null, 2);

        if (response.ok) {
            statusBadge.textContent = `${response.status} OK`;
            statusBadge.className = 'status-badge status-success';
        } else {
            statusBadge.textContent = `${response.status} Error`;
            statusBadge.className = 'status-badge status-error';
        }

        // Validate response
        validateResponse(data, currentEndpoint, validationChecklist);

    } catch (error) {
        statusBadge.textContent = 'Error';
        statusBadge.className = 'status-badge status-error';
        responseContent.textContent = `Error: ${error.message}\n\nMake sure:\n1. The URL is correct\n2. CORS is enabled on the server\n3. The server is running`;

        validationChecklist.innerHTML = `
            <div class="validation-item fail">
                <span class="validation-icon">✗</span>
                <span>Request failed: ${error.message}</span>
            </div>
        `;
    }
}

function updateVideoIdSelector() {
    const container = document.getElementById('videoIdSelector');
    if (!container) return;

    if (!videosData || !videosData.videos || videosData.videos.length === 0) {
        container.innerHTML = '<p class="video-id-placeholder">No videos loaded. Test the Videos endpoint first.</p>';
        return;
    }

    let html = `
        <label>Quick Select Video</label>
        <select id="videoIdSelect" class="video-id-select" onchange="applyVideoId()">
            <option value="">-- Select a video --</option>
            ${videosData.videos.map(video => `
                <option value="${video.id}">${video.title} (${video.id})</option>
            `).join('')}
        </select>
        <small>${videosData.videos.length} video(s) available from last Videos request</small>
    `;

    container.innerHTML = html;
}

function applyVideoId() {
    const select = document.getElementById('videoIdSelect');
    if (select && select.value) {
        document.getElementById('videoId').value = select.value;
        updateRequestUrl();
    }
}

function validateResponse(data, endpoint, container) {
    const validations = [];

    if (endpoint === 'manifest') {
        validations.push(checkField(data, 'name', 'string', true));
        validations.push(checkField(data, 'xtor_version', 'string', true));
        validations.push(checkField(data, 'active', 'boolean', true));
        validations.push(checkField(data, 'description', 'string', false));
        validations.push(checkField(data, 'logo', 'string', false));
        validations.push(checkField(data, 'search', 'boolean', false));

        if (data.filters) {
            validations.push(checkArray(data, 'filters', false));
            if (Array.isArray(data.filters) && data.filters.length > 0) {
                const filter = data.filters[0];
                validations.push(checkField(filter, 'id', 'string', true, 'filters[0]'));
                validations.push(checkField(filter, 'label', 'string', true, 'filters[0]'));
                validations.push(checkArray(filter, 'options', true, 'filters[0]'));
            }
        }

        if (data.sort) {
            validations.push(checkField(data.sort, 'default', 'string', false, 'sort'));
            validations.push(checkArray(data.sort, 'options', false, 'sort'));
        }
    } else if (endpoint === 'videos') {
        validations.push(checkArray(data, 'videos', true));

        if (Array.isArray(data.videos) && data.videos.length > 0) {
            const video = data.videos[0];
            validations.push(checkField(video, 'id', 'string', true, 'videos[0]'));
            validations.push(checkField(video, 'title', 'string', true, 'videos[0]'));
            validations.push(checkField(video, 'thumbnail', 'string', true, 'videos[0]'));
            validations.push(checkField(video, 'source_url', 'string', false, 'videos[0]'));
            validations.push(checkField(video, 'duration', ['number', 'null'], false, 'videos[0]'));

            if (video.formats) {
                validations.push(checkArray(video, 'formats', false, 'videos[0]'));
            }
        }

        validations.push(checkField(data, 'pagination', 'object', true));
        if (data.pagination) {
            validations.push(checkField(data.pagination, 'page', 'number', true, 'pagination'));
            validations.push(checkField(data.pagination, 'has_next', 'boolean', true, 'pagination'));
        }
    } else if (endpoint === 'detail') {
        validations.push(checkField(data, 'id', 'string', true));
        validations.push(checkField(data, 'title', 'string', true));
        validations.push(checkField(data, 'thumbnail', 'string', true));
        validations.push(checkField(data, 'description', 'string', false));
        validations.push(checkField(data, 'source_url', 'string', false));
        validations.push(checkField(data, 'duration', ['number', 'null'], false));
        validations.push(checkField(data, 'published_at', 'string', false));
        validations.push(checkArray(data, 'formats', true));

        if (Array.isArray(data.formats)) {
            if (data.formats.length === 0) {
                validations.push({
                    pass: false,
                    message: 'formats array is empty - all videos must be playable'
                });
            } else {
                const format = data.formats[0];
                validations.push(checkField(format, 'quality', ['number', 'null'], false, 'formats[0]'));
                validations.push(checkField(format, 'url', 'string', true, 'formats[0]'));
            }
        }
    }

    // Display validations
    container.innerHTML = validations.map(v => {
        const className = v.pass ? 'pass' : (v.warning ? 'warning' : 'fail');
        const icon = v.pass ? '✓' : (v.warning ? '⚠' : '✗');
        return `
            <div class="validation-item ${className}">
                <span class="validation-icon">${icon}</span>
                <span>${v.message}</span>
            </div>
        `;
    }).join('');
}

function checkField(obj, field, type, required, path = '') {
    const fullPath = path ? `${path}.${field}` : field;
    const types = Array.isArray(type) ? type : [type];

    if (!(field in obj)) {
        if (required) {
            return { pass: false, message: `Missing required field: ${fullPath}` };
        } else {
            return { pass: true, warning: true, message: `Optional field not present: ${fullPath}` };
        }
    }

    const value = obj[field];
    const actualType = value === null ? 'null' : typeof value;

    if (!types.includes(actualType)) {
        return { pass: false, message: `Field ${fullPath} should be ${types.join(' or ')}, got ${actualType}` };
    }

    return { pass: true, message: `Field ${fullPath} is valid (${actualType})` };
}

function checkArray(obj, field, required, path = '') {
    const fullPath = path ? `${path}.${field}` : field;

    if (!(field in obj)) {
        if (required) {
            return { pass: false, message: `Missing required array: ${fullPath}` };
        } else {
            return { pass: true, warning: true, message: `Optional array not present: ${fullPath}` };
        }
    }

    if (!Array.isArray(obj[field])) {
        return { pass: false, message: `Field ${fullPath} should be an array` };
    }

    return { pass: true, message: `Field ${fullPath} is a valid array (${obj[field].length} items)` };
}

function copyResponse() {
    const content = document.getElementById('responseContent').textContent;
    navigator.clipboard.writeText(content).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copied!';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}
