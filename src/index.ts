import { readFileSync } from "fs";
import { chromium } from "playwright-core";

let args = [
  "--no-sandbox",
  "--disable-dev-shm-usage",
  "--disable-gpu",
  "--single-process",
  // "--autoplay-policy=user-gesture-required",
  // "--disable-background-networking",
  // "--disable-background-timer-throttling",
  // "--disable-backgrounding-occluded-windows",
  // "--disable-breakpad",
  // "--disable-client-side-phishing-detection",
  // "--disable-component-update",
  // "--disable-default-apps",
  // "--disable-domain-reliability",
  // "--disable-extensions",
  // "--disable-features=AudioServiceOutOfProcess",
  // "--disable-hang-monitor",
  // "--disable-ipc-flooding-protection",
  // "--disable-notifications",
  // "--disable-offer-store-unmasked-wallet-cards",
  // "--disable-popup-blocking",
  // "--disable-print-preview",
  // "--disable-prompt-on-repost",
  // "--disable-renderer-backgrounding",
  // "--disable-setuid-sandbox",
  // "--disable-speech-api",
  // "--disable-sync",
  // "--disk-cache-size=33554432",
  // "--hide-scrollbars",
  // "--ignore-gpu-blacklist",
  // "--metrics-recording-only",
  // "--mute-audio",
  // "--no-default-browser-check",
  // "--no-first-run",
  // "--no-pings",
  // "--no-zygote",
  // "--password-store=basic",
  // "--use-gl=swiftshader",
  // "--use-mock-keychain",
];

export const handler = async (event: any, context: any) => {
  let browser;
  let page;

  try {
    browser = await chromium.launch({
      headless: true,
      args: args,
    });
    page = await browser.newPage();
    let cookiesStr = JSON.parse(readFileSync("./cookies.json", "utf8"));
    const cookies = cookiesStr.map((cookie: any) => ({
      name: cookie.name,
      value: cookie.value,
      domain: cookie.domain,
      path: cookie.path,
      expires: cookie.expirationDate,
      httpOnly: cookie.httpOnly,
      secure: cookie.secure,
      sameSite: cookie.sameSite
        ? "None"
        : cookie.sameSite.charAt(0).toUpperCase() + cookie.sameSite.slice(1),
    }));

    console.log(cookies);
    await page.context().addCookies(cookies);
    await page.goto("https://mate.academy/events/tech-check");
    // [data-qa=subscribe-button]
    const btnSelector = "[data-qa=subscribe-button]";
    await page.waitForSelector(btnSelector);
    const btns = await page.$$(btnSelector);
    for (let i = 0; i < btns.length; i++) {
      await page.evaluate(() => {
        const overlay = document.querySelector(".cky-overlay");
        if (overlay) {
          console.log("removing overlay");
          overlay.remove();
        }
      });
      console.log("in the loop");
      //   await btns[i].click();
      console.log("clicked successfully");
      return "Executed successfully";
    }
  } catch (error) {
    console.error("Error " + error);
    return (
      "Something went wrong " +
      error +
      " The browser path is " +
      chromium.executablePath()
    );
  } finally {
    if (page) {
      await page.close();
    }
    if (browser) {
      await browser.close();
    }
  }
};

// handler(null, null);
