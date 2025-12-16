// Dashboard Page
import { renderSidebar } from '../components/sidebar.js';
import { renderLineChart, renderBarChart } from '../components/charts.js';

export function renderDashboard(container) {
    container.innerHTML = `
    <div class="dashboard">
      ${renderSidebar()}
      
      <div class="main-content">
        <!-- Header -->
        <div style="margin-bottom: var(--space-8);">
          <h1 style="font-size: var(--font-size-3xl); margin-bottom: var(--space-2);">Welcome back! 👋</h1>
          <p style="color: var(--text-secondary);">Here's what's happening with your restaurant marketing.</p>
        </div>
        
        <!-- Stats Grid -->
        <div class="stats-grid">
          <div class="glass-card stat-card">
            <div class="stat-card-header">
              <div class="stat-card-icon purple">📈</div>
              <div class="stat-card-trend up">
                <span>↑</span>
                <span>12%</span>
              </div>
            </div>
            <div class="stat-card-value">$24,580</div>
            <div class="stat-card-label">Revenue This Month</div>
          </div>
          
          <div class="glass-card stat-card">
            <div class="stat-card-header">
              <div class="stat-card-icon blue">👥</div>
              <div class="stat-card-trend up">
                <span>↑</span>
                <span>8%</span>
              </div>
            </div>
            <div class="stat-card-value">1,842</div>
            <div class="stat-card-label">Website Visitors</div>
          </div>
          
          <div class="glass-card stat-card">
            <div class="stat-card-header">
              <div class="stat-card-icon green">🛒</div>
              <div class="stat-card-trend up">
                <span>↑</span>
                <span>23%</span>
              </div>
            </div>
            <div class="stat-card-value">342</div>
            <div class="stat-card-label">Online Orders</div>
          </div>
          
          <div class="glass-card stat-card">
            <div class="stat-card-header">
              <div class="stat-card-icon orange">⭐</div>
              <div class="stat-card-trend up">
                <span>↑</span>
                <span>0.2</span>
              </div>
            </div>
            <div class="stat-card-value">4.8</div>
            <div class="stat-card-label">Average Rating</div>
          </div>
        </div>
        
        <!-- Charts Row -->
        <div class="grid grid-cols-2 gap-6" style="margin-bottom: var(--space-8);">
          <div class="glass-card" style="padding: var(--space-6);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
              <div>
                <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--space-1);">Revenue Overview</h3>
                <p style="color: var(--text-tertiary); font-size: var(--font-size-sm);">Monthly revenue trend</p>
              </div>
              <select style="background: var(--glass-bg); border: 1px solid var(--border-color); padding: var(--space-2) var(--space-3); border-radius: var(--radius-md); color: var(--text-primary); font-size: var(--font-size-sm);">
                <option>Last 12 months</option>
                <option>Last 6 months</option>
                <option>Last 30 days</option>
              </select>
            </div>
            <div style="height: 200px;">
              ${renderLineChart([18, 25, 22, 30, 28, 35, 32, 42, 38, 45, 50, 55])}
            </div>
          </div>
          
          <div class="glass-card" style="padding: var(--space-6);">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-6);">
              <div>
                <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--space-1);">Daily Orders</h3>
                <p style="color: var(--text-tertiary); font-size: var(--font-size-sm);">Orders this week</p>
              </div>
            </div>
            <div style="height: 200px;">
              ${renderBarChart()}
            </div>
          </div>
        </div>
        
        <!-- AI Tools Section -->
        <div style="margin-bottom: var(--space-6);">
          <h2 style="font-size: var(--font-size-xl); margin-bottom: var(--space-2);">AI Marketing Tools</h2>
          <p style="color: var(--text-secondary);">Leverage AI to grow your restaurant.</p>
        </div>
        
        <div class="grid grid-cols-3 gap-6">
          <!-- Competitor Analysis Tool -->
          <a href="/competitor-analysis" data-link class="glass-card tool-card">
            <div class="tool-card-content">
              <div class="tool-card-header">
                <div class="tool-card-icon" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);">🔍</div>
                <span class="tool-card-badge">FREE</span>
              </div>
              <h3 class="tool-card-title">Competitor Analysis</h3>
              <p class="tool-card-description">
                Analyze rival restaurants and discover opportunities to outrank them.
              </p>
              <ul class="tool-card-features">
                <li class="tool-card-feature">Google ranking comparison</li>
                <li class="tool-card-feature">Review sentiment analysis</li>
                <li class="tool-card-feature">Pricing insights</li>
              </ul>
            </div>
          </a>
          
          <!-- SEO Generator Tool -->
          <a href="/seo-generator" data-link class="glass-card tool-card">
            <div class="tool-card-content">
              <div class="tool-card-header">
                <div class="tool-card-icon" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);">🎯</div>
                <span class="tool-card-badge">AI-POWERED</span>
              </div>
              <h3 class="tool-card-title">SEO Page Generator</h3>
              <p class="tool-card-description">
                Create optimized landing pages for every menu item and city.
              </p>
              <ul class="tool-card-features">
                <li class="tool-card-feature">Auto-generate 100s of pages</li>
                <li class="tool-card-feature">Rank for local searches</li>
                <li class="tool-card-feature">3x better than social ads</li>
              </ul>
            </div>
          </a>
          
          <!-- App Builder Tool -->
          <a href="/app-builder" data-link class="glass-card tool-card">
            <div class="tool-card-content">
              <div class="tool-card-header">
                <div class="tool-card-icon" style="background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%);">📱</div>
                <span class="tool-card-badge">PREMIUM</span>
              </div>
              <h3 class="tool-card-title">Branded Mobile App</h3>
              <p class="tool-card-description">
                Launch your own ordering app and build customer loyalty.
              </p>
              <ul class="tool-card-features">
                <li class="tool-card-feature">50%+ more reorders</li>
                <li class="tool-card-feature">Zero commission fees</li>
                <li class="tool-card-feature">Built-in loyalty program</li>
              </ul>
            </div>
          </a>
        </div>
        
        <!-- Recent Activity -->
        <div style="margin-top: var(--space-8);">
          <h2 style="font-size: var(--font-size-xl); margin-bottom: var(--space-4);">Recent Activity</h2>
          <div class="glass-card" style="padding: 0; overflow: hidden;">
            ${[
            { icon: '📄', title: 'SEO page generated', desc: '"Best Pizza in Brooklyn" page created', time: '2 min ago', color: '#8b5cf6' },
            { icon: '🔍', title: 'Competitor report ready', desc: 'Analysis of 5 local competitors complete', time: '1 hour ago', color: '#f5576c' },
            { icon: '📱', title: 'App order received', desc: 'New order #1842 - $45.99', time: '2 hours ago', color: '#10b981' },
            { icon: '⭐', title: 'New 5-star review', desc: '"Amazing food and fast delivery!"', time: '5 hours ago', color: '#f59e0b' }
        ].map((item, i) => `
              <div style="display: flex; align-items: center; gap: var(--space-4); padding: var(--space-4) var(--space-6); ${i !== 3 ? 'border-bottom: 1px solid var(--border-color);' : ''}">
                <div style="width: 40px; height: 40px; background: ${item.color}22; border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 18px;">
                  ${item.icon}
                </div>
                <div style="flex: 1;">
                  <div style="font-weight: 600; margin-bottom: 2px;">${item.title}</div>
                  <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">${item.desc}</div>
                </div>
                <div style="font-size: var(--font-size-sm); color: var(--text-muted);">${item.time}</div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    </div>
  `;
}
