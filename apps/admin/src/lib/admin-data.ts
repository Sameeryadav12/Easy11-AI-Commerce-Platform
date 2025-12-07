export type VendorStatus = 'Active' | 'Under Review' | 'Suspended' | 'Pending';
export type VendorKycStatus = 'Verified' | 'Pending' | 'Rejected';

export interface VendorRecord {
  id: string;
  name: string;
  category: string;
  location: string;
  status: VendorStatus;
  kycStatus: VendorKycStatus;
  sales24h: number;
  refundsRate: number;
  rating: number;
  disputeRate: number;
  riskScore: number;
  lastAction: string;
  flags: string[];
}

export interface VendorWatchItem {
  vendorId: string;
  vendorName: string;
  reason: string;
  triggeredAt: string;
  triageStatus: 'Open' | 'Investigating' | 'Escalated';
  riskScore: number;
}

export const vendorDirectory: VendorRecord[] = [
  {
    id: 'VND-1045',
    name: 'Nimbus Outfitters',
    category: 'Apparel',
    location: 'Austin, US',
    status: 'Active',
    kycStatus: 'Verified',
    sales24h: 18600,
    refundsRate: 0.021,
    rating: 4.8,
    disputeRate: 0.006,
    riskScore: 18,
    lastAction: 'KYC re-verified · 12h ago',
    flags: ['Low dispute rate', 'High CSAT'],
  },
  {
    id: 'VND-1188',
    name: 'Aura Beauty Collective',
    category: 'Beauty',
    location: 'Toronto, CA',
    status: 'Under Review',
    kycStatus: 'Pending',
    sales24h: 7200,
    refundsRate: 0.081,
    rating: 4.1,
    disputeRate: 0.034,
    riskScore: 62,
    lastAction: 'Escalated for refund spike · 2h ago',
    flags: ['Refund spike', 'Dispute ratio rising'],
  },
  {
    id: 'VND-1290',
    name: 'Volt Fitness Gear',
    category: 'Fitness',
    location: 'Berlin, DE',
    status: 'Active',
    kycStatus: 'Verified',
    sales24h: 13420,
    refundsRate: 0.032,
    rating: 4.6,
    disputeRate: 0.012,
    riskScore: 34,
    lastAction: 'Voice commerce pilot enabled · 6h ago',
    flags: ['Voice pilot vendor'],
  },
  {
    id: 'VND-1376',
    name: 'Lumen Home Studio',
    category: 'Home Goods',
    location: 'Sydney, AU',
    status: 'Suspended',
    kycStatus: 'Verified',
    sales24h: 0,
    refundsRate: 0.145,
    rating: 3.6,
    disputeRate: 0.081,
    riskScore: 88,
    lastAction: 'Suspended pending compliance review · 1h ago',
    flags: ['Chargeback spike', 'Awaiting compliance'],
  },
  {
    id: 'VND-1403',
    name: 'Skylark Electronics',
    category: 'Electronics',
    location: 'New York, US',
    status: 'Pending',
    kycStatus: 'Pending',
    sales24h: 0,
    refundsRate: 0,
    rating: 0,
    disputeRate: 0,
    riskScore: 24,
    lastAction: 'Awaiting document verification',
    flags: ['New vendor', 'Requires approval'],
  },
  {
    id: 'VND-1482',
    name: 'Coastal Threads',
    category: 'Apparel',
    location: 'Lisbon, PT',
    status: 'Active',
    kycStatus: 'Verified',
    sales24h: 9800,
    refundsRate: 0.044,
    rating: 4.4,
    disputeRate: 0.017,
    riskScore: 41,
    lastAction: 'Issued proactive refund credit · 4h ago',
    flags: ['Seasonal spike', 'Fraud monitoring'],
  },
];

