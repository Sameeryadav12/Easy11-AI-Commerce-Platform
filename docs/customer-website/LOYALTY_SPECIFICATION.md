# 🪙 **Sprint 4: Loyalty & Rewards System - Complete Specification**

**Status:** Specification Complete  
**Sprint:** 4 of 6 (Post-Purchase Growth & Retention)  
**Owner:** Easy11 Growth Team  
**Last Updated:** November 3, 2025

---

## 🎯 **Vision & Objectives**

### **Goal**
Convert one-time purchasers into long-term, repeat customers by creating a personalized, gamified loyalty ecosystem directly in the customer dashboard.

### **Done When:**
- ✅ Full EasyPoints Rewards Program with earn/redeem logic and secure ledger
- ✅ Customers can invite friends via Referrals (both parties earn rewards)
- ✅ Loyalty Tiers (Silver/Gold/Platinum) unlock benefits automatically
- ✅ Gamified UI (progress bars, badges, streaks, confetti) runs smoothly
- ✅ Real-time updates, push/email triggers, analytics feed into BI dashboards
- ✅ All reward operations are audited and tamper-resistant

---

## 📐 **Information Architecture**

### **Routes**

| Route | Purpose | Step-Up Required |
|-------|---------|------------------|
| `/account/rewards` | Wallet overview + redeem actions + tier status | No |
| `/account/referrals` | Generate/share referral link + track invites | No |
| `/account/rewards/history` | Transaction ledger (earn, redeem, adjustments) | No |
| `/account/rewards/redeem` | Redeem points for coupons, shipping, or store credit | Yes (>$20) |
| `/account/rewards/challenges` | Gamified streaks/challenges list | No |
| `/account/rewards/rules` | Explain how to earn; FAQ section | No |

---

## 🎨 **UX & Visual Design**

### **Core Principles**
- **Delightful yet trust-anchored** - Financial-style wallet UI
- **Consistent** - Matches dashboard visuals (cards + rounded-xl + subtle motion)
- **Instant feedback** - Toasts, confetti, live point updates
- **Accessible** - Keyboard navigable, readable contrasts, ARIA labels

### **Rewards Page (Overview)**

```
┌─────────────────────────────────────────────────────────────┐
│ 🎁 Your Rewards                            🥇 Gold Tier     │
├─────────────────────────────────────────────────────────────┤
│ 👋 Welcome back, John!                                      │
│ You have 2,450 EasyPoints ($24.50 value)                    │
│                                                             │
│ ▰▰▰▰▰▰▰▰▰▰▰▰▰▰▰▱▱▱▱▱ 2,450 / 5,000 (Gold → Platinum)      │
│ AI Tip: "Keep shopping to reach Platinum in 3 orders!"     │
│ [Earn More Points] [View Rules]                            │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│ │ 💳 Redeem    │ │ 👥 Referrals │ │ 🏆 Challenges│        │
│ │ Points       │ │ Share & Earn │ │ Daily Goals  │        │
│ │ [Open]       │ │ [Share Link] │ │ [View]       │        │
│ └──────────────┘ └──────────────┘ └──────────────┘        │
├─────────────────────────────────────────────────────────────┤
│ 📊 Recent Activity                        [View All History]│
│ • +250 pts - Order #12345 (2 hours ago)                    │
│ • +10 pts - Review on "Product A" (1 day ago)              │
│ • -500 pts - Redeemed $5 coupon (2 days ago)               │
├─────────────────────────────────────────────────────────────┤
│ 🎯 Your Tier Benefits                                       │
│ ✅ Free Standard Shipping                                   │
│ ✅ 2× Points on All Purchases                               │
│ ⏳ Early Access to Sales (Platinum only)                    │
│ ⏳ 4× Points Multiplier (Platinum only)                     │
└─────────────────────────────────────────────────────────────┘
```

**Components:**
1. **Header** - Current points, tier badge, greeting
2. **Progress Bar** - Animated gauge toward next tier with ETA prediction
3. **Action Cards** - Redeem, Refer, Challenges (3-column grid)
4. **Recent Activity** - Ledger snippet (last 3 transactions)
5. **Tier Benefits** - Current perks + upcoming perks
6. **AI Tip** - Personalized suggestion to reach next tier

---

### **Referral Page**

