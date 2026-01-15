# Bellepros Restaurant App (RestoBoom)

A cross-platform mobile ordering app for Bellepros, a Quebec-based QSR franchise. Built with React Native (Expo) for iOS and Android.

## 🚀 Features

### MVP (Phase 1)
- ✅ **Multi-platform**: iOS, Android, and Web support via Expo
- 🔐 **Authentication**: Email/password, Apple Sign-In, Google Sign-In, and guest checkout
- 📱 **Menu Browsing**: Categories, item customization, modifiers, and search
- 🛒 **Cart Management**: Real-time pricing, quantity updates, and special instructions
- 📦 **Order Types**: Pickup, delivery, and dine-in with scheduling
- 💳 **Payments**: Stripe integration with Apple Pay and Google Pay
- 🎁 **Loyalty System**: Points, punch cards, and tiered rewards
- 🚚 **Delivery Integration**: DoorDash Drive and Uber Direct APIs
- 🔔 **Push Notifications**: Order status updates via Expo Notifications
- 🌍 **Bilingual**: English and French (Quebec market)
- 🏪 **Multi-location Ready**: Architecture supports franchise expansion

## 🏗️ Architecture

### Tech Stack
- **Frontend**: React Native with Expo SDK 54
- **Backend**: Supabase (PostgreSQL + Auth + Realtime)
- **Payments**: Stripe Connect
- **POS Integration**: Lightspeed Restaurant + Clover (abstracted interface)
- **Delivery**: DoorDash Drive + Uber Direct APIs
- **Push Notifications**: Expo Notifications / OneSignal
- **State Management**: React Context API + Hooks
- **Navigation**: React Navigation 6
- **i18n**: react-i18next

### Project Structure
```
restoboom/
├── src/
│   ├── components/        # Reusable UI components
│   │   ├── common/
│   │   ├── menu/
│   │   ├── cart/
│   │   └── loyalty/
│   ├── config/            # App configuration
│   │   ├── supabase.js    # Supabase client
│   │   └── i18n.js        # Internationalization setup
│   ├── constants/         # Constants and theme
│   │   └── theme.js       # Color, typography, spacing
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.js
│   │   └── CartContext.js
│   ├── hooks/             # Custom React hooks
│   ├── locales/           # Translation files
│   │   ├── en.json
│   │   └── fr.json
│   ├── navigation/        # Navigation configuration
│   │   └── AppNavigator.js
│   ├── screens/           # Screen components
│   │   ├── auth/          # Login, SignUp
│   │   ├── menu/          # Menu browsing
│   │   ├── cart/          # Shopping cart
│   │   ├── checkout/      # Checkout flow
│   │   ├── orders/        # Order history & tracking
│   │   ├── loyalty/       # Rewards program
│   │   └── profile/       # User profile
│   ├── services/          # API services
│   │   ├── api/           # Supabase API calls
│   │   │   ├── menuService.js
│   │   │   ├── orderService.js
│   │   │   └── loyaltyService.js
│   │   ├── pos/           # POS integrations
│   │   │   ├── POSAdapter.js        # Abstract base class
│   │   │   ├── LightspeedAdapter.js
│   │   │   ├── CloverAdapter.js
│   │   │   └── POSFactory.js
│   │   ├── delivery/      # Delivery API integrations
│   │   └── payment/       # Stripe integration
│   └── utils/             # Utility functions
├── database/
│   └── schema.sql         # Complete Supabase database schema
├── .env.example           # Environment variables template
├── App.js                 # Root component
└── app.json               # Expo configuration

```

## 📦 Installation

### Prerequisites
- Node.js 18+ and npm
- Expo CLI: `npm install -g expo-cli`
- iOS: Xcode (macOS only)
- Android: Android Studio

### Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd restoboom
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your credentials:
   ```env
   EXPO_PUBLIC_SUPABASE_URL=your-supabase-url
   EXPO_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your-stripe-key
   # ... etc
   ```

4. **Set up Supabase database**
   - Create a new Supabase project at https://supabase.com
   - Run the SQL schema from `database/schema.sql` in the SQL editor
   - Update `.env` with your Supabase URL and anon key

5. **Run the app**
   ```bash
   # Start Expo development server
   npm start

   # Run on iOS simulator
   npm run ios

   # Run on Android emulator
   npm run android

   # Run on web
   npm run web
   ```

## 🗄️ Database Schema

The app uses a multi-tenant architecture with location-based isolation. Key tables:

- **users**: User profiles and authentication
- **locations**: Restaurant locations (franchise support)
- **menus**: Menu data synced from POS
- **menu_items**: Individual menu items with modifiers
- **orders**: Customer orders with full lifecycle tracking
- **loyalty_accounts**: User loyalty accounts per location
- **loyalty_programs**: Configurable loyalty program types
- **rewards**: Available rewards for redemption

See `database/schema.sql` for the complete schema with indexes and RLS policies.

