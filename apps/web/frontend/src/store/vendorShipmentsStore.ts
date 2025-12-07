/**
 * Vendor Shipments Management Store
 * Sprint 9: Shipping and tracking state
 */

import { create } from 'zustand';
import type { Shipment, ShipmentStatus, ShippingRate } from '../types/vendorOrders';

interface VendorShipmentsState {
  shipments: Shipment[];
  selectedShipment: Shipment | null;
  availableRates: ShippingRate[];
  
  isLoading: boolean;
  error: string | null;
  
  // Stats
  stats: {
    created: number;
    in_transit: number;
    delivered: number;
    exceptions: number;
  };
  
  // Actions
  setShipments: (shipments: Shipment[]) => void;
  addShipment: (shipment: Shipment) => void;
  updateShipment: (id: string, updates: Partial<Shipment>) => void;
  updateShipmentStatus: (id: string, status: ShipmentStatus) => void;
  setSelectedShipment: (shipment: Shipment | null) => void;
  
  setAvailableRates: (rates: ShippingRate[]) => void;
  
  recalculateStats: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

export const useVendorShipmentsStore = create<VendorShipmentsState>()((set, get) => ({
  shipments: [],
  selectedShipment: null,
  availableRates: [],
  isLoading: false,
  error: null,
  
  stats: {
    created: 0,
    in_transit: 0,
    delivered: 0,
    exceptions: 0,
  },
  
  setShipments: (shipments) => {
    set({ shipments });
    get().recalculateStats();
  },
  
  addShipment: (shipment) =>
    set((state) => ({
      shipments: [shipment, ...state.shipments],
    })),
  
  updateShipment: (id, updates) =>
    set((state) => ({
      shipments: state.shipments.map((s) => (s.id === id ? { ...s, ...updates } : s)),
      selectedShipment: state.selectedShipment?.id === id ? { ...state.selectedShipment, ...updates } : state.selectedShipment,
    })),
  
  updateShipmentStatus: (id, status) =>
    set((state) => ({
      shipments: state.shipments.map((s) => (s.id === id ? { ...s, status } : s)),
      selectedShipment: state.selectedShipment?.id === id ? { ...state.selectedShipment, status } : state.selectedShipment,
    })),
  
  setSelectedShipment: (shipment) => set({ selectedShipment: shipment }),
  
  setAvailableRates: (rates) => set({ availableRates: rates }),
  
  recalculateStats: () => {
    const state = get();
    const stats = {
      created: state.shipments.filter((s) => s.status === 'created' || s.status === 'label_purchased').length,
      in_transit: state.shipments.filter((s) => s.status === 'in_transit' || s.status === 'out_for_delivery').length,
      delivered: state.shipments.filter((s) => s.status === 'delivered').length,
      exceptions: state.shipments.filter((s) => s.status === 'failed_delivery' || s.status === 'exception' || s.status === 'returned_to_sender').length,
    };
    set({ stats });
  },
  
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      shipments: [],
      selectedShipment: null,
      availableRates: [],
      isLoading: false,
      error: null,
      stats: {
        created: 0,
        in_transit: 0,
        delivered: 0,
        exceptions: 0,
      },
    }),
}));

