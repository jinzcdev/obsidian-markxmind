declare global {
  interface Window {
    Snowbrush?: any;
  }
}

const CDN_SNOWBRUSH_URL = 'https://assets.xmind.net/snowbrush/snowbrush-2.47.0.js';
const SCRIPT_TIMEOUT_MS = 7000;

let pendingLoad: Promise<void> | null = null;

function waitForScript(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const existed = Array.from(document.querySelectorAll('script')).find((script) => script.src === src);
    if (existed) {
      if (window.Snowbrush) {
        resolve();
        return;
      }
      setTimeout(() => {
        if (window.Snowbrush) {
          resolve();
        } else {
          reject(new Error(`Snowbrush script loaded but global is missing: ${src}`));
        }
      }, 300);
      return;
    }

    const script = document.createElement('script');
    script.src = src;
    script.async = true;
    script.defer = true;
    const timer = window.setTimeout(() => {
      script.remove();
      reject(new Error(`Snowbrush script load timeout: ${src}`));
    }, SCRIPT_TIMEOUT_MS);

    script.onload = () => {
      clearTimeout(timer);
      if (window.Snowbrush) {
        resolve();
        return;
      }
      reject(new Error(`Snowbrush script loaded but global is missing: ${src}`));
    };
    script.onerror = () => {
      clearTimeout(timer);
      script.remove();
      reject(new Error(`Snowbrush script load failed: ${src}`));
    };

    document.head.appendChild(script);
  });
}

export async function ensureSnowbrushLoaded(): Promise<void> {
  if (window.Snowbrush) return;
  if (pendingLoad) return pendingLoad;

  pendingLoad = waitForScript(CDN_SNOWBRUSH_URL);

  try {
    await pendingLoad;
  } finally {
    pendingLoad = null;
  }
}