## 🔌 POS Integration

The app uses an **adapter pattern** for POS integration, making it easy to add new POS systems:

### Supported POS Systems
- ✅ Lightspeed Restaurant
- ✅ Clover

### Architecture
```javascript
// POSAdapter (abstract base class)
├── LightspeedAdapter.js  // Lightspeed implementation
├── CloverAdapter.js      // Clover implementation
└── POSFactory.js         // Factory for creating adapters

// Usage
const posAdapter = POSFactory.createForLocation(location);
await posAdapter.syncMenu();
await posAdapter.pushOrder(order);
```

### Adding a New POS System
1. Create a new adapter class extending `POSAdapter`
2. Implement required methods: `syncMenu()`, `pushOrder()`, `updateItemAvailability()`, etc.
3. Add to `POSFactory.js`
4. Done! No changes needed elsewhere in the app.

## 💳 Payment Integration

Uses **Stripe Connect** for multi-location payouts:
- Support for saved payment methods
- Apple Pay and Google Pay integration
- PCI-compliant tokenization
- Tip handling with preset percentages

## 🎁 Loyalty System

Flexible loyalty program supporting three models:

1. **Points per Dollar**: Earn X points per $1 spent
2. **Punch Card**: Buy X items, get 1 free
3. **Tiered Rewards**: Bronze/Silver/Gold based on lifetime spend

Configurable per location with:
- Points expiration
- Minimum order values
- Tier thresholds and multipliers

## 🚚 Delivery Integration

Supports multiple delivery providers with automatic routing:
- DoorDash Drive API
- Uber Direct API
- Real-time driver tracking
- Automatic price comparison

## 🌍 Internationalization

Full bilingual support (English + French):
- Automatic language detection
- Manual language switching in settings
- All UI text and content translated
- RTL support ready (future)

## 🔐 Security

- Row Level Security (RLS) on all Supabase tables
- User data isolation with auth.uid() policies
- API keys stored in environment variables
- PCI-compliant payment handling via Stripe

## 📱 App Configuration

Edit `app.json` to customize:
- App name and slug
- Bundle identifiers
- App icons and splash screens
- Permissions (location, notifications, etc.)

## 🚀 Deployment

### iOS (App Store)
1. Configure app signing in Xcode
2. Build: `expo build:ios`
3. Submit via Xcode or Transporter

### Android (Google Play)
1. Generate upload key
2. Build: `expo build:android`
3. Upload AAB to Play Console

### OTA Updates
Expo supports over-the-air updates:
```bash
expo publish
```

## 📋 Roadmap

### Phase 2 (Post-MVP)
- [ ] In-app chat support
- [ ] Advanced analytics dashboard
- [ ] Catering / large order flow
- [ ] Gift cards
- [ ] Referral program
- [ ] Kitchen display system (KDS) app
- [ ] Franchise owner mobile app

### Phase 3 (Future)
- [ ] Table reservations
- [ ] Waitlist management
- [ ] Inventory management
- [ ] Employee scheduling
- [ ] Multi-language support (Spanish, etc.)

## 🧪 Testing

```bash
# Run tests
npm test

# Run linter
npm run lint

# Type checking
npm run type-check
```

## 📝 Development Workflow

### Milestones (8-week plan)
| Week | Focus |
|------|-------|
| 1-2  | ✅ Auth, profiles, DB setup, architecture |
| 3-4  | Menu sync (Lightspeed + Clover), menu UI, cart |
| 5-6  | Checkout, Stripe, order flow, POS injection |
| 7    | Loyalty system, rewards redemption |
| 8    | Delivery integration, notifications, QA, submission |

### Current Status
**Week 1-2 Complete**:
- ✅ Project structure and architecture
- ✅ Database schema with RLS
- ✅ Authentication (email, OAuth ready)
- ✅ POS integration abstraction layer
- ✅ API service layer (menu, orders, loyalty)
- ✅ Navigation and basic screens
- ✅ Bilingual support (EN/FR)
- ✅ Theme and styling system

**Next Steps**:
- [ ] Connect to real Supabase instance
- [ ] Implement menu syncing from POS
- [ ] Build menu item detail screen with customization
- [ ] Complete cart and checkout flow
- [ ] Integrate Stripe payments
- [ ] Implement order tracking

## 🤝 Contributing

This is a proprietary project for Bellepros. For questions or issues:
- Contact: [your-email]
- Slack: #bellepros-app

## 📄 License

Proprietary - All rights reserved by Bellepros Inc.

## 🙏 Acknowledgments

Built with:
- [Expo](https://expo.dev/)
- [Supabase](https://supabase.com/)
- [Stripe](https://stripe.com/)
- [React Navigation](https://reactnavigation.org/)

---

**Budget**: Under $10K CAD
**Timeline**: 8 weeks
**Target**: App Store + Google Play
**Location**: Laval, Quebec (MVP) → Multi-location expansion ready