```
┌─────────────────────────────────────────────────────────────┐
│ 👥 Refer Friends & Earn Together                            │
├─────────────────────────────────────────────────────────────┤
│ Share your unique link and both of you earn $10 credit!    │
│                                                             │
│ Your Referral Link:                                         │
│ ┌─────────────────────────────────────────────────────────┐│
│ │ https://easy11.com/r/JOHN2024                           ││
│ │ [📋 Copy Link]                                          ││
│ └─────────────────────────────────────────────────────────┘│
│                                                             │
│ Share via:                                                  │
│ [✉️ Email] [💬 WhatsApp] [🐦 X] [💼 LinkedIn]              │
├─────────────────────────────────────────────────────────────┤
│ 📊 Your Referral Stats                                      │
│ • 12 Friends Invited                                        │
│ • 8 Signed Up                                               │
│ • 5 Made First Purchase                                     │
│ • $50 Total Earned                                          │
├─────────────────────────────────────────────────────────────┤
│ 📋 Referral History                                         │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Sarah J. • Pending                        Oct 28, 2025│  │
│ │ Waiting for first purchase                            │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Mike D. • Converted ✅                    Oct 25, 2025│  │
│ │ You both earned $10!                                  │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Alex K. • Rewarded 🎉                     Oct 20, 2025│  │
│ │ +500 EasyPoints awarded                               │  │
│ └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Unique referral link** with token (e.g., `/r/JOHN2024`)
- **Copy button** with success toast
- **Share buttons** - Email, WhatsApp, X, LinkedIn (native share API)
- **Stats dashboard** - Invites, signups, conversions, earnings
- **Status list** - Pending, Converted, Rewarded with timestamps
- **Security** - Tokens expire after 90 days, throttled by IP/user

---

### **Challenges Page**

```
┌─────────────────────────────────────────────────────────────┐
│ 🏆 Challenges & Achievements                                │
├─────────────────────────────────────────────────────────────┤
│ 🔥 Current Streak: 7 Days                  [2× Multiplier!] │
│ ▰▰▰▰▰▰▰▱▱▱ Keep going for 10-day badge!                    │
├─────────────────────────────────────────────────────────────┤
│ 📅 Daily Challenges                                         │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ✅ Add 5 Items to Wishlist                  +10 pts │  │
│ │ ▰▰▰▰▰▰▰▰▰▰ 5/5 Completed!                           │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ 📝 Write a Product Review                   +10 pts │  │
│ │ ▰▰▱▱▱▱▱▱▱▱ 0/1                                       │  │
│ │ [Write Review]                                        │  │
│ └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ 📆 Weekly Challenges                                        │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ 💰 Spend $100 This Week                    +50 pts │  │
│ │ ▰▰▰▰▰▰▱▱▱▱ $67.50 / $100.00                         │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ 👥 Refer 2 Friends                         +100 pts│  │
│ │ ▰▰▰▰▰▱▱▱▱▱ 1/2                                       │  │
│ │ [Share Link]                                          │  │
│ └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ 🏅 Your Badges                                              │
│ 🥇 First Order  ⭐ Top Reviewer  🔥 Gold Streak            │
│ 👥 Referral Hero  🎯 Challenge Master                      │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Streak Bar** - Daily login streak with multiplier bonus
- **Daily Goals** - "Write a review", "Add 5 items to wishlist"
- **Weekly Goals** - "Spend $100 this month", "Refer 2 friends"
- **Progress UI** - Animated rings, celebrate completions with confetti
- **Rewards** - XP + points + badges
- **Badges Display** - Visual achievement showcase

---

### **History Page (Transaction Ledger)**

```
┌─────────────────────────────────────────────────────────────┐
│ 📊 Points History                                           │
│ Filters: [All Types ▾] [Last 30 Days ▾] [Export CSV]      │
├─────────────────────────────────────────────────────────────┤
│ Current Balance: 2,450 EasyPoints ($24.50)                 │
│ Pending: 250 pts (awaiting order confirmation)             │
│ Expiring Soon: 100 pts on Dec 1, 2025                      │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Nov 3, 2025 • 10:15 AM                               │  │
│ │ +250 pts • Purchase: Order #12345                    │  │
│ │ Balance: 2,450 pts                                    │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Nov 2, 2025 • 3:30 PM                                │  │
│ │ +10 pts • Review: "Product A"                        │  │
│ │ Balance: 2,200 pts                                    │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Nov 1, 2025 • 11:00 AM                               │  │
│ │ -500 pts • Redeemed: $5 Off Coupon                  │  │
│ │ Balance: 2,190 pts                                    │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ Oct 28, 2025 • 9:45 AM                               │  │
│ │ +50 pts • Referral: Mike D. made first order        │  │
│ │ Balance: 2,690 pts                                    │  │
│ └──────────────────────────────────────────────────────┘  │
│                                                             │
│ [Load More]                                                 │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Filters** - By type (earn/redeem/adjust), date range
- **Export** - CSV download for records
- **Balance Summary** - Current, pending, expiring
- **Transaction Cards** - Type, source, points, balance after, timestamp
- **Pagination** - Infinite scroll or "Load More"
- **Immutable Display** - Shows ledger integrity

---

### **Redeem Modal**

```
┌─────────────────────────────────────────────────────────────┐
│ 💳 Redeem EasyPoints                                [X]     │
├─────────────────────────────────────────────────────────────┤
│ Your Balance: 2,450 points ($24.50 value)                  │
│ Minimum Redeem: 500 points ($5.00)                         │
├─────────────────────────────────────────────────────────────┤
│ Choose Redemption Option:                                   │
│                                                             │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ○ Discount Coupon Code                               │  │
│ │   Get a code for $5, $10, $20, or $50 off           │  │
│ │   Valid for 30 days on orders over $50              │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ● Wallet Credit                                      │  │
│ │   Add funds directly to your account balance        │  │
│ │   Applied automatically at checkout                  │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ○ Free Shipping Voucher                             │  │
│ │   Get free expedited shipping on your next order    │  │
│ │   Valid for 60 days                                  │  │
│ └──────────────────────────────────────────────────────┘  │
│ ┌──────────────────────────────────────────────────────┐  │
│ │ ○ Donate to Charity                                  │  │
│ │   Support our partner charities                      │  │
│ │   100% of your points donated                        │  │
│ └──────────────────────────────────────────────────────┘  │
├─────────────────────────────────────────────────────────────┤
│ Amount to Redeem:                                           │
│ [500 ▾] points = $5.00                                      │
│ Quick Select: [500] [1000] [1500] [2000] [Custom]          │
├─────────────────────────────────────────────────────────────┤
│ ⚠️ Step-Up Authentication Required for amounts > $20       │
│                                                             │
│ [Cancel] [Redeem Points]                                    │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Balance Display** - Current points and dollar value
- **4 Redemption Options:**
  1. Coupon code (fixed amounts: $5, $10, $20, $50)
  2. Wallet credit (any amount)
  3. Free shipping voucher
  4. Charity donation (optional)
