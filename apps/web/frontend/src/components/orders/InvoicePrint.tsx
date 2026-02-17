/**
 * Invoice Print - Printable invoice (PDF-like)
 * Opens in new window and triggers print dialog.
 * Includes: header, seller/customer details, line items, totals, payment summary, footer
 */

import type { Order } from '../../store/ordersStore';

const SELLER_DETAILS = {
  name: 'Easy11 Commerce',
  address: '123 Commerce Street',
  city: 'Sydney, NSW 2000',
  country: 'Australia',
  email: 'support@easy11.com',
  abn: '12 345 678 901',
};

/** Australia GST rate: 10% flat on most goods and services */
const GST_RATE_AU = 0.1;

function generateInvoiceHtml(order: Order): string {
  const isCancelled = order.status === 'cancelled';
  const invoiceNumber = `INV-${order.orderNumber}-${Date.now().toString(36).toUpperCase()}`;
  const issueDate = new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });
  const orderDate = new Date(order.date).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' });

  // Use order's stored values for full consistency (subtotal, tax, shipping, discount, total)
  const subtotal = Number.isFinite(order.subtotal) ? order.subtotal : order.items.reduce(
    (sum, item) => sum + (Number(item.quantity) || 1) * (Number(item.price) || 0),
    0
  );
  const discount = Number(order.discount) || 0;
  const shipping = Number(order.shipping) || 0;
  const gst = Number.isFinite(order.tax) ? order.tax : Math.round((subtotal - discount + shipping) * GST_RATE_AU * 100) / 100;
  const total = Number.isFinite(order.total) ? order.total : subtotal - discount + shipping + gst;

  const itemsHtml = order.items
    .map(
      (item) => `
    <tr>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${escapeHtml(item.name)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${Number(item.quantity) || 1}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(Number(item.price) || 0).toFixed(2)}</td>
      <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${((Number(item.quantity) || 1) * (Number(item.price) || 0)).toFixed(2)}</td>
    </tr>
  `
    )
    .join('');

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${order.orderNumber}</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; font-size: 14px; line-height: 1.5; color: #111827; max-width: 800px; margin: 0 auto; padding: 24px; }
    h1 { font-size: 24px; margin-bottom: 8px; }
    .invoice-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 32px; padding-bottom: 24px; border-bottom: 2px solid #111827; }
    .seller, .customer { margin-bottom: 24px; }
    .seller h2, .customer h2 { font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin-bottom: 8px; }
    table { width: 100%; border-collapse: collapse; margin: 24px 0; }
    th { text-align: left; padding: 8px; background: #f3f4f6; font-weight: 600; }
    .totals { margin-top: 24px; text-align: right; }
    .totals table { width: auto; margin-left: auto; }
    .totals td { padding: 4px 16px; }
    .grand-total { font-size: 18px; font-weight: 700; padding-top: 8px !important; border-top: 2px solid #111827; }
    .footer { margin-top: 48px; padding-top: 24px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #6b7280; text-align: center; }
    @media print { body { padding: 0; } .no-print { display: none; } }
  </style>
</head>
<body>
  ${isCancelled ? '<div style="background: #fef2f2; border: 2px solid #dc2626; color: #991b1b; padding: 12px 16px; border-radius: 8px; margin-bottom: 24px; font-weight: 600; text-align: center;">CANCELLED ORDER</div>' : ''}
  <div class="invoice-header">
    <div>
      <h1>${escapeHtml(SELLER_DETAILS.name)}</h1>
      <p style="margin: 0; color: #6b7280;">${isCancelled ? 'Cancelled invoice' : 'Invoice'}</p>
    </div>
    <div style="text-align: right;">
      <p style="margin: 0; font-weight: 600;">Invoice #${escapeHtml(invoiceNumber)}</p>
      <p style="margin: 4px 0 0 0; color: #6b7280;">Issue date: ${issueDate}</p>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 32px; margin-bottom: 32px;">
    <div class="seller">
      <h2>Seller</h2>
      <p style="margin: 0; font-weight: 600;">${escapeHtml(SELLER_DETAILS.name)}</p>
      <p style="margin: 4px 0;">${escapeHtml(SELLER_DETAILS.address)}</p>
      <p style="margin: 4px 0;">${escapeHtml(SELLER_DETAILS.city)}, ${escapeHtml(SELLER_DETAILS.country)}</p>
      <p style="margin: 4px 0;">${escapeHtml(SELLER_DETAILS.email)}</p>
      <p style="margin: 4px 0; color: #6b7280;">ABN: ${escapeHtml(SELLER_DETAILS.abn)}</p>
    </div>
    <div class="customer">
      <h2>Bill to / Ship to</h2>
      <p style="margin: 0; font-weight: 600;">${escapeHtml(order.shippingAddress.name)}</p>
      <p style="margin: 4px 0;">${escapeHtml(order.shippingAddress.address)}</p>
      <p style="margin: 4px 0;">${escapeHtml(order.shippingAddress.city)}, ${escapeHtml(order.shippingAddress.state)} ${escapeHtml(order.shippingAddress.zipCode)}</p>
      <p style="margin: 4px 0;">${escapeHtml(order.shippingAddress.country)}</p>
    </div>
  </div>

  <p style="margin: 0 0 16px 0;"><strong>Order:</strong> #${escapeHtml(order.orderNumber)} • <strong>Order date:</strong> ${orderDate}</p>

  <table>
    <thead>
      <tr>
        <th>Product</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Line Total</th>
      </tr>
    </thead>
    <tbody>
      ${itemsHtml}
    </tbody>
  </table>

  <div class="totals">
    <table>
      <tr><td>Subtotal</td><td>$${subtotal.toFixed(2)}</td></tr>
      ${discount > 0 ? `<tr><td>Discount</td><td>-$${discount.toFixed(2)}</td></tr>` : ''}
      <tr><td>Shipping</td><td>$${shipping.toFixed(2)}</td></tr>
      <tr><td>GST (10%)</td><td>$${gst.toFixed(2)}</td></tr>
      <tr><td class="grand-total">Total</td><td class="grand-total">$${total.toFixed(2)}</td></tr>
    </table>
  </div>

  <div style="margin-top: 24px; padding: 16px; background: #f9fafb; border-radius: 8px;">
    <h2 style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; color: #6b7280; margin: 0 0 8px 0;">Payment summary</h2>
    <p style="margin: 0;">${escapeHtml(order.paymentMethod)}</p>
    <p style="margin: 4px 0 0 0; color: #6b7280; font-size: 12px;">Paid on ${orderDate}</p>
  </div>

  <div class="footer" style="margin-top: 48px;">
    <p style="margin: 0;">Thank you for shopping with Easy11</p>
    <p style="margin: 8px 0 0 0;"><a href="/contact" style="color: #2563eb;">Contact support</a></p>
    <p style="margin: 8px 0 0 0; color: #9ca3af;">Invoice generated ${new Date().toLocaleString('en-AU')}</p>
  </div>

  <div class="no-print" style="margin-top: 24px; text-align: center;">
    <button onclick="window.print()" style="padding: 12px 24px; background: #2563eb; color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Print / Save as PDF</button>
    <button onclick="window.close()" style="padding: 12px 24px; margin-left: 12px; background: #e5e7eb; color: #374151; border: none; border-radius: 8px; font-weight: 600; cursor: pointer;">Close</button>
  </div>
</body>
</html>
  `.trim();
}

function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

export function downloadInvoice(order: Order): void {
  const html = generateInvoiceHtml(order);
  const printWindow = window.open('', '_blank');
  if (!printWindow) {
    console.error('Popup blocked. Please allow popups to download invoice.');
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.focus();
  // Trigger print after content loads
  printWindow.onload = () => {
    printWindow.print();
  };
}