export const vendorFraudWatchlist: VendorWatchItem[] = [
  {
    vendorId: 'VND-1188',
    vendorName: 'Aura Beauty Collective',
    reason: 'Refund rate 3x regional baseline (past 24h)',
    triggeredAt: '2025-11-11T08:30:00Z',
    triageStatus: 'Investigating',
    riskScore: 72,
  },
  {
    vendorId: 'VND-1376',
    vendorName: 'Lumen Home Studio',
    reason: 'Chargeback spike flagged by anomaly detector',
    triggeredAt: '2025-11-11T06:15:00Z',
    triageStatus: 'Escalated',
    riskScore: 89,
  },
  {
    vendorId: 'VND-1520',
    vendorName: 'Velocity Sneakers',
    reason: 'Impossible travel logins detected',
    triggeredAt: '2025-11-10T22:45:00Z',
    triageStatus: 'Open',
    riskScore: 65,
  },
];

export interface CustomerRecord {
  id: string;
  name: string;
  email: string;
  region: string;
  loyaltyTier: 'Silver' | 'Gold' | 'Platinum';
  churnRisk: number;
  lifetimeValue: number;
  status: 'Healthy' | 'At Risk' | 'Lost';
  lastPurchase: string;
  interventions: string[];
}

export const customerDirectory: CustomerRecord[] = [
  {
    id: 'CUST-84920',
    name: 'John Dawson',
    email: 'j***@example.com',
    region: 'US',
    loyaltyTier: 'Platinum',
    churnRisk: 0.82,
    lifetimeValue: 8420,
    status: 'At Risk',
    lastPurchase: '2025-09-14T12:30:00Z',
    interventions: ['Offer free return pickup', 'Assign concierge outreach'],
  },
  {
    id: 'CUST-84217',
    name: 'Sophie Martinez',
    email: 's***@example.com',
    region: 'CA',
    loyaltyTier: 'Gold',
    churnRisk: 0.21,
    lifetimeValue: 3220,
    status: 'Healthy',
    lastPurchase: '2025-11-09T16:22:00Z',
    interventions: ['Send personalized bundle recommendation'],
  },
  {
    id: 'CUST-83104',
    name: 'Rajiv Patel',
    email: 'r***@example.com',
    region: 'IN',
    loyaltyTier: 'Silver',
    churnRisk: 0.64,
    lifetimeValue: 1670,
    status: 'At Risk',
    lastPurchase: '2025-09-28T09:10:00Z',
    interventions: ['Flag for win-back campaign', 'Offer loyalty upgrade'],
  },
  {
    id: 'CUST-82654',
    name: 'Mina Ahmadi',
    email: 'm***@example.com',
    region: 'DE',
    loyaltyTier: 'Platinum',
    churnRisk: 0.12,
    lifetimeValue: 10980,
    status: 'Healthy',
    lastPurchase: '2025-11-10T11:05:00Z',
    interventions: ['Invite to ambassador program'],
  },
  {
    id: 'CUST-81902',
    name: 'Luca Romano',
    email: 'l***@example.com',
    region: 'IT',
    loyaltyTier: 'Gold',
    churnRisk: 0.73,
    lifetimeValue: 5120,
    status: 'At Risk',
    lastPurchase: '2025-08-30T17:40:00Z',
    interventions: ['Offer express replacement', 'Escalate to success team'],
  },
  {
    id: 'CUST-80560',
    name: 'Ava Ng',
    email: 'a***@example.com',
    region: 'SG',
    loyaltyTier: 'Silver',
    churnRisk: 0.91,
    lifetimeValue: 980,
    status: 'Lost',
    lastPurchase: '2025-06-12T08:15:00Z',
    interventions: ['Send exit survey', 'Provide reactivation voucher'],
  },
];

export interface CustomerSegment {
  name: string;
  count: number;
  avgValue: number;
  churnRisk: number;
  description: string;
}