- **Amount Selector** - Dropdown with quick select buttons
- **Step-Up Warning** - For redemptions > $20
- **Conversion Rate** - 1 pt = $0.01
- **Minimum** - 500 pts ($5)

---

## 💰 **Reward System Design**

### **Currency: EasyPoints**

| Action | Reward Logic |
|--------|--------------|
| **Purchase $1** | 1 pt base (×tier multiplier) |
| **Write Review** | +10 pts (if verified purchase) |
| **Review with Photos** | +20 pts |
| **Refer Friend (signup)** | +50 pts (both after first order) |
| **Complete Challenge** | Varies (10–100 pts) |
| **Anniversary Bonus** | +100 pts |
| **Daily Login Streak** | +5 pts (with multiplier) |

**Conversion:**
- 1 pt = $0.01 store credit
- Minimum redeem: 500 pts ($5)
- Points expire 12 months after earn date (rolling)
- Ledger is immutable (append-only)

---

### **Loyalty Tiers**

| Tier | Threshold (pts earned in 12 months) | Perks |
|------|-------------------------------------|-------|
| **🥈 Silver** | 0–999 | Standard benefits |
| **🥇 Gold** | 1,000–4,999 | • Free standard shipping<br>• 2× point multiplier<br>• Priority support |
| **💎 Platinum** | 5,000+ | • Early access to sales<br>• 4× point multiplier<br>• Concierge support<br>• Exclusive products |

**Tier Calculation:**
- Based on points **earned** (not spent) in rolling 12-month window
- Tier updates automatically when threshold crossed
- Benefits activate immediately
- Downgrade if fall below threshold (with 30-day grace period)

---

### **Redemption Options**

1. **Coupon Code**
   - Fixed amounts: $5, $10, $20, $50
   - Valid for 30 days
   - Minimum order: $50 (for $5 coupon), scales up
   - One coupon per order
   - Cannot combine with other promotions

2. **Wallet Credit**
   - Any amount (min 500 pts)
   - Applied automatically at checkout
   - No expiration
   - Stacks with coupons

3. **Free Shipping Voucher**
   - Upgrades standard to expedited shipping
   - Valid for 60 days
   - One per order
   - 1000 pts = $10 value

4. **Charity Donation** (Optional)
   - Partner charities listed
   - 100% of points donated
   - Tax receipt if applicable
   - 500 pts minimum

---

### **Fraud Controls**

**Points Pending Period:**
- Points from purchases pending for 7 days (return window)
- After return window closes → points move to "available"
- If order returned → points reversed

**Referral Abuse Detection:**
- Device/IP duplication check
- Velocity limits (max 10 referrals per week)
- Suspicious patterns flagged for manual review
- Fake account detection (disposable emails, etc.)

**Manual Admin Review Queue:**
- High-value redemptions (>$50)
- Unusual earning patterns
- Multiple accounts from same IP
- Chargeback history

**Rate Limits:**
- Redemptions: 3 per day
- Referral invites: 5 per day
- Challenge completions: 10 per day
- Review submissions: 3 per day

---

## 🔄 **Referrals Flow**

### **Complete Flow:**

1. **User visits `/account/referrals`**
   - System generates unique token (e.g., `JOHN2024`)
   - Creates shareable link: `https://easy11.com/r/JOHN2024`
   - Link expires after 90 days (renewable)

