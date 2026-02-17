export interface OrderItem {
  id: string;
  name: string;
  image: string;
  quantity: number;
  price: number;
  category: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'packed' | 'shipped' | 'out_for_delivery' | 'delivered' | 'cancelled' | 'returned';
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  paymentMethod: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  userId: string;
  shippingMethod?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  /** Start of delivery window (for date range display) */
  estimatedDeliveryStart?: string;
  /** End of delivery window (for date range display) */
  estimatedDeliveryEnd?: string;
  deliveredDate?: string;
  carrier?: string;
  onTimeProbability?: number;
  /** Reward points earned from this order (e.g. 1 point per $1 spent) */
  pointsEarned?: number;
  /** When the order was cancelled (ISO string) */
  cancelledAt?: string;
  /** Cancellation reason code */
  cancellationReason?: string;
  /** Free-text reason when cancellationReason is 'other' */
  cancellationReasonOther?: string;
  /** Whether refund has been initiated */
  refundInitiated?: boolean;
  /** Reward coupon code applied at checkout (e.g. E11REWARD-xxx). Invalidated if order cancelled. */
  rewardCouponCode?: string;
}
