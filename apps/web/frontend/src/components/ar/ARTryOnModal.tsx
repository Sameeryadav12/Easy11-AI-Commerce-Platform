import { useMemo } from 'react';
import { Badge, Button, Modal, ModalFooter } from '../ui';
import { Camera, Sparkles, ShieldCheck } from 'lucide-react';

interface ARTryOnModalProps {
  isOpen: boolean;
  onClose: () => void;
  productName: string;
  category: 'eyewear' | 'jewelry' | 'hats' | 'footwear' | 'bags' | 'home';
}

const categoryGuidelines: Record<ARTryOnModalProps['category'], string[]> = {
  eyewear: [
    'Position your face in the center of the frame.',
    'Remove glasses to avoid occlusion.',
    'Ensure good lighting to capture eye contours.',
  ],
  jewelry: [
    'Hold the device about arm’s length from your face.',
    'Avoid reflective lighting for accurate rendering.',
    'Keep earrings or necklaces within the frame.',
  ],
  hats: [
    'Tilt your head slightly to align anchors.',
    'Ensure the top of your head is visible.',
    'Look straight for calibration before turning.',
  ],
  footwear: [
    'Point the camera at your feet while standing.',
    'Use contrasting flooring for better tracking.',
    'Move your foot slowly to see fit dynamics.',
  ],
  bags: [
    'Stand sideways to visualize strap length.',
    'Keep shoulders visible for scale guidance.',
    'Step back for full body overlay if possible.',
  ],
  home: [
    'Scan the floor to detect surfaces.',
    'Move phone slowly in a circular motion.',
    'Adjust lighting to reduce reflections.',
  ],
};

export default function ARTryOnModal({
  isOpen,
  onClose,
  productName,
  category,
}: ARTryOnModalProps) {
  const guidelines = categoryGuidelines[category];
  const supportLink = useMemo(() => {
    switch (category) {
      case 'footwear':
      case 'bags':
        return 'arcore';
      case 'eyewear':
      case 'jewelry':
      case 'hats':
        return 'face-tracking';
      default:
        return 'plane-detection';
    }
  }, [category]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Try ${productName} in AR`}
      size="lg"
      closeOnOverlayClick
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-blue-200 bg-blue-50 p-4 text-blue-900 dark:border-blue-900/40 dark:bg-blue-900/10 dark:text-blue-200">
          <p className="font-semibold">Ready for AR?</p>
          <p className="text-sm mt-1">
            We use on-device rendering and do not store any camera footage. You can switch to a 2D
            overlay preview if your device doesn’t support WebXR.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge color="blue">Supported Scene</Badge>
          <span className="text-sm text-gray-600 dark:text-gray-300">
            {category === 'home' ? 'Room placement' : 'Live try-on'} powered by {supportLink}.
          </span>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/40 p-5 space-y-4">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6 text-blue-500" />
            <p className="font-semibold text-gray-900 dark:text-white">Capture guidance</p>
          </div>
          <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
            {guidelines.map((tip) => (
              <li key={tip} className="flex items-start gap-2">
                <span className="mt-1 text-blue-500">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-900 dark:border-emerald-900/40 dark:bg-emerald-900/20 dark:text-emerald-200 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 mt-0.5" />
          <div>
            <p className="font-semibold text-sm">Privacy first</p>
            <p className="text-xs">
              Camera access is used only for anchoring and fit guidance. No biometric data or imagery
              leaves your device.
            </p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
          <video
            className="w-full rounded-xl border border-gray-200 dark:border-gray-700"
            autoPlay
            loop
            muted
            playsInline
            poster="https://dummyimage.com/800x450/111827/1f2937&text=AR+Preview"
          >
            <source
              src="https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4"
              type="video/mp4"
            />
          </video>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Sample visualization. Actual asset renders when you launch AR.
          </p>
        </div>
      </div>

      <ModalFooter className="justify-between">
        <Button variant="ghost" onClick={onClose}>
          Close
        </Button>
        <Button
          variant="secondary"
          onClick={() => {
            window.open(
              `https://example.com/ar-fallback?product=${encodeURIComponent(productName)}`,
              '_blank',
            );
          }}
        >
          2D overlay
        </Button>
        <Button
          variant="primary"
          className="gap-2"
          onClick={() => {
            window.open(
              `https://example.com/ar-launch?product=${encodeURIComponent(productName)}`,
              '_blank',
            );
          }}
        >
          Launch AR session
          <Sparkles className="w-4 h-4" />
        </Button>
      </ModalFooter>
    </Modal>
  );
}