2. **Friend clicks link**
   - Redirected to signup page
   - Referral ID pre-filled in form (hidden field)
   - Banner: "You've been invited by John! Both of you will earn $10."

3. **Friend signs up**
   - Account created with referral link attached
   - Status: `pending`
   - Referrer notified: "Your friend signed up!"

4. **Friend makes first purchase**
   - Order completes successfully
   - After 7-day return window:
     - Friend earns 500 pts ($5 welcome bonus)
     - Referrer earns 500 pts ($5 referral bonus)
     - Status: `converted` → `rewarded`

5. **Both users notified**
   - Email: "You and [Name] just earned $10 credit!"
   - Dashboard banner with confetti
   - Push notification (if enabled)

### **Referral States:**

```
pending → converted → rewarded
   ↓          ↓
expired   cancelled (if order refunded)
```

**State Definitions:**
- **Pending:** Friend signed up, no purchase yet
- **Converted:** Friend made first purchase
- **Rewarded:** Both parties received points (after 7 days)
- **Expired:** 90 days passed without purchase
- **Cancelled:** Order was refunded/returned

---

## 🎮 **Gamification Layer**

### **XP Points** (Non-Monetary)
- Separate from EasyPoints
- Used for progress/achievements tracking
- Displayed as "Level" (e.g., Level 12)
- No expiration
- Purely for engagement (leaderboard, badges)

### **Badges**

| Badge | Criteria | Icon |
|-------|----------|------|
| **First Order** | Complete first purchase | 🎉 |
| **Top Reviewer** | Write 10+ reviews | ⭐ |
| **Gold Streak** | 10-day login streak | 🔥 |
| **Referral Hero** | Refer 5+ friends | 👥 |
| **Challenge Master** | Complete 50 challenges | 🏆 |
| **Platinum Member** | Reach Platinum tier | 💎 |
| **Early Adopter** | Sign up in first month | 🚀 |
| **Photo Contributor** | Upload 20+ photos | 📸 |

**Badge Display:**
- Shown on user profile
- Displayed in reviews/Q&A
- Shareable on social media
- Unlocked with animation + confetti

### **Leaderboard** (Anonymous)

```
┌─────────────────────────────────────────────────────────────┐
│ 🏆 Top Contributors This Month                              │
├─────────────────────────────────────────────────────────────┤
│ 🥇 User_1234 • 2,450 pts • Level 15                        │
│ 🥈 User_5678 • 2,200 pts • Level 14                        │
│ 🥉 User_9012 • 1,980 pts • Level 13                        │
│ 4. User_3456 • 1,750 pts • Level 12                        │
│ 5. User_7890 • 1,500 pts • Level 11                        │
│ ...                                                         │
│ 42. You • 850 pts • Level 8                                │
└─────────────────────────────────────────────────────────────┘
```

**Features:**
- **Anonymous** - Only shows anonymized user IDs
- **Top 10** - Monthly leaderboard
- **Your Rank** - Always shown at bottom
- **Opt-In** - Users can choose to display real name (privacy setting)

### **AI Challenge Recommender**

Uses user behavior to suggest challenges:
- If user hasn't reviewed recently → "Write a review" challenge
- If low wishlist → "Add 10 items to wishlist"
- If hasn't referred → "Share your referral link"
- If inactive → "Make a purchase" challenge

---

## 🔌 **API Contracts**

### **Rewards**

```typescript
GET /account/rewards

Response: {
  balance: {
    total_points: number;
    available_points: number;
    pending_points: number;
    expiring_points: number;
    expiring_at: string | null;
  };
  tier: {
    current: "silver" | "gold" | "platinum";
    points_earned_12mo: number;
    next_tier: string | null;
    points_to_next_tier: number | null;
    benefits: string[];
  };
  recent_transactions: Transaction[];  // Last 5
  challenges: Challenge[];  // Active
  badges: Badge[];
  referral_stats: {
    total_invited: number;
    total_converted: number;
    total_earned: number;
  };
}
```

```typescript
GET /account/rewards/history?from=&to=&type=&limit=20&offset=0

Response: {
  transactions: Transaction[];
  total_count: number;
  has_more: boolean;
}

interface Transaction {
  id: string;
  type: "earn" | "redeem" | "adjust" | "expire";
  source: "purchase" | "referral" | "review" | "challenge" | "system";
  points: number;  // Positive for earn, negative for redeem
  balance_after: number;
  order_id?: string;
  note?: string;
  created_at: string;
}
```

```typescript
POST /account/rewards/redeem
Headers: { X-Step-Up-Token: "<token>" }  // If amount > $20

Request: {
  option: "coupon" | "wallet" | "shipping" | "donation";
  amount: number;  // Points to redeem (min 500)
  charity_id?: string;  // If option = donation
}

Response: {
  status: "ok";
  transaction_id: string;
  coupon_code?: string;  // If option = coupon
  wallet_credit?: number;  // If option = wallet
  voucher_code?: string;  // If option = shipping
  new_balance: number;
  message: string;
}

Error: {
  status: "error";
  code: "INSUFFICIENT_POINTS" | "MINIMUM_NOT_MET" | "STEP_UP_REQUIRED" | "RATE_LIMITED";
  message: string;
}
```

