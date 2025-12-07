# 🔐 Multi-Factor Authentication (MFA) - Sprint 2 Specification

**Status:** Implementation in Progress  
**Sprint:** 2 of 6 (Account Portal & Advanced Features)  
**Owner:** Easy11 Security Team  
**Last Updated:** November 3, 2025

---

## 🎯 **Objectives**

Build a **comprehensive, enterprise-grade MFA system** that provides:

1. ✅ **Passkeys (WebAuthn)** - Default, recommended, phishing-resistant
2. ✅ **Authenticator App (TOTP)** - Widely compatible (Google Auth, Authy, 1Password)
3. ✅ **SMS OTP** - Last-resort fallback with strict rate limits
4. ✅ **Recovery Codes** - Single-use backup codes
5. ✅ **Device Management** - View, label, revoke trusted devices
6. ✅ **Session Management** - View and revoke active sessions
7. ✅ **Step-Up Authentication** - Re-authentication for sensitive actions
8. ✅ **Risk-Aware Login** - Challenge on new device/IP/location

---

## 📐 **Information Architecture**

### **Customer-Facing Routes**

```
/auth/mfa/enroll                    - Choose factor (Passkey/TOTP/SMS)
/auth/mfa/verify                    - MFA challenge screen
/auth/mfa/recovery-codes            - View/download/regenerate codes
/auth/mfa/passkey/add               - Add additional passkey

/account/security                   - MFA status, devices, sessions overview
/account/security/devices           - Device list management
/account/security/devices/:id       - Device details (rename, revoke)
/account/security/sessions          - Session list
/account/security/sessions/:id      - Session details (revoke)
```

### **Sensitive Actions Requiring Step-Up**

- Change email or phone number
- Add/remove payment method
- Export personal data
- Delete account
- Regenerate recovery codes
- High-value refund or address change

---

## 🎨 **UX & Visual Design**

### **2.1 MFA Enrollment (First-Class Experience)**

**Layout:**
- Three large, beautiful tiles with icons and benefits:
  1. **Passkey (Recommended)** 🔐
     - "Fast, biometric, phishing-resistant"
     - "Use Face ID, Touch ID, or Windows Hello"
  2. **Authenticator App (TOTP)** 📱
     - "Works everywhere with 6-digit codes"
     - "Google Authenticator, Authy, 1Password"
  3. **SMS (Fallback)** 📞
     - "Use only if other options unavailable"
     - "Carrier fees may apply"

**Progress Steps:**
1. Choose factor
2. Setup (scan QR / verify phone / biometric)
3. Verify (test the factor)
4. Success + Recovery Codes

**Polish:**
- Confetti animation on success
- Progress bar (1/4, 2/4, 3/4, 4/4)
- Mobile-optimized (native WebAuthn prompts, camera for QR)
- Accessible (ARIA live regions, keyboard navigation)

### **2.2 MFA Challenge**

**Minimal, Focused Card:**
- Context line: "For your security, confirm it's you"
- Large, centered factor UI
- "Use a different method" link
- Remaining attempts counter (for TOTP/SMS)

**Factor-Specific UI:**

**Passkey:**
```
┌─────────────────────────────┐
│  For your security,         │
│  confirm it's you           │
│                             │
│  [🔐 Use Passkey]          │
│                             │
│  Use a different method     │
└─────────────────────────────┘
```

**TOTP (6-digit segmented input):**
```
┌─────────────────────────────┐
│  Enter authenticator code   │
│                             │
│  [1][2][3][4][5][6]        │
│                             │
│  Open your authenticator    │
│  app for the 6-digit code   │
│                             │
│  Use recovery code          │
└─────────────────────────────┘
```

**SMS:**
```
┌─────────────────────────────┐
│  Enter code from SMS        │
│  Sent to +61 4** *** **3   │
│                             │
│  [1][2][3][4][5][6]        │
│                             │
│  Didn't receive? Resend (45s)│
│  2 attempts remaining       │
└─────────────────────────────┘
```

### **2.3 Devices & Sessions**

**Devices List:**
```
┌──────────────────────────────────────┐
│  🖥️  MacBook Pro (Chrome)           │
│  Last used: 2 minutes ago            │
│  Melbourne, Australia · Trusted ✓    │
│  [Rename]  [Revoke]                  │
├──────────────────────────────────────┤
│  📱  iPhone 15 (Safari)              │
│  Last used: 3 hours ago              │
│  Sydney, Australia · Trusted ✓       │
│  [Rename]  [Revoke]                  │
└──────────────────────────────────────┘
```

