import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export type VoiceIntent =
  | { type: 'search'; query: string }
  | { type: 'trackOrder'; orderRef?: string }
  | { type: 'reorder'; productName?: string }
  | { type: 'addToCart'; productName?: string }
  | { type: 'help' }
  | { type: 'unknown' };

interface UseVoiceCommerceOptions {
  locale?: string;
}

interface UseVoiceCommerceResult {
  isSupported: boolean;
  isListening: boolean;
  transcript: string;
  interimTranscript: string;
  error: string | null;
  intent: VoiceIntent | null;
  startListening: () => void;
  stopListening: () => void;
  reset: () => void;
}

type SpeechRecognitionInstance = SpeechRecognition | webkitSpeechRecognition;

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

function getSpeechRecognition(): typeof SpeechRecognition | null {
  if (typeof window === 'undefined') return null;
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

const normalizeTranscript = (text: string) => text.toLowerCase().trim();

const inferIntent = (text: string): VoiceIntent => {
  const normalized = normalizeTranscript(text);

  if (!normalized) return { type: 'unknown' };

  if (normalized.startsWith('search for ') || normalized.startsWith('find ')) {
    const query = normalized.replace(/^(search for|find)\s*/, '');
    return { type: 'search', query };
  }

  if (normalized.includes('track') && normalized.includes('order')) {
    const orderRefMatch = normalized.match(/order\s*(number)?\s*(\w+)/);
    return { type: 'trackOrder', orderRef: orderRefMatch?.[2] };
  }

  if (normalized.startsWith('reorder ')) {
    return { type: 'reorder', productName: normalized.replace('reorder ', '') };
  }

  if (normalized.startsWith('add ') || normalized.startsWith('put ')) {
    return { type: 'addToCart', productName: normalized.replace(/^(add|put)\s*/, '') };
  }

  if (normalized.includes('help')) {
    return { type: 'help' };
  }

  return { type: 'unknown' };
};

export default function useVoiceCommerce(
  options: UseVoiceCommerceOptions = {},
): UseVoiceCommerceResult {
  const recognitionCtor = useMemo(() => getSpeechRecognition(), []);
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const [isListening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<VoiceIntent | null>(null);

  useEffect(() => {
    if (!recognitionCtor) return;
    const recognition = new recognitionCtor();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = options.locale ?? navigator.language ?? 'en-US';
    recognition.maxAlternatives = 1;
    recognitionRef.current = recognition as SpeechRecognitionInstance;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let interim = '';

      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        const text = result[0].transcript;
        if (result.isFinal) {
          finalTranscript += text;
        } else {
          interim += text;
        }
      }

      if (finalTranscript) {
        setTranscript(finalTranscript.trim());
        setIntent(inferIntent(finalTranscript));
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      if (event.error === 'no-speech') {
        setError('No speech detected. Try speaking closer to the microphone.');
      } else if (event.error === 'not-allowed') {
        setError('Microphone access denied. Enable access in your browser settings.');
      } else if (event.error !== 'aborted') {
        setError(`Voice engine error: ${event.error}`);
      }
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    return () => {
      recognition.stop();
      recognitionRef.current = null;
    };
  }, [recognitionCtor, options.locale]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) {
      setError('Voice recognition is not supported on this device.');
      return;
    }
    setError(null);
    setTranscript('');
    setInterimTranscript('');
    setIntent(null);
    try {
      recognitionRef.current.start();
      setListening(true);
    } catch (err) {
      setError('We could not access the microphone. Make sure no other tab is listening.');
      setListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setListening(false);
  }, []);

  const reset = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
    setIntent(null);
    setError(null);
  }, []);

  return {
    isSupported: Boolean(recognitionCtor),
    isListening,
    transcript,
    interimTranscript,
    error,
    intent,
    startListening,
    stopListening,
    reset,
  };
}


