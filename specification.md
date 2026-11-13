---
layout: page
title: XTOR Specification v1.0
subtitle: Three JSON endpoints. Any feed, any player.
header_class: spec-header
content_class: spec-content
---

<div class="spec-section">
    <h2>Contents</h2>
    <ol>
        <li><a href="#at-a-glance">At a Glance</a></li>
        <li><a href="#basics">Basics: URLs, HTTP and JSON</a></li>
        <li><a href="#manifest">GET /manifest</a></li>
        <li><a href="#videos">GET /videos</a></li>
        <li><a href="#video-detail">GET /videos/:id</a></li>
        <li><a href="#video-object">The Video Object</a></li>
        <li><a href="#format-object">The Format Object</a></li>
        <li><a href="#errors">Status Codes and Errors</a></li>
        <li><a href="#cors">CORS</a></li>
        <li><a href="#clients">Client Guidelines</a></li>
        <li><a href="#checklist">Feed Checklist</a></li>
        <li><a href="#versioning">Versioning and Changelog</a></li>
    </ol>
    <p>The key words <strong>MUST</strong>, <strong>SHOULD</strong> and <strong>MAY</strong> are used as in <a href="https://www.rfc-editor.org/rfc/rfc2119" target="_blank" rel="noopener">RFC 2119</a>. Everything else is explanation.</p>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="at-a-glance">
    <h2>1. At a Glance</h2>
    <p>An XTOR feed is a set of three read-only JSON endpoints under one <strong>base URL</strong>. A player only needs that base URL to browse and play everything the feed offers.</p>

    <table class="spec-table">
        <thead>
            <tr><th>Endpoint</th><th>Returns</th><th>Required</th></tr>
        </thead>
        <tbody>
            <tr><td><code>GET {base}/manifest</code></td><td>Feed name, logo and capabilities (search, filters, sort)</td><td>✅ Yes</td></tr>
            <tr><td><code>GET {base}/videos</code></td><td>One page of videos, with optional search, filter and sort</td><td>✅ Yes</td></tr>
            <tr><td><code>GET {base}/videos/{id}</code></td><td>One video with its playable formats</td><td>✅ Yes</td></tr>
        </tbody>
    </table>

    <div class="info-box">
        <strong>How a player uses a feed:</strong><br>
        1. Read <code>/manifest</code> to learn the name and which controls to show.<br>
        2. Page through <code>/videos</code> to fill the grid.<br>
        3. When the viewer picks a video, use its <code>formats</code> from the list, or fetch <code>/videos/{id}</code> to get them.
    </div>

    <p>The smallest valid feed is three static JSON responses. Search, filters, sorting, descriptions and multiple qualities are all optional.</p>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="basics">
    <h2>2. Basics: URLs, HTTP and JSON</h2>

    <h3>Base URL</h3>
    <ul>
        <li>The base URL is the address you give to players, for example <code>https://example.com</code> or <code>https://example.com/xtor</code>. It MAY contain a path.</li>
        <li>The endpoints are the base URL plus <code>/manifest</code>, <code>/videos</code> and <code>/videos/{id}</code>.</li>
        <li>The base URL has no trailing slash, query string or fragment.</li>
        <li>When you publish your feed, publish the base URL. Players also accept a link that ends in <code>/manifest</code> and strip it (see <a href="#clients">Client Guidelines</a>).</li>
    </ul>

    <h3>HTTP</h3>
    <ul>
        <li>All endpoints are <code>GET</code> and need no authentication, cookies or custom headers.</li>
        <li>Feeds SHOULD be served over <strong>HTTPS</strong>. Some players (web, Smart TV) refuse plain <code>http://</code> streams.</li>
        <li>Feeds SHOULD serve <code>/manifest</code> and <code>/videos</code> with and without a trailing slash.</li>
    </ul>

    <h3>JSON</h3>
    <ul>
        <li>Every response body, including errors, MUST be JSON in UTF-8 with <code>Content-Type: application/json</code>.</li>
        <li><strong>Optional fields:</strong> leave out a field you don't have. Don't send <code>""</code> for missing text. For <code>duration</code>, a missing value and <code>null</code> mean the same thing (live).</li>
        <li><strong>Extra fields:</strong> feeds MAY add fields that are not in this spec. Players MUST ignore fields they don't know. Start your own field names with <code>x_</code> (for example <code>x_views</code>) so they never clash with future XTOR fields.</li>
        <li><strong>URLs:</strong> every URL in a response (<code>logo</code>, <code>thumbnail</code>, <code>source_url</code>, <code>formats[].url</code>) MUST be absolute and start with <code>https://</code> or <code>http://</code>. Relative and protocol-relative (<code>//cdn…</code>) URLs are not allowed.</li>
        <li><strong>Text:</strong> <code>title</code> and <code>description</code> are plain text. Line breaks (<code>\n</code>) are allowed; HTML is not.</li>
    </ul>

    <h3>Video IDs</h3>
    <ul>
        <li>An <code>id</code> is a string, unique within the feed and stable over time, so bookmarks and favorites keep working.</li>
        <li>Feeds SHOULD only use the characters <code>A–Z a–z 0–9 - _ .</code> in IDs. Players percent-encode IDs, but URL-safe IDs avoid problems with routers, proxies and older players.</li>
        <li>Numbers are not allowed: send <code>"42"</code>, not <code>42</code>.</li>
    </ul>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="manifest">
    <h2>3. GET /manifest</h2>
    <p>Describes the feed. Players call it first to show the feed's name and logo, and to decide which controls (search box, filter chips, sort menu) to show.</p>

    <div class="code-example">
        <div class="code-header">Example: GET https://example.com/xtor/manifest</div>
        <pre><code>{
  "name": "Indie Music Videos",
  "description": "Independent artist music videos and live performances.",
  "xtor_version": "1.0",
  "logo": "https://example.com/logo-512.png",
  "active": true,
  "search": true,
  "filters": [
    {
      "id": "genre",
      "label": "Genre",
      "options": [
        { "id": "rock", "label": "Rock" },
        { "id": "jazz", "label": "Jazz" }
      ]
    },
    {
      "id": "year",
      "label": "Year",
      "options": [
        { "id": "2025", "label": "2025" },
        { "id": "2024", "label": "2024" }
      ]
    }
  ],
  "sort": {
    "default": "recent",
    "options": [
      { "id": "recent", "label": "Most Recent" },
      { "id": "popular", "label": "Most Popular" }
    ]
  }
}</code></pre>
    </div>

    <div class="code-example">
        <div class="code-header">Smallest valid manifest</div>
        <pre><code>{
  "name": "Simple Video Feed",
  "xtor_version": "1.0",
  "active": true
}</code></pre>
    </div>

    <h3>Fields</h3>
    <table class="spec-table">
        <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Meaning</th></tr>
        </thead>
        <tbody>
            <tr><td><code>name</code></td><td>string</td><td>✅ Yes</td><td>Display name of the feed.</td></tr>
            <tr><td><code>xtor_version</code></td><td>string</td><td>✅ Yes</td><td>Spec version the feed implements. Use <code>"1.0"</code>.</td></tr>
            <tr><td><code>active</code></td><td>boolean</td><td>✅ Yes</td><td><code>true</code> when the feed works. Set <code>false</code> during maintenance or when the feed is shutting down; players then show it as unavailable.</td></tr>
            <tr><td><code>description</code></td><td>string</td><td>No</td><td>One or two sentences about the content.</td></tr>
            <tr><td><code>logo</code></td><td>string (URL)</td><td>No</td><td>Square PNG or JPEG, at least 256×256 px (512×512 recommended). SVG is not supported everywhere.</td></tr>
            <tr><td><code>search</code></td><td>boolean</td><td>No</td><td><code>true</code> if <code>/videos</code> supports the <code>search</code> parameter. Default <code>false</code>.</td></tr>
            <tr><td><code>filters</code></td><td>array</td><td>No</td><td>Filters the viewer can pick from. Leave out if you have none.</td></tr>
            <tr><td><code>sort</code></td><td>object</td><td>No</td><td>Sort orders the viewer can pick from. Leave out if you have only one order.</td></tr>
        </tbody>
    </table>

    <h3>Filters</h3>
    <p>Each filter is one choice the viewer can make, such as Genre or Year. Players show one control per filter and let the viewer pick <strong>one option per filter</strong> (or none).</p>
    <table class="spec-table">
        <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Meaning</th></tr>
        </thead>
        <tbody>
            <tr><td><code>id</code></td><td>string</td><td>✅ Yes</td><td>Key used in the <code>filter</code> parameter. MUST NOT contain <code>:</code>.</td></tr>
            <tr><td><code>label</code></td><td>string</td><td>✅ Yes</td><td>Name shown to the viewer, for example "Genre".</td></tr>
            <tr><td><code>options</code></td><td>array</td><td>✅ Yes</td><td>At least one option, each <code>{"id": string, "label": string}</code>. The option <code>id</code> is the value used in the <code>filter</code> parameter.</td></tr>
        </tbody>
    </table>
    <p>Keep option lists short enough to scroll on a TV remote (about 50 options at most per filter). For large catalogs (thousands of tags), offer search instead.</p>

    <h3>Sort</h3>
    <table class="spec-table">
        <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Meaning</th></tr>
        </thead>
        <tbody>
            <tr><td><code>options</code></td><td>array</td><td>✅ Yes</td><td>At least one option, each <code>{"id": string, "label": string}</code>. The <code>id</code> is the value of the <code>sort</code> parameter.</td></tr>
            <tr><td><code>default</code></td><td>string</td><td>No</td><td>ID of the order the feed uses when no <code>sort</code> is sent. If omitted, the first option is the default.</td></tr>
        </tbody>
    </table>
    <p>Each option should really change the order. Something that narrows the results (such as "New models only") belongs in <code>filters</code>, not <code>sort</code>.</p>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="videos">
    <h2>4. GET /videos</h2>
    <p>Returns one page of videos. Without parameters it returns the first page in the default order.</p>

    <h3>Query Parameters</h3>
    <p>All parameters are optional. Feeds are <strong>lenient</strong>: an unknown or invalid value is ignored or replaced by the default. It never causes an error response.</p>
    <table class="spec-table">
        <thead>
            <tr><th>Parameter</th><th>Example</th><th>Meaning</th><th>If missing or invalid</th></tr>
        </thead>
        <tbody>
            <tr>
                <td><code>page</code></td>
                <td><code>page=2</code></td>
                <td>Page number, starting at 1.</td>
                <td>Use page 1.</td>
            </tr>
            <tr>
                <td><code>limit</code></td>
                <td><code>limit=24</code></td>
                <td>Requested page size. Feeds SHOULD honor values from 1 to 100 and MAY use their own fixed page size instead.</td>
                <td>Use the feed's page size (20 recommended).</td>
            </tr>
            <tr>
                <td><code>search</code></td>
                <td><code>search=concert</code></td>
                <td>Free text typed by the viewer. Only used when the manifest has <code>"search": true</code>. The feed decides how to match (title, description, tags, …).</td>
                <td>No text search. Feeds without search ignore it.</td>
            </tr>
            <tr>
                <td><code>filter</code></td>
                <td><code>filter=genre:rock</code></td>
                <td>One selected filter option, written as <code>{filter id}:{option id}</code>. Repeat the parameter for each filter the viewer selected.</td>
                <td>Unknown filter IDs or option IDs are ignored.</td>
            </tr>
            <tr>
                <td><code>sort</code></td>
                <td><code>sort=popular</code></td>
                <td>ID of a sort option from the manifest.</td>
                <td>Use the manifest's default sort.</td>
            </tr>
        </tbody>
    </table>

    <h4>How filters combine</h4>
    <ul>
        <li>Players send at most one <code>filter</code> per filter ID: <code>?filter=genre:rock&amp;filter=year:2024</code>.</li>
        <li>Different filters combine with <strong>AND</strong>: rock videos from 2024.</li>
        <li>Search, filters and sort all apply together.</li>
        <li>Split each value on the <strong>first</strong> <code>:</code>. The option ID may contain more colons; the filter ID may not.</li>
        <li>If a request does carry the same filter ID twice, the feed MAY use either value or both.</li>
    </ul>

    <div class="warning-box">
        <strong>PHP and Laravel:</strong> PHP keeps only the <em>last</em> value of a repeated parameter, so <code>$_GET['filter']</code> and <code>$request-&gt;query('filter')</code> lose filters. Read the raw query string instead (snippet below). In Node.js, <code>req.query.filter</code> is a string for one filter and an array for several. In Python/Flask, use <code>request.args.getlist('filter')</code>.
    </div>

    <div class="code-example">
        <div class="code-header">PHP: read all filter parameters</div>
        <pre><code>$filters = [];
