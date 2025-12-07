import { CheckCircle2, Truck, Package, Clock, AlertTriangle } from 'lucide-react';
import type { VendorOrderStatus, VendorOrderTimelineEvent } from '../../types/vendor';

const statusIcons: Record<VendorOrderStatus | 'refunded', JSX.Element> = {
  pending: <Clock className="h-4 w-4" />,
  confirmed: <CheckCircle2 className="h-4 w-4" />,
  preparing: <Package className="h-4 w-4" />,
  shipped: <Truck className="h-4 w-4" />,
  delivered: <CheckCircle2 className="h-4 w-4" />,
  cancelled: <AlertTriangle className="h-4 w-4" />,
  refunded: <AlertTriangle className="h-4 w-4" />,
};

interface OrderTimelineProps {
  events: VendorOrderTimelineEvent[];
}

export function OrderTimeline({ events }: OrderTimelineProps) {
  if (!events || events.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
        Timeline populates once the order progresses beyond creation.
      </div>
    );
  }

  return (
    <ol className="relative space-y-5 pl-4 before:absolute before:top-2 before:bottom-0 before:left-1 before:w-px before:bg-gradient-to-b before:from-blue-300 before:via-blue-200 before:to-transparent dark:before:from-blue-900 dark:before:via-blue-800">
      {events.map((event, index) => {
        const Icon = statusIcons[event.status];
        const isActive = index === 0;
        return (
          <li key={event.id} className="relative flex items-start gap-4">
            <span
              className={`absolute -left-4 mt-1 flex h-6 w-6 items-center justify-center rounded-full border text-xs ${
                isActive
                  ? 'border-blue-500 bg-white text-blue-600 dark:border-blue-400 dark:bg-gray-900 dark:text-blue-300'
                  : 'border-gray-300 bg-white text-gray-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400'
              }`}
            >
              {Icon}
            </span>
            <div className="flex-1 rounded-xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-700 dark:bg-gray-900">
              <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm font-semibold capitalize text-gray-900 dark:text-white">
                  {event.title ?? event.status.replace(/_/g, ' ')}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(event.timestamp).toLocaleString()}
                </p>
              </div>
              {event.description && (
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">{event.description}</p>
              )}
              {event.metadata && (
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {Object.entries(event.metadata).map(([key, value]) => (
                    <div key={key} className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                      <span className="font-semibold capitalize text-gray-700 dark:text-gray-200">
                        {key.replace(/_/g, ' ')}:
                      </span>{' '}
                      <span className="font-mono">{String(value)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}


