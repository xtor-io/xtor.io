---
layout: page
title: XTOR Specification v1.0
subtitle: Complete technical documentation for implementing XTOR feeds
header_class: spec-header
content_class: spec-content
---

<div class="spec-section">
    <h2>Table of Contents</h2>
    <ul>
        <li><a href="#overview">Overview</a></li>
        <li><a href="#endpoints">Required Endpoints</a></li>
        <li><a href="#manifest">1. Manifest Endpoint</a></li>
        <li><a href="#videos">2. Videos List Endpoint</a></li>
        <li><a href="#video-detail">3. Video Detail Endpoint</a></li>
        <li><a href="#feed-types">Feed Types & Use Cases</a></li>
        <li><a href="#live-streams">Live Streams</a></li>
        <li><a href="#formats">Supported Video Formats</a></li>
        <li><a href="#client-behavior">Client Behavior Guidelines</a></li>
        <li><a href="#cors">CORS Requirements</a></li>
        <li><a href="#status-codes">HTTP Status Codes</a></li>
        <li><a href="#versioning">Versioning</a></li>
    </ul>
</div>

<div class="spec-section" id="overview">
    <h2>Overview</h2>
    <p>XTOR is a standard HTTP/JSON format that enables any content provider to expose their video catalog in a machine-readable way. Clients (like XTOR TV app) can connect to any XTOR-compatible feed.</p>

    <h3>Key Principles</h3>
    <ul>
        <li><strong>Decentralized</strong> - Anyone can host a feed</li>
        <li><strong>Provider-agnostic</strong> - Any client can consume any feed</li>
        <li><strong>Open standard</strong> - No registration or API keys required</li>
        <li><strong>Minimal</strong> - Three simple endpoints</li>
    </ul>
</div>

<div class="spec-section" id="endpoints">
    <h2>Required Endpoints</h2>
    <p>All XTOR feeds MUST implement these three endpoints:</p>
    <table class="spec-table">
        <thead>
            <tr>
                <th>Endpoint</th>
                <th>Purpose</th>
                <th>Required</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code>GET /manifest</code></td>
                <td>Feed metadata and capabilities</td>
                <td>✅ Yes</td>
            </tr>
            <tr>
                <td><code>GET /videos</code></td>
                <td>Paginated video list</td>
                <td>✅ Yes</td>
            </tr>
            <tr>
                <td><code>GET /videos/:id</code></td>
                <td>Individual video details</td>
                <td>✅ Yes</td>
            </tr>
        </tbody>
    </table>
</div>

{% include specification/manifest.html %}
{% include specification/videos.html %}
{% include specification/video_detail.html %}

<div class="spec-section" id="feed-types">
    <h2>Feed Types & Use Cases</h2>
    <p>XTOR is designed for <strong>playable video content</strong>. All videos must have at least one format URL.</p>

    <div class="warning-box">
        <strong>Note:</strong> Pure directory/catalog feeds (with only <code>source_url</code> and no playable formats) are NOT valid XTOR feeds.
    </div>
</div>

<div class="spec-section" id="live-streams">
    <h2>Live Streams</h2>
    <p>For live content, set <code>duration</code> to <code>null</code> and typically use <code>quality: null</code> for adaptive streams.</p>
</div>

<div class="spec-section" id="formats">
    <h2>Supported Video Formats</h2>
    <p>XTOR supports any HTTP-accessible video format:</p>
    <ul>
        <li><strong>MP4 / WebM</strong> - Direct video files</li>
        <li><strong>HLS (.m3u8)</strong> - Adaptive streaming</li>
        <li><strong>DASH (.mpd)</strong> - Adaptive streaming</li>
        <li><strong>Direct HTTP streams</strong> - Progressive download</li>
    </ul>
</div>

<div class="spec-section" id="client-behavior">
    <h2>Client Behavior Guidelines</h2>

    <h3>Quality Selection</h3>
    <ul>
        <li>When <code>quality: null</code>: Display as "Auto" or "Default"</li>
        <li>When multiple qualities available: Let user select preferred quality</li>
        <li>Remember user's quality preference across sessions</li>
    </ul>

    <h3>Source URL Handling</h3>
    <ul>
        <li>When <code>source_url</code> present: Show "Watch Original" or "View on [Platform]" button</li>
        <li>On click: Open in system browser or in-app browser</li>
        <li>Preserve tracking/affiliate parameters in URL</li>
    </ul>
</div>

<div class="spec-section" id="cors">
    <h2>CORS Requirements</h2>
    <p>All XTOR feeds MUST set proper CORS headers:</p>
    <div class="code-example">
        <div class="code-header">Required Headers</div>
        <pre><code>Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Content-Type</code></pre>
    </div>
</div>

<div class="spec-section" id="status-codes">
    <h2>HTTP Status Codes</h2>
    <table class="spec-table">
        <thead>
            <tr>
                <th>Code</th>
                <th>Usage</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td><code>200 OK</code></td>
                <td>Successful response</td>
            </tr>
            <tr>
                <td><code>404 Not Found</code></td>
                <td>Video ID not found</td>
            </tr>
            <tr>
                <td><code>400 Bad Request</code></td>
                <td>Invalid parameters</td>
            </tr>
            <tr>
                <td><code>500 Internal Server Error</code></td>
                <td>Server error</td>
            </tr>
        </tbody>
    </table>
</div>

<div class="spec-section" id="versioning">
    <h2>Versioning</h2>
    <p>The <code>xtor_version</code> field in the manifest indicates which version of the XTOR specification the feed implements.</p>

    <div class="success-box">
        <strong>License:</strong> XTOR is an open format. Anyone can implement it freely without restrictions.
    </div>
</div>