export const customerSegments: CustomerSegment[] = [
  {
    name: 'Champions',
    count: 1245,
    avgValue: 5420,
    churnRisk: 0.05,
    description: 'Recent, frequent, high spend customers.',
  },
  {
    name: 'Loyal Customers',
    count: 2156,
    avgValue: 3200,
    churnRisk: 0.12,
    description: 'Stable frequency, consistent spend.',
  },
  {
    name: 'At Risk',
    count: 847,
    avgValue: 2800,
    churnRisk: 0.78,
    description: 'Need outreach within 7 days.',
  },
  {
    name: 'Cannot Lose Them',
    count: 234,
    avgValue: 8900,
    churnRisk: 0.65,
    description: 'High CLV customers requiring concierge support.',
  },
  {
    name: 'New Customers',
    count: 1456,
    avgValue: 890,
    churnRisk: 0.35,
    description: 'First purchase within 30 days.',
  },
  {
    name: 'Lost',
    count: 643,
    avgValue: 450,
    churnRisk: 0.95,
    description: 'Need reactivation sequence or archival.',
  },
];

export interface VoiceIntentStat {
  intent: string;
  count24h: number;
  successRate: number;
  growth: number;
}

export interface VoiceErrorStat {
  category: string;
  count24h: number;
  delta: number;
}

export interface RegionPolicyState {
  region: string;
  voiceEnabled: boolean;
  arEnabled: boolean;
  note?: string;
  lastUpdated: string;
}

export interface ArAssetReview {
  assetId: string;
  vendorName: string;
  assetName: string;
  format: 'GLB' | 'USDZ';
  qualityGrade: 'A' | 'B' | 'C' | 'Review';
  issues: string[];
  status: 'Pending' | 'Approved' | 'Rejected';
  submittedAt: string;
}

export const voiceIntentStats: VoiceIntentStat[] = [
  { intent: 'SEARCH_PRODUCTS', count24h: 5460, successRate: 0.94, growth: 0.12 },
  { intent: 'ADD_TO_CART', count24h: 1280, successRate: 0.88, growth: 0.08 },
  { intent: 'TRACK_ORDER', count24h: 1940, successRate: 0.91, growth: 0.05 },
  { intent: 'REORDER_LAST', count24h: 720, successRate: 0.82, growth: -0.03 },
  { intent: 'ACCOUNT_ACTION', count24h: 410, successRate: 0.76, growth: -0.06 },
];

export const voiceErrorStats: VoiceErrorStat[] = [
  { category: 'ASR failure', count24h: 360, delta: -0.08 },
  { category: 'NLU unclassified', count24h: 210, delta: 0.05 },
  { category: 'Confirmation rejected', count24h: 140, delta: 0.12 },
  { category: 'Timeout', count24h: 95, delta: 0.03 },
];

export const regionPolicies: RegionPolicyState[] = [
  {
    region: 'US',
    voiceEnabled: true,
    arEnabled: true,
    note: 'All intents live · step-up enforced for payments',
    lastUpdated: '2025-11-11T10:05:00Z',
  },
  {
    region: 'EU',
    voiceEnabled: false,
    arEnabled: true,
    note: 'Paused pending privacy review (GDPR Article 25)',
    lastUpdated: '2025-11-10T18:10:00Z',
  },
  {
    region: 'APAC',
    voiceEnabled: true,
    arEnabled: true,
    note: 'AR limited to eyewear until device QA completes',
    lastUpdated: '2025-11-11T07:45:00Z',
  },
  {
    region: 'LATAM',
    voiceEnabled: true,
    arEnabled: false,
    note: 'Awaiting vendor asset localization',
    lastUpdated: '2025-11-09T22:30:00Z',
  },
];

export const arReviewQueue: ArAssetReview[] = [
  {
    assetId: 'AR-501',
    vendorName: 'Nimbus Outfitters',
    assetName: 'Nimbus Sunglasses v3',
    format: 'GLB',
    qualityGrade: 'B',
    issues: ['Lighting imbalance', 'Texture seam detected'],
    status: 'Pending',
    submittedAt: '2025-11-11T05:15:00Z',
  },
  {
    assetId: 'AR-512',
    vendorName: 'Volt Fitness Gear',
    assetName: 'Volt HyperRunner',
    format: 'USDZ',
    qualityGrade: 'A',
    issues: [],
    status: 'Pending',
    submittedAt: '2025-11-11T04:05:00Z',
  },
  {
    assetId: 'AR-520',
    vendorName: 'Lumen Home Studio',
    assetName: 'Lumen Ambient Lamp',
    format: 'GLB',
    qualityGrade: 'Review',
    issues: ['Missing collision mesh', 'Polycount exceeds threshold'],
    status: 'Pending',
    submittedAt: '2025-11-10T22:18:00Z',
  },
];

