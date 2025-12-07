# 🧭 **Sprint 3: Customer Dashboard (Core) - Specification**

**Status:** Implementation in Progress  
**Sprint:** 3 of 6 (Account Portal Enhancement)  
**Owner:** Easy11 Development Team  
**Last Updated:** November 3, 2025

---

## 🎯 **Goals & Vision**

### **Goal**
Deliver a full-featured, secure, and intelligent customer dashboard that gives users complete control over their data, orders, preferences, and personalization.

### **Done When:**
- `/account` dashboard is fully functional, responsive, secure, and connected to live APIs
- Users can manage orders, wishlist, addresses, payment methods, and notifications
- All sensitive actions require Step-Up (MFA) authentication
- Dashboard integrates live analytics, personalization, and AI recommendations
- Performance ≤ 2.5s LCP, Core Web Vitals ≥ 90 desktop / 85 mobile

---

## 📐 **Information Architecture & Navigation**

### **Primary Routes**

| Path | Purpose | Step-Up Required |
|------|---------|------------------|
| `/account` | Overview dashboard (greeting, insights, quick actions) | No |
| `/account/orders` | Full order history, live tracking, returns | Returns only |
| `/account/wishlist` | Saved items, price alerts, collections | No |
| `/account/addresses` | Manage shipping & billing addresses | Delete only |
| `/account/payments` | Tokenized cards / wallets | Add/Delete |
| `/account/notifications` | Email/SMS/push preferences | No |
| `/account/security` | MFA status, devices, recovery codes | Yes (Sprint 2) |
| `/account/privacy` | Download/Delete data (GDPR self-service) | Yes |

### **Layout Structure**

**Desktop:**
```
┌─────────────────────────────────────────────────────┐
│ Header: Greeting + Tier Badge + Quick Search       │
├──────────────┬──────────────────────────────────────┤
│              │                                      │
│  Sidebar:    │  Main Panel:                        │
│  - Dashboard │  - Dynamic widgets                  │
│  - Orders    │  - Charts & tables                  │
│  - Wishlist  │  - Cards & forms                    │
│  - Addresses │                                      │
│  - Payments  │                                      │
│  - Notify    │                                      │
│  - Security  │                                      │
│  - Privacy   │                                      │
│              │                                      │
└──────────────┴──────────────────────────────────────┘
```

**Mobile:**
- Collapsible bottom tab nav
- Persistent "Account" tab on home screen
- Swipeable panels
- Sticky header with back button

---

## 🎨 **UX & Visual Design**

### **Style Language**

