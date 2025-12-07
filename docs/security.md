# 🔐 Easy11 Security Documentation

## Table of Contents

1. [Security Overview](#security-overview)
2. [Threat Model](#threat-model)
3. [Security Architecture](#security-architecture)
4. [Authentication & Authorization](#authentication--authorization)
5. [Data Protection](#data-protection)
6. [Network Security](#network-security)
7. [Application Security](#application-security)
8. [DevOps Security](#devops-security)
9. [Compliance & Auditing](#compliance--auditing)
10. [Incident Response](#incident-response)

---

## Security Overview

Easy11 Commerce Intelligence Platform implements **defense in depth** security across all layers of the stack. Our security-first approach ensures customer data, financial transactions, and intellectual property are protected.

### Security Principles

1. **Least Privilege**: Users and services have minimum necessary access
2. **Defense in Depth**: Multiple security layers
3. **Zero Trust**: Verify every request
4. **Security by Design**: Built-in from the start
5. **Continuous Monitoring**: Real-time threat detection
6. **Incident Response**: Fast containment and recovery

---

## Threat Model

### STRIDE Analysis

| Threat | Category | Mitigation |
|--------|----------|------------|
| **Spoofing** | Authentication | JWT + MFA, OAuth 2.0 |
| **Tampering** | Integrity | HTTPS, HMAC, Database encryption |
| **Repudiation** | Non-repudiation | Audit logs, immutable records |
| **Information Disclosure** | Confidentiality | TLS, encryption at rest, PII masking |
| **Denial of Service** | Availability | Rate limiting, CDN, auto-scaling |
| **Elevation of Privilege** | Authorization | RBAC, input validation, parameterized queries |

### Attack Surface

```
┌──────────────────────────────────────────────────────┐
│                   Attack Surface                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  1. Frontend (React)                                  │
│     • XSS attacks                                     │
│     • CSRF attacks                                    │
│     • Clickjacking                                    │
│                                                       │
│  2. API Layer (Node.js)                              │
│     • SQL injection                                   │
│     • NoSQL injection                                 │
│     • Command injection                               │
│     • Authentication bypass                           │
│                                                       │
│  3. Data Layer                                        │
│     • Database compromise                             │
│     • Data exfiltration                               │
│     • Unauthorized access                             │
│                                                       │
│  4. ML Service (FastAPI)                             │
│     • Model poisoning                                 │
│     • Adversarial inputs                              │
│     • Inference attacks                               │
│                                                       │
│  5. Infrastructure                                    │
│     • DDoS attacks                                    │
│     • Container escape                                │
│     • Misconfigured cloud resources                   │
│                                                       │
└──────────────────────────────────────────────────────┘
```

---

## Security Architecture

### Defense in Depth Layers

```
┌──────────────────────────────────────────────────────────────────┐
│                        Layer 1: Perimeter                        │
│  • CloudFlare WAF                                                │
│  • DDoS Protection                                               │
│  • IP Whitelisting                                               │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                      Layer 2: Network                            │
│  • VPC Isolation                                                 │
│  • Security Groups                                               │
│  • VPN Access                                                    │
│  • Network ACLs                                                  │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                   Layer 3: Application                           │
│  • Authentication (JWT + MFA)                                   │
│  • Authorization (RBAC)                                          │
│  • Input Validation (Zod)                                        │
│  • Rate Limiting                                                 │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                      Layer 4: Data                               │
│  • Encryption at Rest (AES-256)                                  │
│  • Encryption in Transit (TLS 1.3)                               │
│  • PII Masking                                                   │
│  • Database Access Control                                       │
└────────────────────────────────┬─────────────────────────────────┘
                                 │
┌────────────────────────────────▼─────────────────────────────────┐
│                    Layer 5: Monitoring                           │
│  • Intrusion Detection (IDS)                                     │
│  • Audit Logging                                                 │
│  • Security Event Analysis                                       │
│  • Anomaly Detection                                             │
└──────────────────────────────────────────────────────────────────┘
```

---

## Authentication & Authorization

### Authentication

#### JWT (JSON Web Tokens)

```typescript
// JWT Configuration
const jwtConfig = {
  accessTokenExpiry: '15m',
  refreshTokenExpiry: '7d',
  algorithm: 'RS256',
  issuer: 'easy11.com',
  audience: 'easy11-app'
};

// Token Generation
const generateTokens = (user: User) => {
  const accessToken = jwt.sign(
    { userId: user.id, role: user.role },
    PRIVATE_KEY,
    {
      algorithm: 'RS256',
      expiresIn: jwtConfig.accessTokenExpiry,
      issuer: jwtConfig.issuer,
      audience: jwtConfig.audience
    }
  );
  
  const refreshToken = jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    REFRESH_SECRET,
    { expiresIn: jwtConfig.refreshTokenExpiry }
  );
  
  return { accessToken, refreshToken };
};
```

#### Password Security

```typescript
import bcrypt from 'bcrypt';
import crypto from 'crypto';

const SALT_ROUNDS = 12;

const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

const verifyPassword = async (
  password: string,
  hash: string
): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

// Password strength validation
const validatePassword = (password: string): ValidationResult => {
  const checks = {
    minLength: password.length >= 8,
    hasUpperCase: /[A-Z]/.test(password),
    hasLowerCase: /[a-z]/.test(password),
    hasNumber: /\d/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
  };
  
  const score = Object.values(checks).filter(Boolean).length;
  
  return {
    valid: score >= 4,
    score,
    checks
  };
};
```

#### Multi-Factor Authentication (MFA)

```typescript
import speakeasy from 'speakeasy';
import qrcode from 'qrcode';

// Generate MFA Secret
const generateMFASecret = async (email: string) => {
  const secret = speakeasy.generateSecret({
    name: `Easy11 (${email})`,
    issuer: 'Easy11'
  });
  
  const qrCodeUrl = await qrcode.toDataURL(secret.otpauth_url);
  
  return { secret: secret.base32, qrCodeUrl };
};

// Verify TOTP
const verifyTOTP = (token: string, secret: string): boolean => {
  return speakeasy.totp.verify({
    secret,
    encoding: 'base32',
    token,
    window: 2  // Allow 2-step drift
  });
};
```

### Authorization

#### Role-Based Access Control (RBAC)

```typescript
enum Role {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  MANAGER = 'manager',
  ANALYST = 'analyst'
}

enum Permission {
  // Product
  READ_PRODUCTS = 'read:products',
  WRITE_PRODUCTS = 'write:products',
  DELETE_PRODUCTS = 'delete:products',
  
  // Orders
  READ_ORDERS = 'read:orders',
  WRITE_ORDERS = 'write:orders',
  CANCEL_ORDERS = 'cancel:orders',
  
  // Analytics
  READ_ANALYTICS = 'read:analytics',
  EXPORT_ANALYTICS = 'export:analytics',
  
  // Admin
  MANAGE_USERS = 'manage:users',
  MANAGE_SETTINGS = 'manage:settings'
}

const rolePermissions: Record<Role, Permission[]> = {
  [Role.CUSTOMER]: [
    Permission.READ_PRODUCTS,
    Permission.READ_ORDERS,
    Permission.WRITE_ORDERS
  ],
  [Role.ADMIN]: [
    ...Object.values(Permission)
  ],
  [Role.MANAGER]: [
    Permission.READ_PRODUCTS,
    Permission.WRITE_PRODUCTS,
    Permission.READ_ORDERS,
    Permission.WRITE_ORDERS,
    Permission.READ_ANALYTICS,
    Permission.EXPORT_ANALYTICS
  ],
  [Role.ANALYST]: [
    Permission.READ_ORDERS,
    Permission.READ_ANALYTICS,
    Permission.EXPORT_ANALYTICS
  ]
};

// Authorization Middleware
const authorize = (...permissions: Permission[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    
    const userPermissions = rolePermissions[user.role] || [];
    const hasPermission = permissions.every(p => userPermissions.includes(p));
    
    if (!hasPermission) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    next();
  };
};
```

---

## Data Protection

### Encryption at Rest

```typescript
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY_LENGTH = 32;

// Generate encryption key
const generateKey = (): Buffer => {
  return crypto.randomBytes(KEY_LENGTH);
};

// Encrypt data
const encrypt = (data: string, key: Buffer): string => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(data, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  
  const authTag = cipher.getAuthTag();
  
  // Return: iv:authTag:encrypted
  return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`;
};

// Decrypt data
const decrypt = (encryptedData: string, key: Buffer): string => {
  const [ivHex, authTagHex, encrypted] = encryptedData.split(':');
  const iv = Buffer.from(ivHex, 'hex');
  const authTag = Buffer.from(authTagHex, 'hex');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
};
```

### Encryption in Transit

```nginx
# Nginx Configuration
server {
    listen 443 ssl http2;
    
    ssl_certificate /etc/ssl/certs/easy11.crt;
    ssl_certificate_key /etc/ssl/private/easy11.key;
    
    # TLS 1.3 only
    ssl_protocols TLSv1.3;
    
    # Strong ciphers
    ssl_ciphers 'TLS_AES_256_GCM_SHA384:TLS_CHACHA20_POLY1305_SHA256:TLS_AES_128_GCM_SHA256';
    
    # HSTS
    add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
    
    # Security headers
    add_header X-Frame-Options "DENY" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Content-Security-Policy "default-src 'self'" always;
}
```

### PII Masking

```typescript
const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  const visibleChars = Math.min(2, name.length);
  const maskedChars = name.length - visibleChars;
  
  const maskedName = name.substring(0, visibleChars) + '*'.repeat(maskedChars);
  return `${maskedName}@${domain}`;
};

const maskCreditCard = (cardNumber: string): string => {
  const last4 = cardNumber.slice(-4);
  return `****-****-****-${last4}`;
};

const maskSSN = (ssn: string): string => {
  return `***-**-${ssn.slice(-4)}`;
};
```

---

## Network Security

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

// API Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,
  message: 'Too many requests from this IP',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'Too Many Requests',
      message: 'Please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000)
    });
  }
});

// Auth Rate Limiter (stricter)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true,
  message: 'Too many authentication attempts'
});

// Search Rate Limiter (more permissive)
const searchLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 200,
  message: 'Too many search queries'
});
```

### DDoS Protection

```typescript
// IP-Based Filtering
const ipWhitelist = ['192.168.1.0/24', '10.0.0.0/8'];
const ipBlacklist = new Set(['1.2.3.4', '5.6.7.8']);

const ipFilter = (req: Request, res: Response, next: NextFunction) => {
  const ip = req.ip;
  
  // Check blacklist
  if (ipBlacklist.has(ip)) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  
  // Allow whitelist
  for (const subnet of ipWhitelist) {
    if (isIPInSubnet(ip, subnet)) {
      return next();
    }
  }
  
  next();
};
```

### Security Headers

```typescript
import helmet from 'helmet';

app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'", 'https://api.stripe.com'],
      fontSrc: ["'self'", 'data:'],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: []
    }
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  frameguard: {
    action: 'deny'
  },
  noSniff: true,
  xssFilter: true
}));
```

---

## Application Security

### Input Validation

```typescript
import { z } from 'zod';

// Product Validation Schema
const productSchema = z.object({
  name: z.string().min(1).max(200),
  description: z.string().max(5000),
  price: z.number().positive(),
  category: z.enum(['electronics', 'clothing', 'books', 'home']),
  stock: z.number().int().nonnegative(),
  tags: z.array(z.string()).max(10)
});

// SQL Injection Prevention
const getUserById = async (id: string): Promise<User | null> => {
  // Use parameterized queries
  return prisma.user.findUnique({
    where: { id },
    // Never do: `WHERE id = '${id}'` ❌
  });
};

// NoSQL Injection Prevention
const getProducts = async (filters: any) => {
  // Sanitize input
  const sanitizedFilters = {
    category: filters.category,
    minPrice: Number(filters.minPrice),
    maxPrice: Number(filters.maxPrice)
  };
  
  return Product.find(sanitizedFilters);
};
```

### Audit Logging

```typescript
interface AuditLog {
  id: string;
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress: string;
  userAgent: string;
  timestamp: Date;
  metadata?: Record<string, any>;
}

const auditLog = async (log: AuditLog): Promise<void> => {
  await prisma.auditLog.create({
    data: {
      ...log,
      timestamp: new Date()
    }
  });
};

// Usage
await auditLog({
  userId: req.user.id,
  action: 'READ',
  resource: 'ORDER',
  resourceId: orderId,
  ipAddress: req.ip,
  userAgent: req.get('User-Agent')
});
```

---

## DevOps Security

### Container Security

```dockerfile
# Dockerfile with security best practices
FROM node:20-alpine

# Use non-root user
RUN addgroup -g 1000 nodeuser && \
    adduser -D -u 1000 -G nodeuser nodeuser

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (production only)
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application
COPY --chown=nodeuser:nodeuser . .

# Switch to non-root user
USER nodeuser

# Expose port
EXPOSE 5000

# Health check
HEALTHCHECK --interval=30s --timeout=3s \
  CMD node healthcheck.js

# Start application
CMD ["node", "server.js"]
```

### CI/CD Security

```yaml
# .github/workflows/ci.yml
name: CI/CD Security Pipeline

on: [push, pull_request]

jobs:
  security:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Trivy Vulnerability Scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'easy11/backend:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: CodeQL Analysis
        uses: github/codeql-action/analyze@v2
        with:
          queries: security-and-quality
      
      - name: SAST (Semgrep)
        uses: returntocorp/semgrep-action@v1
      
      - name: Dependency Check
        uses: snyk/actions/node@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}
```

### Secrets Management

```typescript
import AWS from 'aws-sdk';

const secretsManager = new AWS.SecretsManager();

const getSecret = async (secretName: string): Promise<any> => {
  const result = await secretsManager.getSecretValue({
    SecretId: secretName
  }).promise();
  
  return JSON.parse(result.SecretString);
};

// Usage
const dbConfig = await getSecret('easy11/database');
const stripeKey = await getSecret('easy11/stripe');
```

---

## Compliance & Auditing

### Data Retention

```typescript
const RETENTION_POLICIES = {
  auditLogs: 365,        // 1 year
  userSessions: 30,      // 30 days
  analytics: 1095,       // 3 years
  backupData: 2555,      // 7 years
  deletedAccounts: 30    // 30 days
};

const cleanupOldData = async () => {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - RETENTION_POLICIES.auditLogs);
  
  await prisma.auditLog.deleteMany({
    where: {
      timestamp: {
        lt: cutoffDate
      }
    }
  });
};
```

### GDPR Compliance

```typescript
// Right to Access
const exportUserData = async (userId: string): Promise<string> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  const orders = await prisma.order.findMany({ where: { userId } });
  const sessions = await prisma.session.findMany({ where: { userId } });
  
  return JSON.stringify({ user, orders, sessions }, null, 2);
};

// Right to Deletion
const deleteUserData = async (userId: string): Promise<void> => {
  await prisma.$transaction([
    prisma.order.deleteMany({ where: { userId } }),
    prisma.session.deleteMany({ where: { userId } }),
    prisma.user.delete({ where: { id: userId } }),
    prisma.auditLog.create({
      data: {
        userId,
        action: 'DELETE',
        resource: 'USER',
        ipAddress: 'system',
        userAgent: 'automated'
      }
    })
  ]);
};
```

---

## Incident Response

### Incident Response Plan

1. **Detection**: Automated monitoring alerts
2. **Containment**: Isolate affected systems
3. **Eradication**: Remove threat
4. **Recovery**: Restore services
5. **Lessons Learned**: Post-incident review

### Response Team

- **Incident Commander**: Coordinates response
- **Security Lead**: Technical analysis
- **Operations**: System recovery
- **Legal/Compliance**: Regulatory requirements
- **Communications**: Customer notification

---

## Security Checklist

- [x] HTTPS enforced with TLS 1.3
- [x] JWT authentication with refresh tokens
- [x] RBAC implementation
- [x] Rate limiting on all endpoints
- [x] Input validation with Zod
- [x] SQL injection prevention
- [x] XSS protection with CSP
- [x] CSRF tokens
- [x] Encryption at rest (AES-256)
- [x] Encryption in transit (TLS)
- [x] Audit logging
- [x] Secrets management (AWS Secrets Manager)
- [x] Container scanning (Trivy)
- [x] Dependency vulnerability scanning (Snyk)
- [x] CodeQL security analysis
- [x] GDPR compliance
- [x] Incident response plan

---

**Document Version**: 1.0  
**Last Updated**: 2024  
**Security Contact**: security@easy11.com  
**Maintained by**: Ocean & Sameer

