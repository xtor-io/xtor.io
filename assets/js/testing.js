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
        if (search) params.append('search', search);
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
        url += '/videos/' + (videoId ? encodeURIComponent(videoId) : ':id');
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
        const text = await response.text();
        let data;
        try {
            data = JSON.parse(text);
        } catch (e) {
            throw new Error(`HTTP ${response.status}: response is not JSON. Every XTOR response, including errors, must be JSON`);
        }
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

        // If a search was sent, check that `search` actually narrows the results
        if (currentEndpoint === 'videos' && response.ok) {
            await validateSearchNarrows(requestUrl, data, validationChecklist);
        }

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

    if (data && typeof data === 'object' && 'error' in data && !('videos' in data) && !('name' in data) && !('id' in data)) {
        validations.length = 0;
        validations.push(typeof data.error === 'string'
            ? { pass: true, message: `Error body has an "error" message: ${data.error}` }
            : { pass: false, message: 'Error body should be {"error": "message"}' });
    } else {
        validations.push(...ruleChecks(data, endpoint));
    }

    // Display validations
    container.innerHTML = validations.map(v => {
        const className = v.pass ? 'pass' : (v.warning ? 'warning' : 'fail');
        const icon = v.pass ? '✓' : (v.warning ? '⚠' : '✗');
        return `
            <div class="validation-item ${className}">
                <span class="validation-icon">${icon}</span>
                <span>${escapeHtml(v.message)}</span>
            </div>
        `;
    }).join('');
}

