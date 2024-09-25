import { readFileSync } from "fs";
import { chromium } from "playwright-core";

export const handler = async (event: any, context: any) => {
  let browser;
  let page;

  try {
    browser = await chromium.launch({ headless: true });
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
    }
  } catch (error) {
    console.error("Error " + error);
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
