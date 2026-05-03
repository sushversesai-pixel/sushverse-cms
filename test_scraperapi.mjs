import * as cheerio from 'cheerio';

async function testProxy() {
  const url = 'https://mydramalist.com/dramalist/sushversesai';
  const apiKey = '68a82a9e268eb61573941d778c05e391';
  
  console.log("Testing ScraperAPI...");
  try {
    const res = await fetch(`http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}`);
    const html = await res.text();
    console.log("Status:", res.status);
    
    const $ = cheerio.load(html);
    const titles = [];
    $("table.table tbody tr").each((i, el) => {
      const title = $(el).find("a.title").text().trim();
      if (title) titles.push(title);
    });

    console.log("Found Titles count:", titles.length);
    if (titles.length > 0) {
      console.log("First 5 titles:", titles.slice(0, 5));
    } else {
      console.log("No titles found. Might need JS rendering or different selector.");
      // check if it's Cloudflare
      if (html.includes("Cloudflare")) {
        console.log("Blocked by Cloudflare via ScraperAPI!");
      }
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testProxy();
