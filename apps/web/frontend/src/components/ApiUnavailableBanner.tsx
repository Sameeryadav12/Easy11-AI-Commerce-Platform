import { useApiStatusStore } from '../store/apiStatusStore';
import { Button } from './ui';

export default function ApiUnavailableBanner() {
  const { unavailable, setUnavailable } = useApiStatusStore();

  if (!unavailable) return null;

  return (
    <div
      role="alert"
      className="flex flex-wrap items-center justify-center gap-3 bg-amber-500 px-4 py-2 text-center text-sm font-medium text-black shadow"
    >
      <span>Service temporarily unavailable. Please try again in a moment.</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => setUnavailable(false)}
        className="border-black/30 bg-black/10 hover:bg-black/20"
      >
        Dismiss
      </Button>
    </div>
  );
}
