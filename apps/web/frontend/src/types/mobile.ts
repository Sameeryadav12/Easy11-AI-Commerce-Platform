/**
 * Mobile App Ecosystem Types
 * Sprint 13: Mobile app readiness & cross-platform integration
 */

export interface MobileAppSnapshot {
  version: string;
  build_number: string;
  release_phase: 'alpha' | 'beta' | 'ga';
  last_deploy_at: string;
  next_release_at?: string;
  release_notes: string[];
  active_testers: number;
  crash_free_sessions: number; // percentage
}

export interface MobileFeature {
  id: string;
  name: string;
  description: string;
  status: 'planned' | 'in_progress' | 'complete';
  owner: string;
  linked_web_feature?: string;
  parity_gap?: 'none' | 'partial' | 'full';
}

export interface DeviceSupportMatrix {
  os: 'iOS' | 'Android';
  minimum_version: string;
  recommended_version: string;
  tested_devices: string[];
  store_status: 'pending' | 'approved' | 'in_review';
  last_store_review_at?: string;
}

export interface OfflineSyncMetric {
  queue_name: string;
  pending_items: number;
  avg_retry_count: number;
  last_sync_at: string;
  status: 'healthy' | 'warning' | 'error';
}

export interface ReleaseChecklistItem {
  id: string;
  description: string;
  owner: string;
  due_at: string;
  status: 'todo' | 'in_progress' | 'done';
}

export interface MobileReleaseChecklist {
  version: string;
  items: ReleaseChecklistItem[];
}