// Spec rules beyond field types. Checks every video, not only the first.
function ruleChecks(data, endpoint) {
    const out = [];
    const isAbsUrl = u => typeof u === 'string' && /^https?:\/\/[^/]/i.test(u);
    const isTimestamp = t => /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/.test(t);
    const problems = [];

    const checkVideo = (v, where, isDetail) => {
        if (!v || typeof v !== 'object') { problems.push(`${where} is not an object`); return; }
        if (typeof v.id !== 'string' || v.id === '') problems.push(`${where}.id must be a non-empty string`);
        else if (!/^[A-Za-z0-9._-]+$/.test(v.id)) out.push({ pass: false, warning: true, message: `${where}.id "${v.id}" contains characters outside A-Z a-z 0-9 - _ . (allowed, but not recommended)` });
        if (typeof v.title !== 'string' || v.title === '') problems.push(`${where}.title must be a non-empty string`);
        if (!isAbsUrl(v.thumbnail)) problems.push(`${where}.thumbnail must be an absolute http(s) URL`);
        if ('duration' in v && v.duration !== null && !Number.isInteger(v.duration)) problems.push(`${where}.duration must be whole seconds or null (got ${JSON.stringify(v.duration)})`);
        if ('published_at' in v && !isTimestamp(v.published_at)) problems.push(`${where}.published_at should look like 2025-01-15T20:30:00Z (got ${JSON.stringify(v.published_at)})`);
        if ('source_url' in v && !isAbsUrl(v.source_url)) problems.push(`${where}.source_url must be an absolute http(s) URL`);
        if ('formats' in v) {
            if (!Array.isArray(v.formats)) { problems.push(`${where}.formats must be an array`); return; }
            if (v.formats.length === 0) problems.push(isDetail ? 'formats is empty: return 404 when nothing is playable' : `${where}.formats is empty: omit it from the list instead`);
            v.formats.forEach((f, i) => {
                const fw = `${where}.formats[${i}]`;
                if (!isAbsUrl(f?.url)) problems.push(`${fw}.url must be an absolute http(s) URL`);
                else if (/\/embed\//i.test(f.url)) problems.push(`${fw}.url looks like an embed page, not a direct stream`);
                if (f && 'quality' in f && f.quality !== null && !Number.isInteger(f.quality)) problems.push(`${fw}.quality must be an integer or null`);
            });
        } else if (isDetail) {
            problems.push('formats is missing: the detail endpoint must return at least one format');
        }
    };

    if (endpoint === 'manifest') {
        if (typeof data.xtor_version === 'string' && !data.xtor_version.startsWith('1.')) problems.push(`xtor_version should be "1.0" (got "${data.xtor_version}")`);
        if ('logo' in data && !isAbsUrl(data.logo)) problems.push('logo must be an absolute http(s) URL');
        if ('logo' in data && /\.svg(\?|$)/i.test(data.logo || '')) out.push({ pass: false, warning: true, message: 'logo is SVG; PNG or JPEG works on more players' });
        (Array.isArray(data.filters) ? data.filters : []).forEach((f, i) => {
            if (typeof f?.id === 'string' && f.id.includes(':')) problems.push(`filters[${i}].id must not contain ":"`);
            if (!Array.isArray(f?.options) || f.options.length === 0) problems.push(`filters[${i}].options must have at least one option`);
        });
        if (data.sort) {
            const opts = Array.isArray(data.sort.options) ? data.sort.options : [];
            if (opts.length === 0) problems.push('sort.options must have at least one option (or leave out sort)');
            if (data.sort.default && !opts.some(o => o.id === data.sort.default)) problems.push(`sort.default "${data.sort.default}" is not one of sort.options`);
        }
    } else if (endpoint === 'videos') {
        const videos = Array.isArray(data.videos) ? data.videos : [];
        videos.forEach((v, i) => checkVideo(v, `videos[${i}]`, false));
        const ids = videos.map(v => v?.id);
        if (new Set(ids).size !== ids.length) problems.push('videos contains duplicate ids');
        if (data.pagination) {
            if (!Number.isInteger(data.pagination.page)) problems.push('pagination.page must be an integer');
            if (videos.length === 0 && data.pagination.has_next === true) problems.push('has_next is true but this page is empty');
        }
        if (videos.length > 0) out.push({ pass: true, message: `Checked all ${videos.length} videos on this page` });
    } else if (endpoint === 'detail') {
        checkVideo(data, 'video', true);
        const requested = document.getElementById('videoId')?.value.trim();
        if (requested && data.id !== requested) problems.push(`id "${data.id}" does not match the requested id "${requested}"`);
    }

    problems.forEach(message => out.push({ pass: false, message }));
    if (problems.length === 0) out.push({ pass: true, message: 'No spec rule violations found' });
    return out;
}

// Compares the searched response against the same request without `search`.
// A feed that ignores `search` returns identical results for both.
async function validateSearchNarrows(requestUrl, searchedData, container) {
    let url;
    try {
        url = new URL(requestUrl);
    } catch (e) {
        return;
    }
    const term = url.searchParams.get('search');
    if (!term) return;

    let result;
    if (manifestData && manifestData.search === false) {
        result = { pass: true, message: `search not tested: manifest declares search: false` };
    } else {
        url.searchParams.delete('search');
        try {
            const baseline = await (await fetch(url.toString())).json();
            const ids = d => (Array.isArray(d?.videos) ? d.videos.map(v => v.id) : []);
            const searchedIds = ids(searchedData);
            const baselineIds = ids(baseline);
            const same = searchedIds.length === baselineIds.length &&
                searchedIds.every((id, i) => id === baselineIds[i]) &&
                searchedData?.pagination?.has_next === baseline?.pagination?.has_next;

            if (!same) {
                result = { pass: true, message: `search="${term}" narrows results (${searchedIds.length} vs ${baselineIds.length} unfiltered on this page)` };
            } else if (manifestData && manifestData.search === true) {
                result = { pass: false, message: `search="${term}" returned the same results as no search, but manifest declares search: true. Is the feed reading the old "query" name instead of "search"?` };
            } else {
                result = { pass: false, warning: true, message: `search="${term}" returned the same results as no search. Either every video matches, or the feed ignores "search" (load the manifest first for a stricter check)` };
            }
        } catch (error) {
            result = { pass: false, warning: true, message: `Could not fetch unfiltered baseline to verify search: ${error.message}` };
        }
    }

    const className = result.pass ? 'pass' : (result.warning ? 'warning' : 'fail');
    const icon = result.pass ? '✓' : (result.warning ? '⚠' : '✗');
    container.insertAdjacentHTML('beforeend', `
        <div class="validation-item ${className}">
            <span class="validation-icon">${icon}</span>
            <span>${escapeHtml(result.message)}</span>
        </div>
    `);
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
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
