// Competitor Analysis Page
import { renderSidebar } from '../components/sidebar.js';

export function renderCompetitorAnalysis(container) {
    container.innerHTML = `
    <div class="dashboard">
      ${renderSidebar()}
      
      <div class="main-content">
        <!-- Header -->
        <div style="margin-bottom: var(--space-8);">
          <div style="display: flex; align-items: center; gap: var(--space-3); margin-bottom: var(--space-2);">
            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 24px;">🔍</div>
            <div>
              <h1 style="font-size: var(--font-size-3xl);">AI Competitor Analysis</h1>
              <p style="color: var(--text-secondary);">Discover insights to outrank your competition</p>
            </div>
          </div>
        </div>
        
        <!-- Search Form -->
        <div class="glass-card" style="padding: var(--space-8); margin-bottom: var(--space-8);">
          <h2 style="font-size: var(--font-size-xl); margin-bottom: var(--space-2);">Analyze Your Competition</h2>
          <p style="color: var(--text-secondary); margin-bottom: var(--space-6);">Enter your restaurant name or URL and we'll analyze competitors in your area.</p>
          
          <div class="analysis-input-group" id="analysis-form">
            <input type="text" class="form-input analysis-input" id="restaurant-input" placeholder="Enter your restaurant name (e.g., Joe's Pizza, Brooklyn)">
            <button class="btn btn-primary btn-lg" id="analyze-btn" style="white-space: nowrap;">
              <span id="btn-text">🔍 Analyze Competitors</span>
              <span id="btn-loading" style="display: none;">
                <span class="loading-spinner" style="width: 20px; height: 20px; border-width: 2px;"></span>
              </span>
            </button>
          </div>
          
          <div style="display: flex; gap: var(--space-3); flex-wrap: wrap;">
            <span style="font-size: var(--font-size-sm); color: var(--text-muted);">Try:</span>
            <button class="btn btn-secondary" style="padding: var(--space-2) var(--space-3); font-size: var(--font-size-sm);" data-example="Talkin' Tacos, Miami">Talkin' Tacos, Miami</button>
            <button class="btn btn-secondary" style="padding: var(--space-2) var(--space-3); font-size: var(--font-size-sm);" data-example="Tony's Pizzeria, NYC">Tony's Pizzeria, NYC</button>
            <button class="btn btn-secondary" style="padding: var(--space-2) var(--space-3); font-size: var(--font-size-sm);" data-example="Sakura Sushi, LA">Sakura Sushi, LA</button>
          </div>
        </div>
        
        <!-- Results Section (Hidden by default) -->
        <div id="results-section" style="display: none;">
          <!-- Your Restaurant Card -->
          <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6); border: 2px solid var(--primary-600);">
            <div style="display: flex; align-items: center; gap: var(--space-4); margin-bottom: var(--space-4);">
              <div style="width: 64px; height: 64px; background: var(--gradient-primary); border-radius: var(--radius-xl); display: flex; align-items: center; justify-content: center; font-size: 28px;">🏪</div>
              <div>
                <div style="display: flex; align-items: center; gap: var(--space-2);">
                  <h3 style="font-size: var(--font-size-xl);" id="your-restaurant-name">Your Restaurant</h3>
                  <span style="background: var(--primary-600); padding: 2px 8px; border-radius: var(--radius-full); font-size: var(--font-size-xs); font-weight: 600;">YOU</span>
                </div>
                <p style="color: var(--text-tertiary); font-size: var(--font-size-sm);">Your current market position</p>
              </div>
            </div>
            
            <div class="grid grid-cols-4 gap-4">
              <div class="metric">
                <div class="metric-value">#3</div>
                <div class="metric-label">Google Rank</div>
              </div>
              <div class="metric">
                <div class="metric-value">4.2</div>
                <div class="metric-label">Rating</div>
              </div>
              <div class="metric">
                <div class="metric-value">127</div>
                <div class="metric-label">Reviews</div>
              </div>
              <div class="metric">
                <div class="metric-value">$$</div>
                <div class="metric-label">Price Range</div>
              </div>
            </div>
          </div>
          
          <!-- Competitors Header -->
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: var(--space-4);">
            <h2 style="font-size: var(--font-size-xl);">Top Competitors</h2>
            <span style="color: var(--text-tertiary); font-size: var(--font-size-sm);">5 competitors found</span>
          </div>
          
          <!-- Competitors Grid -->
          <div class="analysis-results" id="competitors-grid">
            <!-- Competitors will be inserted here -->
          </div>
          
          <!-- Insights Section -->
          <div class="glass-card" style="padding: var(--space-8); margin-top: var(--space-8);">
            <h2 style="font-size: var(--font-size-xl); margin-bottom: var(--space-6);">
              <span style="margin-right: var(--space-2);">💡</span>
              AI-Powered Insights
            </h2>
            
            <div class="grid grid-cols-2 gap-6">
              <div style="padding: var(--space-4); background: rgba(16, 185, 129, 0.1); border-radius: var(--radius-lg); border-left: 4px solid var(--accent-500);">
                <h4 style="color: var(--accent-400); margin-bottom: var(--space-2);">✅ Opportunities</h4>
                <ul style="color: var(--text-secondary); font-size: var(--font-size-sm); list-style: disc; padding-left: var(--space-5); display: flex; flex-direction: column; gap: var(--space-2);">
                  <li>Only 2 competitors have mobile apps - you can stand out!</li>
                  <li>No competitor ranks for "late night delivery" - target this keyword</li>
                  <li>Your prices are competitive - highlight value in marketing</li>
                </ul>
              </div>
              
              <div style="padding: var(--space-4); background: rgba(239, 68, 68, 0.1); border-radius: var(--radius-lg); border-left: 4px solid var(--error-400);">
                <h4 style="color: var(--error-400); margin-bottom: var(--space-2);">⚠️ Threats</h4>
                <ul style="color: var(--text-secondary); font-size: var(--font-size-sm); list-style: disc; padding-left: var(--space-5); display: flex; flex-direction: column; gap: var(--space-2);">
                  <li>Competitor #1 has 3x more reviews - encourage reviews</li>
                  <li>2 competitors have higher Google rankings - improve SEO</li>
                  <li>Chef's Kitchen has a loyalty program stealing repeat customers</li>
                </ul>
              </div>
            </div>
            
            <div style="margin-top: var(--space-6); padding: var(--space-4); background: var(--glass-bg); border-radius: var(--radius-lg);">
              <h4 style="margin-bottom: var(--space-3);">🎯 Recommended Actions</h4>
              <div style="display: flex; flex-wrap: wrap; gap: var(--space-3);">
                <a href="/seo-generator" data-link class="btn btn-primary">Generate SEO Pages</a>
                <a href="/app-builder" data-link class="btn btn-secondary">Build Your App</a>
                <button class="btn btn-secondary">Download Full Report</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    setupCompetitorAnalysis();
}

function setupCompetitorAnalysis() {
    const analyzeBtn = document.getElementById('analyze-btn');
    const input = document.getElementById('restaurant-input');
    const resultsSection = document.getElementById('results-section');
    const exampleBtns = document.querySelectorAll('[data-example]');

    // Handle example buttons
    exampleBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            input.value = btn.dataset.example;
            runAnalysis(btn.dataset.example);
        });
    });

    // Handle analyze button
    analyzeBtn.addEventListener('click', () => {
        const value = input.value.trim();
        if (value) {
            runAnalysis(value);
        }
    });

    // Handle enter key
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && input.value.trim()) {
            runAnalysis(input.value.trim());
        }
    });
}

function runAnalysis(restaurantName) {
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const resultsSection = document.getElementById('results-section');
    const yourName = document.getElementById('your-restaurant-name');
    const competitorsGrid = document.getElementById('competitors-grid');

    // Show loading
    btnText.style.display = 'none';
    btnLoading.style.display = 'flex';

    // Simulate AI analysis
    setTimeout(() => {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';

        // Update your restaurant name
        yourName.textContent = restaurantName;

        // Generate fake competitors
        const competitors = generateCompetitors(restaurantName);
        competitorsGrid.innerHTML = competitors.map(comp => renderCompetitorCard(comp)).join('');

        // Show results
        resultsSection.style.display = 'block';
        resultsSection.classList.add('fade-in');

        // Scroll to results
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 2000);
}

function generateCompetitors(restaurantName) {
    const competitors = [
        { name: "Chef's Kitchen", type: "Fine Dining", rank: 1, rating: 4.8, reviews: 542, price: "$$$", emoji: "👨‍🍳" },
        { name: "The Local Bistro", type: "Casual Dining", rank: 2, rating: 4.5, reviews: 328, price: "$$", emoji: "🍽️" },
        { name: "Fresh & Fast", type: "Fast Casual", rank: 4, rating: 4.3, reviews: 215, price: "$", emoji: "🥗" },
        { name: "Corner Cafe", type: "Cafe", rank: 5, rating: 4.1, reviews: 156, price: "$", emoji: "☕" },
        { name: "Fusion Flavors", type: "Asian Fusion", rank: 6, rating: 4.4, reviews: 289, price: "$$", emoji: "🍜" }
    ];

    return competitors;
}

function renderCompetitorCard(comp) {
    const rankColor = comp.rank <= 2 ? 'var(--error-400)' : comp.rank <= 4 ? 'var(--warning-400)' : 'var(--text-muted)';

    return `
    <div class="glass-card competitor-card">
      <div class="competitor-header">
        <div class="competitor-avatar">${comp.emoji}</div>
        <div>
          <div class="competitor-name">${comp.name}</div>
          <div class="competitor-type">${comp.type}</div>
        </div>
      </div>
      <div class="competitor-metrics">
        <div class="metric">
          <div class="metric-value" style="color: ${rankColor};">#${comp.rank}</div>
          <div class="metric-label">Google Rank</div>
        </div>
        <div class="metric">
          <div class="metric-value">${comp.rating}</div>
          <div class="metric-label">Rating</div>
        </div>
        <div class="metric">
          <div class="metric-value">${comp.reviews}</div>
          <div class="metric-label">Reviews</div>
        </div>
        <div class="metric">
          <div class="metric-value">${comp.price}</div>
          <div class="metric-label">Price</div>
        </div>
      </div>
    </div>
  `;
}