---

### **Referrals**

```typescript
GET /account/referrals

Response: {
  referral_link: string;  // Full URL
  referral_token: string;  // Short code
  stats: {
    total_invited: number;
    total_signed_up: number;
    total_converted: number;
    total_earned_points: number;
  };
  referrals: Referral[];  // Recent 20
}

interface Referral {
  id: string;
  referee_name: string | null;  // "Sarah J." or null if not signed up
  status: "pending" | "converted" | "rewarded" | "expired" | "cancelled";
  created_at: string;
  signed_up_at: string | null;
  first_order_at: string | null;
  rewarded_at: string | null;
  points_earned: number;
}
```

```typescript
POST /account/referrals/send

Request: {
  email: string;
  message?: string;  // Optional personal message
}

Response: {
  status: "ok";
  message: "Invitation sent to alice@example.com";
}

Error: {
  status: "error";
  code: "RATE_LIMITED" | "INVALID_EMAIL" | "ALREADY_INVITED";
}
```

```typescript
GET /account/referrals/status?limit=50&offset=0

Response: {
  referrals: Referral[];
  total_count: number;
  has_more: boolean;
}
```

---

### **Challenges**

```typescript
GET /account/rewards/challenges

Response: {
  streak: {
    current_days: number;
    multiplier: number;  // 1.0, 1.5, 2.0
    next_milestone: number;  // Days to next multiplier
  };
  daily: Challenge[];
  weekly: Challenge[];
  monthly: Challenge[];
}

interface Challenge {
  id: string;
  name: string;
  description: string;
  points_reward: number;
  xp_reward: number;
  progress_current: number;
  progress_target: number;
  completed: boolean;
  expires_at: string;
  category: "shopping" | "engagement" | "social" | "achievement";
}
```

```typescript
POST /account/rewards/challenges/:id/complete

Response: {
  status: "ok";
  challenge: Challenge;
  reward: {
    points: number;
    xp: number;
    badge?: string;
  };
  new_balance: number;
}

Error: {
  status: "error";
  code: "ALREADY_COMPLETED" | "NOT_ELIGIBLE" | "EXPIRED";
}
```

---

### **Admin-Side** (Behind API Gateway)

```typescript
// Manage Reward Rules
POST /admin/rewards/rules
Request: { action_type: string; points: number; conditions: object; }

// Fraud Detection
GET /admin/rewards/fraud/queue?status=flagged&limit=50
POST /admin/rewards/fraud/:transaction_id/approve|reject

// Point Adjustments
POST /admin/rewards/adjust
Request: { user_id: string; points: number; reason: string; }

// Tier Management
PATCH /admin/rewards/tiers/:tier
Request: { threshold: number; benefits: string[]; }
```

---

## 🗄️ **Data Models**

### **reward_transactions**
```sql
CREATE TABLE reward_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  type VARCHAR(20),  -- 'earn', 'redeem', 'adjust', 'expire'
  source VARCHAR(50),  -- 'purchase', 'referral', 'review', 'challenge', 'system'
  points INTEGER,  -- Positive for earn, negative for redeem
  balance_after INTEGER,
  order_id UUID REFERENCES orders(id),
  challenge_id UUID REFERENCES challenges(id),
  referral_id UUID REFERENCES referrals(id),
  note TEXT,
  status VARCHAR(20) DEFAULT 'completed',  -- 'pending', 'completed', 'reversed'
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP,  -- For earned points (12 months)
  
  -- Immutability & Audit
  hash VARCHAR(64),  -- SHA256(prev_hash + transaction_data)
  prev_transaction_id UUID REFERENCES reward_transactions(id)
);

CREATE INDEX idx_reward_transactions_user ON reward_transactions(user_id, created_at DESC);
CREATE INDEX idx_reward_transactions_status ON reward_transactions(user_id, status);
```

### **reward_ledger_balances**
```sql
CREATE TABLE reward_ledger_balances (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  total_points INTEGER DEFAULT 0,  -- All-time earned
  available_points INTEGER DEFAULT 0,  -- Currently spendable
  pending_points INTEGER DEFAULT 0,  -- Awaiting return window
  tier VARCHAR(20) DEFAULT 'silver',  -- 'silver', 'gold', 'platinum'
  tier_points_12mo INTEGER DEFAULT 0,  -- Points earned in last 12 months
  tier_achieved_at TIMESTAMP,
  streak_days INTEGER DEFAULT 0,
  streak_multiplier DECIMAL(3,2) DEFAULT 1.00,
  last_activity_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reward_balances_tier ON reward_ledger_balances(tier);
```

