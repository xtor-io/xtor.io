<div align="center">

# 📺 XTOR

*A minimal, open format for distributed video feeds. Like RSS for video content.*

[![License](https://img.shields.io/badge/license-Open%20Format-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0-green.svg)](https://xtor.io/specification/)
[![Documentation](https://img.shields.io/badge/docs-xtor.io-purple.svg)](https://xtor.io)

[🌐 Website](https://xtor.io) • [📖 Specification](https://xtor.io/specification/) • [🧪 API Tester](https://xtor.io/testing/) • [📱 Clients](https://xtor.io/clients/)

</div>

---

## 🎯 What is XTOR?

XTOR is an **open standard** for video feed distribution that enables:

- 🌐 **Decentralized** - Anyone can host a feed, no centralized platform needed
- 📺 **Universal** - Any client can consume any feed
- 🔓 **Open** - No API keys, registration, or authentication required
- 🎯 **Minimal** - Just three simple HTTP/JSON endpoints
- ⚡ **Efficient** - Built-in pagination, filtering, and quality selection

Think of it as **RSS for video content** with modern features like quality selection, search, filtering, and live streaming support.

---

## 🚀 Quick Start

### Creating a Feed (5 minutes)

A minimal XTOR feed requires just three endpoints:

```python
from flask import Flask, jsonify

app = Flask(__name__)

# 1. Manifest - Describes your feed
@app.route('/manifest')
def manifest():
    return jsonify({
        "name": "My Video Feed",
        "xtor_version": "1.0",
        "active": True
    })

# 2. Videos List - Paginated video catalog
@app.route('/videos')
def videos():
    return jsonify({
        "videos": [{
            "id": "video1",
            "title": "Sample Video",
            "thumbnail": "https://example.com/thumb.jpg",
            "duration": 120,
            "formats": [{"quality": 720, "url": "https://example.com/video.mp4"}]
        }],
        "pagination": {"page": 1, "has_next": False}
    })

# 3. Video Detail - Individual video metadata
@app.route('/videos/<video_id>')
def video_detail(video_id):
    return jsonify({
        "id": video_id,
        "title": "Sample Video",
        "thumbnail": "https://example.com/thumb.jpg",
        "formats": [{"quality": 720, "url": "https://example.com/video.mp4"}]
    })

app.run()
```

**That's it!** Your feed is ready at `http://localhost:5000`

---

## ✨ Features

### For Feed Providers

- ✅ **Simple Implementation** - Three endpoints, pure JSON
- ✅ **Flexible Hosting** - Any web server, CDN, or cloud platform
- ✅ **Quality Control** - Multiple quality levels per video
- ✅ **Search & Filters** - Built-in discovery capabilities
- ✅ **Live Streaming** - Native HLS/DASH support
- ✅ **Attribution** - Optional source URLs for content linking
- ✅ **No Lock-in** - Own your content and distribution

### For Client Developers

- ✅ **Standard Format** - Consistent API across all feeds
- ✅ **Lazy Loading** - Efficient bandwidth usage
- ✅ **Rich Metadata** - Thumbnails, duration, descriptions
- ✅ **Quality Selection** - Let users choose their preferred quality
- ✅ **CORS Enabled** - Works in web browsers
- ✅ **No Authentication** - Simplified client implementation

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        XTOR Ecosystem                        │
├─────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌──────────┐      ┌──────────┐      ┌──────────┐          │
│  │  Feed 1  │      │  Feed 2  │      │  Feed N  │          │
│  │ (Music)  │      │ (Sports) │      │  (News)  │          │
│  └────┬─────┘      └────┬─────┘      └────┬─────┘          │
│       │                 │                  │                 │
│       └─────────────────┴──────────────────┘                │
│                         │                                    │
│                    XTOR Format                               │
│              (manifest, videos, detail)                      │
│                         │                                    │
│       ┌─────────────────┴──────────────────┐                │
│       │                                     │                │
│  ┌────▼────┐  ┌───────────┐  ┌──────────┐ ┌─────────┐     │
│  │   TV    │  │  Mobile   │  │   Web    │ │  Other  │     │
│  │  Apps   │  │   Apps    │  │ Players  │ │ Clients │     │
│  └─────────┘  └───────────┘  └──────────┘ └─────────┘     │
│                                                               │
└─────────────────────────────────────────────────────────────┘
```

---

## 📚 Endpoints

### 1. **`GET /manifest`** - Feed Metadata

Describes your feed's capabilities, available filters, and sorting options.

```json
{
  "name": "Indie Music Videos",
  "xtor_version": "1.0",
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
    }
  ]
}
```

### 2. **`GET /videos`** - Paginated Video List

Returns videos with optional filtering, search, and sorting.

```bash
GET /videos?filter=genre:rock&page=1&limit=20&sort=recent
```

```json
{
  "videos": [
    {
      "id": "mv001",
      "title": "Sunset Live Performance",
      "thumbnail": "https://example.com/thumb.jpg",
      "duration": 245,
      "formats": [
        { "quality": 720, "url": "https://example.com/video-720p.mp4" },
        { "quality": 1080, "url": "https://example.com/video-1080p.mp4" }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "has_next": true
  }
}
```

### 3. **`GET /videos/:id`** - Video Details

Returns complete metadata for a single video.

```json
{
  "id": "mv001",
  "title": "Sunset Live Performance",
  "description": "Recorded live at the Indie Music Festival 2025",
  "thumbnail": "https://example.com/thumb.jpg",
  "duration": 245,
  "published_at": "2025-01-15T20:30:00Z",
  "formats": [
    { "quality": 360, "url": "https://example.com/video-360p.mp4" },
    { "quality": 720, "url": "https://example.com/video-720p.mp4" },
    { "quality": 1080, "url": "https://example.com/video-1080p.mp4" }
  ]
}
```

---

## 🧪 Test Your Feed

Use the [**Interactive API Tester**](https://xtor.io/testing/) to validate your XTOR feed:

1. Enter your feed URL
2. Click "Load Manifest" to auto-populate filters
3. Test videos endpoint with dynamic filters
4. Select videos from dropdown to test detail endpoint
5. Validate compliance with real-time feedback

---

## 🌟 Use Cases

### Content Creators
- Distribute videos without platform lock-in
- Maintain control over content and monetization
- Add affiliate links via `source_url`

### Education Platforms
- Share course videos across multiple platforms
- Filter by subject, level, or language
- Track original sources for attribution

### Media Organizations
- Syndicate video content to partners
- Enable third-party apps to access your catalog
- Maintain brand visibility with logos

### Live Streaming
- Distribute live streams with HLS/DASH
- Support multiple quality levels
- Indicate live status automatically

---

## 📱 Client Applications

Build XTOR-compatible clients for:

- 🌐 **Web Players** - React, Vue, vanilla JS

---

## 🔧 This Repository

This repository contains the **official XTOR documentation website** built with Jekyll.

### Website Structure

```
├── _config.yml              # Jekyll configuration
├── _data/
│   ├── navigation.yml       # Navigation menu
│   └── clients.yml          # Client apps database
├── _includes/
│   ├── specification/       # Endpoint documentation
│   ├── navigation.html      # Nav component
│   └── footer.html          # Footer component
├── _layouts/
│   ├── default.html         # Base layout
│   ├── page.html            # Content pages
│   └── testing.html         # API tester layout
├── assets/
│   ├── css/
│   │   ├── main.css         # Main styles
│   │   └── testing.css      # Tester styles
│   └── js/
│       └── testing.js       # API tester logic
├── index.md                 # Homepage
├── specification.md         # Full API spec
├── clients.md               # Client directory
└── testing.md               # API testing tool
```

### Local Development

```bash
# Install dependencies
bundle install

# Run development server with live reload
bundle exec jekyll serve --livereload

# Visit http://localhost:4000
```

### Deploying to GitHub Pages

1. Push to GitHub
2. Go to **Settings** → **Pages**
3. Select source branch (`main`)
4. Save

Your site will be live at `https://yourusername.github.io/xtor.io/`

### Custom Domain

Add a `CNAME` file:
```bash
echo "xtor.io" > CNAME
git add CNAME
git commit -m "Add custom domain"
git push
```

---

## 🤝 Contributing

We welcome contributions! Here's how you can help:

### Documentation
- Fix typos or clarify explanations
- Add examples or use cases
- Translate to other languages

### Specification
- Propose new features (create an issue first)
- Report ambiguities or edge cases
- Suggest improvements

### Website
- Improve design or UX
- Add client applications to the directory
- Create tutorials or guides

**Process:**
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/improvement`)
3. Make your changes
4. Test locally (`bundle exec jekyll serve`)
5. Commit (`git commit -am 'Add new feature'`)
6. Push (`git push origin feature/improvement`)
7. Open a Pull Request

---

## 📋 Specification Versions

| Version | Status | Release Date | Documentation |
|---------|--------|--------------|---------------|
| **1.0** | ✅ Current | October 2025 | [Spec](https://xtor.io/specification/) |

---

## 🆚 Comparison

| Feature | XTOR | RSS | YouTube API | Proprietary APIs |
|---------|------|-----|-------------|------------------|
| Video-specific | ✅ | ❌ | ✅ | ✅ |
| Multiple qualities | ✅ | ❌ | ✅ | ⚠️ |
| Decentralized | ✅ | ✅ | ❌ | ❌ |
| No authentication | ✅ | ✅ | ❌ | ❌ |
| Live streaming | ✅ | ❌ | ✅ | ⚠️ |
| Search & filters | ✅ | ❌ | ✅ | ⚠️ |
| Open standard | ✅ | ✅ | ❌ | ❌ |

---

## 📄 License

XTOR is an **open format** with no restrictions. The specification, documentation, and reference implementations are free to use, modify, and distribute.

This documentation website and all associated code are released under the **MIT License** - see [LICENSE](LICENSE) for details.

---

## 🔗 Links

- 🌐 **Website:** [xtor.io](https://xtor.io)
- 📖 **Specification:** [xtor.io/specification](https://xtor.io/specification/)
- 🧪 **API Tester:** [xtor.io/testing](https://xtor.io/testing/)
- 📱 **Clients:** [xtor.io/clients](https://xtor.io/clients/)
- 💬 **Discussions:** [GitHub Discussions](https://github.com/xtor-io/docs/discussions)
- 🐛 **Issues:** [GitHub Issues](https://github.com/xtor-io/docs/issues)

---

## 🙏 Acknowledgments

Inspired by:
- **RSS/Atom** - For proving the power of open syndication formats
- **BitTorrent** - For decentralized content distribution
- **ActivityPub** - For federated social protocols
- **JSON Feed** - For modern, developer-friendly formats

---

<div align="center">

**Built with ❤️ by the XTOR community**

[⭐ Star this repo](https://github.com/xtor-io/docs) • [🍴 Fork](https://github.com/xtor-io/docs/fork) • [📢 Share](https://twitter.com/intent/tweet?text=Check%20out%20XTOR%20-%20an%20open%20format%20for%20distributed%20video%20feeds!&url=https://xtor.io)

</div>
