import * as cheerio from "cheerio";

async function run() {
  const apiKey = "68a82a9e268eb61573941d778c05e391";
  const url = "https://mydramalist.com/dramalist/sushversesai";
  const fetchUrl = `http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}`;
  
  const res = await fetch(fetchUrl);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  console.log("Full HTML of first drama row:");
  console.log($("table.table tbody tr").first().html());
}

run();

run();
