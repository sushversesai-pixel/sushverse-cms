import * as cheerio from 'cheerio';

async function testStyle3() {
  const url = 'https://mydramalist.com/dramalist/sushversesai?style=3';
  const apiKey = '68a82a9e268eb61573941d778c05e391';
  
  try {
    const res = await fetch(`http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // In style=3, covers are usually displayed. Let's see if there are any img tags inside li or div items
    const covers = $("img");
    console.log("Total images found with style=3:", covers.length);
    if (covers.length > 0) {
      covers.each((i, el) => {
        if (i < 5) {
          console.log("img src:", $(el).attr("src") || $(el).attr("data-src"));
        }
      });
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testStyle3();