foreach (explode('&amp;', $_SERVER['QUERY_STRING'] ?? '') as $pair) {
    [$name, $value] = array_pad(explode('=', $pair, 2), 2, '');
    if (urldecode($name) !== 'filter') continue;
    [$key, $option] = array_pad(explode(':', urldecode($value), 2), 2, null);
    if ($key !== '' &amp;&amp; $option !== null) $filters[$key] = $option;
}</code></pre>
    </div>

    <h3>Response</h3>
    <div class="code-example">
        <div class="code-header">Example: GET https://example.com/xtor/videos?search=concert&amp;sort=recent</div>
        <pre><code>{
  "videos": [
    {
      "id": "mv001",
      "title": "Sunset Live Performance",
      "thumbnail": "https://example.com/thumbs/mv001.jpg",
      "duration": 245,
      "published_at": "2025-01-15T20:30:00Z"
    },
    {
      "id": "live001",
      "title": "Festival Live Stream",
      "thumbnail": "https://example.com/thumbs/live001.jpg",
      "duration": null
    }
  ],
  "pagination": {
    "page": 1,
    "has_next": true
  }
}</code></pre>
    </div>

    <table class="spec-table">
        <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Meaning</th></tr>
        </thead>
        <tbody>
            <tr><td><code>videos</code></td><td>array</td><td>✅ Yes</td><td><a href="#video-object">Video objects</a> in the requested order. May be empty.</td></tr>
            <tr><td><code>pagination.page</code></td><td>integer</td><td>✅ Yes</td><td>The page number that was served (the requested page, or 1 if the request had none or an invalid one).</td></tr>
            <tr><td><code>pagination.has_next</code></td><td>boolean</td><td>✅ Yes</td><td><code>true</code> only if the next page has at least one video.</td></tr>
        </tbody>
    </table>

    <h3>Rules</h3>
    <ul>
        <li><strong>No results:</strong> return <code>200</code> with <code>"videos": []</code> and <code>"has_next": false</code>. This also applies to a page past the end.</li>
        <li><strong>Page size:</strong> a page MAY hold fewer videos than <code>limit</code>, even when <code>has_next</code> is <code>true</code> (for example after hiding removed videos). Players rely on <code>has_next</code>, not on counting.</li>
        <li><strong>Stable paging:</strong> the same video should not appear on two pages of one listing. For live content that changes every minute, that is best effort.</li>
        <li><strong>Formats in the list:</strong> optional. Leaving them out keeps the list small; players then fetch <code>/videos/{id}</code>. If you include them, include all formats for that video, because players may play straight from the list. Leave them out if your stream URLs expire.</li>
        <li><strong>Search and filters</strong> only narrow the results. A video in a filtered or searched list is also available through <code>/videos/{id}</code>.</li>
    </ul>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="video-detail">
    <h2>5. GET /videos/:id</h2>
    <p>Returns one <a href="#video-object">Video object</a> with its playable formats. Players call it when the viewer opens or plays a video, so it should be fast (under 200&nbsp;ms is a good target).</p>

    <div class="code-example">
        <div class="code-header">Example: GET https://example.com/xtor/videos/mv001</div>
        <pre><code>{
  "id": "mv001",
  "title": "Sunset Live Performance",
  "description": "Recorded live at the Indie Music Festival 2025.\nPerformed by The Wanderers.",
  "thumbnail": "https://example.com/thumbs/mv001.jpg",
  "source_url": "https://example.com/watch/mv001",
  "duration": 245,
  "published_at": "2025-01-15T20:30:00Z",
  "formats": [
    { "quality": 1080, "url": "https://cdn.example.com/mv001-1080p.mp4" },
    { "quality": 720,  "url": "https://cdn.example.com/mv001-720p.mp4" },
    { "quality": null, "url": "https://cdn.example.com/mv001/master.m3u8" }
  ]
}</code></pre>
    </div>

    <div class="code-example">
        <div class="code-header">Example: a live stream</div>
        <pre><code>{
  "id": "live001",
  "title": "Festival Live Stream",
  "thumbnail": "https://example.com/thumbs/live001.jpg",
  "duration": null,
  "formats": [
    { "quality": null, "url": "https://cdn.example.com/live001/index.m3u8" }
  ]
}</code></pre>
    </div>

    <h3>Rules</h3>
    <ul>
        <li><code>id</code> MUST equal the requested ID.</li>
        <li><code>formats</code> MUST be present and contain <strong>at least one</strong> playable format.</li>
        <li>If the video doesn't exist, was removed, is offline, or has nothing playable right now: return <code>404</code> with an <a href="#errors">error body</a>. Never return <code>200</code> with an empty <code>formats</code> array.</li>
        <li><code>title</code> and <code>thumbnail</code> SHOULD be the same as in the list, so the screen doesn't change when the detail arrives.</li>
        <li><strong>Expiring URLs:</strong> if stream URLs are signed, keep them valid for at least the video's duration plus a margin (or several hours for live). Players fetch this endpoint again when playback fails.</li>
    </ul>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="video-object">
    <h2>6. The Video Object</h2>
    <p><code>/videos</code> and <code>/videos/{id}</code> use the same Video object. The list may leave out the heavier fields (<code>description</code>, <code>formats</code>); the detail endpoint must include <code>formats</code>.</p>

    <table class="spec-table">
        <thead>
            <tr><th>Field</th><th>Type</th><th>List</th><th>Detail</th><th>Meaning</th></tr>
        </thead>
        <tbody>
            <tr><td><code>id</code></td><td>string</td><td>✅ Required</td><td>✅ Required</td><td>Unique, stable ID. See <a href="#basics">Video IDs</a>.</td></tr>
            <tr><td><code>title</code></td><td>string</td><td>✅ Required</td><td>✅ Required</td><td>Video title.</td></tr>
            <tr><td><code>thumbnail</code></td><td>string (URL)</td><td>✅ Required</td><td>✅ Required</td><td>16:9 JPEG, PNG or WebP image, at least 640×360 px (1280×720 looks sharp on TVs).</td></tr>
            <tr><td><code>duration</code></td><td>integer or null</td><td>Optional</td><td>Optional</td><td>Length in <strong>whole seconds</strong> (round, never send <code>12.5</code>). <code>null</code> or missing means <strong>live</strong>. Always send it for on-demand videos.</td></tr>
            <tr><td><code>published_at</code></td><td>string</td><td>Optional</td><td>Optional</td><td>Publication time in UTC, in exactly this form: <code>2025-01-15T20:30:00Z</code>.</td></tr>
            <tr><td><code>source_url</code></td><td>string (URL)</td><td>Optional</td><td>Optional</td><td>Web page of the original, for "Watch original", sharing or a QR code. Affiliate parameters are fine.</td></tr>
            <tr><td><code>description</code></td><td>string</td><td>Optional</td><td>Optional</td><td>Plain text, may span several lines.</td></tr>
            <tr><td><code>formats</code></td><td>array</td><td>Optional</td><td>✅ Required, non-empty</td><td>Playable versions of the video. See <a href="#format-object">The Format Object</a>.</td></tr>
        </tbody>
    </table>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="format-object">
    <h2>7. The Format Object</h2>
    <p>A format is one stream URL a media player can open directly.</p>

    <table class="spec-table">
        <thead>
            <tr><th>Field</th><th>Type</th><th>Required</th><th>Meaning</th></tr>
        </thead>
        <tbody>
            <tr><td><code>url</code></td><td>string (URL)</td><td>✅ Yes</td><td>Direct stream URL. See the allowed types below.</td></tr>
            <tr><td><code>quality</code></td><td>integer or null</td><td>No</td><td>Resolution as viewers know it: <code>360</code>, <code>480</code>, <code>720</code>, <code>1080</code>, <code>1440</code>, <code>2160</code>. Shown as "720p". <code>null</code> or missing means adaptive or unknown, shown as "Auto".</td></tr>
        </tbody>
    </table>

    <h3>Allowed stream types</h3>
    <table class="spec-table">
        <thead>
            <tr><th>Type</th><th>URL must</th><th>Notes</th></tr>
        </thead>
        <tbody>
            <tr><td>HLS</td><td>contain <code>.m3u8</code></td><td>Best choice for live and adaptive streams. Use <code>quality: null</code> for a multi-bitrate master playlist.</td></tr>
            <tr><td>DASH</td><td>contain <code>.mpd</code></td><td>Not supported on every device. Also offer HLS or MP4 if you can.</td></tr>
            <tr><td>MP4</td><td>be any other http(s) URL</td><td>H.264 video + AAC audio plays everywhere.</td></tr>
            <tr><td>WebM</td><td>be any other http(s) URL</td><td>Not supported on every device. Also offer MP4.</td></tr>
        </tbody>
    </table>
    <p>Players detect the stream type from <code>.m3u8</code> or <code>.mpd</code> in the URL. Without one of those, they treat the URL as a single video file.</p>

    <div class="warning-box">
        <strong>Not allowed as a format:</strong> web pages and embed players (<code>…/embed/123</code>), RTMP, WebRTC, DRM-protected streams, and URLs that need cookies or special headers. Put a web page in <code>source_url</code> instead.
    </div>

    <h3>Quality values</h3>
    <ul>
        <li>Use the standard value that matches the encode: a 1920×1080 or 1920×800 (cinema) file is <code>1080</code>, and a 1280×720 or 1280×534 file is <code>720</code>.</li>
        <li>Only use a number when you know it. When you know a stream is "HD" but not its resolution, use <code>null</code>.</li>
        <li>Give each format a different <code>url</code>. Formats may come in any order; players sort them themselves.</li>
    </ul>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="errors">
    <h2>8. Status Codes and Errors</h2>
    <table class="spec-table">
        <thead>
            <tr><th>Code</th><th>When</th></tr>
        </thead>
        <tbody>
            <tr><td><code>200 OK</code></td><td>Success, including an empty <code>videos</code> list.</td></tr>
            <tr><td><code>404 Not Found</code></td><td><code>/videos/{id}</code>: the video doesn't exist, was removed, is offline, or has no playable format.</td></tr>
            <tr><td><code>500</code> / <code>502</code> / <code>503</code></td><td>Something broke on your side or upstream. Use <code>503 Service Unavailable</code> for a temporary outage.</td></tr>
        </tbody>
    </table>
    <p>Feeds don't return <code>400</code> for bad parameters; they fall back to defaults (see <a href="#videos">GET /videos</a>).</p>
    <p>Every error response MUST have a JSON body with a short, human-readable message that players can show to the viewer:</p>
    <div class="code-example">
        <div class="code-header">Error body</div>
        <pre><code>{ "error": "Video not found" }</code></pre>
    </div>
    <div class="info-box">
        <strong>Upstream down?</strong> If your feed wraps another API and that API fails, return <code>503</code> with an error, not <code>200</code> with an empty list. Players then show "try again" instead of "no videos".
    </div>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="cors">
    <h2>9. CORS</h2>
    <p>Web and Smart TV players run in a browser engine, so every response (including errors) MUST allow cross-origin requests:</p>
    <div class="code-example">
        <div class="code-header">Headers on every response</div>
        <pre><code>Access-Control-Allow-Origin: *</code></pre>
    </div>
    <p>Feeds SHOULD also answer <code>OPTIONS</code> preflight requests on all three endpoints with <code>200</code> or <code>204</code> and:</p>
    <div class="code-example">
        <div class="code-header">Preflight response headers</div>
        <pre><code>Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, OPTIONS
