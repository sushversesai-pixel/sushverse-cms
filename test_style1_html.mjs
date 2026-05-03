import * as cheerio from 'cheerio';

async function testStyle1HTML() {
  const url = 'https://mydramalist.com/dramalist/sushversesai?style=1';
  const apiKey = '68a82a9e268eb61573941d778c05e391';
  
  try {
    const res = await fetch(`http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // style=1 uses .col-xl-2 .col-lg-2 .col-md-3 .col-sm-4 .col-6 classes usually for grid
    const gridItem = $("li").first();
    console.log("First grid item HTML:");
    console.log(gridItem.html());
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testStyle1HTML();
