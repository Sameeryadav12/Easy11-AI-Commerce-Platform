# @easy11/telemetry-client

Shared telemetry helper used by the Easy11 storefront, vendor portal, and admin portal. Provides a single API for emitting navigation, interaction, and metric events to the telemetry gateway (default `http://localhost:5000/api/v1/telemetry/events`). Works in any browser environment and falls back to `fetch` when `navigator.sendBeacon` is unavailable.

## Usage

```ts
import { createTelemetryClient } from '@easy11/telemetry-client';

const telemetry = createTelemetryClient({
  serviceName: 'storefront',
  environment: import.meta.env.MODE,
  endpoint: import.meta.env.VITE_TELEMETRY_ENDPOINT,
});

telemetry.trackEvent({
  name: 'page_view',
  eventType: 'navigation.page',
  attributes: { path: '/home' },
});
```

The client automatically augments events with timestamp, sessionId, deviceId, and basic browser metadata. All payloads are JSON and can be ingested by the telemetry gateway → Kafka → analytics stack defined in Sprint 17.


