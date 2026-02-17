import { Router, Request, Response } from 'express';
import fs from 'fs';
import path from 'path';

const router = Router();

function getDebugLogPath() {
  // backend/src -> backend -> project root
  const projectRoot = path.resolve(__dirname, '..', '..', '..');
  return path.join(projectRoot, '.cursor', 'debug.log');
}

router.post('/log', (req: Request, res: Response) => {
  try {
    // Only accept small JSON payloads; do NOT log secrets.
    const payload = req.body ?? {};
    const line = JSON.stringify(payload);
    fs.appendFileSync(getDebugLogPath(), `${line}\n`, { encoding: 'utf8' });
    return res.status(204).send();
  } catch (e) {
    return res.status(500).json({ error: 'debug log write failed' });
  }
});

router.get('/ping', (_req: Request, res: Response) => {
  return res.json({ ok: true });
});

export default router;

