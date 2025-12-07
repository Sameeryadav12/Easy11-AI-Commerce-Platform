import { create } from 'zustand';

export interface Message {
  id: string;
  type: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  toolUsed?: string;
  products?: any[];
  isLoading?: boolean;
}

export type ChatMode = 'browse' | 'compare' | 'size' | 'deals' | 'track';

interface AssistantState {
  isOpen: boolean;
  messages: Message[];
  currentMode: ChatMode;
  context: {
    page: 'home' | 'products' | 'product' | 'cart';
    productId?: string;
    category?: string;
  };
  isTyping: boolean;
  
  // Actions
  openChat: () => void;
  closeChat: () => void;
  toggleChat: () => void;
  sendMessage: (content: string) => void;
  setMode: (mode: ChatMode) => void;
  setContext: (context: Partial<AssistantState['context']>) => void;
  clearMessages: () => void;
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;
}

// Mock AI responses based on query patterns
const generateAIResponse = (userMessage: string, context: AssistantState['context']): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  // Product search queries
  if (lowerMessage.includes('laptop') || lowerMessage.includes('computer')) {
    return "I found 3 great laptops for you! The **Laptop Xtreme Gaming** at $1,299.99 is our top pick for power users. Would you like me to:\n\n1. Show you all laptops\n2. Filter by your budget\n3. Compare with similar models\n\nWhat would help you most?";
  }
  
  if (lowerMessage.includes('headphone') || lowerMessage.includes('audio')) {
    return "Perfect! Our **Wireless Headphones Pro** are bestsellers at $299.99 (save $50!). They feature:\n\n• 40-hour battery life\n• Active Noise Cancellation\n• Premium sound quality\n\nShall I add them to your cart?";
  }
  
  if (lowerMessage.includes('discount') || lowerMessage.includes('coupon') || lowerMessage.includes('promo')) {
    return "Great question! I can help with discounts. Try these codes:\n\n💰 **EASY10** - 10% off\n💰 **EASY20** - 20% off\n💰 **WELCOME** - 15% off first order\n💰 **SAVE50** - $50 off orders over $200\n\nWould you like me to apply one to your cart?";
  }
  
  if (lowerMessage.includes('cheap') || lowerMessage.includes('budget') || lowerMessage.includes('under')) {
    return "Looking for great value? I can show you our best products under different budgets:\n\n• **Under $50**: 15 items\n• **Under $100**: 28 items\n• **Under $200**: 45 items\n\nWhat's your budget range?";
  }
  
  if (lowerMessage.includes('compare')) {
    return "I can help you compare products! Just tell me which products you're interested in, and I'll create a detailed side-by-side comparison showing:\n\n• Specifications\n• Prices & deals\n• Customer ratings\n• Value recommendation\n\nWhich products would you like to compare?";
  }
  
  if (lowerMessage.includes('track') || lowerMessage.includes('order')) {
    return "I can help you track your order! If you're signed in, I can pull your recent orders. Otherwise, please provide your order number (format: E11-XXXXXXXX) and I'll get the latest status for you.";
  }
  
  if (lowerMessage.includes('return') || lowerMessage.includes('refund')) {
    return "Our return policy is simple:\n\n✓ **30-day returns** on most items\n✓ **Free return shipping**\n✓ **Full refund** to original payment method\n✓ **No questions asked**\n\nWould you like to start a return? I can guide you through the process!";
  }
  
  if (lowerMessage.includes('ship') || lowerMessage.includes('deliver')) {
    return "Shipping at Easy11:\n\n🚚 **FREE** on orders over $100\n⚡ **Standard**: 5-7 business days\n🚀 **Express**: 2-3 days ($9.99)\n⭐ **Same-day**: Available in select cities ($19.99)\n\nWhat would you like to know about shipping?";
  }
  
  // Context-specific responses
  if (context.page === 'cart' && (lowerMessage.includes('accessory') || lowerMessage.includes('add'))) {
    return "Great question! Based on your cart, I recommend:\n\n🖱️ **Wireless Mouse Pro** ($29.99) - Pairs perfectly\n🔌 **USB-C Hub** ($49.99) - Essential accessory\n💻 **Laptop Stand** ($39.99) - Ergonomic upgrade\n\nShould I add any of these to your cart?";
  }
  
  if (context.page === 'product') {
    return "I'm here to help with this product! I can:\n\n• Explain the specifications\n• Compare with similar items\n• Check for bundle deals\n• Find matching accessories\n• Verify shipping times\n\nWhat would you like to know?";
  }
  
  // General greeting
  if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
    return "Hello! 👋 I'm **EasyAI**, your personal shopping assistant. I can help you:\n\n• Find products\n• Compare items\n• Apply discounts\n• Track orders\n• Answer questions\n\nWhat can I help you with today?";
  }
  
  // Default helpful response
  return "I'm here to help! I can assist you with:\n\n🔍 **Finding products** - \"Show me laptops under $800\"\n⚖️ **Comparing items** - \"Compare this with similar models\"\n💰 **Deals & discounts** - \"Any active promotions?\"\n📦 **Order tracking** - \"Track my order #E11-12345678\"\n❓ **Questions** - \"What's your return policy?\"\n\nWhat would you like help with?";
};

export const useAssistantStore = create<AssistantState>((set, get) => ({
  isOpen: false,
  messages: [],
  currentMode: 'browse',
  context: {
    page: 'home',
  },
  isTyping: false,

  openChat: () => set({ isOpen: true }),
  
  closeChat: () => set({ isOpen: false }),
  
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  sendMessage: (content) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content,
      timestamp: new Date(),
    };

    set((state) => ({
      messages: [...state.messages, userMessage],
      isTyping: true,
    }));

    // Simulate AI response (300-800ms delay)
    const delay = 300 + Math.random() * 500;
    
    setTimeout(() => {
      const aiResponse = generateAIResponse(content, get().context);
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
        toolUsed: 'product_search', // Mock tool usage
      };

      set((state) => ({
        messages: [...state.messages, assistantMessage],
        isTyping: false,
      }));
    }, delay);
  },

  setMode: (mode) => set({ currentMode: mode }),

  setContext: (context) => set((state) => ({
    context: { ...state.context, ...context },
  })),

  clearMessages: () => set({ messages: [] }),

  addMessage: (message) => {
    const fullMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    set((state) => ({
      messages: [...state.messages, fullMessage],
    }));
  },
}));

