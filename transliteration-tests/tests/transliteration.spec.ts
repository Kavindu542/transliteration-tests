import { expect, test } from '@playwright/test';

import { SwiftTranslatorPage } from '../pages/swift-translator-page';
import {
  negativeTestCases,
  positiveTestCases,
  type TestCase,
  uiTestCases,
} from './fixtures/test-data';
import { calculateSimilarity, normalizeText } from '../utils/helpers';

expect.extend({
  toBeSimilarTo(received: string, expected: string, threshold: number = 0.95) {
    const similarity = calculateSimilarity(received, expected);
    const pass = similarity >= threshold;

    return {
      pass,
      message: () =>
        pass
          ? `expected received not to be similar (>= ${threshold}); similarity was ${similarity.toFixed(3)}`
          : `expected received to be similar (>= ${threshold}); similarity was ${similarity.toFixed(3)}\nreceived: ${received}\nexpected: ${expected}`,
    };
  },
});

function thresholdFor(testCase: TestCase): number {
  if (testCase.inputLengthType === 'L') return 0.9;
  if (testCase.inputLengthType === 'M') return 0.93;
  return 0.95;
}

test.describe('Singlish to Sinhala Transliteration Tests', () => {
  let translatorPage: SwiftTranslatorPage;

  test.beforeEach(async ({ page }) => {
    translatorPage = new SwiftTranslatorPage(page);
    await translatorPage.goto();
    await page.waitForLoadState('domcontentloaded');
  });

  test.describe('Positive Functional Tests', () => {
    for (const testCase of positiveTestCases) {
      test(`[${testCase.id}] ${testCase.name}`, async () => {
        await translatorPage.enterSinglishText(testCase.input);
        const actualOutput = await translatorPage.getSinhalaOutput();

        expect(actualOutput).toBeSimilarTo(testCase.expectedOutput, thresholdFor(testCase));
      });
    }
  });

  test.describe('Negative Functional Tests', () => {
    for (const testCase of negativeTestCases) {
      test(`[${testCase.id}] ${testCase.name}`, async () => {
        await translatorPage.enterSinglishText(testCase.input);
        const actualOutput = await translatorPage.getSinhalaOutput();

        // The site currently transliterates this input into a single unsegmented Sinhala string.
        // Treat this as a negative (undesirable) behavior: output exists but has no spaces.
        if (testCase.id === 'Neg_Fun_0006') {
          expect(actualOutput.trim().length).toBeGreaterThan(0);
          expect(actualOutput).not.toMatch(/\s/);
          return;
        }

        const normalizedActual = normalizeText(actualOutput);
        const normalizedExpected = normalizeText(testCase.expectedOutput);
        expect(normalizedActual).not.toEqual(normalizedExpected);
      });
    }
  });

  test.describe('UI Tests', () => {
    for (const testCase of uiTestCases) {
      if (testCase.id === 'Pos_UI_0001') {
        test(`[${testCase.id}] ${testCase.name}`, async () => {
          await translatorPage.enterSinglishText(testCase.input);

          const initialOutput = await translatorPage.getSinhalaOutput();
          expect(normalizeText(initialOutput).length).toBeGreaterThan(0);

          await translatorPage.clearInput();

          const inputAfterClear = await translatorPage.getInputValue();
          const outputAfterClear = await translatorPage.getSinhalaOutput();

          expect(inputAfterClear).toBe('');
          expect(normalizeText(outputAfterClear)).toBe('');
        });
      } else {
        test(`[${testCase.id}] ${testCase.name}`, async () => {
          await translatorPage.enterSinglishText(testCase.input);
          const actualOutput = await translatorPage.getSinhalaOutput();
          expect(actualOutput).toBeSimilarTo(testCase.expectedOutput, thresholdFor(testCase));
        });
      }
    }
  });

  test('Real-time output update behavior', async () => {
    const testPhrase = 'mama gedhara yanavaa';
    const expectedOutput = 'මම ගෙදර යනවා';

    await translatorPage.singlishInput.click();

    for (const ch of testPhrase) {
      await translatorPage.singlishInput.type(ch);
      await translatorPage.page.waitForTimeout(80);
    }

    // SwiftTranslator debounces transliteration by ~300ms after the last input change.
    await expect
      .poll(async () => normalizeText(await translatorPage.getSinhalaOutput()), {
        timeout: 10_000,
        intervals: [250, 500, 750],
      })
      .not.toBe('');

    const actualOutput = await translatorPage.getSinhalaOutput();
    expect(actualOutput).toBeSimilarTo(expectedOutput, 0.95);
  });
});