**Colors:**
- Primary: Brand blue (#3B82F6)
- Accents: Teal (#14B8A6), Sky (#0EA5E9)
- Background: White / Dark (#1F2937)
- Success: Green (#10B981)
- Warning: Orange (#F59E0B)
- Error: Red (#EF4444)

**Typography:**
- Headings: Poppins (600-800 weight)
- Body: Inter (400-500 weight)
- Monospace: Mono (for order IDs, codes)

**Grid:**
- Base: 8pt spacing system
- Generous whitespace
- Cards with soft shadows (`shadow-md`, `shadow-lg`)
- Rounded corners (`rounded-xl`, `rounded-2xl`)

**Animations:**
- Micro fade/slide on page transitions
- Loading skeletons for async data
- Motion-reduce fallbacks for accessibility
- Framer Motion for complex animations

**Icons:**
- Lucide React (outlined style)
- Consistent sizing (w-5 h-5 for buttons, w-6 h-6 for headers)

**Charts:**
- Recharts for points/spend visualizations
- Responsive with tooltips
- Dark mode support

**Accessibility:**
- WCAG 2.2 AA compliance
- Focus visible rings
- ARIA labels on all interactive elements
- Color contrast ≥ 4.5:1
- Keyboard navigation support

---

## 🏠 **Dashboard Homepage Widgets**

### **1. Welcome Banner**
```
┌─────────────────────────────────────────────────────┐
│ 👋 Welcome back, John!                     🥇 Gold  │
│ You have 2,450 EasyPoints                           │
│ "Keep shopping to reach Platinum!"                  │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Personalized greeting with user's name
- Tier badge (Silver/Gold/Platinum) with icon
- Points balance with visual gauge
- AI-generated personalized message

### **2. Next Delivery Card**
```
┌─────────────────────────────────────────────────────┐
│ 📦 Next Delivery                                    │
│ Order #12345 • Arriving Tomorrow                    │
│ ▰▰▰▰▰▰▰▰▱▱ 80% (Out for Delivery)                  │
│ [Track Order]                                       │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Most recent order ETA
- Carrier tracking progress bar
- Status: Processing → Shipped → Out for Delivery → Delivered
- Quick "Track Order" button

### **3. Rewards Snapshot**
```
┌─────────────────────────────────────────────────────┐
│ 🎁 Your Rewards                                     │
│ 2,450 Points                                        │
│ ○○○○○○○○○○○○ 2,450 / 5,000 (Gold → Platinum)       │
│ [Redeem Points]                                     │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Points gauge with tier progress
- Next tier threshold display
- "Redeem Points" button (opens modal)

### **4. Wishlist Preview**
```
┌─────────────────────────────────────────────────────┐
│ ❤️ Wishlist (12 items)                              │
│ ┌─────┐ ┌─────┐ ┌─────┐                            │
│ │ 📱  │ │ 💻  │ │ 🎧  │                            │
│ │$899 │ │$1499│ │$299 │                            │
│ └─────┘ └─────┘ └─────┘                            │
│ 🔻 Price dropped on 2 items! [View All]            │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Top 3 wishlist items with images
- Price-drop badge (AI-detected)
- "View All" link to full wishlist

### **5. Notifications Summary**
```
┌─────────────────────────────────────────────────────┐
│ 🔔 Notifications (3 new)                            │
│ • Your order #12345 has shipped                     │
│ • Price drop on "AirPods Pro"                       │
│ • New rewards tier unlocked!                        │
│ [View All]                                          │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Count of unread notifications
- Top 3 recent notifications
- Quick toggle to mark all as read

### **6. Security Health**
```
┌─────────────────────────────────────────────────────┐
│ 🔐 Security Status                                  │
│ ✅ MFA Enabled (Passkey)                            │
│ ✅ 2 Trusted Devices                                │
│ ⚠️ Step-Up: Last used 2 days ago                   │
│ [Manage Security]                                   │
└─────────────────────────────────────────────────────┘
```

**Features:**
- MFA status (from Sprint 2)
- Device count
- Step-Up last used time
- Link to security settings

### **7. AI Recommendations Carousel**
```
┌─────────────────────────────────────────────────────┐
│ 🤖 Recommended for You                              │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │
│ │ 🎮  │ │ 📷  │ │ 🎵  │ │ 📚  │  ──>               │
│ └─────┘ └─────┘ └─────┘ └─────┘                    │
└─────────────────────────────────────────────────────┘
```

**Features:**
- AI-powered product recommendations
- Swipeable carousel
- Based on browsing/purchase history
- "Why this?" explainability tooltip

---

## 📄 **Orders Page**

### **List View**
```
┌─────────────────────────────────────────────────────┐
│ 🔍 Search: [         ]  Status: [All ▾]  Date: [▾] │
├─────────────────────────────────────────────────────┤
│ Order #12345 • Nov 1, 2025                          │
│ ▰▰▰▰▰▰▰▰▰▱ Delivered • $1,234.56                   │
│ [View Details] [Reorder]                            │
├─────────────────────────────────────────────────────┤
│ Order #12344 • Oct 28, 2025                         │
│ ▰▰▰▰▰▰▱▱▱▱ Out for Delivery • $567.89              │
│ [Track] [Contact Support]                           │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Card per order (number, date, status, amount)
- Expandable details (items, timeline, tracking map)
- Filters: status (All, Processing, Shipped, Delivered, Cancelled), date range
- Search by order ID
- Progress bar visualization

### **Order Details (Expanded)**
```
┌─────────────────────────────────────────────────────┐
│ Order #12345 • Placed on Nov 1, 2025               │
├─────────────────────────────────────────────────────┤
│ Items (3):                                          │
│ • Product A x1 - $499.00                            │
│ • Product B x2 - $299.00 each                       │
│ Subtotal: $1,097.00                                 │
│ Shipping: $10.00                                    │
│ Tax: $127.56                                        │
│ Total: $1,234.56                                    │
├─────────────────────────────────────────────────────┤
│ Tracking Timeline:                                  │
│ ✅ Nov 1, 10:00 AM - Order Placed                  │
│ ✅ Nov 1, 2:00 PM - Processing                     │
│ ✅ Nov 2, 9:00 AM - Shipped (UPS: 1Z999AA10123)   │
│ 🚚 Nov 3, 8:00 AM - Out for Delivery              │
│ ⏳ Nov 3, 5:00 PM - Estimated Delivery             │
├─────────────────────────────────────────────────────┤
│ [📍 Track on Map] [📞 Contact Support]             │
│ [🔄 Return Items] [📥 Download Invoice]            │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Item list with quantities and prices
- Breakdown (subtotal, shipping, tax, total)
- Timeline with status updates and timestamps
- Tracking number with carrier link
- Map integration (mock or Google Maps)
- Actions: Return, Download Invoice, Contact Support

### **Returns Flow**
```
┌─────────────────────────────────────────────────────┐
│ Return Items from Order #12345                      │
├─────────────────────────────────────────────────────┤
│ Select items to return:                             │
│ ☑ Product A - $499.00                              │
│ ☐ Product B (x2) - $299.00 each                    │
├─────────────────────────────────────────────────────┤
│ Reason for return:                                  │
│ ○ Defective / Damaged                               │
│ ● Changed my mind                                   │
│ ○ Wrong item received                               │
│ ○ Better price elsewhere                            │
│ ○ Other: [                  ]                       │
├─────────────────────────────────────────────────────┤
│ Upload photos (optional):                           │
│ [📷 Add Photos]                                     │
├─────────────────────────────────────────────────────┤
│ ⚠️ Step-Up Authentication Required                 │
│ [Confirm with MFA]                                  │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Select which items to return
- Pre-filled reason dropdown
- Optional photo upload (AI verification)
- Step-Up authentication trigger
- Refund ETA display
- Email confirmation

---

## ❤️ **Wishlist Page**

### **Collections View**
```
┌─────────────────────────────────────────────────────┐
│ ❤️ My Wishlist (24 items in 3 collections)          │
│ [+ New Collection] [📊 Price Alerts]                │
├─────────────────────────────────────────────────────┤
│ 📁 Gift Ideas (8 items)            [🔗 Share]      │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │
│ │ 📱  │ │ 💻  │ │ 🎧  │ │ 🎮  │  ──>               │
│ └─────┘ └─────┘ └─────┘ └─────┘                    │
│ 🔻 2 price drops                                    │
├─────────────────────────────────────────────────────┤
│ 📁 Office Setup (10 items)         [🔗 Share]      │
│ ┌─────┐ ┌─────┐ ┌─────┐ ┌─────┐                    │
│ │ 🖥️  │ │ ⌨️  │ │ 🖱️  │ │ 💡  │  ──>               │
│ └─────┘ └─────┘ └─────┘ └─────┘                    │
├─────────────────────────────────────────────────────┤
│ 📁 Uncategorized (6 items)                          │
│ ┌─────┐ ┌─────┐ ┌─────┐                            │
│ │ 📚  │ │ 🎨  │ │ 🏋️  │  ──>                       │
│ └─────┘ └─────┘ └─────┘                            │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Collections: create, rename, delete (e.g., "Gifts", "Office Setup")
- Drag & drop items between collections
- Price alerts & AI suggestions ("Similar under $X")
- Shareable links with public token (view-only)
- "Notify when available" for out-of-stock items
- Price history chart

### **Product Card in Wishlist**
```
┌──────────────────────┐
│  [🖼️ Product Image]  │
│  Product Name        │
│  $899.00  was $999  │
│  🔻 10% Price Drop!  │
│  [Add to Cart]       │
│  [Remove]            │
└──────────────────────┘
```

---

## 🏠 **Addresses Page**

### **Address List**
```
┌─────────────────────────────────────────────────────┐
│ 🏠 My Addresses (3)                  [+ Add New]     │
├─────────────────────────────────────────────────────┤
│ 📍 Home (Default)                    [Edit] [Delete]│
│ John Doe                                            │
│ 123 Main St, Apt 4B                                 │
│ Melbourne, VIC 3000, Australia                      │
│ ✅ Default Shipping  ✅ Default Billing             │
├─────────────────────────────────────────────────────┤
│ 📍 Work                              [Edit] [Delete]│
│ John Doe                                            │
│ 456 Office Blvd                                     │
│ Sydney, NSW 2000, Australia                         │
├─────────────────────────────────────────────────────┤
│ 📍 Parents' House                    [Edit] [Delete]│
│ Jane Doe                                            │
│ 789 Family Road                                     │
│ Brisbane, QLD 4000, Australia                       │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Editable cards with nickname
- Default flags (shipping/billing)
- Map autofill (Google Places API integration)
- Delete requires Step-Up authentication
- Internationalization (auto-format for country)

### **Add/Edit Address Form**
```
┌─────────────────────────────────────────────────────┐
│ ✏️ Edit Address: Home                               │
├─────────────────────────────────────────────────────┤
│ Nickname: [Home              ]                      │
│ Full Name: [John Doe          ]                     │
│ Phone: [+61 412 345 678      ]                      │
│ Address Line 1: [123 Main St           ]           │
│ Address Line 2: [Apt 4B      ] (optional)          │
│ City: [Melbourne             ]                      │
│ State: [Victoria ▾]                                 │
│ Postal Code: [3000           ]                      │
│ Country: [Australia ▾]                              │
│ ☑ Set as default shipping                          │
│ ☑ Set as default billing                           │
├─────────────────────────────────────────────────────┤
│ [Cancel] [Save Address]                             │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Google Places API autocomplete
- Phone number validation (E.164 format)
- State/Country dropdowns
- Checkbox for default flags
- Real-time validation

---

## 💳 **Payments Page**

### **Payment Methods List**
```
┌─────────────────────────────────────────────────────┐
│ 💳 Payment Methods (2)               [+ Add New]    │
├─────────────────────────────────────────────────────┤
│ 💳 Visa •••• 1234 (Default)          [Edit] [Remove]│
│ Expires: 12/25                                      │
│ ✅ Default Payment Method                           │
├─────────────────────────────────────────────────────┤
│ 💳 Mastercard •••• 5678              [Edit] [Remove]│
│ Expires: 06/26                                      │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Tokenized methods: cards (PSP token only, no PAN stored)
- Wallets: Apple Pay, PayPal (integration ready)
- Add method: Step-Up authentication required
- Remove method: Step-Up authentication required
- Default toggle
- Last 4 digits display only
- Expiry date display

### **Add Payment Method**
```
┌─────────────────────────────────────────────────────┐
│ 💳 Add Payment Method                               │
├─────────────────────────────────────────────────────┤
│ ⚠️ Step-Up Authentication Required                 │
│ Confirm it's you to add a new payment method.      │
│ [Verify with MFA]                                   │
├─────────────────────────────────────────────────────┤
│ After verification:                                 │
│ Card Number: [•••• •••• •••• ••••]                 │
│ Expiry: [MM/YY]  CVV: [•••]                        │
│ Cardholder Name: [                ]                │
│ Billing Address: [Same as shipping ▾]              │
│ ☐ Set as default payment method                    │
├─────────────────────────────────────────────────────┤
│ [Cancel] [Add Card]                                 │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Step-Up modal triggers first
- Card input with validation (Luhn check)
- CVV input (hidden)
- Expiry validation (MM/YY format)
- Billing address selector
- PCI-compliant (token from Stripe/PSP, no PAN stored)

---

## 🔔 **Notifications Page**

### **Preferences Tab**
```
┌─────────────────────────────────────────────────────┐
│ 🔔 Notification Preferences                         │
├─────────────────────────────────────────────────────┤
│ Marketing Updates                                   │
│ ☑ Email  ☑ SMS  ☐ Push                             │
│                                                     │
│ Order Updates                                       │
│ ☑ Email  ☑ SMS  ☑ Push                             │
│                                                     │
│ Price Drop Alerts                                   │
│ ☑ Email  ☐ SMS  ☑ Push                             │
│                                                     │
│ Wishlist Updates                                    │
│ ☑ Email  ☐ SMS  ☑ Push                             │
│                                                     │
│ Security Alerts                                     │
│ ☑ Email  ☑ SMS  ☑ Push (Cannot disable)            │
├─────────────────────────────────────────────────────┤
│ [Save Preferences]                                  │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Granular preferences by type
- Channels: Email, SMS, Push
- Security alerts cannot be disabled
- Save button with confirmation toast

### **Notification Feed Tab**
```
┌─────────────────────────────────────────────────────┐
│ 🔔 Notifications (15 total, 3 unread)               │
│ Filters: [All ▾]  [Mark All Read]                  │
├─────────────────────────────────────────────────────┤
│ 🆕 Your order #12345 has shipped              2h ago│
│ Track your delivery in real-time.                  │
├─────────────────────────────────────────────────────┤
│ 🆕 Price drop on "AirPods Pro"                3h ago│
│ Now $249 (was $299). Save 17%!                     │
├─────────────────────────────────────────────────────┤
│ 🆕 New tier unlocked: Gold!                   5h ago│
│ You're now earning 5% back on all purchases.       │
├─────────────────────────────────────────────────────┤
│ ✓ Order #12344 delivered                     1d ago│
│ Hope you enjoy your new purchase!                   │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Chronological feed with timestamps
- Read/unread status (bold = unread)
- Filter by type (All, Orders, Wishlist, Security, Marketing)
- Mark all as read button
- Individual mark as read on click
- Pagination (load more)

---

## 🔒 **Privacy Page**

### **Data Export**
```
┌─────────────────────────────────────────────────────┐
│ 📥 Export Your Data (GDPR Self-Service)             │
├─────────────────────────────────────────────────────┤
│ Download a complete copy of your personal data:    │
│ • Account information                               │
│ • Order history                                     │
│ • Wishlist items                                    │
│ • Addresses                                         │
│ • Notification preferences                          │
│ • Security logs                                     │
│                                                     │
│ ⚠️ Step-Up Authentication Required                 │
│ [Request Data Export]                               │
├─────────────────────────────────────────────────────┤
│ Status: No pending requests                         │
│                                                     │
│ Previous exports:                                   │
│ • Nov 1, 2025 - Expired (24h link)                 │
│ • Oct 15, 2025 - Expired (24h link)                │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Step-Up authentication required
- Generate ZIP file of all user data
- Email link with 24-hour expiry
- Previous export history
- Processing time estimate (2-5 minutes)
- GDPR-compliant data structure

### **Account Deletion**
```
┌─────────────────────────────────────────────────────┐
│ 🗑️ Delete Your Account                              │
├─────────────────────────────────────────────────────┤
│ ⚠️ WARNING: This action cannot be undone!          │
│                                                     │
│ Deleting your account will:                         │
│ • Remove all personal information                   │
│ • Cancel active orders (if any)                     │
│ • Forfeit all reward points                         │
│ • Revoke all access tokens                          │
│                                                     │
│ ⏳ 7-Day Cool-Down Period                          │
│ Your account will be marked for deletion and       │
│ permanently removed after 7 days. You can cancel   │
│ the deletion during this period.                    │
│                                                     │
│ ⚠️ Step-Up Authentication Required                 │
│ [Delete My Account]                                 │
└─────────────────────────────────────────────────────┘
```

**Features:**
- Step-Up authentication required
- Double confirmation modal
- 7-day cool-down period (can cancel)
- Email reminder on day 1, 3, 6, 7
- Soft delete (data retained for legal/compliance)
- Audit log entry

---

## 🔌 **API Contracts**

### **Dashboard Overview**

```typescript
GET /account/dashboard

Response: {
  greeting: string;  // "Welcome back, John!"
  user: {
    id: string;
    name: string;
    email: string;
    tier: "silver" | "gold" | "platinum";
    points: number;
    points_to_next_tier: number;
  };
  orders: {
    total_count: number;
    recent: Order[];  // Last 3 orders
    next_delivery: Order | null;
  };
  wishlist: {
    total_count: number;
    items: WishlistItem[];  // Top 3
    price_drops_count: number;
  };
  notifications: {
    unread_count: number;
    recent: Notification[];  // Last 3
  };
  security: {
    mfa_enabled: boolean;
    devices_count: number;
    last_stepup_at: string | null;
  };
  recommendations: Product[];  // AI recommendations
}
```

### **Orders**

```typescript
GET /account/orders?status=&from=&to=&limit=10&offset=0

Response: {
  orders: Order[];
  total_count: number;
  has_more: boolean;
}

GET /account/orders/:id

Response: Order

POST /account/orders/:id/return
Headers: { X-Step-Up-Token: "<token>" }
Request: {
  items: { product_id: string; quantity: number }[];
  reason: string;
  comments?: string;
  photos?: string[];  // Base64 or URLs
}

Response: {
  return_id: string;
  refund_amount: number;
  refund_eta_days: number;
  return_label_url: string;
}
```

### **Wishlist**

```typescript
GET /account/wishlist

Response: {
  collections: WishlistCollection[];
  uncategorized: WishlistItem[];
}

POST /account/wishlist
Request: { product_id: string; collection_id?: string; }
Response: { wishlist_item: WishlistItem; }

DELETE /account/wishlist/:id
Response: { status: "ok"; }

POST /account/wishlist/share
Request: { collection_id: string; }
Response: { public_token: string; share_url: string; }
```

### **Addresses**

```typescript
GET /account/addresses
Response: { addresses: Address[]; }

POST /account/addresses
Request: Address
Response: { address: Address; }

PATCH /account/addresses/:id
Request: Partial<Address>
Response: { address: Address; }

DELETE /account/addresses/:id
Headers: { X-Step-Up-Token: "<token>" }
Response: { status: "ok"; }
```

### **Payments**

```typescript
GET /account/payments
Response: { methods: PaymentMethod[]; }

POST /account/payments
Headers: { X-Step-Up-Token: "<token>" }
Request: { psp_token: string; nickname?: string; is_default: boolean; }
Response: { method: PaymentMethod; }

DELETE /account/payments/:id
Headers: { X-Step-Up-Token: "<token>" }
Response: { status: "ok"; }
```

### **Notifications**

```typescript
GET /account/notifications?limit=20&offset=0
Response: { notifications: Notification[]; total_count: number; has_more: boolean; }

PATCH /account/notifications/:id/read
Response: { notification: Notification; }

POST /account/notifications/preferences
Request: { type: string; channels: { email: boolean; sms: boolean; push: boolean; }; }
Response: { preferences: NotificationPreference[]; }
```

### **Privacy**

```typescript
POST /account/privacy/export
Headers: { X-Step-Up-Token: "<token>" }
Response: { request_id: string; estimated_time_minutes: number; }

GET /account/privacy/export/:request_id
Response: { status: "processing" | "completed" | "failed"; download_url?: string; expires_at?: string; }

POST /account/privacy/delete
Headers: { X-Step-Up-Token: "<token>" }
Request: { confirmation: string; }  // User must type "DELETE MY ACCOUNT"
Response: { scheduled_deletion_date: string; cool_down_days: number; }
```

---

## 🗄️ **Data Models**

### **notifications**
```sql
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(50),  -- 'order', 'wishlist', 'security', 'marketing'
  title VARCHAR(255),
  body TEXT,
  channel VARCHAR(20),  -- 'email', 'sms', 'push'
  status VARCHAR(20) DEFAULT 'pending',
  read_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_notifications_user ON notifications(user_id);
CREATE INDEX idx_notifications_read ON notifications(user_id, read_at);
```

### **addresses**
```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  nickname VARCHAR(50),
  full_name VARCHAR(255),
  phone VARCHAR(20),
  line1 VARCHAR(255),
  line2 VARCHAR(255),
  city VARCHAR(100),
  state VARCHAR(100),
  country VARCHAR(2),  -- ISO 3166-1 alpha-2
  postal_code VARCHAR(20),
  is_default_shipping BOOLEAN DEFAULT false,
  is_default_billing BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);
```

### **payments**
```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  psp_token TEXT,  -- Encrypted token from Stripe/PSP
  brand VARCHAR(20),  -- 'visa', 'mastercard', 'amex', etc.
  last4 VARCHAR(4),
  expiry VARCHAR(7),  -- 'MM/YYYY'
  nickname VARCHAR(50),
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_payments_user ON payments(user_id);
```

### **wishlist_collections**
```sql
CREATE TABLE wishlist_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(100),
  public_token VARCHAR(100) UNIQUE,  -- For shareable links
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_wishlist_collections_user ON wishlist_collections(user_id);
CREATE INDEX idx_wishlist_collections_token ON wishlist_collections(public_token);
```

### **wishlist_items**
```sql
CREATE TABLE wishlist_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID REFERENCES wishlist_collections(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  price_at_addition DECIMAL(10,2),
  added_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(collection_id, product_id)
);

CREATE INDEX idx_wishlist_items_collection ON wishlist_items(collection_id);
CREATE INDEX idx_wishlist_items_product ON wishlist_items(product_id);
```

---

## 🔒 **Security & Privacy Controls**

### **Access Control**
- All `/account/*` routes require valid JWT token
- MFA must be completed (check `mfa_completed_at` in session)
- Step-Up required for:
  - Adding/removing payment methods
  - Deleting addresses
  - Requesting data export
  - Deleting account
  - Processing returns

### **Step-Up Middleware**
```typescript
async function requireStepUp(req, res, next) {
  const stepUpToken = req.headers['x-step-up-token'];
  if (!stepUpToken) {
    return res.status(403).json({ error: 'step_up_required' });
  }
  
  const valid = await verifyStepUpToken(stepUpToken);
  if (!valid || valid.expires_at < Date.now()) {
    return res.status(403).json({ error: 'step_up_expired' });
  }
  
  req.stepUpPurpose = valid.purpose;
  next();
}
```

### **Audit Logging**
All sensitive actions logged:
```
security.audit_log (
  user_id, action, resource, metadata, ip_address, user_agent, timestamp
)
```

### **PII Encryption**
- Phone numbers: AES-256-GCM
- PSP tokens: AES-256-GCM
- Email addresses: Not encrypted (needed for auth), but not exposed in logs

### **Rate Limiting**
- Dashboard: 60 req/min per user
- Updates (addresses/payments): 10 req/min per user
- Export requests: 1 per hour per user
- Delete requests: 1 per day per user

### **GDPR & CCPA Compliance**
- Right to Access: Data export endpoint
- Right to Erasure: Account deletion with cool-down
- Right to Portability: JSON + CSV exports
- Privacy notices: Linked in footer
- Cookie consent: Managed separately

---

## 📊 **Analytics & AI Integrations**

### **ML Service Endpoints**
```
GET /ai/recommendations?user_id=&limit=10
→ Collaborative filtering (LightFM/ALS)

GET /ai/points-forecast?user_id=
→ Prophet model predicts tier ETA

GET /ai/churn-risk?user_id=
→ XGBoost churn model (0-1 score)
```

### **Events to Track**
```
dashboard_view
order_view
order_return_request
wishlist_add
wishlist_collection_create
address_add
address_delete
payment_add
payment_delete
notification_read
privacy_export_request
privacy_delete_request
```

### **BI Dashboards (Superset)**
- User engagement heatmaps
- Step-Up frequency
- Wishlist conversion rate
- Address/payment add rates
- Churn risk distribution

---

## ✅ **QA Checklist**

| Area | Check |
|------|-------|
| **Functional** | All CRUD works; redirects secure; Step-Ups trigger as expected |
| **Security** | JWT scope check; MFA required; audit log entries; Step-Up tokens validated |
| **UX/UI** | Responsive; loading skeletons; toasts for feedback; animations smooth |
| **Accessibility** | Keyboard-only flows; contrast AA; labels & ARIA; focus visible |
| **Performance** | Dashboard LCP ≤ 2.5s; API p95 ≤ 500ms; no layout shifts |
| **Data Integrity** | Add/Delete reflect instantly; cache invalidated; optimistic updates |
| **Notifications** | Real-time updates; push permission flows; unread counts accurate |
| **Privacy** | Export/Delete requests work; emails sent; cool-down period enforced |

---

## 📅 **Sprint Plan & Timeline**

| Week | Focus | Deliverables |
|------|-------|--------------|
| **1** | Dashboard UI Scaffold + Widgets | `/account` layout, cards, API hooks |
| **2** | Orders & Wishlist | Order list + tracking + returns; wishlist collections |
| **3** | Addresses & Payments | CRUD flows + Step-Up integration |
| **4** | Notifications & Privacy | Prefs + feed + export/delete flows |
| **5** | QA + Perf Tuning | Tests, Lighthouse, a11y, docs updates |

---

## 🚀 **Rollout Plan**

1. **Internal Beta** - Seeded accounts, test all flows
2. **Telemetry** - Collect performance & usage patterns
3. **Soft Launch** - 10% users, observe errors & Step-Up rates
4. **Push Notifications** - Gradual rollout (per browser support)
5. **Full Rollout** - 100% + public announcement banner

---

## 📦 **Deliverables Checklist**

- [ ] UI pages + responsive design
- [ ] API endpoints implemented + secured
- [ ] Step-Up middleware attached to sensitive routes
- [ ] Orders / Wishlist / Addresses / Payments / Notifications / Privacy modules tested
- [ ] AI recommendation hook connected
- [ ] Telemetry + BI dashboards updated
- [ ] QA pass + Lighthouse ≥ 90 desktop / 85 mobile
- [ ] Documentation and runbooks completed

---

**Sprint 3 Status:** 📝 Specification Complete → 🚀 Ready for Implementation

**Next:** Begin implementation with TypeScript types, stores, and API layer.

