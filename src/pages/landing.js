// Landing Page
export function renderLanding(container) {
    container.innerHTML = `
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <div class="hero-badge">
            <span class="hero-badge-dot"></span>
            <span>AI-Powered Restaurant Marketing</span>
          </div>
          
          <h1 class="hero-title">
            <span>Grow Your Restaurant</span>
            <span class="text-gradient">With AI Marketing</span>
          </h1>
          
          <p class="hero-subtitle">
            Outrank competitors, dominate local search, and build a loyal customer base with our all-in-one AI marketing platform for restaurants.
          </p>
          
          <div class="hero-actions">
            <a href="/dashboard" data-link class="btn btn-primary btn-lg">
              Start Free Trial
              <span>→</span>
            </a>
            <button class="btn btn-secondary btn-lg">
              <span>▶</span>
              Watch Demo
            </button>
          </div>
          
          <div class="hero-stats">
            <div class="hero-stat">
              <div class="hero-stat-value">$350K+</div>
              <div class="hero-stat-label">Average Revenue Increase</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">50%</div>
              <div class="hero-stat-label">More Reorders</div>
            </div>
            <div class="hero-stat">
              <div class="hero-stat-value">3x</div>
              <div class="hero-stat-label">Better Than Social Media</div>
            </div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Features Section -->
    <section class="section" id="features">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">
            Three Powerful <span class="text-gradient">AI Tools</span>
          </h2>
          <p class="section-subtitle">
            Everything you need to dominate your local market and grow your restaurant business.
          </p>
        </div>
        
        <div class="grid grid-cols-3 gap-8">
          <!-- Feature 1: Competitor Analysis -->
          <article class="glass-card feature-card">
            <div class="feature-icon">🔍</div>
            <h3 class="feature-title">AI Competitor Analysis</h3>
            <p class="feature-description">
              Discover what your competitors are doing right and wrong. Get actionable insights to outrank them online and steal their customers.
            </p>
            <a href="/competitor-analysis" data-link class="feature-link">
              Try it free <span>→</span>
            </a>
          </article>
          
          <!-- Feature 2: SEO Generator -->
          <article class="glass-card feature-card">
            <div class="feature-icon">🎯</div>
            <h3 class="feature-title">AI SEO Page Generator</h3>
            <p class="feature-description">
              Create custom, SEO-optimized pages for every menu item and nearby city. 3x more effective than social media marketing.
            </p>
            <a href="/seo-generator" data-link class="feature-link">
              Generate pages <span>→</span>
            </a>
          </article>
          
          <!-- Feature 3: App Builder -->
          <article class="glass-card feature-card">
            <div class="feature-icon">📱</div>
            <h3 class="feature-title">Branded Mobile App</h3>
            <p class="feature-description">
              Launch your own branded app in days. Increase reorders by 50%+, reduce third-party fees, and build customer loyalty.
            </p>
            <a href="/app-builder" data-link class="feature-link">
              Build your app <span>→</span>
            </a>
          </article>
        </div>
      </div>
    </section>
    
    <!-- How It Works Section -->
    <section class="section" style="background: var(--bg-secondary);">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">How It Works</h2>
          <p class="section-subtitle">
            Get started in minutes, not months. Our AI does the heavy lifting.
          </p>
        </div>
        
        <div class="grid grid-cols-4 gap-6">
          <div class="glass-card" style="padding: var(--space-6); text-align: center;">
            <div style="font-size: 48px; margin-bottom: var(--space-4);">1️⃣</div>
            <h4 style="margin-bottom: var(--space-2);">Sign Up</h4>
            <p style="color: var(--text-secondary); font-size: var(--font-size-sm);">Create your free account in 30 seconds</p>
          </div>
          
          <div class="glass-card" style="padding: var(--space-6); text-align: center;">
            <div style="font-size: 48px; margin-bottom: var(--space-4);">2️⃣</div>
            <h4 style="margin-bottom: var(--space-2);">Add Restaurant</h4>
            <p style="color: var(--text-secondary); font-size: var(--font-size-sm);">Enter your restaurant details and menu</p>
          </div>
          
          <div class="glass-card" style="padding: var(--space-6); text-align: center;">
            <div style="font-size: 48px; margin-bottom: var(--space-4);">3️⃣</div>
            <h4 style="margin-bottom: var(--space-2);">AI Analysis</h4>
            <p style="color: var(--text-secondary); font-size: var(--font-size-sm);">Our AI generates insights and content</p>
          </div>
          
          <div class="glass-card" style="padding: var(--space-6); text-align: center;">
            <div style="font-size: 48px; margin-bottom: var(--space-4);">4️⃣</div>
            <h4 style="margin-bottom: var(--space-2);">Grow Revenue</h4>
            <p style="color: var(--text-secondary); font-size: var(--font-size-sm);">Watch your orders and revenue increase</p>
          </div>
        </div>
      </div>
    </section>
    
    <!-- Testimonials Section -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Trusted by <span class="text-gradient">5,000+</span> Restaurants</h2>
          <p class="section-subtitle">
            See what restaurant owners are saying about our platform.
          </p>
        </div>
        
        <div class="grid grid-cols-3 gap-6">
          <div class="glass-card" style="padding: var(--space-6);">
            <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-4);">
              <div style="width: 48px; height: 48px; background: var(--gradient-primary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">🌮</div>
              <div>
                <div style="font-weight: 600;">Maria Rodriguez</div>
                <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">Talkin' Tacos, Miami</div>
              </div>
            </div>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-4);">
              "We increased our sales by $350,000 in the first year. The AI SEO pages alone brought in 200+ new customers every month."
            </p>
            <div style="color: var(--warning-400);">⭐⭐⭐⭐⭐</div>
          </div>
          
          <div class="glass-card" style="padding: var(--space-6);">
            <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-4);">
              <div style="width: 48px; height: 48px; background: var(--gradient-accent); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">🍕</div>
              <div>
                <div style="font-weight: 600;">Tony Marinelli</div>
                <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">Tony's Pizzeria, NYC</div>
              </div>
            </div>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-4);">
              "The branded app changed everything. Our reorder rate went up 60% and we saved $8,000/month on delivery fees."
            </p>
            <div style="color: var(--warning-400);">⭐⭐⭐⭐⭐</div>
          </div>
          
          <div class="glass-card" style="padding: var(--space-6);">
            <div style="display: flex; gap: var(--space-3); margin-bottom: var(--space-4);">
              <div style="width: 48px; height: 48px; background: var(--gradient-success); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px;">🍣</div>
              <div>
                <div style="font-weight: 600;">David Chen</div>
                <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">Sakura Sushi, LA</div>
              </div>
            </div>
            <p style="color: var(--text-secondary); line-height: 1.7; margin-bottom: var(--space-4);">
              "Competitor analysis showed us exactly where we were falling behind. Now we're #1 on Google for sushi in our area."
            </p>
            <div style="color: var(--warning-400);">⭐⭐⭐⭐⭐</div>
          </div>
        </div>
      </div>
    </section>
    
    <!-- CTA Section -->
    <section class="section" style="background: var(--gradient-hero);">
      <div class="container">
        <div style="text-align: center; max-width: 700px; margin: 0 auto;">
          <h2 class="section-title" style="margin-bottom: var(--space-4);">
            Ready to Grow Your Restaurant?
          </h2>
          <p class="section-subtitle" style="margin-bottom: var(--space-8);">
            Join 5,000+ restaurants already using AI to dominate their local market.
          </p>
          <a href="/dashboard" data-link class="btn btn-primary btn-lg">
            Start Your Free Trial Today
          </a>
          <p style="margin-top: var(--space-4); font-size: var(--font-size-sm); color: var(--text-muted);">
            No credit card required • Free forever plan available
          </p>
        </div>
      </div>
    </section>
    
    <!-- Footer -->
    <footer style="background: var(--bg-secondary); padding: var(--space-12) 0; border-top: 1px solid var(--border-color);">
      <div class="container">
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: var(--space-6);">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div style="width: 40px; height: 40px; background: var(--gradient-primary); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center;">🚀</div>
            <span style="font-size: var(--font-size-xl); font-weight: 800;">RestaurantAI</span>
          </div>
          <div style="display: flex; gap: var(--space-8); color: var(--text-secondary); font-size: var(--font-size-sm);">
            <a href="#" style="transition: color var(--transition-fast);">Privacy</a>
            <a href="#" style="transition: color var(--transition-fast);">Terms</a>
            <a href="#" style="transition: color var(--transition-fast);">Contact</a>
            <a href="#" style="transition: color var(--transition-fast);">Blog</a>
          </div>
          <div style="color: var(--text-muted); font-size: var(--font-size-sm);">
            © 2025 RestaurantAI. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  `;

    // Add scroll animations
    setupScrollAnimations();
}

function setupScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.feature-card, .glass-card').forEach(el => {
        observer.observe(el);
    });
}
