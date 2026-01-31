const { chromium } = require("playwright");

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on("console", (msg) => {
    // eslint-disable-next-line no-console
    console.log("[console]", msg.type(), msg.text());
  });

  await page.goto("https://www.swifttranslator.com/", {
    waitUntil: "domcontentloaded",
  });
  await page.fill(
    'textarea[placeholder="Input Your Singlish Text Here."]',
    "mama gedhara yanavaa",
  );
  await page.waitForTimeout(2500);

  const loc = page.locator("div.whitespace-pre-wrap");
  const count = await loc.count();
  console.log("whitespace-pre-wrap count:", count);

  for (let i = 0; i < Math.min(count, 10); i++) {
    const nth = loc.nth(i);
    const cls = await nth.getAttribute("class");
    const txt = (await nth.innerText().catch(() => "")) || "";
    console.log("---", i, "class=", cls);
    console.log(
      "textLen=",
      txt.length,
      "snippet=",
      JSON.stringify(txt.slice(0, 120)),
    );
  }

  // Also probe for the output card by panel-title text.
  const sinhalaCard = page.locator("div.card", {
    has: page.locator(".panel-title", { hasText: /^Sinhala$/ }),
  });
  console.log("sinhalaCard count:", await sinhalaCard.count());
  const sinhalaOutput = sinhalaCard.locator("div.whitespace-pre-wrap");
  console.log("sinhalaOutput count:", await sinhalaOutput.count());
  if ((await sinhalaOutput.count()) > 0) {
    const t =
      (await sinhalaOutput
        .first()
        .innerText()
        .catch(() => "")) || "";
    console.log("sinhalaOutput textLen:", t.length);
    console.log("sinhalaOutput snippet:", JSON.stringify(t.slice(0, 160)));
  }

  await browser.close();
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
