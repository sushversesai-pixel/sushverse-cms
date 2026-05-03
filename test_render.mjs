import * as cheerio from 'cheerio';

async function testRender() {
  const url = 'https://mydramalist.com/dramalist/sushversesai';
  const apiKey = '68a82a9e268eb61573941d778c05e391';
  
  console.log("Testing ScraperAPI with render=true...");
  try {
    const res = await fetch(`http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}&render=true`);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let imageCount = 0;
    $("table.table tbody tr").each((i, el) => {
      const title = $(el).find("a.title").text().trim();
      const img = $(el).find("img").attr("src") || $(el).find("img").attr("data-src") || $(el).find("a.title").attr("data-src");
      if (title && i < 5) {
        console.log(`Title: ${title}, Image: ${img}`);
      }
      if (img) imageCount++;
    });

    console.log("Total rows with images:", imageCount);
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testRender();
