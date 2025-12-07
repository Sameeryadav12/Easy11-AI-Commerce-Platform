import { formatISO } from 'date-fns';
import type { AdminRole } from './rbac';

export type AuditEventInput = {
  actorId: string;
  actorRole: AdminRole;
  action: string;
  resource: string;
  actorEmail?: string;
  metadata?: Record<string, unknown>;
};

export type AuditEvent = AuditEventInput & {
  timestamp: string;
  hash: string;
  previousHash: string;
};

let lastHash = '0000000000000000000000000000000000000000000000000000000000000000';

async function sha256(payload: string): Promise<string> {
  if (typeof window !== 'undefined' && window.crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(payload);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return Array.from(new Uint8Array(digest))
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }

  const { createHash } = await import('crypto');
  return createHash('sha256').update(payload).digest('hex');
}

export async function buildAuditEvent(input: AuditEventInput): Promise<AuditEvent> {
  const timestamp = formatISO(new Date());
  const payload = JSON.stringify({
    ...input,
    timestamp,
    previousHash: lastHash,
  });
  const hash = await sha256(payload);
  const auditEvent: AuditEvent = {
    ...input,
    timestamp,
    previousHash: lastHash,
    hash,
  };
  lastHash = hash;
  return auditEvent;
}

export async function recordAuditEvent(input: AuditEventInput): Promise<AuditEvent> {
  const event = await buildAuditEvent(input);
  if (process.env.NODE_ENV !== 'production') {
    console.info('[Easy11::AuditTrail]', event);
  }
  return event;
}

export function resetAuditChain(seed?: string) {
  lastHash = seed ?? '0000000000000000000000000000000000000000000000000000000000000000';
}


