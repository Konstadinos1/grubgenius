// SEO Generator Page
import { renderSidebar } from '../components/sidebar.js';

export function renderSeoGenerator(container) {
    container.innerHTML = `
    <div class="dashboard">
      ${renderSidebar()}
      <div class="main-content">
        <div style="margin-bottom: var(--space-8);">
          <div style="display: flex; align-items: center; gap: var(--space-3);">
            <div style="width: 48px; height: 48px; background: var(--gradient-primary); border-radius: var(--radius-lg); display: flex; align-items: center; justify-content: center; font-size: 24px;">🎯</div>
            <div>
              <h1 style="font-size: var(--font-size-3xl);">AI SEO Page Generator</h1>
              <p style="color: var(--text-secondary);">Create optimized pages that rank on Google</p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-8">
          <div class="glass-card" style="padding: var(--space-6);">
            <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--space-6);">Generate SEO Pages</h2>
            <div class="form-group" style="margin-bottom: var(--space-4);">
              <label class="form-label">Restaurant Name</label>
              <input type="text" class="form-input" id="seo-restaurant" placeholder="e.g., Tony's Pizzeria" value="Tony's Pizzeria">
            </div>
            <div class="form-group" style="margin-bottom: var(--space-4);">
              <label class="form-label">Menu Item</label>
              <input type="text" class="form-input" id="seo-item" placeholder="e.g., Margherita Pizza" value="Margherita Pizza">
            </div>
            <div class="form-group" style="margin-bottom: var(--space-4);">
              <label class="form-label">Target City</label>
              <input type="text" class="form-input" id="seo-city" placeholder="e.g., Brooklyn, NY" value="Brooklyn, NY">
            </div>
            <div class="form-group" style="margin-bottom: var(--space-6);">
              <label class="form-label">Keywords</label>
              <input type="text" class="form-input" id="seo-keywords" value="best pizza, authentic italian, delivery">
            </div>
            <button class="btn btn-primary" style="width: 100%;" id="generate-btn">✨ Generate SEO Page</button>
          </div>
          
          <div class="glass-card" style="padding: var(--space-6);">
            <h2 style="font-size: var(--font-size-lg); margin-bottom: var(--space-6);">Google Preview</h2>
            <div class="seo-preview" id="seo-preview">
              <div class="seo-preview-url">tonys-pizzeria.com › menu › margherita-pizza-brooklyn</div>
              <h3 class="seo-preview-title" id="preview-title">Best Margherita Pizza in Brooklyn | Tony's Pizzeria</h3>
              <p class="seo-preview-description" id="preview-desc">Looking for the best Margherita Pizza in Brooklyn, NY? Tony's Pizzeria serves authentic Italian wood-fired pizza. Order for delivery today!</p>
            </div>
            <div style="margin-top: var(--space-6); display: flex; align-items: center; gap: var(--space-4);">
              <div style="width: 70px; height: 70px; background: conic-gradient(var(--accent-500) 0deg 324deg, var(--glass-bg) 324deg); border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                <div style="width: 55px; height: 55px; background: var(--bg-tertiary); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-weight: 700;">90</div>
              </div>
              <div>
                <div style="font-weight: 600; color: var(--accent-400);">Excellent SEO Score</div>
                <div style="font-size: var(--font-size-sm); color: var(--text-tertiary);">Page is optimized for search</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

    setupSeoGenerator();
}

function setupSeoGenerator() {
    const generateBtn = document.getElementById('generate-btn');
    const inputs = { restaurant: document.getElementById('seo-restaurant'), item: document.getElementById('seo-item'), city: document.getElementById('seo-city') };
    const previewTitle = document.getElementById('preview-title');
    const previewDesc = document.getElementById('preview-desc');

    const updatePreview = () => {
        previewTitle.textContent = `Best ${inputs.item.value || 'Menu Item'} in ${inputs.city.value || 'Your City'} | ${inputs.restaurant.value || 'Restaurant'}`;
        previewDesc.textContent = `Looking for the best ${inputs.item.value} in ${inputs.city.value}? ${inputs.restaurant.value} serves fresh, delicious food. Order for delivery today!`;
    };

    Object.values(inputs).forEach(input => input.addEventListener('input', updatePreview));

    generateBtn.addEventListener('click', () => {
        generateBtn.textContent = '⏳ Generating...';
        setTimeout(() => {
            generateBtn.textContent = '✅ Page Generated!';
            generateBtn.style.background = 'var(--gradient-success)';
            setTimeout(() => { generateBtn.textContent = '✨ Generate SEO Page'; generateBtn.style.background = ''; }, 2000);
        }, 1500);
    });
}
