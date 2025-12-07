import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mic, StopCircle, Sparkles, AlertCircle } from 'lucide-react';
import clsx from 'clsx';
import useVoiceCommerce from '../../hooks/useVoiceCommerce';
import { Button, Card, CardBody, Badge } from '../ui';
import { useCartStore } from '../../store/cartStore';

interface VoiceCommandButtonProps {
  className?: string;
}

const suggestions = [
  'Find running shoes under $120',
  'Reorder last face wash',
  'Track my order 1056',
];

export default function VoiceCommandButton({ className }: VoiceCommandButtonProps) {
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);
  const {
    isSupported,
    isListening,
    transcript,
    interimTranscript,
    error,
    intent,
    startListening,
    stopListening,
    reset,
  } = useVoiceCommerce();

  const activeSuggestion = useMemo(
    () => suggestions[Math.floor(Math.random() * suggestions.length)],
    [],
  );

  useEffect(() => {
    if (!intent || intent.type === 'unknown') return;

    switch (intent.type) {
      case 'search': {
        const params = new URLSearchParams({ q: intent.query });
        navigate(`/products?${params.toString()}`);
        break;
      }
      case 'trackOrder': {
        navigate('/account/orders', { state: { orderRef: intent.orderRef } });
        break;
      }
      case 'reorder': {
        if (intent.productName) {
          navigate(`/products?reorder=${encodeURIComponent(intent.productName)}`);
        }
        break;
      }
      case 'addToCart': {
        if (intent.productName) {
          addItem(
            {
              id: `voice-${Date.now()}`,
              name: intent.productName,
              price: 0,
              image: '🛒',
            },
            1,
          );
        }
        break;
      }
      case 'help':
      default:
        break;
    }
  }, [intent, navigate, addItem]);

  useEffect(() => {
    if (transcript && !isListening) {
      const timer = setTimeout(() => reset(), 6000);
      return () => clearTimeout(timer);
    }
    return undefined;
  }, [transcript, isListening, reset]);

  if (!isSupported) {
    return null;
  }

  return (
    <div className={clsx('relative', className)}>
      <Button
        variant={isListening ? 'danger' : 'secondary'}
        size="sm"
        className="gap-2"
        onClick={() => (isListening ? stopListening() : startListening())}
        aria-pressed={isListening}
        aria-label="Voice commerce"
      >
        {isListening ? (
          <>
            <StopCircle className="w-4 h-4 animate-pulse" />
            Listening…
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            Voice
          </>
        )}
      </Button>

      {(transcript || interimTranscript || error || isListening) && (
        <div className="absolute right-0 top-12 w-80 z-40">
          <Card className="shadow-xl border border-blue-200 dark:border-blue-900/40 bg-white dark:bg-slate-900">
            <CardBody className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <Badge variant="info" size="sm" className="gap-1">
                  <Sparkles className="w-3 h-3" />
                  Assistant
                </Badge>
                <button
                  type="button"
                  className="text-xs text-blue-500 hover:text-blue-700"
                  onClick={reset}
                >
                  Clear
                </button>
              </div>

              {error ? (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900 dark:border-amber-900/40 dark:bg-amber-900/20 dark:text-amber-100 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 mt-0.5" />
                  {error}
                </div>
              ) : (
                <div className="rounded-lg border border-blue-100 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/20 dark:text-blue-200 min-h-[64px]">
                  {interimTranscript && (
                    <p className="text-blue-500 animate-pulse">{interimTranscript}</p>
                  )}
                  {transcript && <p className="font-medium">{transcript}</p>}
                  {!transcript && !interimTranscript && (
                    <p className="text-xs text-blue-500">Try saying: “{activeSuggestion}”</p>
                  )}
                </div>
              )}

              {intent?.type && intent.type !== 'unknown' && (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900 dark:border-emerald-900/30 dark:bg-emerald-900/20 dark:text-emerald-100">
                  Intent detected:{' '}
                  <span className="font-semibold uppercase tracking-widest">{intent.type}</span>
                  {intent.type === 'search' && intent.query && (
                    <span className="block mt-1 text-emerald-800 dark:text-emerald-200">
                      Query: “{intent.query}”
                    </span>
                  )}
                  {intent.type === 'trackOrder' && intent.orderRef && (
                    <span className="block mt-1 text-emerald-800 dark:text-emerald-200">
                      Order ref: {intent.orderRef}
                    </span>
                  )}
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      )}
    </div>
  );
}