export interface AnalyticsMetric {
  label: string;
  value: string;
  delta: string;
  tone: 'positive' | 'negative' | 'neutral';
}

export interface HealthStream {
  name: string;
  description: string;
}

export const analyticsMetrics: AnalyticsMetric[] = [
  {
    label: 'Active users (5m)',
    value: '9,842',
    delta: '+6% vs. 1h',
    tone: 'positive',
  },
  {
    label: 'API P95 latency',
    value: '312 ms',
    delta: 'SLO 400 ms',
    tone: 'neutral',
  },
  {
    label: 'Checkout success',
    value: '98.6%',
    delta: 'No anomalies detected',
    tone: 'positive',
  },
];

export const monitoringStreams: HealthStream[] = [
  {
    name: 'Traffic',
    description: 'Requests, error rate, cache hit ratio.',
  },
  {
    name: 'Financial',
    description: 'GMV, payouts, refund velocity.',
  },
  {
    name: 'Operational',
    description: 'Queue depth, worker health, PostHog events.',
  },
];


export interface SarRequest {
  id: string;
  region: string;
  requestedBy: string;
  submittedAt: string;
  status: 'Awaiting approval' | 'Processing' | 'Completed';
  owner: string;
  notes: string[];
}

export const sarQueue: SarRequest[] = [
  {
    id: 'SAR-2044',
    region: 'EU',
    requestedBy: 'anita@example.com',
    submittedAt: '2025-11-10T18:45:00Z',
    status: 'Awaiting approval',
    owner: 'Compliance',
    notes: ['GDPR Article 15 request', 'Needs DPO approval within 24h'],
  },
  {
    id: 'SAR-2045',
    region: 'US',
    requestedBy: 'jason@example.com',
    submittedAt: '2025-11-11T02:15:00Z',
    status: 'Processing',
    owner: 'Support',
    notes: ['Export generated · awaiting legal review'],
  },
  {
    id: 'SAR-2046',
    region: 'AU',
    requestedBy: 'kylie@example.com',
    submittedAt: '2025-11-11T05:05:00Z',
    status: 'Awaiting approval',
    owner: 'Compliance',
    notes: ['Requires identity verification before release'],
  },
];

export interface ConsentSnapshot {
  label: string;
  value: string;
  delta: string;
}

export const consentSnapshot: ConsentSnapshot[] = [
  { label: 'Marketing opt-in', value: '76.4%', delta: '+1.2% this week' },
  { label: 'Voice consent', value: '58.2%', delta: '-0.8% after reminders' },
  { label: 'AR capture consent', value: '61.5%', delta: '+2.1% with new UX' },
];

export interface RetentionPolicy {
  dataType: string;
  retention: string;
  status: 'Enforced' | 'Pending';
  lastUpdated: string;
  notes: string;
}

export const retentionPolicies: RetentionPolicy[] = [
  {
    dataType: 'Transactional records',
    retention: '7 years',
    status: 'Enforced',
    lastUpdated: '2025-11-01T12:00:00Z',
    notes: 'Required for financial compliance.',
  },
  {
    dataType: 'Customer support logs',
    retention: '18 months',
    status: 'Pending',
    lastUpdated: '2025-10-22T09:00:00Z',
    notes: 'Automation rollout planned Week 5.',
  },
  {
    dataType: 'Voice transcripts metadata',
    retention: '30 days',
    status: 'Enforced',
    lastUpdated: '2025-11-08T15:30:00Z',
    notes: 'No raw audio stored; metadata hashed.',
  },
];