**Sessions List:**
```
┌──────────────────────────────────────┐
│  Session #1234                       │
│  Created: Nov 3, 2025 at 9:15 AM    │
│  Device: MacBook Pro (Chrome)        │
│  Last seen: 2 minutes ago            │
│  IP: 203.123.45.67                   │
│  [Sign Out]                          │
└──────────────────────────────────────┘
```

**Security Status Banner:**
```
🔴 MFA OFF - Your account is vulnerable
   [Enable Passkey (Recommended)]

🟢 MFA ON with Passkey - Your account is secure
   2 factors enabled · 3 devices trusted
```

---

## 🔄 **Flows (End-to-End)**

### **3.1 Enroll Passkey (WebAuthn)**

```
1. User clicks "Enable MFA" → /auth/mfa/enroll
2. User selects "Passkey (Recommended)"
3. Frontend calls POST /auth/mfa/webauthn/registration/options
4. Server returns: { challenge, rp, user, pubKeyCredParams }
5. Frontend calls navigator.credentials.create()
6. Browser prompts: "Use Face ID to continue?"
7. User authenticates with biometric/PIN
8. Browser returns credential (public key, attestation)
9. Frontend calls POST /auth/mfa/webauthn/registration/verify
10. Server verifies attestation, stores credential
11. Show Recovery Codes screen (10 codes)
12. User downloads/copies codes
13. User checks "I've saved them" ✓
14. Success! Confetti animation 🎉
15. Redirect to /account/security
```

### **3.2 Enroll Authenticator App (TOTP)**

```
1. User selects "Authenticator App"
2. Frontend calls POST /auth/mfa/totp/enroll
3. Server generates secret, returns otpauth:// URI + QR code
4. Show QR code + manual entry option
5. User scans QR with Google Authenticator
6. User enters 6-digit code to verify setup
7. Frontend calls POST /auth/mfa/totp/verify { code }
8. Server validates code against secret
9. Success → Recovery Codes screen
10. User saves codes → Done
```

### **3.3 Enroll SMS (Fallback)**

```
1. User selects "SMS (Text Message)"
2. Show warning: "Less secure, use only if needed"
3. User enters phone number (+61 4XX XXX XXX)
4. Frontend calls POST /auth/mfa/sms/enroll { phone }
5. Server sends SMS with 6-digit code
6. User enters code to verify ownership
7. Frontend calls POST /auth/mfa/sms/verify { code }
8. Success → Recovery Codes screen
9. User saves codes → Done
```

### **3.4 MFA Challenge on Login**

```
1. User enters email + password on /auth/login
2. Credentials valid → check MFA status
3. If MFA enabled:
   a. Check risk factors (new device/IP?)
   b. If trusted device + low risk → skip challenge
   c. Else → redirect to /auth/mfa/verify
4. Show MFA challenge modal:
   - Default to user's preferred factor (Passkey)
   - "Use a different method" → show all enrolled factors
5. User completes challenge successfully
6. Option: "Remember this device for 30 days" ✓
7. Create session + device trust token
8. Redirect to /account or original destination
```

### **3.5 Step-Up Authentication**

```
1. User on /account/security wants to "Change Email"
2. Clicks "Change Email" button
3. Frontend detects sensitive action
4. Check: last step-up < 10 minutes?
5. If NO → show Step-Up modal:
   - "Confirm it's you to continue"
   - MFA challenge (same UI as login)
6. User completes challenge
7. Backend issues short-lived step-up token (JWT, 10 min)
8. Frontend includes step-up token in next request
9. Email change proceeds
10. Step-up token expires after 10 min or action complete
```

### **3.6 Recovery Codes**

```
Generate:
1. User on /account/security clicks "View Recovery Codes"
2. Step-Up challenge (if needed)
3. POST /auth/mfa/recovery-codes/generate
4. Server generates 10 random codes (12 chars each)
5. Server stores hashed versions (like passwords)
6. Return plaintext codes (only time shown)
7. User downloads codes.txt or copies
8. User checks "I've saved them securely" ✓

Use:
1. User at MFA challenge, no device/phone access
2. Clicks "Use recovery code"
3. Enters one code: ABCD-1234-EFGH-5678
4. POST /auth/mfa/recovery-codes/consume { code }
5. Server validates hash, marks consumed
6. Code becomes invalid (single-use)
7. Success → create session

Regenerate:
1. User clicks "Regenerate Recovery Codes"
2. Step-Up challenge
3. Old codes invalidated, new set generated
4. Email notification sent
```

### **3.7 Device & Session Management**

