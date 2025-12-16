// Sidebar Component for Dashboard
export function renderSidebar() {
    const currentPath = window.location.pathname;

    return `
    <aside class="sidebar">
      <div class="sidebar-section">
        <h3 class="sidebar-title">Overview</h3>
        <ul class="sidebar-nav">
          <li>
            <a href="/dashboard" data-link class="sidebar-link ${currentPath === '/dashboard' ? 'active' : ''}">
              <span class="sidebar-link-icon">📊</span>
              <span>Dashboard</span>
            </a>
          </li>
          <li>
            <a href="#" class="sidebar-link">
              <span class="sidebar-link-icon">📈</span>
              <span>Analytics</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-section">
        <h3 class="sidebar-title">AI Tools</h3>
        <ul class="sidebar-nav">
          <li>
            <a href="/competitor-analysis" data-link class="sidebar-link ${currentPath === '/competitor-analysis' ? 'active' : ''}">
              <span class="sidebar-link-icon">🔍</span>
              <span>Competitor Analysis</span>
            </a>
          </li>
          <li>
            <a href="/seo-generator" data-link class="sidebar-link ${currentPath === '/seo-generator' ? 'active' : ''}">
              <span class="sidebar-link-icon">🎯</span>
              <span>SEO Generator</span>
            </a>
          </li>
          <li>
            <a href="/app-builder" data-link class="sidebar-link ${currentPath === '/app-builder' ? 'active' : ''}">
              <span class="sidebar-link-icon">📱</span>
              <span>App Builder</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-section">
        <h3 class="sidebar-title">Settings</h3>
        <ul class="sidebar-nav">
          <li>
            <a href="#" class="sidebar-link">
              <span class="sidebar-link-icon">🏪</span>
              <span>Restaurant Profile</span>
            </a>
          </li>
          <li>
            <a href="#" class="sidebar-link">
              <span class="sidebar-link-icon">⚙️</span>
              <span>Settings</span>
            </a>
          </li>
          <li>
            <a href="#" class="sidebar-link">
              <span class="sidebar-link-icon">❓</span>
              <span>Help & Support</span>
            </a>
          </li>
        </ul>
      </div>
    </aside>
  `;
}
