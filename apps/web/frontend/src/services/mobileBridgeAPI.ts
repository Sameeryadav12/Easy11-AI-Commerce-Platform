/**
 * Mobile Bridge API
 * Sprint 13: Mobile app ecosystem & cross-platform integration
 */

import type {
  MobileAppSnapshot,
  MobileFeature,
  DeviceSupportMatrix,
  OfflineSyncMetric,
  MobileReleaseChecklist,
} from '../types/mobile';

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const getMobileAppSnapshot = async (): Promise<MobileAppSnapshot> => {
  await delay(300);
  return {
    version: '1.0.0',
    build_number: '100',
    release_phase: 'beta',
    last_deploy_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    next_release_at: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
    release_notes: [
      'Added offline-ready product catalogue with background sync.',
      'Implemented biometric login and passkey support.',
      'Improved crash handling for vendor analytics module.',
    ],
    active_testers: 186,
    crash_free_sessions: 97.4,
  };
};

export const getMobileFeatureParity = async (): Promise<MobileFeature[]> => {
  await delay(400);
  return [
    {
      id: 'feat-001',
      name: 'AI Pricing Insights',
      description: 'Surfacing AI pricing recommendations within mobile vendor dashboard.',
      status: 'in_progress',
      owner: 'Mobile Core',
      linked_web_feature: 'VendorProducts.tsx — Pricing Copilot',
      parity_gap: 'partial',
    },
    {
      id: 'feat-002',
      name: 'Order Management',
      description: 'Support order timeline and refund initiation from mobile.',
      status: 'planned',
      owner: 'Mobile Ops',
      linked_web_feature: 'VendorOrders.tsx — Order timeline & refunds',
      parity_gap: 'partial',
    },
    {
      id: 'feat-003',
      name: 'Growth Ops Command Center',
      description: 'Growth loop tiles, experiments snapshot, and NPS feed.',
      status: 'complete',
      owner: 'Mobile Growth',
      linked_web_feature: 'VendorGrowthOpsPage.tsx',
      parity_gap: 'none',
    },
  ];
};

export const getDeviceSupportMatrix = async (): Promise<DeviceSupportMatrix[]> => {
  await delay(300);
  return [
    {
      os: 'iOS',
      minimum_version: '15.0',
      recommended_version: '16.4',
      tested_devices: ['iPhone 12', 'iPhone 13', 'iPhone 14 Pro', 'iPad Air (M1)'],
      store_status: 'in_review',
      last_store_review_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    },
    {
      os: 'Android',
      minimum_version: '12',
      recommended_version: '13',
      tested_devices: ['Pixel 6', 'Pixel 7 Pro', 'Samsung S22', 'Samsung Tab S8'],
      store_status: 'pending',
    },
  ];
};

export const getOfflineSyncMetrics = async (): Promise<OfflineSyncMetric[]> => {
  await delay(250);
  return [
    {
      queue_name: 'product-update-queue',
      pending_items: 6,
      avg_retry_count: 1.2,
      last_sync_at: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      status: 'healthy',
    },
    {
      queue_name: 'order-status-queue',
      pending_items: 18,
      avg_retry_count: 2.8,
      last_sync_at: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      status: 'warning',
    },
    {
      queue_name: 'analytics-event-queue',
      pending_items: 0,
      avg_retry_count: 1.0,
      last_sync_at: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      status: 'healthy',
    },
  ];
};

export const getMobileReleaseChecklist = async (): Promise<MobileReleaseChecklist> => {
  await delay(350);
  return {
    version: '1.0.0',
    items: [
      {
        id: 'check-001',
        description: 'Complete regression suite on top 10 flows (Auth, Orders, Pricing, Growth)',
        owner: 'QA',
        due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        status: 'in_progress',
      },
      {
        id: 'check-002',
        description: 'Update App Store / Play Store metadata and screenshots',
        owner: 'Marketing',
        due_at: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(),
        status: 'todo',
      },
      {
        id: 'check-003',
        description: 'Verify offline sync telemetry in Datadog dashboards',
        owner: 'Mobile Platform',
        due_at: new Date(Date.now() + 36 * 60 * 60 * 1000).toISOString(),
        status: 'done',
      },
    ],
  };
};

const mobileBridgeAPI = {
  getMobileAppSnapshot,
  getMobileFeatureParity,
  getDeviceSupportMatrix,
  getOfflineSyncMetrics,
  getMobileReleaseChecklist,
};

export default mobileBridgeAPI;