```
Add Device:
1. User logs in from new device
2. MFA challenge → success
3. Option: "Trust this device?" ✓
4. Server creates device record:
   - UA hash, client hints, last IP, label
   - Issues device trust token (30 days)
5. Device appears in /account/security/devices

Revoke Device:
1. User sees unrecognized device
2. Clicks [Revoke] on device
3. Confirm modal: "Sign out all sessions on this device?"
4. POST /account/security/devices/:id/revoke
5. Server invalidates all refresh tokens for device
6. Device removed from list
7. Email notification: "Device removed from your account"

Revoke Session:
1. User on /account/security/sessions
2. Sees active session from unknown location
3. Clicks [Sign Out] on session
4. POST /account/security/sessions/:id/revoke
5. Server invalidates that specific refresh token
6. Session removed, user logged out on that device
```

---

## 🔌 **API Contracts**

### **4.1 WebAuthn (Passkeys)**

**Registration Options:**
```typescript
POST /auth/mfa/webauthn/registration/options
Headers: { Authorization: "Bearer <access_token>" }

Request: {
  displayName: string;  // "John Doe"
  attestation?: "none" | "direct" | "indirect";
}

Response: {
  challenge: string;  // Base64URL
  rp: {
    name: string;  // "Easy11"
    id: string;    // "easy11.com"
  };
  user: {
    id: string;           // User handle (opaque)
    name: string;         // "john@example.com"
    displayName: string;  // "John Doe"
  };
  pubKeyCredParams: Array<{
    type: "public-key";
    alg: number;  // -7 (ES256), -257 (RS256)
  }>;
  timeout: number;  // 60000 (60s)
  authenticatorSelection?: {
    authenticatorAttachment?: "platform" | "cross-platform";
    residentKey?: "required" | "preferred" | "discouraged";
    userVerification?: "required" | "preferred" | "discouraged";
  };
}
```

**Registration Verify:**
```typescript
POST /auth/mfa/webauthn/registration/verify
Headers: { Authorization: "Bearer <access_token>" }

Request: {
  id: string;  // Credential ID (Base64URL)
  rawId: string;  // Raw credential ID
  response: {
    clientDataJSON: string;
    attestationObject: string;
  };
  type: "public-key";
}

Response: {
  status: "ok";
  credentialId: string;
  message: "Passkey registered successfully";
}

Error: {
  status: "error";
  code: "INVALID_ATTESTATION" | "CHALLENGE_MISMATCH" | "TIMEOUT";
  message: string;
}
```

**Authentication Options:**
```typescript
POST /auth/mfa/webauthn/authentication/options

Request: {
  userId?: string;  // Optional if already in session
}

Response: {
  challenge: string;
  allowCredentials: Array<{
    id: string;  // Base64URL credential ID
    type: "public-key";
    transports?: ("usb" | "nfc" | "ble" | "internal")[];
  }>;
  timeout: number;
  userVerification: "required" | "preferred" | "discouraged";
}
```

**Authentication Verify:**
```typescript
POST /auth/mfa/webauthn/authentication/verify

Request: {
  id: string;
  rawId: string;
  response: {
    clientDataJSON: string;
    authenticatorData: string;
    signature: string;
    userHandle?: string;
  };
  type: "public-key";
}

Response: {
  status: "ok";
  mfa_token: string;  // Short-lived token for session creation
  message: "Authentication successful";
}
```

### **4.2 TOTP (Authenticator App)**

```typescript
POST /auth/mfa/totp/enroll
Headers: { Authorization: "Bearer <access_token>" }

Response: {
  otpauth_uri: string;  // "otpauth://totp/Easy11:john@example.com?secret=..."
  qr_code: string;      // Data URL of QR code image
  secret: string;       // Base32 secret (for manual entry)
  algorithm: "SHA1";
  digits: 6;
  period: 30;
}

POST /auth/mfa/totp/verify
Request: { code: string; }  // "123456"
Response: { status: "ok"; message: "TOTP enrolled successfully"; }

POST /auth/mfa/totp/challenge
Request: { code: string; }
Response: { status: "ok"; mfa_token: string; }
Error: { status: "error"; code: "INVALID_CODE" | "RATE_LIMITED"; message: string; }
```

### **4.3 SMS**

```typescript
POST /auth/mfa/sms/enroll
Headers: { Authorization: "Bearer <access_token>" }
Request: { phone: string; }  // E.164 format: "+61412345678"
Response: { status: "code_sent"; expires_at: string; }

POST /auth/mfa/sms/verify
Request: { code: string; }
Response: { status: "ok"; message: "Phone verified"; }

POST /auth/mfa/sms/challenge
Request: { userId?: string; }
Response: { status: "code_sent"; masked_phone: "+61 4** *** **3"; }

POST /auth/mfa/sms/challenge/verify
Request: { code: string; }
Response: { status: "ok"; mfa_token: string; }
Error: { status: "error"; code: "INVALID_CODE" | "EXPIRED" | "RATE_LIMITED"; attempts_remaining: number; }
```

