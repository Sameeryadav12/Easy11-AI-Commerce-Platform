import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  vus: 20,
  duration: '1m',
};

export default function () {
  const url = 'http://localhost:3001/api/insights/query';
  const payload = JSON.stringify({ dataset: 'retail_sales_summary', epsilon: 1.0, threshold: 5, clientId: 'k6' });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, { 'status is 200': (r) => r.status === 200 });
  sleep(0.5);
}


