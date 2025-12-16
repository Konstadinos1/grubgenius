// App Builder Page
import { renderSidebar } from '../components/sidebar.js';
import { renderPhoneMockup } from '../components/phone-mockup.js';

export function renderAppBuilder(container) {
    container.innerHTML = `
    <div class="dashboard">
      ${renderSidebar()}
      <div class="main-content">
        <div style="margin-bottom: var(--space-8);">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div style="width: 48px; height: 48px; background: linear-gradient(135deg, #11998e 0%, #38ef7d 100%); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 24px;">📱</div>
            <div>
              <h1 style="font-size: var(--font-size-3xl);">Branded Mobile App Builder</h1>
              <p style="color: var(--text-secondary);">Create your own restaurant ordering app</p>
            </div>
          </div>
        </div>
        
        <div style="display: flex; gap: var(--space-8);">
          <!-- Customization Panel -->
          <div style="flex: 1;">
            <div class="glass-card" style="padding: var(--space-6); margin-bottom: var(--space-6);">
              <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--space-6);">Brand Customization</h2>
              
              <div class="form-group" style="margin-bottom: var(--space-4);">
                <label class="form-label">Restaurant Name</label>
                <input type="text" class="form-input" id="app-name" value="Mario's Kitchen" placeholder="Your restaurant name">
              </div>
              
              <div class="form-group" style="margin-bottom: var(--space-4);">
                <label class="form-label">App Icon</label>
                <div style="display: flex; gap: var(--space-2); flex-wrap: wrap;">
                  ${['🍕', '🍔', '🌮', '🍣', '🍜', '🥗', '☕', '🍰'].map((emoji, i) => `
                    <button class="emoji-btn ${i === 0 ? 'active' : ''}" data-emoji="${emoji}" style="width: 48px; height: 48px; background: var(--glass-bg); border: 2px solid ${i === 0 ? 'var(--primary-500)' : 'transparent'}; border-radius: var(--radius-lg); font-size: 24px; cursor: pointer; transition: all var(--transition-fast);">
                      ${emoji}
                    </button>
                  `).join('')}
                </div>
              </div>
              
              <div class="form-group" style="margin-bottom: var(--space-4);">
                <label class="form-label">Primary Color</label>
                <div style="display: flex; gap: var(--space-2);">
                  ${['#8b5cf6', '#ef4444', '#f59e0b', '#10b981', '#06b6d4', '#ec4899'].map((color, i) => `
                    <button class="color-btn ${i === 0 ? 'active' : ''}" data-color="${color}" style="width: 40px; height: 40px; background: ${color}; border: 3px solid ${i === 0 ? 'white' : 'transparent'}; border-radius: var(--radius-md); cursor: pointer; transition: all var(--transition-fast);"></button>
                  `).join('')}
                </div>
              </div>
            </div>
            
            <div class="glass-card" style="padding: var(--space-6);">
              <h3 style="font-size: var(--font-size-lg); margin-bottom: var(--space-4);">📊 App Benefits</h3>
              <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: var(--space-4);">
                <div style="text-align: center; padding: var(--space-4); background: var(--glass-bg); border-radius: var(--radius-lg);">
                  <div style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--accent-400);">+50%</div>
                  <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">More Reorders</div>
                </div>
                <div style="text-align: center; padding: var(--space-4); background: var(--glass-bg); border-radius: var(--radius-lg);">
                  <div style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--primary-400);">0%</div>
                  <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">Commission Fees</div>
                </div>
                <div style="text-align: center; padding: var(--space-4); background: var(--glass-bg); border-radius: var(--radius-lg);">
                  <div style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--secondary-400);">2x</div>
                  <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">Customer Retention</div>
                </div>
                <div style="text-align: center; padding: var(--space-4); background: var(--glass-bg); border-radius: var(--radius-lg);">
                  <div style="font-size: var(--font-size-2xl); font-weight: 800; color: var(--warning-400);">7 Days</div>
                  <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">To Launch</div>
                </div>
              </div>
              <button class="btn btn-primary" style="width: 100%; margin-top: var(--space-6);">🚀 Start Building My App</button>
            </div>
          </div>
          
          <!-- Phone Preview -->
          <div style="flex-shrink: 0;">
            <div style="position: sticky; top: 100px;">
              <h3 style="text-align: center; margin-bottom: var(--space-4); color: var(--text-secondary);">Live Preview</h3>
              <div id="phone-preview">
                ${renderPhoneMockup({ restaurantName: "Mario's Kitchen", primaryColor: '#8b5cf6', logoEmoji: '🍕' })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    setupAppBuilder();
}

function setupAppBuilder() {
    const nameInput = document.getElementById('app-name');
    const phonePreview = document.getElementById('phone-preview');
    let currentEmoji = '🍕';
    let currentColor = '#8b5cf6';

    const updatePreview = () => {
        const { renderPhoneMockup } = require('../components/phone-mockup.js');
        phonePreview.innerHTML = renderPhoneMockup({
            restaurantName: nameInput.value || "Your Restaurant",
            primaryColor: currentColor,
            logoEmoji: currentEmoji
        });
    };

    nameInput.addEventListener('input', () => {
        import('../components/phone-mockup.js').then(module => {
            phonePreview.innerHTML = module.renderPhoneMockup({
                restaurantName: nameInput.value || "Your Restaurant",
                primaryColor: currentColor,
                logoEmoji: currentEmoji
            });
        });
    });

    document.querySelectorAll('.emoji-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.emoji-btn').forEach(b => { b.style.borderColor = 'transparent'; b.classList.remove('active'); });
            btn.style.borderColor = 'var(--primary-500)';
            btn.classList.add('active');
            currentEmoji = btn.dataset.emoji;
            import('../components/phone-mockup.js').then(module => {
                phonePreview.innerHTML = module.renderPhoneMockup({ restaurantName: nameInput.value, primaryColor: currentColor, logoEmoji: currentEmoji });
            });
        });
    });

    document.querySelectorAll('.color-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.color-btn').forEach(b => { b.style.borderColor = 'transparent'; b.classList.remove('active'); });
            btn.style.borderColor = 'white';
            btn.classList.add('active');
            currentColor = btn.dataset.color;
            import('../components/phone-mockup.js').then(module => {
                phonePreview.innerHTML = module.renderPhoneMockup({ restaurantName: nameInput.value, primaryColor: currentColor, logoEmoji: currentEmoji });
            });
        });
    });
}