Access-Control-Allow-Headers: Accept, Content-Type</code></pre>
    </div>
    <p>Frameworks that only register <code>GET</code> routes often answer <code>OPTIONS</code> without these headers. Test it with <code>curl -i -X OPTIONS {base}/videos</code>.</p>
    <p>Thumbnails and stream URLs on another domain (a CDN) SHOULD also send <code>Access-Control-Allow-Origin: *</code>, because browser players load HLS playlists and segments with JavaScript.</p>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="clients">
    <h2>10. Client Guidelines</h2>
    <p>Players that follow these rules work with every valid feed.</p>

    <h3>Adding a feed</h3>
    <ol>
        <li><strong>Normalize the URL</strong> the viewer typed or scanned: trim spaces, add <code>https://</code> if there is no scheme, drop query and fragment, remove trailing slashes, and remove a trailing <code>/manifest</code> or <code>/videos</code>.</li>
        <li>Fetch <code>/manifest</code>. If it returns 404, isn't JSON, or lacks <code>name</code> or <code>xtor_version</code>, show "This is not an XTOR feed".</li>
        <li>Accept any <code>xtor_version</code> starting with <code>1.</code>.</li>
        <li>If <code>active</code> is <code>false</code>, show the feed as unavailable. Fetch the manifest again whenever the feed is opened, so name, logo, <code>active</code> and filters stay current.</li>
    </ol>

    <h3>Browsing</h3>
    <ol>
        <li>Show the search box only when <code>search</code> is <code>true</code>.</li>
        <li>Show one single-select control per filter, with an "All" choice. Send one <code>filter=id:option</code> per selected filter.</li>
        <li>You don't need to send <code>sort</code> for the default order; the feed applies it. Send <code>sort</code> when the viewer picks an order.</li>
        <li>Build query strings with a proper URL encoder (so <code>search=rock &amp; roll</code> stays intact).</li>
        <li>Load the next page while <code>has_next</code> is <code>true</code>. Stop when a page returns no videos you haven't seen yet, even if <code>has_next</code> is <code>true</code>.</li>
        <li>Treat a missing <code>pagination</code> object as <code>has_next: false</code>.</li>
    </ol>

    <h3>Playing</h3>
    <ol>
        <li>Percent-encode the ID in <code>/videos/{id}</code> like <code>encodeURIComponent</code> does, so <code>/</code>, spaces and <code>?</code> are escaped.</li>
        <li>If the list item has <code>formats</code>, you MAY start playing from them. Otherwise fetch <code>/videos/{id}</code>. If playback fails, fetch <code>/videos/{id}</code> again (URLs may have expired) before showing an error.</li>
        <li>Skip formats you can't play (unknown scheme, <code>http://</code> on an HTTPS-only platform). If nothing remains, say the video is not available.</li>
        <li>Detect the stream type from <code>.m3u8</code> (HLS) or <code>.mpd</code> (DASH) in the URL; otherwise treat it as a progressive file.</li>
        <li>Choosing the starting quality is up to the player. A common approach is a user setting such as "Auto" or "720p", picking the closest quality at or below it.</li>
        <li>A video with <code>duration</code> <code>null</code> or missing is live: hide the progress bar and show a LIVE badge. If the player then finds a fixed length, it MAY switch to on-demand controls.</li>
    </ol>

    <h3>Robustness</h3>
    <ol>
        <li>Ignore unknown fields. Tolerate missing optional fields.</li>
        <li>Parse <code>published_at</code> as ISO 8601, including fractional seconds and time-zone offsets. If it can't be parsed, hide it.</li>
        <li>On an error status, show the body's <code>error</code> message if there is one (some frameworks use <code>message</code>), otherwise a friendly text for the status code.</li>
        <li>Send <code>Accept: application/json</code>.</li>
    </ol>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="checklist">
    <h2>11. Feed Checklist</h2>
    <p>Before you publish a feed, check that:</p>
    <ul>
        <li>☐ <code>/manifest</code> has <code>name</code>, <code>xtor_version: "1.0"</code> and <code>active</code>.</li>
        <li>☐ <code>search: true</code> only if the <code>search</code> parameter really narrows <code>/videos</code>.</li>
        <li>☐ Repeated <code>filter</code> parameters are all applied (watch out for PHP's last-value-wins), and unknown filters are ignored, not answered with zero results.</li>
        <li>☐ Every <code>id</code> is a string and works in <code>/videos/{id}</code>.</li>
        <li>☐ <code>duration</code> is whole seconds for on-demand videos and <code>null</code> for live.</li>
        <li>☐ <code>/videos/{id}</code> returns at least one direct stream URL, or <code>404</code>.</li>
        <li>☐ All URLs are absolute, preferably <code>https://</code>.</li>
        <li>☐ Errors are JSON <code>{"error": "…"}</code>, and every response has <code>Access-Control-Allow-Origin: *</code>.</li>
        <li>☐ The feed passes the <a href="{{ '/testing/' | relative_url }}">API Tester</a>.</li>
    </ul>
</div>

<!-- ============================================================ -->
<div class="spec-section" id="versioning">
    <h2>12. Versioning and Changelog</h2>
    <p>The manifest's <code>xtor_version</code> names the spec version a feed implements. Within <code>1.x</code>, changes only add optional fields or clarify behavior, so a <code>1.0</code> player keeps working with a <code>1.1</code> feed. A change that would break existing players gets a new major version (<code>2.0</code>).</p>

    <h3>Changelog</h3>
    <table class="spec-table">
        <thead>
            <tr><th>Date</th><th>Version</th><th>Change</th></tr>
        </thead>
        <tbody>
            <tr>
                <td>2026-11-13</td>
                <td>1.0 (revised)</td>
                <td>
                    Rewritten for clarity, based on how existing players and feeds behave. <code>xtor_version</code> stays <code>"1.0"</code>. The clarifications:
                    <ul>
                        <li>The search parameter is <code>search</code>. Earlier text called it <code>query</code>.</li>
                        <li>Defined the base URL (it may contain a path), how filters combine (AND, one option per filter), and that invalid parameters fall back to defaults instead of returning <code>400</code>.</li>
                        <li>One shared Video object for the list and detail endpoints. <code>published_at</code> and <code>description</code> may also appear in the list.</li>
                        <li><code>duration</code> is whole seconds. <code>published_at</code> uses the <code>2025-01-15T20:30:00Z</code> form.</li>
                        <li>Format URLs must be direct streams (no embed pages, RTMP or WebRTC). <code>quality</code> uses the standard resolution values and may be omitted.</li>
                        <li>A detail response without playable formats is a <code>404</code>. Every error has a JSON <code>{"error"}</code> body and CORS headers.</li>
                        <li>All URLs must be absolute. IDs should be URL-safe, and players percent-encode them.</li>
                        <li>Extension fields start with <code>x_</code>, and players ignore unknown fields.</li>
                        <li>Added Client Guidelines and a Feed Checklist.</li>
                    </ul>
                </td>
            </tr>
            <tr>
                <td>October 2025</td>
                <td>1.0</td>
                <td>First release.</td>
            </tr>
        </tbody>
    </table>

    <div class="success-box">
        <strong>License:</strong> XTOR is an open format. Anyone can implement it freely, without registration or fees.
    </div>
</div>
