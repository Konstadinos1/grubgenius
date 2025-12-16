// Phone Mockup Component for App Builder
export function renderPhoneMockup(config = {}) {
    const {
        restaurantName = 'Your Restaurant',
        primaryColor = '#8b5cf6',
        logoEmoji = '🍕',
        menuItems = []
    } = config;

    const defaultMenuItems = [
        { name: 'Margherita Pizza', price: '$14.99', image: '🍕' },
        { name: 'Caesar Salad', price: '$9.99', image: '🥗' },
        { name: 'Grilled Salmon', price: '$22.99', image: '🐟' },
        { name: 'Tiramisu', price: '$8.99', image: '🍰' }
    ];

    const items = menuItems.length > 0 ? menuItems : defaultMenuItems;

    return `
    <div class="phone-mockup">
      <div class="phone-screen">
        <div class="phone-status-bar">
          <span>9:41</span>
          <span>📶 📡 🔋</span>
        </div>
        <div class="phone-content" style="background: linear-gradient(180deg, ${primaryColor}22 0%, transparent 40%);">
          <!-- Header -->
          <div style="text-align: center; padding: 16px 0 24px;">
            <div style="width: 64px; height: 64px; background: ${primaryColor}; border-radius: 16px; margin: 0 auto 12px; display: flex; align-items: center; justify-content: center; font-size: 32px;">
              ${logoEmoji}
            </div>
            <h3 style="font-size: 18px; font-weight: 700; margin-bottom: 4px;">${restaurantName}</h3>
            <p style="font-size: 12px; color: rgba(255,255,255,0.6);">Order now • Earn rewards</p>
          </div>
          
          <!-- Quick Actions -->
          <div style="display: flex; gap: 8px; margin-bottom: 20px;">
            <button style="flex: 1; background: ${primaryColor}; color: white; padding: 12px; border-radius: 12px; font-weight: 600; font-size: 13px; border: none;">
              🛒 Order Now
            </button>
            <button style="flex: 1; background: rgba(255,255,255,0.1); color: white; padding: 12px; border-radius: 12px; font-weight: 600; font-size: 13px; border: 1px solid rgba(255,255,255,0.1);">
              ⭐ Rewards
            </button>
          </div>
          
          <!-- Featured Section -->
          <div style="margin-bottom: 16px;">
            <h4 style="font-size: 14px; font-weight: 600; margin-bottom: 12px;">Popular Items</h4>
            <div style="display: flex; flex-direction: column; gap: 10px;">
              ${items.map(item => `
                <div style="display: flex; align-items: center; gap: 12px; background: rgba(255,255,255,0.05); padding: 12px; border-radius: 12px; border: 1px solid rgba(255,255,255,0.08);">
                  <div style="width: 48px; height: 48px; background: rgba(255,255,255,0.1); border-radius: 10px; display: flex; align-items: center; justify-content: center; font-size: 24px;">
                    ${item.image}
                  </div>
                  <div style="flex: 1;">
                    <div style="font-size: 14px; font-weight: 600;">${item.name}</div>
                    <div style="font-size: 12px; color: ${primaryColor}; font-weight: 600;">${item.price}</div>
                  </div>
                  <button style="width: 32px; height: 32px; background: ${primaryColor}; border: none; border-radius: 8px; color: white; font-size: 16px; cursor: pointer;">+</button>
                </div>
              `).join('')}
            </div>
          </div>
          
          <!-- Bottom Nav -->
          <div style="position: absolute; bottom: 0; left: 0; right: 0; display: flex; justify-content: space-around; padding: 16px 24px; background: rgba(20,20,30,0.95); border-top: 1px solid rgba(255,255,255,0.1);">
            <div style="text-align: center; color: ${primaryColor};">
              <div style="font-size: 20px;">🏠</div>
              <div style="font-size: 10px; font-weight: 600;">Home</div>
            </div>
            <div style="text-align: center; color: rgba(255,255,255,0.5);">
              <div style="font-size: 20px;">📋</div>
              <div style="font-size: 10px;">Menu</div>
            </div>
            <div style="text-align: center; color: rgba(255,255,255,0.5);">
              <div style="font-size: 20px;">🎁</div>
              <div style="font-size: 10px;">Rewards</div>
            </div>
            <div style="text-align: center; color: rgba(255,255,255,0.5);">
              <div style="font-size: 20px;">👤</div>
              <div style="font-size: 10px;">Profile</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
}