### **referrals**
```sql
CREATE TABLE referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID REFERENCES users(id) ON DELETE CASCADE,
  referee_id UUID REFERENCES users(id) ON DELETE SET NULL,
  token VARCHAR(50) UNIQUE NOT NULL,  -- 'JOHN2024'
  status VARCHAR(20) DEFAULT 'pending',  -- 'pending', 'converted', 'rewarded', 'expired', 'cancelled'
  created_at TIMESTAMP DEFAULT NOW(),
  signed_up_at TIMESTAMP,
  first_order_id UUID REFERENCES orders(id),
  first_order_at TIMESTAMP,
  rewarded_at TIMESTAMP,
  points_earned INTEGER DEFAULT 0,
  expires_at TIMESTAMP DEFAULT (NOW() + INTERVAL '90 days'),
  
  -- Fraud Detection
  signup_ip INET,
  signup_device_hash VARCHAR(64),
  fraud_flags TEXT[]
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id, status);
CREATE INDEX idx_referrals_token ON referrals(token);
CREATE INDEX idx_referrals_referee ON referrals(referee_id);
```

### **challenges**
```sql
CREATE TABLE challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  description TEXT,
  points_reward INTEGER,
  xp_reward INTEGER,
  frequency VARCHAR(20),  -- 'daily', 'weekly', 'monthly', 'one_time'
  target_value INTEGER,  -- e.g., "Review 3 products" → 3
  target_metric VARCHAR(50),  -- 'review_count', 'purchase_amount', 'wishlist_adds', etc.
  category VARCHAR(50),  -- 'shopping', 'engagement', 'social', 'achievement'
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  expires_at TIMESTAMP
);

CREATE INDEX idx_challenges_frequency ON challenges(frequency, active);
```

### **challenge_progress**
```sql
CREATE TABLE challenge_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  challenge_id UUID REFERENCES challenges(id) ON DELETE CASCADE,
  progress_value INTEGER DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  completed_at TIMESTAMP,
  claimed BOOLEAN DEFAULT false,
  claimed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, challenge_id, created_at)  -- One per user per period
);

CREATE INDEX idx_challenge_progress_user ON challenge_progress(user_id, completed);
CREATE INDEX idx_challenge_progress_challenge ON challenge_progress(challenge_id);
```

### **badges**
```sql
CREATE TABLE badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255),
  description TEXT,
  icon VARCHAR(10),  -- Emoji or icon identifier
  criteria_type VARCHAR(50),  -- 'review_count', 'referral_count', 'streak_days', etc.
  criteria_value INTEGER,
  active BOOLEAN DEFAULT true
);

CREATE TABLE user_badges (
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

CREATE INDEX idx_user_badges_user ON user_badges(user_id);
```

---

## 🔒 **Security & Compliance**

### **Immutable Ledger**
- **Append-only** - No updates or deletes allowed on `reward_transactions`
- **Hash Chain** - Each transaction includes hash of previous transaction
- **Signing** - HMAC signature with secret key
- **Verification** - Periodic integrity checks

**Implementation:**
```typescript
function createTransaction(prevTx: Transaction, data: TransactionData): Transaction {
  const txData = {
    user_id: data.user_id,
    type: data.type,
    source: data.source,
    points: data.points,
    balance_after: data.balance_after,
    created_at: Date.now()
  };
  
  const hash = sha256(prevTx.hash + JSON.stringify(txData) + SECRET_KEY);
  
  return {
    ...txData,
    hash,
    prev_transaction_id: prevTx.id
  };
}
```

### **Step-Up Authentication**
Required for:
- Redemptions > $20 (2000 points)
- Wallet credit transfers
- Multiple redemptions in short time (3+ per hour)

### **Rate Limits**

| Action | Limit |
|--------|-------|
| Redemptions | 3 per day |
| Referral invites | 5 per day |
| Challenge completions | 10 per day |
| Review submissions | 3 per day |
| Points adjustments (admin) | 100 per hour |

### **Encryption**
- **PII (email/phone):** AES-256-GCM
- **Points:** Not PII, no encryption needed
- **Referral tokens:** Random, URL-safe (Base62)

### **Audit Logs**
```sql
CREATE TABLE reward_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  action VARCHAR(50),  -- 'earn', 'redeem', 'adjust', 'tier_change', 'referral_convert'
  resource_id UUID,
  actor_id UUID,  -- Admin ID if manual action
  actor_type VARCHAR(20),  -- 'system', 'admin', 'user'
  metadata JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_reward_audit_user ON reward_audit_log(user_id, created_at DESC);
```

### **Tax Compliance**
- **Exportable Ledger** - CSV/JSON export for finance team
- **1099 Reporting** - For users earning >$600 (US only)
- **VAT Handling** - Points as non-taxable "loyalty currency"
- **Expiry Policy** - Clear terms in T&C

