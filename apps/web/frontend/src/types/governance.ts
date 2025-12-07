export interface ModelCard {
  model_id: string;
  name: string;
  version: string;
  owner: string;
  description: string;
  created_at: string;
  last_trained_at: string;
  training_data_window: string;
  features: string[];
  metrics: Record<string, number>;
  fairness_considerations: string;
  explainability_assets: {
    global_shap_url: string;
    last_regenerated_at: string;
  };
  notes: string[];
}

export interface DriftFeatureStatus {
  feature: string;
  p_value: number;
  alert_level: 'normal' | 'warning' | 'critical';
}

export interface DriftStatus {
  model_id: string;
  status: 'healthy' | 'warning' | 'critical';
  monitored_features: DriftFeatureStatus[];
  recommended_actions?: string[];
  last_evaluated_at: string;
}

export interface AuditLogEntry {
  timestamp: string;
  model_id: string;
  action: string;
  actor: string;
  reason: string;
  outcome: string;
  details?: Record<string, unknown>;
}


