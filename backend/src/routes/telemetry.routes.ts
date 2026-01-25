import { Router } from 'express';
import { z } from 'zod';
import { publishTelemetryEvent } from '../services/telemetry.service';

const router = Router();

const telemetrySchema = z.object({
  kind: z.enum(['event', 'metric', 'log']),
  timestamp: z.string().optional(),
  sessionId: z.string().optional(),
  serviceName: z.string(),
  environment: z.string().optional(),
  name: z.string(),
  eventType: z.string().optional(),
  severity: z.string().optional(),
  value: z.number().optional(),
  unit: z.string().optional(),
  level: z.string().optional(),
  attributes: z.record(z.any()).optional(),
  actor: z
    .object({
      id: z.string().optional(),
      role: z.string().optional(),
      region: z.string().optional(),
      tenant: z.string().optional(),
    })
    .optional(),
  correlationId: z.string().optional(),
  traceId: z.string().optional(),
  spanId: z.string().optional(),
});

router.post('/events', async (req, res, next) => {
  try {
    const payload = {
      ...req.body,
      timestamp: req.body.timestamp || new Date().toISOString(),
    };
    
    const validated = telemetrySchema.parse(payload);
    
    // Ensure timestamp is always a string for TelemetryPayload
    const telemetryPayload = {
      ...validated,
      timestamp: validated.timestamp || new Date().toISOString(),
    };

    const result = await publishTelemetryEvent(telemetryPayload);

    res.status(result.queued ? 202 : 503).json({
      status: result.queued ? 'queued' : 'failed',
      reason: result.reason,
    });
  } catch (error) {
    next(error);
  }
});

export default router;


