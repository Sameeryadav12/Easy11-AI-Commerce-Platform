/**
 * Cancel Order Modal - Amazon/eBay-style cancellation flow
 * Eligibility check, item selection (multi-item), reason, what happens next, confirm/keep
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Info, AlertTriangle, CheckCircle2, Package, MapPin } from 'lucide-react';
import { Modal, ModalFooter, Button } from '../ui';
import type { Order, OrderItem } from '../../store/ordersStore';

/** Mask address for privacy: show city, state, last 2 of zip (e.g. "Mawson Lakes, SA •••5") */
function maskAddress(order: Order): string {
  const a = order.shippingAddress;
  if (!a) return '—';
  const cityState = [a.city, a.state].filter(Boolean).join(', ');
  const zip = a.zipCode ? `•••${a.zipCode.slice(-1)}` : '';
  return cityState + (zip ? ` ${zip}` : '');
}

const CANCELLATION_REASONS = [
  { value: 'ordered_by_mistake', label: 'Ordered by mistake' },
  { value: 'better_price', label: 'Found a better price elsewhere' },
  { value: 'shipping_slow', label: 'Shipping is too slow' },
  { value: 'changed_mind', label: 'Changed my mind' },
  { value: 'wrong_address', label: 'Wrong address / need to update address' },
  { value: 'duplicate_order', label: 'Duplicate order' },
  { value: 'other', label: 'Other' },
] as const;

const canCancelStatuses = ['pending', 'confirmed', 'packed'] as const;
export function canCancelOrder(order: Order): boolean {
  return canCancelStatuses.includes(order.status as (typeof canCancelStatuses)[number]);
}

interface CancelOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order;
  onConfirm: (opts: {
    reason: string;
    reasonOther?: string;
    cancelEntire: boolean;
    itemIds: string[];
  }) => void;
}

