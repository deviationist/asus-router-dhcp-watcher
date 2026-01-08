import { Page, Frame, ElementHandle } from 'puppeteer';
import childProcess from 'child_process';

export async function getButtonByText(item: Page|ElementHandle, text: string) {
  return item.waitForSelector(`::-p-xpath(//button[contains(text(), '${text}')])`);
};

export async function resolveCookieFrameByUrl(page: Page, urlPattern: string, exact: boolean = false): Promise<Frame> {
  return new Promise((resolve, reject) => {
    setInterval(async () => {
      const frame = page.frames().find((frame) => {
        if (exact) {
          return frame.url() === urlPattern;
        }
        return frame.url().includes(urlPattern)
      });
      if (frame) {
        resolve(frame);
      }
    }, 500);
    setTimeout(() => {
      reject('Could not resolve cookie frame');
    }, 5000);
  });
};

export function extractIdFromFinnAdUrl(url: string): string | undefined {
  const matches = url.match(/\/([0-9]*$)/);
  return matches?.[1];
}

export async function runScript(scriptPath: string, args: string[]): Promise<string> {
  return new Promise((resolve, reject) => {
    const p = childProcess.spawn('node', [scriptPath, ...args], {
      shell: true,
    });
    p.stdout.setEncoding('utf8');
    p.stdout.on('data', (data) => {
      const output = data.toString().trim();
      switch (output) {
        case 'missing-url':
        case 'timeout':
          reject(output);
          return;
        default:
          resolve(output);
      }
      p.kill();
    });
    p.stderr.on('data', (data) => {
      reject(data.toString());
      p.kill();
    });
  });
}