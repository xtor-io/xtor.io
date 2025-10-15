---
layout: page
title: XTOR Clients
subtitle: Compatible apps and platforms for consuming XTOR feeds
header_class: clients-header
content_class: clients-content
---

<div class="spec-section">
    <h2>Mobile & TV Apps</h2>
    <div class="clients-grid">
        {% for client in site.data.clients.mobile_tv %}
        <div class="client-card">
            <div class="client-icon">{{ client.icon }}</div>
            <h3>{{ client.name }}</h3>
            <div class="client-platform">{{ client.platform }}</div>
            <p>{{ client.description }}</p>
            <div class="client-links">
                <a href="{{ client.download_link | relative_url }}" class="btn btn-primary">Download</a>
                <a href="{{ client.info_link | relative_url }}" class="btn btn-outline">Learn More</a>
            </div>
        </div>
        {% endfor %}
    </div>

    {% if site.data.clients.mobile_tv[0].placeholder %}
    <p class="placeholder-text">The clients shown above are examples. Add your real client applications by editing <code>_data/clients.yml</code>.</p>
    {% endif %}
</div>

<div class="spec-section">
    <h2>Desktop & Web Apps</h2>
    <div class="clients-grid">
        {% for client in site.data.clients.desktop_web %}
        <div class="client-card">
            <div class="client-icon">{{ client.icon }}</div>
            <h3>{{ client.name }}</h3>
            <div class="client-platform">{{ client.platform }}</div>
            <p>{{ client.description }}</p>
            <div class="client-links">
                <a href="{{ client.download_link | relative_url }}" class="btn btn-primary">Download</a>
                <a href="{{ client.info_link | relative_url }}" class="btn btn-outline">Learn More</a>
            </div>
        </div>
        {% endfor %}
    </div>

    {% if site.data.clients.desktop_web[0].placeholder %}
    <p class="placeholder-text">The clients shown above are examples. Add your real client applications by editing <code>_data/clients.yml</code>.</p>
    {% endif %}
</div>

<div class="spec-section">
    <h2>Developer Tools</h2>
    <div class="clients-grid">
        {% for client in site.data.clients.developer_tools %}
        <div class="client-card">
            <div class="client-icon">{{ client.icon }}</div>
            <h3>{{ client.name }}</h3>
            <div class="client-platform">{{ client.platform }}</div>
            <p>{{ client.description }}</p>
            <div class="client-links">
                <a href="{{ client.download_link | relative_url }}" class="btn btn-primary">{% if client.name contains 'Tester' %}Open App{% else %}Install{% endif %}</a>
                <a href="{{ client.info_link | relative_url }}" class="btn btn-outline">{% if client.name contains 'Tester' %}Learn More{% else %}Documentation{% endif %}</a>
            </div>
        </div>
        {% endfor %}
    </div>
</div>

<div class="submit-client">
    <h3>Submit Your Client</h3>
    <p>Have you built an XTOR-compatible client? We'd love to feature it here!</p>
    <p>To submit your client, please open an issue or pull request on our GitHub repository with the following information:</p>
    <ul style="text-align: left; max-width: 600px; margin: 1rem auto;">
        <li><strong>Client Name:</strong> The name of your application</li>
        <li><strong>Platform:</strong> Which platforms it supports (iOS, Android, Web, etc.)</li>
        <li><strong>Description:</strong> A brief description of features and capabilities</li>
        <li><strong>Links:</strong> Download links, website, or repository</li>
        <li><strong>Icon:</strong> A representative emoji or icon</li>
        <li><strong>Verification:</strong> Proof that it implements the XTOR spec correctly</li>
    </ul>
    <div class="cta-buttons">
        <a href="{{ site.xtor.github_org }}" target="_blank" rel="noopener" class="btn btn-primary">Submit on GitHub</a>
        <a href="{{ '/specification/' | relative_url }}" class="btn btn-outline">View Specification</a>
    </div>
</div>

<div class="spec-section">
    <h2>Building Your Own Client?</h2>
    <p>XTOR is an open standard, so anyone can build a compatible client. Here are some resources to help you get started:</p>

    <div class="get-started-grid">
        <div class="get-started-card">
            <h3>Read the Spec</h3>
            <p>Start by understanding the XTOR specification and required endpoints.</p>
            <a href="{{ '/specification/' | relative_url }}" class="btn btn-outline">View Specification →</a>
        </div>
        <div class="get-started-card">
            <h3>Test Your Code</h3>
            <p>Use our interactive API tester to validate your implementation.</p>
            <a href="{{ '/testing/' | relative_url }}" class="btn btn-outline">Open Tester →</a>
        </div>
        <div class="get-started-card">
            <h3>Join the Community</h3>
            <p>Get help and share your work with other XTOR developers.</p>
            <a href="{{ site.xtor.github_org }}" target="_blank" rel="noopener" class="btn btn-outline">GitHub →</a>
        </div>
    </div>
</div>
