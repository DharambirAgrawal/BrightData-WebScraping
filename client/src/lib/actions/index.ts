"use server";
import { scrapeAmazonProduct } from "../scraper";
import { scrapePuppetier } from "../scraper";
export async function scrapeAndStoreProduct(productUrl: string) {
  if (!productUrl) return;

  try {
    const scrapedProduct = await scrapeAmazonProduct(productUrl);
  } catch (err: any) {
    console.log(err);
    throw new Error(`Failed to create/Update Product:${err.message}`);
  }
}

export async function scrapefromPuppetier(productUrl: string) {
  if (!productUrl) return;

  try {
    const scrapedProduct = await scrapePuppetier(productUrl);
  } catch (err: any) {
    console.log(err);
    throw new Error(`Failed to create/Update Product:${err.message}`);
  }
}
