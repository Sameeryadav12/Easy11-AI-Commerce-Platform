import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Sparkles,
  ShoppingBag,
  Search,
  BarChart3,
  Package,
  Loader2,
  Mic,
  MicOff,
} from 'lucide-react';
import { useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAssistantStore } from '../../store/assistantStore';
import { Button } from '../ui';

export default function ChatWidget() {
  const location = useLocation();
  const {
    isOpen,
    messages,
    isTyping,
    context,
    openChat,
    closeChat,
    toggleChat,
    sendMessage,
    setContext,
  } = useAssistantStore();

  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isVoiceSupported, setIsVoiceSupported] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const recognitionRef = useRef<any>(null);

  // Update context when page changes
  useEffect(() => {
    const path = location.pathname;
    
    if (path === '/') {
      setContext({ page: 'home' });
    } else if (path.startsWith('/products/') && path.split('/').length === 3) {
      setContext({ page: 'product', productId: path.split('/')[2] });
    } else if (path.startsWith('/products')) {
      setContext({ page: 'products' });
    } else if (path === '/cart') {
      setContext({ page: 'cart' });
    }
  }, [location, setContext]);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Initialize Web Speech API
  useEffect(() => {
    // Check if browser supports Speech Recognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsVoiceSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputValue(transcript);
        setIsRecording(false);
        toast.success('Voice captured!', { icon: '🎤', duration: 1500 });
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsRecording(false);
        toast.error('Voice input failed. Please try again.');
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Send initial greeting when chat first opens
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetings = {
        home: "👋 Hi! I'm EasyAI. Tell me what you're looking for and I'll help you find it!",
        products: "Hello! Want me to help narrow down the best options? Just describe what you need!",
        product: "Hi! Want to compare this with similar options or learn more about the specs?",
        cart: "Hey! Looking for compatible accessories or bundle savings? I can help!",
      };

      const greeting = greetings[context.page] || greetings.home;
      
      useAssistantStore.getState().addMessage({
        type: 'assistant',
        content: greeting,
      });
    }
  }, [isOpen, messages.length, context.page]);

  const handleSend = () => {
    if (!inputValue.trim()) return;
    
    sendMessage(inputValue);
    setInputValue('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoiceToggle = () => {
    if (!isVoiceSupported) {
      toast.error('Voice input not supported in this browser');
      return;
    }

    if (isRecording) {
      // Stop recording
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      // Start recording
      try {
        recognitionRef.current?.start();
        setIsRecording(true);
        toast('Listening... Speak now!', { icon: '🎤', duration: 3000 });
      } catch (error) {
        console.error('Failed to start voice recognition:', error);
        toast.error('Could not start voice input');
        setIsRecording(false);
      }
    }
  };

  const quickActions = [
    { icon: Search, label: 'Find Products', query: 'Show me popular products' },
    { icon: BarChart3, label: 'Compare', query: 'Help me compare products' },
    { icon: ShoppingBag, label: 'Deals', query: 'What deals are available?' },
    { icon: Package, label: 'Track Order', query: 'Track my order' },
  ];

  return (
    <>
      {/* Chat Bubble Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={openChat}
            className="fixed bottom-6 right-6 z-50 w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full shadow-2xl flex items-center justify-center text-white hover:shadow-purple-500/50 transition-shadow group"
            aria-label="Open AI Assistant"
          >
            <Sparkles className="w-7 h-7 group-hover:rotate-12 transition-transform" />
            <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold animate-pulse">
              AI
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] bg-white dark:bg-gray-900 rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-heading font-bold">EasyAI Assistant</h3>
                  <p className="text-purple-100 text-xs">
                    {isTyping ? 'Typing...' : 'Online'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeChat}
                className="w-8 h-8 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-colors"
                aria-label="Close assistant"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>

            {/* Quick Actions (if no messages) */}
            {messages.length <= 1 && (
              <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick actions:</p>
                <div className="grid grid-cols-2 gap-2">
                  {quickActions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <button
                        key={action.label}
                        onClick={() => {
                          sendMessage(action.query);
                        }}
                        className="flex items-center space-x-2 p-2 bg-gray-50 dark:bg-gray-800 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-left"
                      >
                        <Icon className="w-4 h-4 text-purple-500 flex-shrink-0" />
                        <span className="text-xs font-medium text-gray-700 dark:text-gray-300">
                          {action.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'
                        : message.type === 'system'
                        ? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-sm italic'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {message.type === 'assistant' && (
                      <div className="flex items-center space-x-2 mb-2">
                        <Sparkles className="w-4 h-4 text-purple-500" />
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">
                          EasyAI
                        </span>
                      </div>
                    )}
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">
                      {message.content}
                    </div>
                    {message.toolUsed && (
                      <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                        🔧 Used: {message.toolUsed}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Typing Indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl px-4 py-3 flex items-center space-x-2">
                    <Loader2 className="w-4 h-4 text-purple-500 animate-spin" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Thinking...
                    </span>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="flex items-end space-x-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isRecording ? "Listening..." : "Ask me anything..."}
                  className="flex-1 px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-purple-500 focus:outline-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white resize-none"
                  disabled={isTyping || isRecording}
                />
                {isVoiceSupported && (
                  <button
                    onClick={handleVoiceToggle}
                    disabled={isTyping}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all flex-shrink-0 ${
                      isRecording
                        ? 'bg-red-500 hover:bg-red-600 animate-pulse'
                        : 'bg-gray-400 dark:bg-gray-600 hover:bg-gray-500 dark:hover:bg-gray-500'
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                    aria-label={isRecording ? 'Stop recording' : 'Start voice input'}
                  >
                    {isRecording ? (
                      <MicOff className="w-5 h-5" />
                    ) : (
                      <Mic className="w-5 h-5" />
                    )}
                  </button>
                )}
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || isTyping || isRecording}
                  className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center text-white disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-shadow flex-shrink-0"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                {isVoiceSupported ? (
                  <>AI-powered by Easy11 • Press Enter to send • 🎤 Click mic for voice</>
                ) : (
                  <>AI-powered by Easy11 • Press Enter to send</>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

