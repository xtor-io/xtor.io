---
layout: testing
title: XTOR API Tester
subtitle: Test and validate your XTOR feed implementation
---

<div class="examples-section">
    <h3>Example Test Feeds</h3>
    <p>Click on an example to load it into the tester:</p>
    <div class="example-feeds">
        <div class="example-feed" onclick="loadExample('https://sample.xtor.io')">
            <h4>Sample feed</h4>
            <p>Example feed non copyrighted videos</p>
            <code>https://sample.xtor.io</code>
        </div>
    </div>
</div>

<div class="tester-layout">
    <div class="tester-panel">
        <h3>Configuration</h3>
        <div class="form-group">
            <label for="baseUrl">Base URL</label>
            <div style="display: flex; gap: 0.5rem;">
                <input type="text" id="baseUrl" placeholder="https://sample.xtor.io" value="" style="flex: 1;">
                <button class="load-manifest-btn" onclick="loadManifest()">Load Manifest</button>
            </div>
            <small>The base URL of your XTOR feed (without /manifest, /videos, etc.)</small>
        </div>

        <div id="feedInfo" class="feed-info-container">
            <p class="feed-info-placeholder">Enter a base URL and click "Load Manifest" to see feed capabilities</p>
        </div>

        <div class="form-group">
            <label>Endpoint to Test</label>
            <div class="endpoint-selector">
                <button class="endpoint-btn active" data-endpoint="manifest" onclick="selectEndpoint('manifest')">
                    Manifest
                </button>
                <button class="endpoint-btn" data-endpoint="videos" onclick="selectEndpoint('videos')">
                    Videos
                </button>
                <button class="endpoint-btn" data-endpoint="detail" onclick="selectEndpoint('detail')">
                    Detail
                </button>
            </div>
        </div>

        <div id="videosParams" style="display: none;">
            <div class="form-group">
                <label for="page">Page</label>
                <input type="number" id="page" value="1" min="1">
            </div>

            <div class="form-group">
                <label for="limit">Limit</label>
                <input type="number" id="limit" value="20" min="1" max="100">
            </div>

            <div class="form-group">
                <label for="search">Search Query</label>
                <input type="text" id="search" placeholder="concert">
            </div>

            <div id="dynamicFilters" class="dynamic-filters-container">
                <p class="filter-placeholder">No filters available. Enter filters manually or load a manifest.</p>
            </div>

            <div class="form-group">
                <label for="filters">Manual Filters (Advanced)</label>
                <input type="text" id="filters" placeholder="genre:rock,year:2024">
                <small>Comma-separated filters in key:value format</small>
            </div>

            <div id="dynamicSort" class="dynamic-sort-container">
                <p class="sort-placeholder">No sort options available.</p>
            </div>

            <div class="form-group">
                <label for="sort">Manual Sort (Advanced)</label>
                <input type="text" id="sort" placeholder="recent">
            </div>
        </div>

        <div id="detailParams" style="display: none;">
            <div id="videoIdSelector" class="video-id-selector-container">
                <p class="video-id-placeholder">No videos loaded. Test the Videos endpoint first.</p>
            </div>

            <div class="form-group">
                <label for="videoId">Manual Video ID</label>
                <input type="text" id="videoId" placeholder="video123">
                <small>The ID of the video to fetch</small>
            </div>
        </div>

        <button class="test-button" onclick="testEndpoint()">Test Endpoint</button>
    </div>

    <div class="tester-panel">
        <h3>Request Info</h3>
        <div class="form-group">
            <label>Full URL</label>
            <div class="response-content" style="min-height: auto;">
                <pre id="requestUrl">Enter a base URL and click Test Endpoint</pre>
            </div>
        </div>

        <div class="form-group">
            <label>Validation Checklist</label>
            <div id="validationChecklist">
                <div class="validation-item status-pending">
                    <span class="validation-icon">⏳</span>
                    <span>Click "Test Endpoint" to start validation</span>
                </div>
            </div>
        </div>
    </div>

    <div class="tester-panel response-panel">
        <div class="response-header">
            <h3>Response</h3>
            <div>
                <span id="statusBadge" class="status-badge status-pending">Ready</span>
                <button class="copy-button" onclick="copyResponse()" style="margin-left: 0.5rem;">Copy JSON</button>
            </div>
        </div>
        <div class="response-content">
            <pre id="responseContent">Response will appear here...</pre>
        </div>
    </div>
</div>