### **4.4 Recovery Codes**

```typescript
POST /auth/mfa/recovery-codes/generate
Headers: { Authorization: "Bearer <access_token>", X-Step-Up-Token: "<token>" }

Response: {
  codes: string[];  // ["ABCD-1234-EFGH-5678", ...]  (10 codes)
  version: number;  // Increments on regeneration
  created_at: string;
}

POST /auth/mfa/recovery-codes/consume
Request: { code: string; }
Response: { status: "ok"; mfa_token: string; remaining_codes: number; }
Error: { status: "error"; code: "INVALID_CODE" | "ALREADY_USED"; }
```

### **4.5 MFA Status & Settings**

```typescript
GET /auth/mfa/status
Headers: { Authorization: "Bearer <access_token>" }

Response: {
  enabled: boolean;
  default_factor: "webauthn" | "totp" | "sms" | null;
  factors: {
    webauthn: number;  // Count of enrolled passkeys
    totp: number;      // 0 or 1
    sms: number;       // 0 or 1
  };
  recovery_codes_count: number;
  last_challenged_at: string | null;
}

POST /auth/mfa/default
Headers: { Authorization: "Bearer <access_token>" }
Request: { factor: "webauthn" | "totp" | "sms"; }
Response: { status: "ok"; default_factor: string; }
```

### **4.6 Devices & Sessions**

```typescript
GET /account/security/devices
Response: {
  devices: Array<{
    id: string;
    label: string;  // "MacBook Pro (Chrome)"
    os: string;     // "macOS"
    browser: string; // "Chrome"
    trusted: boolean;
    last_ip: string;
    last_location: string;  // "Melbourne, Australia"
    last_seen: string;
    created_at: string;
  }>;
}

POST /account/security/devices/:id/revoke
Response: { status: "ok"; message: "Device revoked"; sessions_invalidated: number; }

POST /account/security/devices/:id/rename
Request: { label: string; }
Response: { status: "ok"; }

GET /account/security/sessions
Response: {
  sessions: Array<{
    id: string;
    device_id: string;
    device_label: string;
    created_at: string;
    last_seen: string;
    last_ip: string;
    is_current: boolean;
    risk_flags: string[];
  }>;
}

POST /account/security/sessions/:id/revoke
Response: { status: "ok"; message: "Session signed out"; }
```

### **4.7 Step-Up Authentication**

```typescript
POST /auth/step-up/challenge
Headers: { Authorization: "Bearer <access_token>" }
Request: { purpose: string; }  // "change_email", "add_payment", etc.

Response: {
  challenge_id: string;
  factors_available: ("webauthn" | "totp" | "sms")[];
}

POST /auth/step-up/verify
Request: {
  challenge_id: string;
  factor: string;
  // ... factor-specific payload (same as MFA challenge)
}

Response: {
  status: "ok";
  step_up_token: string;  // JWT, valid 10 minutes
  expires_at: string;
}
```

---

## 🗄️ **Data Model**

### **mfa_settings**
```sql
CREATE TABLE mfa_settings (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  enabled BOOLEAN DEFAULT false,
  default_factor VARCHAR(20),  -- 'webauthn', 'totp', 'sms'
  passkey_enabled BOOLEAN DEFAULT false,
  totp_enabled BOOLEAN DEFAULT false,
  sms_enabled BOOLEAN DEFAULT false,
  recovery_codes_version INTEGER DEFAULT 0,
  last_enrolled_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

### **webauthn_credentials**
```sql
CREATE TABLE webauthn_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  credential_id TEXT UNIQUE NOT NULL,  -- Base64URL
  public_key TEXT NOT NULL,            -- PEM or COSE
  sign_count BIGINT DEFAULT 0,
  transports TEXT[],                   -- ['internal', 'usb', ...]
  label VARCHAR(255),                  -- "My iPhone", "Work Laptop"
  created_at TIMESTAMP DEFAULT NOW(),
  last_used_at TIMESTAMP
);

