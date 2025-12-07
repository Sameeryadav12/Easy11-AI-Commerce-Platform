import crypto from 'crypto';
import { prisma } from '../server';

/**
 * Generate hash chain signature for audit log entry
 * Creates tamper-evident audit trail
 */
export const generateAuditSignature = (
  previousSignature: string | null,
  logData: {
    userId: string;
    action: string;
    resource: string;
    resourceId?: string;
    timestamp: Date;
  }
): string => {
  const data = JSON.stringify({
    previousHash: previousSignature || '0',
    ...logData,
  });

  return crypto.createHash('sha256').update(data).digest('hex');
};

/**
 * Create audit log entry with hash chain
 */
export const createAuditLog = async (logData: {
  userId: string;
  action: string;
  resource: string;
  resourceId?: string;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}): Promise<void> => {
  try {
    // Get the latest audit log for hash chain
    const latest = await prisma.auditLog.findFirst({
      orderBy: { createdAt: 'desc' },
      select: { id: true, metadata: true },
    });

    const previousSignature = latest?.metadata
      ? (latest.metadata as any).signature
      : null;

    const timestamp = new Date();

    // Generate signature
    const signature = generateAuditSignature(previousSignature, {
      userId: logData.userId,
      action: logData.action,
      resource: logData.resource,
      resourceId: logData.resourceId,
      timestamp,
    });

    // Create audit log with signature
    await prisma.auditLog.create({
      data: {
        userId: logData.userId,
        action: logData.action,
        resource: logData.resource,
        resourceId: logData.resourceId,
        metadata: {
          ...logData.metadata,
          signature,
          previousHash: previousSignature || '0',
          chainIndex: latest ? (latest.id ? 1 : 0) : 0,
        },
        ipAddress: logData.ipAddress,
        userAgent: logData.userAgent,
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
    // Don't throw - audit logging should not break the main flow
  }
};

/**
 * Verify audit log chain integrity
 */
export const verifyAuditChain = async (
  startId?: string,
  endId?: string
): Promise<{
  valid: boolean;
  totalChecked: number;
  invalidEntries: string[];
}> => {
  try {
    const logs = await prisma.auditLog.findMany({
      where: {
        ...(startId && { id: { gte: startId } }),
        ...(endId && { id: { lte: endId } }),
      },
      orderBy: { createdAt: 'asc' },
    });

    const invalidEntries: string[] = [];
    let previousSignature: string | null = null;

    for (const log of logs) {
      const metadata = log.metadata as any;
      const expectedPrevious = previousSignature || '0';

      if (metadata.previousHash !== expectedPrevious) {
        invalidEntries.push(log.id);
      }

      // Verify signature
      const expectedSignature = generateAuditSignature(previousSignature, {
        userId: log.userId || '',
        action: log.action,
        resource: log.resource,
        resourceId: log.resourceId || undefined,
        timestamp: log.createdAt,
      });

      if (metadata.signature !== expectedSignature) {
        invalidEntries.push(log.id);
      }

      previousSignature = metadata.signature;
    }

    return {
      valid: invalidEntries.length === 0,
      totalChecked: logs.length,
      invalidEntries,
    };
  } catch (error) {
    console.error('Failed to verify audit chain:', error);
    return {
      valid: false,
      totalChecked: 0,
      invalidEntries: [],
    };
  }
};

