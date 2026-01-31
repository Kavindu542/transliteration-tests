import { Locator, Page } from '@playwright/test';

export class SwiftTranslatorPage {
  readonly page: Page;
  readonly languageSelect: Locator;
  readonly singlishInput: Locator;
  readonly sinhalaOutput: Locator;
  readonly clearButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // The site has a single language switch <select> with option values: english | sinhala.
    this.languageSelect = page
      .locator('select', { has: page.locator('option[value="english"]') })
      .first();

    // Singlish typing input (when language === english)
    this.singlishInput = page
      .locator('textarea[placeholder="Input Your Singlish Text Here."]')
      .first();

    // Sinhala output is rendered into a <div> (not an input/textarea)
    this.sinhalaOutput = page
      .locator('div.card', {
        has: page.locator('.panel-title', { hasText: /^Sinhala$/ }),
      })
      .locator('div.whitespace-pre-wrap')
      .first();

    this.clearButton = page.getByRole('button', { name: /clear/i }).first();
  }

  async goto() {
    await this.page.goto('/', { waitUntil: 'domcontentloaded' });
    await this.singlishInput.waitFor({ state: 'visible' });
  }

  async enterSinglishText(text: string) {
    await this.ensureTypingLanguage('english');

    const previous = await this.getSinhalaOutput().catch(() => '');

    const shouldProduceOutput = text.trim().length > 0;

    // SwiftTranslator calls an API endpoint for transliteration. Under throttling or slow network,
    // waiting only on DOM updates can be flaky; waiting for the response first makes the suite
    // much more stable across browsers.
    const transliterateResponse = shouldProduceOutput
      ? this.page
          .waitForResponse(
            (res) =>
              /execute-api\.us-east-1\.amazonaws\.com\/transliterate/i.test(res.url()) &&
              res.status() === 200,
            { timeout: 20_000 }
          )
          .catch(() => null)
      : Promise.resolve(null);

    await this.singlishInput.fill(text);

    // The app debounces transliteration requests by ~300ms.
    await this.page.waitForTimeout(350);

    await transliterateResponse;

    if (shouldProduceOutput) {
      await this.waitForNonEmptyOutput(previous, 25_000);
    } else {
      await this.waitForOutputChange(previous, 10_000);
    }
  }

  async getSinhalaOutput(): Promise<string> {
    const output = (await this.sinhalaOutput.innerText().catch(() => '')) ?? '';
    return output;
  }

  async clearInput() {
    const clearVisible = await this.clearButton.isVisible().catch(() => false);
    if (clearVisible) {
      await this.clearButton.click();
    } else {
      await this.singlishInput.fill('');
    }

    await this.waitForOutputChange(undefined, 8000);
  }

  async getInputValue(): Promise<string> {
    return await this.singlishInput.inputValue();
  }

  async ensureTypingLanguage(language: 'english' | 'sinhala') {
    const selectVisible = await this.languageSelect.isVisible().catch(() => false);
    if (!selectVisible) return;

    const current = await this.languageSelect.inputValue().catch(() => '');
    if (current === language) return;

    await this.languageSelect.selectOption(language);
  }

  private async waitForOutputChange(previous?: string, timeoutMs: number = 2500) {
    const start = Date.now();

    while (Date.now() - start < timeoutMs) {
      const current = (await this.getSinhalaOutput().catch(() => '')).trimEnd();

      if (previous === undefined) {
        // When clearing, accept empty output.
        if (current.length === 0) return;
      } else if (current !== previous.trimEnd()) {
        return;
      }

      await this.page.waitForTimeout(100);
    }
  }

  private async waitForNonEmptyOutput(previous: string, timeoutMs: number) {
    const previousTrimmed = previous.trim();

    const attempt = async (attemptTimeoutMs: number) => {
      const start = Date.now();

      while (Date.now() - start < attemptTimeoutMs) {
        const current = (await this.getSinhalaOutput().catch(() => '')).trim();
        if (current.length > 0 && current !== previousTrimmed) return true;
        await this.page.waitForTimeout(150);
      }

      return false;
    };

    // First wait normally.
    const ok = await attempt(timeoutMs);
    if (ok) return;

    // One-time retry poke: some runs get the API response but the debounced input handler
    // doesn't apply it (rare, mostly under throttling). Nudge the input without changing text.
    await this.pokeInputForRecompute().catch(() => undefined);
    const okAfterPoke = await attempt(10_000);
    if (okAfterPoke) return;

    const locatorCount = await this.sinhalaOutput.count().catch(() => 0);
    const current = (await this.getSinhalaOutput().catch(() => '')).trim();
    throw new Error(
      `Timed out waiting for Sinhala output to appear. (outputLocatorCount=${locatorCount}, currentLength=${current.length})`
    );
  }

  private async pokeInputForRecompute() {
    // Toggle a trailing space and remove it to trigger the debounced transliteration.
    const value = await this.singlishInput.inputValue().catch(() => '');
    if (!value.trim()) return;

    await this.singlishInput.focus();
    await this.singlishInput.press('End');
    await this.singlishInput.type(' ');
    await this.page.waitForTimeout(50);
    await this.singlishInput.press('Backspace');

    // Allow the debounce window to elapse again.
    await this.page.waitForTimeout(350);
  }
}
