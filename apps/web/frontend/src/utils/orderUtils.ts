import type { Order } from '../store/ordersStore';

/**
 * Compute estimated delivery date range from order date and shipping method.
 * Standard: 5–7 business days, Express: 2–3 days.
 */
function computeEstimatedRange(order: Order): { start: Date; end: Date } | null {
  const orderDate = new Date(order.date);
  const method = (order.shippingMethod || 'Standard Shipping').toLowerCase();
  let startDays: number;
  let endDays: number;
  if (method.includes('express')) {
    startDays = 2;
    endDays = 3;
  } else {
    startDays = 5;
    endDays = 7;
  }
  const start = new Date(orderDate);
  start.setDate(start.getDate() + startDays);
  const end = new Date(orderDate);
  end.setDate(end.getDate() + endDays);
  return { start, end };
}

/**
 * Format delivery ETA text. Amazon/eBay style:
 * - Delivered: "Delivered on Feb 8"
 * - In transit / packed / confirmed: "Estimated delivery: Feb 12–14" (date range)
 * - No estimate: "Updating soon"
 * - Cancelled/returned: empty
 */
export function getDeliveryEtaText(order: Order): string {
  if (order.status === 'delivered' && order.deliveredDate) {
    return `Delivered on ${new Date(order.deliveredDate).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    })}`;
  }

  if (order.status === 'cancelled' || order.status === 'returned') {
    return '';
  }

  // Build date range for active orders
  let startDate: Date | null = null;
  let endDate: Date | null = null;

  if (order.estimatedDeliveryStart && order.estimatedDeliveryEnd) {
    startDate = new Date(order.estimatedDeliveryStart);
    endDate = new Date(order.estimatedDeliveryEnd);
  } else if (order.estimatedDelivery) {
    const mid = new Date(order.estimatedDelivery);
    startDate = new Date(mid);
    startDate.setDate(startDate.getDate() - 1);
    endDate = new Date(mid);
    endDate.setDate(endDate.getDate() + 1);
  } else {
    const range = computeEstimatedRange(order);
    if (range) {
      startDate = range.start;
      endDate = range.end;
    }
  }

  if (startDate && endDate) {
    const fmt = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const startStr = fmt(startDate);
    const endStr = fmt(endDate);
    const sameMonth =
      startDate.getMonth() === endDate.getMonth() &&
      startDate.getFullYear() === endDate.getFullYear();
    const rangeStr =
      startStr === endStr
        ? startStr
        : sameMonth
          ? `${startStr}–${endDate.getDate()}`
          : `${startStr} – ${endStr}`;
    return `Estimated delivery: ${rangeStr}`;
  }

  return 'Updating soon';
}
