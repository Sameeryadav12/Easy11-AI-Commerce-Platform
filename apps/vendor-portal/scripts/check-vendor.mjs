import { chromium } from '@playwright/test';

async function main() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  page.on('console', (msg) => {
    console.log(`[client:${msg.type()}] ${msg.text()}`);
  });

  page.on('pageerror', (error) => {
    console.error('[client:error]', error);
  });

  page.on('response', (response) => {
    if (response.status() >= 400) {
      console.error(
        `[client:response] ${response.status()} ${response.request().method()} ${response.url()}`
      );
    }
  });

  try {
    await page.goto('http://localhost:5174/vendor/analytics', {
      waitUntil: 'domcontentloaded',
    });
    await page.waitForTimeout(4000);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error('[script:error]', error);
  process.exit(1);
});