---

## 📊 **AI & Analytics Integration**

### **ML Models**

1. **Prophet - Points Forecast**
   ```
   Input: User's historical earning pattern
   Output: Predicted tier ETA, "You'll reach Gold in 3 orders"
   ```

2. **XGBoost - Reward Abuse Detection**
   ```
   Features: Device hash, IP, referral velocity, point velocity, account age
   Output: Fraud risk score (0-1)
   Threshold: >0.7 → flag for manual review
   ```

3. **LightFM - Product Recommendations**
   ```
   Input: User's purchase history + wishlist
   Output: "Spend your points on these items you'll love"
   ```

4. **Sentiment Model - Review Tone**
   ```
   Input: User's review text
   Output: Sentiment score → adjust engagement offers
   ```

### **Events to Track**

```typescript
// Rewards
reward_earned { user_id, source, points, balance_after }
reward_redeemed { user_id, option, points, value_usd }
tier_up { user_id, from_tier, to_tier, points_12mo }
tier_down { user_id, from_tier, to_tier }
points_expired { user_id, points, reason }

// Referrals
referral_created { referrer_id, token }
referral_signup { referrer_id, referee_id, token }
referral_converted { referrer_id, referee_id, order_id }
referral_rewarded { referrer_id, referee_id, points }

// Challenges
challenge_started { user_id, challenge_id }
challenge_progress { user_id, challenge_id, progress_value, target_value }
challenge_completed { user_id, challenge_id, points_earned }
badge_earned { user_id, badge_id }

// Step-Up & Security
mfa_step_up_on_redeem { user_id, amount, success }
fraud_flagged { user_id, reason, risk_score }
```

### **BI Dashboards** (Superset/Looker)

**1. Points Distribution Histogram**
- X: Point balance buckets (0-500, 500-1000, 1000-2000, etc.)
- Y: Number of users
- Insight: How many users are close to redemption threshold?

**2. Referral Funnel**
```
Invited → Signed Up → First Order → Rewarded
   100%      80%          60%          55%
```

**3. Tier Migration Over Time**
- Stacked area chart: Silver/Gold/Platinum users over months
- Upgrade/downgrade flow Sankey diagram

**4. Challenge Completion Heatmap**
- X: Day of week, Y: Challenge type
- Color: Completion rate
- Insight: When are users most engaged?

**5. Churn vs Reward Activity**
- Cohort: Users with 0 points vs >1000 points
- Metric: 30-day retention rate
- Insight: Does reward engagement reduce churn?

---

## 🔔 **Notifications & Emails**

### **Email Templates**

**1. Reward Earned**
```
Subject: 🎉 You earned 250 EasyPoints!

Hi John,

Great news! You just earned 250 EasyPoints from your recent order #12345.

Your new balance: 2,450 points ($24.50 value)

Redeem your points for discounts, free shipping, or donate to charity.

[Redeem Points]

Happy shopping!
Easy11 Rewards Team
```

**2. Tier Up**
```
Subject: 🥇 Welcome to Gold Tier!

Hi John,

Congratulations! You've reached Gold Tier in our EasyPoints Rewards Program.

Your new benefits:
✅ Free Standard Shipping on all orders
✅ 2× Points on every purchase
✅ Priority customer support

Keep shopping to unlock Platinum perks!

[View Your Tier]

Easy11 Team
```

**3. Referral Success**
```
Subject: 💰 You and Alex earned $10 credit!

Hi John,

Exciting news! Your friend Alex just made their first purchase.

As a thank you:
• You earned 500 EasyPoints ($5)
• Alex earned 500 EasyPoints ($5)

Keep sharing your referral link to earn more!

[Share My Link]

Easy11 Referrals Team
```

**4. Challenge Completed**
```
Subject: 🏆 Streak 10 Days Unlocked!

Hi John,

Amazing! You've logged in for 10 days straight and unlocked the "Gold Streak" badge.

Rewards:
• 50 EasyPoints
• 2× Multiplier on all challenges this week
• Gold Streak Badge 🔥

Keep the streak going!

[View Challenges]

Easy11 Team
```

**5. Points Expiring**
```
Subject: ⚠️ Your 500 points expire in 7 days

Hi John,

Heads up! You have 500 EasyPoints expiring on December 1, 2025.

Don't lose your rewards! Redeem them now:
• $5 Off Coupon
• Wallet Credit
• Free Shipping

[Redeem Before They Expire]

Easy11 Rewards Team
```

### **Push Notifications**

- **Reward Earned:** "🎉 +250 pts from Order #12345"
- **Tier Up:** "🥇 You're now Gold Tier! Free shipping unlocked"
- **Referral:** "👥 Alex signed up! Earn $10 when they order"
- **Challenge:** "🏆 Daily challenge ready: Write a review (+10 pts)"
- **Expiring:** "⚠️ 500 pts expiring in 3 days"