CREATE INDEX idx_webauthn_user ON webauthn_credentials(user_id);
CREATE INDEX idx_webauthn_cred ON webauthn_credentials(credential_id);
```

### **totp_secrets**
```sql
CREATE TABLE totp_secrets (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  secret_enc TEXT NOT NULL,         -- Encrypted Base32 secret
  algorithm VARCHAR(10) DEFAULT 'SHA1',
  digits INTEGER DEFAULT 6,
  period INTEGER DEFAULT 30,
  created_at TIMESTAMP DEFAULT NOW(),
  last_verified_at TIMESTAMP
);
```

### **sms_mfa**
```sql
CREATE TABLE sms_mfa (
  user_id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
  e164_phone_enc TEXT NOT NULL,    -- Encrypted phone number
  verified_at TIMESTAMP,
  last_challenge_at TIMESTAMP,
  send_count_window INTEGER DEFAULT 0,
  window_reset_at TIMESTAMP
);
```

### **recovery_codes**
```sql
CREATE TABLE recovery_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  code_hash TEXT NOT NULL,
  version INTEGER NOT NULL,        -- Matches mfa_settings.recovery_codes_version
  created_at TIMESTAMP DEFAULT NOW(),
  consumed_at TIMESTAMP,
  UNIQUE(user_id, code_hash)
);

CREATE INDEX idx_recovery_user ON recovery_codes(user_id);
```

### **devices**
```sql
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  label VARCHAR(255),              -- "MacBook Pro (Chrome)"
  ua_hash TEXT,                    -- SHA256(User-Agent)
  client_hints_json JSONB,         -- Structured client data
  trusted BOOLEAN DEFAULT false,
  trust_expires_at TIMESTAMP,      -- 30 days from trust
  last_ip INET,
  last_location VARCHAR(255),      -- "Melbourne, Australia"
  last_seen TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_devices_user ON devices(user_id);
```

### **sessions (extended from Sprint 1)**
```sql
ALTER TABLE sessions ADD COLUMN device_id UUID REFERENCES devices(id);
ALTER TABLE sessions ADD COLUMN risk_flags TEXT[];
ALTER TABLE sessions ADD COLUMN is_trusted BOOLEAN DEFAULT false;
ALTER TABLE sessions ADD COLUMN mfa_completed_at TIMESTAMP;
```

### **step_up_challenges**
```sql
CREATE TABLE step_up_challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  purpose VARCHAR(100) NOT NULL,   -- 'change_email', 'add_payment', etc.
  challenge TEXT NOT NULL,         -- Random challenge string
  expires_at TIMESTAMP NOT NULL,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stepup_user ON step_up_challenges(user_id);
```

---

## 🔒 **Security Controls**

### **Factor Precedence**
1. Passkey (WebAuthn) → Most secure, phishing-resistant
2. TOTP (Authenticator App) → Widely compatible
3. SMS → Least secure, fallback only

### **Rate Limits**
- **TOTP verification:** 5 attempts per minute per account
- **SMS send:** 3 per hour per account/phone, exponential backoff
- **Recovery code:** 5 attempts per hour per account
- **WebAuthn:** No strict limit (but audit suspicious activity)

### **Secret Handling**
- TOTP secrets: Encrypted at rest (AES-256-GCM)
- SMS phone numbers: Encrypted at rest
- Recovery codes: Hashed with Argon2id (like passwords)
- WebAuthn public keys: Stored plaintext (public data)

### **Replay Protection**
- WebAuthn: Verify sign_count increments (detect cloned credentials)
- TOTP: Time-based, accept ±1 time step (30s window)
- SMS: Single-use codes, 5-minute expiry
- Recovery codes: Single-use, mark consumed immediately

### **Risk Engine**
Trigger MFA challenge on:
- New device fingerprint (UA hash + client hints)
- New IP address or ASN
- Geographic distance (impossible travel)
- Velocity (too many logins in short time)
- High-value transaction or data export

### **Transport & Headers**
- TLS 1.3 minimum
- HSTS: max-age=31536000; includeSubDomains
- CSP: No inline scripts on MFA pages
- X-Frame-Options: DENY
- X-Content-Type-Options: nosniff

### **Audit Logging**
Log all events:
- mfa.enroll_{start|success|fail}
- mfa.challenge_{start|success|fail}
- mfa.factor_changed
- mfa.recovery_{generated|used}
- device.{added|renamed|revoked}
- session.revoked
- stepup.{required|success|fail}

---

## 📧 **Emails & Notifications**

### **1. New Device Sign-In**
```
Subject: New sign-in to your Easy11 account

Hi [Name],

We detected a new sign-in to your account:

Device: MacBook Pro (Chrome)
Location: Melbourne, Australia
Time: Nov 3, 2025 at 9:15 AM AEDT

If this was you, no action needed.

