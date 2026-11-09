const { chromium } = require("playwright");

const MAX_TIMEOUT = 5000;
const MAX_OUTPUT = 12000;
const PREVIEW_URL = "http://codementor-preview.local/";

async function runWebCode({
  html = "",
  css = "",
  javascript = "",
  timeoutMs = MAX_TIMEOUT,
}) {
  let browser;

  const logs = [];
  const errors = [];

  try {
    browser = await chromium.launch({
      headless: true,
      args: [
        "--disable-background-networking",
        "--disable-extensions",
        "--disable-sync",
      ],
    });

    const context = await browser.newContext({
      serviceWorkers: "block",
      acceptDownloads: false,
      javaScriptEnabled: true,
    });

    const page = await context.newPage();

    page.setDefaultTimeout(MAX_TIMEOUT);

    page.on("console", (message) => {
      if (message.type() === "log" || message.type() === "info") {
        logs.push(message.text());
      }

      if (message.type() === "error") {
        errors.push(message.text());
      }
    });

    page.on("pageerror", (error) => {
      errors.push(error.message);
    });

    const safeJavaScript = String(javascript)
      .replace(/<\/script/gi, "<\\/script");

    const styleTag = `<style>${String(css).replace(/<\/style/gi, "<\\/style")}</style>`;

    const scriptTag = `<script>${safeJavaScript}</script>`;

    let document = String(html);

    if (!/<html[\s>]/i.test(document)) {
      document = `<!DOCTYPE html>
<html>
<head></head>
<body>${document}</body>
</html>`;
    }

    if (/<\/head>/i.test(document)) {
      document = document.replace(
        /<\/head>/i,
        `${styleTag}</head>`
      );
    } else {
      document = document.replace(
        /<html([^>]*)>/i,
        `<html$1><head>${styleTag}</head>`
      );
    }

    if (/<\/body>/i.test(document)) {
      document = document.replace(
        /<\/body>/i,
        `${scriptTag}</body>`
      );
    } else {
      document += scriptTag;
    }

    // Serve only the preview page. Block every other network request.
    let previewServed = false;

    await page.route("**/*", async (route) => {
      const request = route.request();

      if (
        !previewServed &&
        request.url() === PREVIEW_URL &&
        request.method() === "GET"
      ) {
        previewServed = true;

        await route.fulfill({
          status: 200,
          contentType: "text/html; charset=utf-8",
          body: document,
        });

        return;
      }

      await route.abort();
    });

    // Navigate to a real, non-opaque origin.
    await page.goto(PREVIEW_URL, {
      waitUntil: "domcontentloaded",
      timeout: timeoutMs,
    });

    await page.waitForTimeout(100);

    const result = await page.evaluate(() => ({
      title: document.title,
      text: document.body?.innerText || "",
      html: document.body?.innerHTML || "",
    }));

    return {
      success: true,
      logs,
      errors,
      ...result,
    };
  } catch (error) {
    return {
      success: false,
      logs,
      errors,
      message: error.message,
    };
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = { runWebCode };