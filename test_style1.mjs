import * as cheerio from 'cheerio';

async function testStyle1() {
  const url = 'https://mydramalist.com/dramalist/sushversesai?style=1';
  const apiKey = '68a82a9e268eb61573941d778c05e391';
  
  try {
    const res = await fetch(`http://api.scraperapi.com/?api_key=${apiKey}&url=${encodeURIComponent(url)}`);
    const html = await res.text();
    const $ = cheerio.load(html);
    
    // Look for list items
    const listItems = $(".box");
    console.log("Total .box elements found:", listItems.length);
    if (listItems.length > 0) {
      listItems.each((i, el) => {
        if (i < 3) {
          const title = $(el).find(".title").text().trim();
          const img = $(el).find("img").attr("src") || $(el).find("img").attr("data-src");
          console.log(`Title: ${title}, Image: ${img}`);
        }
      });
    } else {
        const listItems2 = $("li");
        console.log("Total li elements found:", listItems2.length);
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testStyle1();