If this wasn't you, secure your account immediately:
[It Wasn't Me - Secure My Account]

This link will sign you out everywhere and require a password reset.

Stay secure,
Easy11 Security Team
```

### **2. MFA Enabled**
```
Subject: Multi-Factor Authentication enabled

Hi [Name],

You've successfully enabled MFA on your Easy11 account using: [Passkey / Authenticator App / SMS]

Your account is now more secure. You'll be asked to verify your identity when signing in.

Recovery Codes: Make sure you've saved your recovery codes in a secure place.

[View Security Settings]

If you didn't enable this, contact support immediately.

Easy11 Security Team
```

### **3. MFA Disabled**
```
Subject: ⚠️ Multi-Factor Authentication disabled

Hi [Name],

MFA was disabled on your account on Nov 3, 2025 at 9:15 AM.

Your account is now LESS SECURE. We strongly recommend re-enabling MFA.

[Re-Enable MFA Now]

If you didn't do this, secure your account immediately:
[It Wasn't Me - Secure My Account]

Easy11 Security Team
```

### **4. Recovery Codes Regenerated**
```
Subject: New recovery codes generated

Hi [Name],

You've generated a new set of recovery codes. Your old codes are now invalid.

Make sure to store your new codes in a secure place (password manager, encrypted file, etc.).

[View Recovery Codes]

If you didn't do this, secure your account immediately.

Easy11 Security Team
```

### **5. Phone Added for SMS MFA**
```
Subject: Phone number added to your account

Hi [Name],

You've added +61 4** *** **3 to your Easy11 account for SMS-based MFA.

You'll receive codes at this number when signing in.

If you didn't do this, secure your account immediately:
[It Wasn't Me - Secure My Account]

Easy11 Security Team
```

### **6. Device Revoked**
```
Subject: Device removed from your account

Hi [Name],

A device was removed from your Easy11 account:

Device: iPhone 15 (Safari)
Removed: Nov 3, 2025 at 9:15 AM

All sessions on this device have been signed out.

[View My Devices]

If you didn't do this, secure your account immediately.

Easy11 Security Team
```

---

## 📊 **Telemetry & Dashboards**

### **Events to Track**

```typescript
// Enrollment
mfa.enroll_started { factor: 'webauthn' | 'totp' | 'sms' }
mfa.enroll_success { factor, time_to_complete_ms }
mfa.enroll_fail { factor, error_code }

// Challenge
mfa.challenge_started { factor, trigger: 'login' | 'stepup' | 'risk' }
mfa.challenge_success { factor, time_to_complete_ms }
mfa.challenge_fail { factor, error_code, attempts_remaining }

// Settings
mfa.default_changed { from_factor, to_factor }
mfa.factor_removed { factor }

// Recovery
mfa.recovery_generated { codes_count }
mfa.recovery_used { success: boolean, remaining_codes }

// Security
security.device_added { os, browser, location }
security.device_renamed { device_id }
security.device_revoked { device_id, sessions_count }
security.session_revoked { session_id, was_current: boolean }

// Risk & Step-Up
risk.detected { type: 'new_device' | 'new_ip' | 'velocity', risk_score }
risk.stepup_triggered { purpose, user_id }
risk.stepup_success { purpose, time_to_complete_ms }
risk.stepup_fail { purpose, error_code }

// Rate Limits
sms.rate_limit_triggered { phone_hash, window_count }
totp.invalid_attempts { user_id, count }
```

### **Dashboards**

**1. MFA Adoption Dashboard**
- MFA Enabled %: Line chart over time
- Factor Mix: Pie chart (Passkey vs TOTP vs SMS)
- Enrollment Funnel: Started → Success → With Recovery Codes
- Time to Complete: Histogram (seconds)

**2. Challenge Performance**
- Success Rate: By factor (Passkey: 98%, TOTP: 92%, SMS: 88%)
- Median Time to Complete: By factor
- Failure Reasons: Bar chart (invalid code, timeout, user cancelled)
- Peak Challenge Times: Heatmap (by hour/day)

**3. Risk & Step-Up**
- Risk Events: Count over time (new device, new IP, velocity)
- Step-Up Triggers: By purpose (change_email, add_payment, etc.)
- False Positive Rate: User feedback or support tickets
- Risk Score Distribution: Histogram

**4. SMS & Rate Limits**
- SMS Sends: Count over time, cost per day
- Rate Limit Hits: By type (TOTP, SMS, recovery)
- Phone Carrier Mix: Pie chart (for debugging deliverability)

**5. Device & Session Health**
- Avg Devices per User: Line chart
- Device Revocations: Count over time, by reason
- Session Duration: Histogram (minutes/hours)
- Trusted Device %: Pie chart

---

## ✅ **Acceptance Criteria**

### **Functional**
- ✅ Users can enroll Passkey, TOTP, or SMS
- ✅ Passkeys offered first and work on major browsers (Chrome, Safari, Edge, Firefox)
- ✅ TOTP QR codes scan successfully in Google Auth, Authy, 1Password
- ✅ SMS codes deliver within 30 seconds
- ✅ Recovery codes generate, download, and work for login
- ✅ Users can set default factor and add multiple passkeys
- ✅ MFA challenge triggers on login when enabled
- ✅ Risk events (new device/IP) trigger challenge even if trusted
- ✅ Step-Up required for sensitive actions (change email, add card, etc.)
- ✅ Device list shows OS/browser, location, last seen
- ✅ Revoking device signs out all sessions immediately
- ✅ Session list accurate, revoke works in real-time

### **Security**
- ✅ TOTP time drift tolerance: ±1 step (30s) only
- ✅ SMS codes: Single-use, 5-minute expiry
- ✅ WebAuthn counters increment, reject cloned credentials
- ✅ Rate limits enforced (TOTP: 5/min, SMS: 3/hour)
- ✅ All secrets encrypted at rest (TOTP, phone)
- ✅ Recovery codes hashed with Argon2id
- ✅ CSRF protection on all state-changing routes
- ✅ Audit entries created for every sensitive operation
- ✅ Step-Up token expires after 10 minutes or use

### **A11y & UX**
- ✅ Keyboard-only navigation works (Tab, Enter, Esc)
- ✅ Screen reader announces errors and success states
- ✅ Color contrast ≥ 4.5:1 (WCAG AA)
- ✅ Motion-reduced animations for vestibular sensitivity
- ✅ Mobile-optimized (iOS/Android WebAuthn, QR camera, SMS autofill)
- ✅ OTP input: Auto-focus, paste support, numeric keypad on mobile

### **Performance**
- ✅ MFA challenge TTFB < 400ms (p75)
- ✅ End-to-end passkey flow < 2.5s (p75)
- ✅ QR code generation < 200ms
- ✅ Device list loads < 500ms

---

## 🚀 **Rollout Plan**

### **Phase 1: Staging (Week 1)**
- Deploy to staging environment
- Enable for internal test users (10-20 accounts)
- Seed mock devices and sessions
- Simulate risk events (new device/IP)
- Test all factors on iOS/Android/Desktop

### **Phase 2: Dark Launch (Week 2)**
- Enable Passkeys only for 10% of production users
- Monitor failure rates, browser compatibility
- No forced enrollment, opt-in only
- Collect telemetry, watch dashboards

### **Phase 3: TOTP Rollout (Week 3)**
- Enable TOTP for all users
- In-app nudge: "Secure your account with 2FA"
- Email campaign explaining benefits
- Monitor QR scan success rate

### **Phase 4: SMS Fallback (Week 4)**
- Enable SMS for users without smartphone/passkey support
- Hard rate-limits (3/hour)
- Cost monitoring (SMS fees)

### **Phase 5: Risk-Based Step-Up (Week 5)**
- Turn on risk detection (new device/IP)
- Start with low thresholds (minimize false positives)
- Gradually tune based on support tickets and user feedback

### **Phase 6: Full Rollout (Week 6)**
- MFA available to all users
- In-app banner: "Enable MFA for 100 bonus points!"
- Blog post + social media announcement
- Optional: MFA required for high-value accounts (>$10k orders)

### **Phase 7: Policy Enforcement (Future)**
- MFA required for all new accounts (after 30 days)
- Gradual enforcement for existing accounts (grace period)
- Support "MFA lite" (SMS only) for regions with low smartphone penetration

---

## 📦 **Deliverables Checklist**

### **UI Components** ✅
- [ ] MFA Enrollment page (factor selection)
- [ ] Passkey enrollment component
- [ ] TOTP enrollment component (QR + manual entry)
- [ ] SMS enrollment component
- [ ] MFA Challenge modal (Passkey/TOTP/SMS)
- [ ] Segmented OTP input component (6-digit)
- [ ] Recovery Codes view/download component
- [ ] Step-Up modal (sensitive action gate)
- [ ] /account/security page (MFA status, devices, sessions)
- [ ] Device list component (rename, revoke)
- [ ] Session list component (sign out)

### **API Endpoints** (Mock)
- [ ] POST /auth/mfa/webauthn/registration/options
- [ ] POST /auth/mfa/webauthn/registration/verify
- [ ] POST /auth/mfa/webauthn/authentication/options
- [ ] POST /auth/mfa/webauthn/authentication/verify
- [ ] POST /auth/mfa/totp/enroll
- [ ] POST /auth/mfa/totp/verify
- [ ] POST /auth/mfa/totp/challenge
- [ ] POST /auth/mfa/sms/enroll
- [ ] POST /auth/mfa/sms/verify
- [ ] POST /auth/mfa/sms/challenge
- [ ] POST /auth/mfa/recovery-codes/generate
- [ ] POST /auth/mfa/recovery-codes/consume
- [ ] GET /auth/mfa/status
- [ ] POST /auth/mfa/default
- [ ] GET /account/security/devices
- [ ] POST /account/security/devices/:id/revoke
- [ ] POST /account/security/devices/:id/rename
- [ ] GET /account/security/sessions
- [ ] POST /account/security/sessions/:id/revoke
- [ ] POST /auth/step-up/challenge
- [ ] POST /auth/step-up/verify

### **Data Models**
- [ ] mfa_settings table schema
- [ ] webauthn_credentials table
- [ ] totp_secrets table
- [ ] sms_mfa table
- [ ] recovery_codes table
- [ ] devices table
- [ ] step_up_challenges table
- [ ] sessions table extensions
- [ ] Prisma schema updates
- [ ] Database migrations

### **State Management**
- [ ] MFA Zustand store (enrollment status, factors, devices)
- [ ] Step-Up state management
- [ ] Device trust tracking

### **Utilities**
- [ ] QR code generation (TOTP otpauth:// URI)
- [ ] TOTP validation (time-based OTP)
- [ ] Recovery code generation (random, secure)
- [ ] Device fingerprinting (UA + client hints)
- [ ] Risk detection (new device/IP/location)

### **Security & Risk**
- [ ] Rate limiting logic (TOTP, SMS, recovery)
- [ ] Risk engine (new device/IP detection)
- [ ] Step-Up token generation (JWT, 10-min expiry)
- [ ] Audit logging hooks

### **Emails**
- [ ] New device sign-in template
- [ ] MFA enabled template
- [ ] MFA disabled warning template
- [ ] Phone added template
- [ ] Recovery codes regenerated template
- [ ] Device revoked template

### **Telemetry**
- [ ] MFA enrollment events
- [ ] Challenge success/fail events
- [ ] Step-Up events
- [ ] Device/session events
- [ ] Rate limit hit events
- [ ] Dashboards (Grafana/PostHog)

### **QA & Testing**
- [ ] Functional tests (all flows)
- [ ] Security tests (rate limits, replay protection)
- [ ] A11y tests (keyboard, screen reader)
- [ ] Mobile tests (iOS Safari, Android Chrome)
- [ ] Cross-browser (Chrome, Firefox, Safari, Edge)

### **Documentation**
- [ ] MFA User Guide (how to enable, use, troubleshoot)
- [ ] Admin Runbook (account takeover response)
- [ ] Developer Guide (backend implementation)
- [ ] Email template documentation
- [ ] Telemetry guide (dashboards, alerts)

---

## 🎯 **Success Metrics**

### **Adoption**
- MFA Enrollment Rate: Target 40% within 3 months
- Passkey Adoption: Target 60% of MFA users
- Recovery Codes Saved: >95% completion rate

### **Security**
- Account Takeover Reduction: -80% (vs pre-MFA baseline)
- Credential Stuffing Success: <0.01%
- False Positive Rate: <2% (step-up challenges)

### **UX**
- MFA Challenge Time: Median <10s (Passkey), <30s (TOTP)
- Enrollment Drop-off: <15%
- Support Tickets: <5% increase (well-documented)

### **Performance**
- API Response Time: p75 <400ms
- End-to-End Flow: p75 <3s
- SMS Delivery: >98% within 30s

---

## 📚 **References**

- **OWASP Authentication Cheat Sheet:** https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
- **NIST SP 800-63B:** https://pages.nist.gov/800-63-3/sp800-63b.html
- **W3C WebAuthn Spec:** https://www.w3.org/TR/webauthn-2/
- **RFC 6238 (TOTP):** https://datatracker.ietf.org/doc/html/rfc6238
- **FIDO2 Best Practices:** https://fidoalliance.org/specifications/

---

## 🎉 **Sprint 2 Overview**

**Estimated Effort:** 80-120 hours (2-3 weeks, 1-2 engineers)

**Critical Path:**
1. MFA Store + Types + API Layer (8h)
2. Passkey Components (12h)
3. TOTP Components (10h)
4. SMS Components (8h)
5. Recovery Codes (6h)
6. MFA Challenge Modal (8h)
7. Step-Up Modal (6h)
8. Security Page (Devices + Sessions) (12h)
9. Risk Engine (8h)
10. Integration (Login flow, Auth checks) (10h)
11. Testing (Functional, Security, A11y) (12h)
12. Documentation (10h)

**Total:** ~110 hours

---

**Status:** 📝 Specification Complete → 🚀 Ready for Implementation

**Next:** Begin implementation with MFA types, store, and API layer.

