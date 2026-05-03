import * as cheerio from 'cheerio';

async function testCovers() {
  const url = 'https://mydramalist.com/dramalist/sushversesai';
  const apiKey = '68a82a9e268eb61573941d778c05e391';
  
  try {
    const res = await fetch(`http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    const firstRow = $("table.table tbody tr").first();
    console.log("First Row HTML:");
    console.log(firstRow.html());
    
    const img = firstRow.find("img");
    console.log("\nImage tags found:", img.length);
    if (img.length > 0) {
      console.log("src:", img.attr("src"));
      console.log("data-src:", img.attr("data-src"));
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testCovers();
