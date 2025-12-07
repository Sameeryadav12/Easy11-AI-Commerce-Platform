import axios from 'axios';
import type { ModelCard, DriftStatus, AuditLogEntry } from '../types/governance';

const DEFAULT_BASE_URL = 'http://localhost:8000';
const ML_BASE_URL = import.meta.env.VITE_ML_SERVICE_URL || DEFAULT_BASE_URL;
const BASE = ML_BASE_URL.replace(/\/$/, '');

export const fetchModelCards = async (): Promise<ModelCard[]> => {
  const response = await axios.get<{ model_cards: ModelCard[] }>(`${BASE}/api/v1/governance/model-cards`, {
    timeout: 5000,
  });
  return response.data.model_cards;
};

export const fetchDriftStatus = async (): Promise<DriftStatus[]> => {
  const response = await axios.get<{ drift_status: DriftStatus[] }>(`${BASE}/api/v1/governance/drift`, {
    timeout: 4000,
  });
  return response.data.drift_status;
};

export const fetchAuditLog = async (limit = 10): Promise<AuditLogEntry[]> => {
  const response = await axios.get<{ entries: AuditLogEntry[] }>(`${BASE}/api/v1/governance/audit-log`, {
    params: { limit },
    timeout: 4000,
  });
  return response.data.entries;
};

const governanceAPI = {
  fetchModelCards,
  fetchDriftStatus,
  fetchAuditLog,
};

export default governanceAPI;

