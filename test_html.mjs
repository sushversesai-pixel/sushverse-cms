import * as cheerio from 'cheerio';

async function testHTML() {
  const url = 'https://mydramalist.com/dramalist/sushversesai?style=1';
  const apiKey = '68a82a9e268eb61573941d778c05e391';
  
  try {
    const res = await fetch(`http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}`);
    const html = await res.text();
    
    const matches = html.match(/https:\/\/i\.mydramalist\.com\/[a-zA-Z0-9_]+\.jpg/g);
    console.log("Found image links directly in HTML:", matches ? matches.length : 0);
    if (matches && matches.length > 0) {
      console.log(matches.slice(0, 5));
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testHTML();
