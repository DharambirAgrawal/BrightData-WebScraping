import axios from "axios";
import { extractPrice } from "../utils";
import * as cheerio from "cheerio";

export async function scrapeAmazonProduct(url: string) {
  if (!url) return;

  //BridhtData proxy configuration
  const username = String(process.env.BRIGHT_DATA_USERNAME);
  const password = String(process.env.BRIGHT_DATA_PASSWORD);

  const port = 22225;
  const session_id = (1000000 * Math.random()) | 0;
  const options = {
    auth: {
      username: `${username}-session-${session_id}`,
      password,
    },
    host: "brd.superproxy.io",
    port,
    rejectUnauthorized: false,
  };
  try {
    //Fetch product page
    const response = await axios.get(url, options);
    // console.log(response.data);
    const $ = cheerio.load(response.data);
    //Extract te product title
    const title = $("#productTitle").text().trim();

    const images =
      $("#imgBlkFront").attr("data-a-dynamic-image") ||
      $("#landingImage").attr("data-a-dynamic-image") ||
      "{}";
    const imageUrls = Object.keys(JSON.parse(images));

    const about = $(
      "ul.a-unordered-list.a-vertical.a-spacing-mini span.a-list-item"
    );
    const about2 = $(
      "ul.a-unordered-list.a-vertical.a-spacing-none span.a-list-item"
    );

    const price = $(
      "span.a-price.a-text-price.a-size-medium.apexPriceToPay span.a-offscreen"
    )
      .text()
      .trim();
    const discount_percentage = $(
      "td.a-span12.a-color-price.a-size-base span.a-color-price"
    )
      .text()
      .trim();

    let dis_per = "";
    let matches = discount_percentage.match(/\((.*?)\)/);
    if (matches) {
      var insideBrackets = matches[1];
      dis_per = insideBrackets;
    } else {
      console.log("No percentage found inside brackets.");
    }

    const discount = $(
      "td.a-span12.a-color-price.a-size-base span.a-color-price span.a-price.a-text-price.a-size-base span.a-offscreen"
    )
      .text()
      .trim();
    let aboutProduct: string[] = [];

    about.each((index, element) => {
      aboutProduct.push($(element).text());
    });
    about2.each((index, element) => {
      aboutProduct.push($(element).text());
    });

    console.log({
      title,
      price,
      discount,
      dis_per,
      imageUrls,
      aboutProduct,
    });
  } catch (err: any) {
    console.log(err);
    throw new Error(`Failed to scrape Product:${err.message}`);
  }
}

export async function scrapePuppetier(url: string) {
  if (!url) return;
}
