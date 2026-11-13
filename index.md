---
layout: default
title: XTOR
description: A minimal, open format for distributed video feeds. Like RSS for video content.
---

<header class="hero">
    <div class="container">
        <h1>{{ site.title }}</h1>
        <!-- <p class="subtitle">eXtensible Torrent-style Object Retrieval</p> -->
        <p class="tagline">A minimal, open format for distributed video feeds. Like RSS for video content.</p>
        <div class="cta-buttons">
            <a href="{{ '/specification/' | relative_url }}" class="btn btn-primary">Read Specification</a>
            <a href="{{ '/testing/' | relative_url }}" class="btn btn-secondary">Test Your API</a>
        </div>
    </div>
</header>

<section class="features">
    <div class="container">
        <h2>Key Principles</h2>
        <div class="features-grid">
            <div class="feature-card">
                <div class="feature-icon">🌐</div>
                <h3>Decentralized</h3>
                <p>Anyone can host a feed. No central authority or gatekeepers.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">📺</div>
                <h3>Provider-agnostic</h3>
                <p>Any client can consume any feed. True interoperability.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🔓</div>
                <h3>Open Standard</h3>
                <p>No registration or API keys required. Just HTTP and JSON.</p>
            </div>
            <div class="feature-card">
                <div class="feature-icon">🎯</div>
                <h3>Minimal</h3>
                <p>Three simple endpoints. Easy to implement and understand.</p>
            </div>
        </div>
    </div>
</section>

<section class="overview">
    <div class="container">
        <h2>What is XTOR?</h2>
        <p>XTOR is a standard HTTP/JSON format that enables any content provider to expose their video catalog in a machine-readable way. Think of it like RSS/Atom feeds, but specifically designed for video content with quality selection, filtering, and pagination.</p>

        <div class="comparison">
            <h3>How XTOR Compares</h3>
            <div class="comparison-table">
                <table>
                    <thead>
                        <tr>
                            <th>Feature</th>
                            <th>XTOR</th>
                            <th>RSS</th>
                            <th>YouTube API</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Video-specific</td>
                            <td class="yes">✅</td>
                            <td class="no">❌</td>
                            <td class="yes">✅</td>
                        </tr>
                        <tr>
                            <td>Quality selection</td>
                            <td class="yes">✅</td>
                            <td class="no">❌</td>
                            <td class="yes">✅</td>
                        </tr>
                        <tr>
                            <td>Decentralized</td>
                            <td class="yes">✅</td>
                            <td class="yes">✅</td>
                            <td class="no">❌</td>
                        </tr>
                        <tr>
                            <td>No authentication</td>
                            <td class="yes">✅</td>
                            <td class="yes">✅</td>
                            <td class="no">❌</td>
                        </tr>
                        <tr>
                            <td>Live streams</td>
                            <td class="yes">✅</td>
                            <td class="no">❌</td>
                            <td class="yes">✅</td>
                        </tr>
                        <tr>
                            <td>Filtering & search</td>
                            <td class="yes">✅</td>
                            <td class="no">❌</td>
                            <td class="yes">✅</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</section>

<section class="endpoints">
    <div class="container">
        <h2>Three Simple Endpoints</h2>
        <div class="endpoints-grid">
            <div class="endpoint-card">
                <div class="endpoint-method">GET</div>
                <h3>/manifest</h3>
                <p>Feed metadata and capabilities</p>
                <a href="{{ '/specification/' | relative_url }}#manifest" class="learn-more">Learn more →</a>
            </div>
            <div class="endpoint-card">
                <div class="endpoint-method">GET</div>
                <h3>/videos</h3>
                <p>Paginated video list with filtering</p>
                <a href="{{ '/specification/' | relative_url }}#videos" class="learn-more">Learn more →</a>
            </div>
            <div class="endpoint-card">
                <div class="endpoint-method">GET</div>
                <h3>/videos/:id</h3>
                <p>Individual video details</p>
                <a href="{{ '/specification/' | relative_url }}#video-detail" class="learn-more">Learn more →</a>
            </div>
        </div>
    </div>
</section>

<section class="quick-start">
    <div class="container">
        <h2>Quick Start</h2>
        <div class="code-example">
            <div class="code-header">Minimal Python Implementation</div>
            <pre><code>from flask import Flask, jsonify, request

app = Flask(__name__)

@app.after_request
def cors(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    return response

@app.route('/manifest')
def manifest():
    return jsonify({
        "name": "My Video Feed",
        "xtor_version": "1.0",
        "active": True,
        "search": False
    })

@app.route('/videos')
def videos():
    page = request.args.get('page', 1, type=int)
    return jsonify({
        "videos": [{
            "id": "video1",
            "title": "Sample Video",
            "thumbnail": "https://example.com/thumb.jpg",
            "duration": 120,
            "formats": [{
                "quality": 720,
                "url": "https://example.com/video-720p.mp4"
            }]
        }],
        "pagination": {
            "page": page,
            "has_next": False
        }
    })

@app.route('/videos/&lt;video_id&gt;')
def video_detail(video_id):
    return jsonify({
        "id": video_id,
        "title": "Sample Video",
        "thumbnail": "https://example.com/thumb.jpg",
        "duration": 120,
        "formats": [
            {"quality": 720, "url": "https://example.com/video-720p.mp4"},
            {"quality": 1080, "url": "https://example.com/video-1080p.mp4"}
        ]
    })

if __name__ == '__main__':
    app.run(debug=True)</code></pre>
        </div>
        <div class="cta-buttons">
            <a href="{{ '/specification/' | relative_url }}" class="btn btn-primary">Full Specification</a>
            <a href="{{ '/testing/' | relative_url }}" class="btn btn-secondary">Test Your Feed</a>
        </div>
    </div>
</section>

<section class="get-started">
    <div class="container">
        <h2>Get Started</h2>
        <div class="get-started-grid">
            <div class="get-started-card">
                <h3>For Providers</h3>
                <p>Implement the XTOR spec to expose your video content to any compatible client.</p>
                <a href="{{ '/specification/' | relative_url }}" class="btn btn-outline">Read Specification →</a>
            </div>
            <div class="get-started-card">
                <h3>For Developers</h3>
                <p>Build clients and apps that can consume any XTOR-compatible feed.</p>
                <a href="{{ '/clients/' | relative_url }}" class="btn btn-outline">Browse Clients →</a>
            </div>
            <div class="get-started-card">
                <h3>Test Your API</h3>
                <p>Use our interactive testing tool to validate your XTOR feed implementation.</p>
                <a href="{{ '/testing/' | relative_url }}" class="btn btn-outline">Open Tester →</a>
            </div>
        </div>
    </div>
</section>