export default function CancelOrderModal({
  isOpen,
  onClose,
  order,
  onConfirm,
}: CancelOrderModalProps) {
  const [cancelEntire, setCancelEntire] = useState(true);
  const [selectedItemIds, setSelectedItemIds] = useState<Set<string>>(
    () => new Set(order.items.map((i) => i.id))
  );
  const [reason, setReason] = useState('');
  const [reasonOther, setReasonOther] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const eligible = canCancelOrder(order);
  const isMultiItem = order.items.length > 1;

  useEffect(() => {
    if (isOpen) {
      setCancelEntire(true);
      setSelectedItemIds(new Set(order.items.map((i) => i.id)));
      setReason('');
      setReasonOther('');
      setShowSuccess(false);
    }
  }, [isOpen, order.id]);

  const toggleItem = (item: OrderItem) => {
    setSelectedItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(item.id)) next.delete(item.id);
      else next.add(item.id);
      return next;
    });
  };

  const handleConfirm = async () => {
    if (!eligible) return;
    if (!reason) return;
    if (isMultiItem && !cancelEntire && selectedItemIds.size === 0) return;
    setIsSubmitting(true);
    try {
      const itemIds = cancelEntire
        ? order.items.map((i) => i.id)
        : Array.from(selectedItemIds);
      onConfirm({
        reason,
        reasonOther: reason === 'other' ? reasonOther : undefined,
        cancelEntire,
        itemIds,
      });
      setShowSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeepOrder = () => {
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Cancel order"
      size="lg"
      closeOnOverlayClick={!isSubmitting}
    >
      <div className="space-y-6">
        {/* Eligibility message */}
        <div className="flex items-start gap-3 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
          <div className="text-sm text-blue-800 dark:text-blue-200">
            {eligible ? (
              <p>
                You can cancel if the order hasn&apos;t shipped yet. Order #{order.orderNumber} is
                eligible for cancellation.
              </p>
            ) : (
              <p>
                This order has already shipped. Cancellation is no longer possible. You can start a
                return once it arrives.
              </p>
            )}
          </div>
        </div>

        {/* Already shipped: show Return CTA */}
        {!eligible && (
          <div className="space-y-4">
            <Link to={`/account/returns?order=${order.id}`} onClick={onClose}>
              <Button variant="primary" size="sm">
                Go to Returns & Refunds
              </Button>
            </Link>
            <Button variant="ghost" size="sm" onClick={onClose}>
              Keep order
            </Button>
          </div>
        )}

        {eligible && showSuccess ? (
          /* Success state: show result before closing */
          <div className="space-y-6">
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-full bg-teal-100 dark:bg-teal-900/40 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="w-8 h-8 text-teal-600 dark:text-teal-400" />
              </div>
              <h3 className="text-xl font-heading font-bold text-gray-900 dark:text-white mb-1">
                Order cancelled
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Order #{order.orderNumber} has been cancelled.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <p className="text-sm text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-gray-900 dark:text-white">Refund status: </span>
                Pending — refund initiated to your original payment method.
              </p>
            </div>
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-600">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2">What happens next</h4>
              <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                <li>• Refund will appear in 3–5 business days (depends on your bank).</li>
                <li>• Any reward points from this order have been reversed.</li>
                <li>• You can view this order in &quot;Cancelled&quot; on My Orders.</li>
              </ul>
            </div>
            <ModalFooter>
              <Button variant="primary" size="sm" onClick={onClose}>
                Done
              </Button>
            </ModalFooter>
          </div>
        ) : eligible ? (
          <>
            {/* Summary: what's being cancelled (prevents wrong-order mistakes) */}
            <div className="p-4 rounded-lg border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/30">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Package className="w-4 h-4 text-gray-500" />
                Order summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">Items: </span>
                  {order.items.map((it) => `${it.name} × ${Number(it.quantity) || 1}`).join(', ')}
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">Total: </span>
                  ${order.total.toFixed(2)}
                </div>
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <MapPin className="w-3.5 h-3.5 shrink-0 text-gray-500" />
                  <span>
                    <span className="font-medium text-gray-900 dark:text-white">Delivery: </span>
                    {maskAddress(order)}
                  </span>
                </div>
                <div className="text-gray-700 dark:text-gray-300">
                  <span className="font-medium text-gray-900 dark:text-white">Status: </span>
                  <span className="capitalize">{order.status.replace('_', ' ')}</span>
                </div>
              </div>
            </div>

            {/* What to cancel (multi-item only) */}
            {isMultiItem && (
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
                  What would you like to cancel?
                </h3>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="cancelScope"
                      checked={cancelEntire}
                      onChange={() => setCancelEntire(true)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Cancel entire order</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="radio"
                      name="cancelScope"
                      checked={!cancelEntire}
                      onChange={() => setCancelEntire(false)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="text-gray-700 dark:text-gray-300">Cancel selected items</span>
                  </label>
                  {!cancelEntire && (
                    <div className="ml-7 mt-2 space-y-2 pl-4 border-l-2 border-gray-200 dark:border-gray-600">
                      {order.items.map((item) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selectedItemIds.has(item.id)}
                            onChange={() => toggleItem(item)}
                            className="w-4 h-4 rounded text-blue-600"
                          />
                          <span className="text-gray-700 dark:text-gray-300">
                            {item.name} × {Number(item.quantity) || 1}
                          </span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Reason dropdown (required); no default selection */}
            <div>
              <label
                htmlFor="cancel-reason"
                className="block font-semibold text-gray-900 dark:text-white mb-2"
              >
                Reason for cancellation <span className="text-red-500">*</span>
              </label>
              <select
                id="cancel-reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Select a reason</option>
                {CANCELLATION_REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
              {reason === 'other' && (
                <textarea
                  value={reasonOther}
                  onChange={(e) => setReasonOther(e.target.value)}
                  placeholder="Tell us more (optional)"
                  rows={2}
                  className="mt-2 w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              )}
            </div>

            {/* Wrong address: offer update instead of cancel */}
            {reason === 'wrong_address' && (
              <div className="p-4 rounded-lg bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <p className="text-sm text-amber-800 dark:text-amber-200 mb-3">
                  If it hasn&apos;t shipped, you may be able to update the address instead of
                  cancelling.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Link
                    to="/account/support"
                    state={{ from: 'cancel_modal', orderId: order.id, reason: 'update_address' }}
                    onClick={onClose}
                  >
                    <Button variant="secondary" size="sm">
                      Update address
                    </Button>
                  </Link>
                  <Link
                    to="/account/support"
                    state={{ from: 'cancel_modal', orderId: order.id }}
                    onClick={onClose}
                  >
                    <Button variant="ghost" size="sm">
                      Contact support
                    </Button>
                  </Link>
                </div>
              </div>
            )}

            {/* What happens next */}
            <div className="p-4 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                What happens next
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• If you already paid, we&apos;ll refund to your original payment method.</li>
                <li>• Refund timing depends on your bank or card issuer.</li>
                <li>• Any reward points earned from this order will be reversed.</li>
                <li>
                  • If it ships before we stop it, you&apos;ll see return options instead.
                </li>
              </ul>
            </div>

            {/* Warning line */}
            <p className="flex items-center gap-2 text-sm text-amber-700 dark:text-amber-400">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Once cancelled, this can&apos;t be undone.
            </p>

            {/* Footer buttons */}
            <ModalFooter>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleKeepOrder}
                disabled={isSubmitting}
              >
                Keep order
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleConfirm}
                disabled={
                  isSubmitting ||
                  !reason ||
                  (isMultiItem && !cancelEntire && selectedItemIds.size === 0)
                }
              >
                {isSubmitting ? 'Cancelling...' : 'Confirm cancellation'}
              </Button>
            </ModalFooter>
            <p className="text-xs text-gray-500 dark:text-gray-400 px-6 pb-2 -mt-2">
              If already charged, refunds go back to your original payment method. Banks can take a
              few business days to reflect it.
            </p>
          </>
        ) : null}
      </div>
    </Modal>
  );
}
