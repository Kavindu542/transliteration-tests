# Singlish to Sinhala Transliteration Testing

Automated Playwright test suite for evaluating a Singlish → Sinhala transliteration UI.

This suite runs a mix of:

- **Positive tests** (expects correct Sinhala output)
- **Negative tests** (expects the site to produce an incorrect/undesirable output; the test **passes** when the mismatch/bug is detected)

## Prerequisites

- Node.js 18+ recommended
- npm

## Setup

```bash
npm install
npx playwright install
```

## Run tests

```bash
npm test
```

### Run only one browser (recommended for evaluation)

Your Playwright config defines separate projects: `chromium`, `firefox`, `webkit`.
To run **only one browser**, use `--project`.

**Evaluator mode (Chromium only, headed, runs one-by-one):**

```bash
npx playwright test --project=chromium --workers=1 --headed
```

**Chromium only (headless):**

```bash
npx playwright test --project=chromium
```

**Firefox only (optional):**

```bash
npx playwright test --project=firefox --workers=1 --headed
```

Other useful commands:

```bash
npm run test:headed
npm run test:chromium
npm run test:firefox
npm run test:webkit
npm run report
```

## Understanding results (Negative tests)

- In the **HTML report**, negative tests should show as **passed** when the automation successfully detected a mismatch.
- In the **terminal output**, you may still see ❌-style “mismatch” messages for negative cases. This is intentional and indicates the site did _not_ match the correct Sinhala output (i.e., the bug was found).

## View the HTML report

```bash
npx playwright show-report
```

If you see a “port in use” error:

```bash
npx playwright show-report --port 0
```

## Project structure

- `playwright.config.ts` Playwright configuration
- `pages/` Page Object Model
- `tests/fixtures/test-data.ts` test cases
- `tests/transliteration.spec.ts` main test suite
- `utils/helpers.ts` text normalization + similarity helpers

## Notes

Selectors on https://www.swifttranslator.com/ can change over time. If tests fail due to missing locators, update `pages/swift-translator-page.ts`.
