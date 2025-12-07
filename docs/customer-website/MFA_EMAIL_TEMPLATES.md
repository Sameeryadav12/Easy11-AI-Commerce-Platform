# 📧 **MFA Email Templates**

**Sprint 2: Multi-Factor Authentication**  
**Last Updated:** November 3, 2025

---

## 📨 **Email Templates**

All emails include:
- Easy11 branding (logo, colors)
- Clear call-to-action buttons
- Security reminders
- Unsubscribe option (except security alerts)

---

### **1. New Device Sign-In**

**Subject:** `New sign-in to your Easy11 account`

**Content:**
```
Hi [Name],

We detected a new sign-in to your account:

Device: MacBook Pro (Chrome)
Location: Melbourne, Australia  
Time: Nov 3, 2025 at 9:15 AM AEDT
IP Address: 203.123.45.67

If this was you, no action needed.

If this wasn't you, secure your account immediately:
[It Wasn't Me - Secure My Account]

This link will sign you out everywhere and require a password reset.

Stay secure,
Easy11 Security Team

---
This is a security alert and cannot be unsubscribed from.
```

---

### **2. MFA Enabled**

**Subject:** `✅ Multi-Factor Authentication enabled`

**Content:**
```
Hi [Name],

You've successfully enabled MFA on your Easy11 account using: [Passkey / Authenticator App / SMS]

Your account is now more secure. You'll be asked to verify your identity when signing in.

Recovery Codes: Make sure you've saved your recovery codes in a secure place.

[View Security Settings]

If you didn't enable this, contact support immediately.

Easy11 Security Team
```

---

### **3. MFA Disabled**

**Subject:** `⚠️ Multi-Factor Authentication disabled`

**Content:**
```
Hi [Name],

MFA was disabled on your account on Nov 3, 2025 at 9:15 AM.

Your account is now LESS SECURE. We strongly recommend re-enabling MFA.

[Re-Enable MFA Now]

If you didn't do this, secure your account immediately:
[It Wasn't Me - Secure My Account]

Easy11 Security Team

---
This is a security alert and cannot be unsubscribed from.
```

---

### **4. Recovery Codes Regenerated**

**Subject:** `🔄 New recovery codes generated`

**Content:**
```
Hi [Name],

You've generated a new set of recovery codes. Your old codes are now invalid.

Make sure to store your new codes in a secure place (password manager, encrypted file, etc.).

[View Recovery Codes]

If you didn't do this, secure your account immediately.

Easy11 Security Team
```

---

### **5. Phone Added for SMS MFA**

**Subject:** `📱 Phone number added to your account`

**Content:**
```
Hi [Name],

You've added +61 4** *** **3 to your Easy11 account for SMS-based MFA.

You'll receive codes at this number when signing in.

If you didn't do this, secure your account immediately:
[It Wasn't Me - Secure My Account]

Easy11 Security Team
```

---

### **6. Device Revoked**

**Subject:** `🚫 Device removed from your account`

**Content:**
```
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

### **7. Session Signed Out**

**Subject:** `👋 Session signed out`

**Content:**
```
Hi [Name],

A session was signed out from your Easy11 account:

Device: MacBook Pro (Chrome)
Location: Melbourne, Australia
Signed out: Nov 3, 2025 at 9:15 AM

[View Active Sessions]

If you didn't do this, please review your security settings.

Easy11 Security Team
```

---

### **8. MFA Challenge Failed (Multiple Attempts)**

**Subject:** `🚨 Multiple failed sign-in attempts`

**Content:**
```
Hi [Name],

We detected multiple failed MFA verification attempts on your account:

Time: Nov 3, 2025 at 9:15 AM
Device: Unknown Device (Chrome)
Location: Unknown

If this was you, you may have entered the wrong code.

If this wasn't you, your account may be under attack:
[Secure My Account Now]

Consider:
• Changing your password
• Reviewing your trusted devices
• Enabling additional security factors

Easy11 Security Team

---
This is a security alert and cannot be unsubscribed from.
```

---

## 📋 **Email Delivery Best Practices**

### **Timing**
- **Immediate:** New device, MFA enabled/disabled, device revoked
- **Batched (5 min):** Recovery code regen, phone added
- **Delayed (15 min):** Session signed out (to avoid spam on bulk logout)

### **Priority**
- **Critical:** Failed attempts, new device, MFA disabled
- **High:** MFA enabled, device revoked
- **Medium:** Recovery codes, phone added, session signed out

### **Channels**
- **Email:** All security events
- **SMS:** Critical events only (failed attempts, new device from suspicious location)
- **Push:** Optional in-app notifications

### **Deliverability**
- **From:** security@easy11.com (dedicated security sender)
- **Reply-To:** support@easy11.com
- **SPF/DKIM/DMARC:** Properly configured
- **Unsubscribe:** Not available for security alerts (legal requirement)

### **Compliance**
- **GDPR:** Include privacy policy link
- **CAN-SPAM:** Include physical address
- **Accessibility:** Plain text version included

---

## 🔔 **Push Notification Variants**

| Event | Title | Body | Actions |
|-------|-------|------|---------|
| **New Device** | 🔐 New sign-in detected | MacBook Pro from Melbourne | [View] [Secure Account] |
| **MFA Enabled** | ✅ MFA is now active | Your account is more secure | [View Settings] |
| **Device Revoked** | 🚫 Device removed | iPhone 15 has been revoked | [View Devices] |
| **Failed Attempts** | 🚨 Security alert | Multiple failed sign-in attempts | [Review] [Secure] |

---

**Status:** ✅ Email templates documented and ready for implementation

**Next:** Backend team can implement these templates with SendGrid, AWS SES, or similar service.