### **In-App Feed**

Displayed in `/account/notifications`:
- All reward-related events
- Real-time updates (WebSocket or polling)
- Grouped by type (Rewards, Referrals, Challenges)
- Read/unread status
- Archive option

---

## ✅ **QA Checklist**

### **Functional**
- [ ] Earn points per action (purchase, review, referral, challenge)
- [ ] Redeem flows (coupon, wallet, shipping, donation) work correctly
- [ ] Referral conversion logic (pending → converted → rewarded)
- [ ] Tier calculations accurate (12-month rolling window)
- [ ] Challenge progress updates in real-time
- [ ] Badges unlock with animation
- [ ] Ledger history displays correctly (pagination, filters)
- [ ] Points expiration works (12 months after earn)

### **Fraud Controls**
- [ ] Duplicate device/IP block for referrals
- [ ] Pending points window (7 days for purchases)
- [ ] Velocity limits enforced (5 referrals/day, 3 redemptions/day)
- [ ] Admin review queue flags suspicious patterns
- [ ] Chargeback reverses points

### **Security**
- [ ] Step-Up authentication required for large redemptions (>$20)
- [ ] Ledger integrity check (hash chain verification)
- [ ] Audit logs created for all sensitive operations
- [ ] Rate limits enforced on all endpoints
- [ ] PII encryption (emails/phones)

### **UX/UI**
- [ ] Animations smooth (confetti, progress bars, tier unlock)
- [ ] Charts render correctly (Recharts)
- [ ] Responsive design (mobile, tablet, desktop)
- [ ] Dark mode support
- [ ] Loading states (skeletons, spinners)
- [ ] Toast notifications appear correctly
- [ ] Accessibility (keyboard navigation, ARIA labels, contrast)

### **Performance**
- [ ] API p95 ≤ 600ms
- [ ] Page LCP ≤ 2.8s
- [ ] Ledger loads quickly (pagination, indexing)
- [ ] Real-time updates don't block UI

### **Analytics**
- [ ] All events fire correctly (reward_earned, tier_up, etc.)
- [ ] BI dashboards populated (points distribution, referral funnel, etc.)
- [ ] AI models integrated (Prophet forecast, XGBoost fraud detection)

---

## 📅 **Sprint Plan & Timeline**

| Week | Focus | Deliverables |
|------|-------|--------------|
| **1** | Rewards Ledger & Wallet Backend | Ledger tables, earn/redeem logic, API endpoints |
| **2** | Dashboard Rewards UI + Referrals | Overview page, redeem modal, referral link system |
| **3** | Tiers + Challenges + Gamification | Tier progress UI, badges, XP model, challenge tracking |
| **4** | Emails + Push + AI Forecast Models | All notification templates, Prophet/XGBoost integration |
| **5** | QA + Performance Tuning + Docs | End-to-end testing, Lighthouse, documentation |

**Total Estimated Time:** 40-50 hours (5 weeks, 1 engineer)

---

## 🚀 **Rollout Plan**

### **Phase 1: Beta (Week 1)**
- Enable for Gold/Platinum users only
- Collect feedback on redemption UX
- Monitor fraud signals

### **Phase 2: Gradual Expansion (Week 2)**
- Enable for Silver users
- Monitor API load and performance
- Tune fraud detection thresholds

### **Phase 3: Stability Check (Week 3)**
- Review analytics (uplift in engagement, conversion)
- Fix any critical bugs
- Optimize database queries

### **Phase 4: Public Launch (Week 4)**
- Marketing campaign (email, banner, social)
- In-app banner: "Introducing EasyPoints Rewards!"
- Press release (if applicable)

### **Phase 5: Monitoring (Ongoing)**
- Weekly trust & safety review
- Monthly fraud pattern analysis
- Quarterly tier threshold adjustments
- Annual tax compliance reporting

---

## 📦 **Deliverables Checklist**

- [ ] UI pages + responsive design (Rewards, Referrals, History, Challenges)
- [ ] API endpoints implemented + secured (earn, redeem, referral, challenge)
- [ ] Ledger tables + immutability (hash chain, audit log)
- [ ] Step-Up middleware attached to large redemptions
- [ ] Tier calculation + auto-upgrade logic
- [ ] Challenges system (daily/weekly/monthly)
- [ ] Badges + XP system
- [ ] Referral link generation + tracking
- [ ] Fraud detection (velocity, device/IP duplication)
- [ ] AI models integrated (Prophet, XGBoost, LightFM)
- [ ] Email templates (5 templates)
- [ ] Push notifications
- [ ] Telemetry + BI dashboards
- [ ] QA pass + Lighthouse ≥ 90 desktop / 85 mobile
- [ ] Documentation and runbooks completed

---

**Sprint 4 Status:** 📝 Specification Complete → 🚀 Ready for Implementation

**Next:** Begin implementation with TypeScript types, Zustand store, and API layer.

