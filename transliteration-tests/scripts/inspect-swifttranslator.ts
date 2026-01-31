import { chromium } from 'playwright';
import { gunzipSync, inflateSync } from 'zlib';

function pickAttr(el: Element, name: string): string | null {
  const v = el.getAttribute(name);
  return v && v.length ? v : null;
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const requests: string[] = [];
  const apiResponses: Array<{ url: string; status: number; body: unknown }> = [];
  page.on('request', (req) => {
    const url = req.url();
    // Keep it reasonably small.
    if (requests.length < 200) requests.push(url);
  });

  page.on('response', async (res) => {
    const url = res.url();
    if (!/execute-api\.us-east-1\.amazonaws\.com\/transliterate/i.test(url)) return;
    try {
      const body = await res.json();
      let decoded: unknown = undefined;

      const raw = (body as any)?.data;
      if (typeof raw === 'string') {
        const b64 = raw.replace(/\s+/g, '');
        try {
          const buf = Buffer.from(b64, 'base64');
          try {
            const gunzipped = gunzipSync(buf);
            const asText = gunzipped.toString('utf8');
            decoded = asText;
            try {
              decoded = JSON.parse(asText);
            } catch {
              // leave as text
            }
          } catch {
            try {
              const inflated = inflateSync(buf);
              const asText = inflated.toString('utf8');
              decoded = asText;
              try {
                decoded = JSON.parse(asText);
              } catch {
                // leave as text
              }
            } catch {
              decoded = {
                rawLength: raw.length,
                normalizedBase64Length: b64.length,
                base64Head: b64.slice(0, 40),
                base64Tail: b64.slice(-40),
                base64DecodedBytes: buf.length,
                headHex: buf.subarray(0, 16).toString('hex'),
                utf8Snippet: buf.toString('utf8', 0, Math.min(buf.length, 160)),
                utf16leSnippet: buf.toString('utf16le', 0, Math.min(buf.length, 160)),
                utf8HasSinhala: /[\u0D80-\u0DFF]/.test(buf.toString('utf8')),
                utf16leHasSinhala: /[\u0D80-\u0DFF]/.test(buf.toString('utf16le')),
              };
            }
          }
        } catch {
          decoded = '<base64 decode failed>';
        }
      }

      apiResponses.push({ url, status: res.status(), body: { ...body, decoded } });
    } catch {
      apiResponses.push({ url, status: res.status(), body: '<non-json>' });
    }
  });

  await page.goto('https://www.swifttranslator.com/', { waitUntil: 'domcontentloaded' });

  // Try switching typing language to Sinhala (could be button/tab/radio/text).
  const candidates: Array<{ kind: string; selector: string }> = [
    { kind: 'button', selector: 'button:has-text("Sinhala")' },
    { kind: 'role=tab', selector: '[role="tab"]:has-text("Sinhala")' },
    { kind: 'role=radio', selector: '[role="radio"]:has-text("Sinhala")' },
    { kind: 'text', selector: 'text=Sinhala' },
  ];

  for (const c of candidates) {
    const loc = page.locator(c.selector).first();
    if (await loc.count()) {
      await loc.click({ timeout: 2000 }).catch(() => undefined);
      await page.waitForTimeout(250);
      break;
    }
  }

  // Try typing a sample to make the output appear.
  const input = page.locator('textarea[placeholder="Input Your Singlish Text Here."]');
  if (await input.count()) {
    await input.click();
    await input.fill('');
    await input.type('mama gedhara yanavaa', { delay: 40 });
    await page.waitForTimeout(1500);
  }

  const afterValue = await input.inputValue().catch(() => '');
  // eslint-disable-next-line no-console
  console.log('TEXTAREA_VALUE_AFTER:', JSON.stringify(afterValue));

  // eslint-disable-next-line no-console
  console.log('REQUESTS_SAMPLE:', JSON.stringify(requests.slice(0, 50), null, 2));

  // eslint-disable-next-line no-console
  console.log('TRANSLITERATE_RESPONSES:', JSON.stringify(apiResponses, null, 2));

  const summary = await page.evaluate(() => {
    const els = Array.from(document.querySelectorAll('input, textarea'));

    const data = els.map((el) => {
      const tag = el.tagName.toLowerCase();
      const input = el as HTMLInputElement;
      const textarea = el as HTMLTextAreaElement;
      const isInput = tag === 'input';

      const type = isInput ? input.type : null;
      const placeholder = el.getAttribute('placeholder');
      const name = el.getAttribute('name');
      const id = el.getAttribute('id');
      const cls = el.getAttribute('class');
      const ariaLabel = el.getAttribute('aria-label');
      const readOnly = (el as any).readOnly === true || el.hasAttribute('readonly');
      const disabled = (el as any).disabled === true || el.hasAttribute('disabled');
      const value = isInput ? input.value : textarea.value;

      return {
        tag,
        type,
        placeholder,
        name,
        id,
        class: cls,
        ariaLabel,
        readOnly,
        disabled,
        valueLength: value?.length ?? 0,
      };
    });

    const outputCandidates = Array.from(
      document.querySelectorAll(
        '[data-testid*="output" i], [data-testid*="result" i], [id*="output" i], [id*="result" i], [class*="output" i], [class*="result" i]'
      )
    )
      .filter((el) => !(el instanceof HTMLInputElement) && !(el instanceof HTMLTextAreaElement))
      .slice(0, 30)
      .map((el) => {
        const text = (el.textContent ?? '').trim();
        return {
          tag: el.tagName.toLowerCase(),
          id: el.getAttribute('id'),
          class: el.getAttribute('class'),
          testid: el.getAttribute('data-testid'),
          textLength: text.length,
          textSnippet: text.slice(0, 120),
        };
      });

    const sinhalaRegex = /[\u0D80-\u0DFF]/;
    const sinhalaElements = Array.from(document.querySelectorAll('body *'))
      .map((el) => {
        const text = (el.textContent ?? '').trim();
        return { el, text };
      })
      .filter(({ text }) => text.length > 0 && sinhalaRegex.test(text))
      .slice(0, 50)
      .map(({ el, text }) => ({
        tag: el.tagName.toLowerCase(),
        id: el.getAttribute('id'),
        class: el.getAttribute('class'),
        testid: el.getAttribute('data-testid'),
        textLength: text.length,
        textSnippet: text.slice(0, 160),
      }));

    const textareasByPlaceholder = Array.from(document.querySelectorAll('textarea'))
      .map((ta) => ({
        placeholder: ta.getAttribute('placeholder'),
        class: ta.getAttribute('class'),
      }));

    const checkboxContexts = Array.from(document.querySelectorAll('input[type="checkbox"]')).map((cb) => {
      const parent = cb.parentElement;
      const parentText = (parent?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 200);
      const grandParent = parent?.parentElement;
      const grandParentText = (grandParent?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 200);

      const label = cb.closest('label');
      const labelText = (label?.textContent ?? '').trim().replace(/\s+/g, ' ').slice(0, 200);

      return {
        class: cb.getAttribute('class'),
        id: cb.getAttribute('id'),
        name: cb.getAttribute('name'),
        parentText,
        grandParentText,
        labelText,
      };
    });

    const links = Array.from(document.querySelectorAll('a[href]'))
      .map((a) => a.getAttribute('href') ?? '')
      .filter(Boolean)
      .map((href) => href.trim())
      .filter((href) => !href.startsWith('#'));

    const interestingLinks = Array.from(new Set(links))
      .filter((href) => /sinhala|singlish|translit|translate|keyboard/i.test(href))
      .slice(0, 50);

    const buttons = Array.from(document.querySelectorAll('button'))
      .map((b) => {
        const text = (b.textContent ?? '').trim().replace(/\s+/g, ' ');
        return {
          text: text.slice(0, 120),
          textLength: text.length,
          id: b.getAttribute('id'),
          class: b.getAttribute('class'),
          ariaLabel: b.getAttribute('aria-label'),
        };
      })
      .filter((b) => b.textLength > 0 || (b.ariaLabel && b.ariaLabel.length > 0))
      .slice(0, 60);

    return {
      inputsAndTextareas: {
        total: data.length,
        readonly: data.filter((d) => d.readOnly).length,
        enabled: data.filter((d) => !d.disabled).length,
        data,
      },
      textareasByPlaceholder,
      checkboxContexts,
      interestingLinks,
      buttons,
      outputCandidates,
      sinhalaElements,
    };
  });

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(summary, null, 2));

  await browser.close();
}

main().catch((e) => {
  // eslint-disable-next-line no-console
  console.error(e);
  process.exit(1);
});
