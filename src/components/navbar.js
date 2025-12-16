// Navbar Component
export function renderNavbar() {
    const navbar = document.getElementById('navbar');
    const currentPath = window.location.pathname;

    const isLanding = currentPath === '/';

    navbar.innerHTML = `
    <div class="container">
      <div class="navbar-content">
        <a href="/" data-link class="navbar-logo">
          <div class="navbar-logo-icon">🚀</div>
          <span>RestaurantAI</span>
        </a>
        
        <ul class="navbar-nav">
          <li><a href="/" data-link class="navbar-link ${currentPath === '/' ? 'active' : ''}">Home</a></li>
          <li><a href="/dashboard" data-link class="navbar-link ${currentPath === '/dashboard' ? 'active' : ''}">Dashboard</a></li>
          <li><a href="/competitor-analysis" data-link class="navbar-link ${currentPath.includes('competitor') ? 'active' : ''}">Competitor Analysis</a></li>
          <li><a href="/seo-generator" data-link class="navbar-link ${currentPath.includes('seo') ? 'active' : ''}">SEO Generator</a></li>
          <li><a href="/app-builder" data-link class="navbar-link ${currentPath.includes('app-builder') ? 'active' : ''}">App Builder</a></li>
        </ul>
        
        <div class="navbar-actions">
          ${isLanding ? `
            <a href="/dashboard" data-link class="btn btn-primary">Get Started Free</a>
          ` : `
            <button class="btn btn-secondary btn-icon" title="Notifications">🔔</button>
            <button class="btn btn-secondary btn-icon" title="Settings">⚙️</button>
          `}
        </div>
      </div>
    </div>
  `;
}
