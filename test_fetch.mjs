import Parser from 'rss-parser';

async function testFetch() {
  console.log("Testing Letterboxd...");
  try {
    const parser = new Parser({ headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
    const feed = await parser.parseURL('https://letterboxd.com/starletbean/rss/');
    console.log("Letterboxd Success! Items:", feed.items.length);
  } catch (e) {
    console.log("Letterboxd Error:", e.message);
  }

  console.log("\nTesting Goodreads...");
  try {
    const parser = new Parser({ headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } });
    const feed = await parser.parseURL('https://www.goodreads.com/review/list_rss/134004880-sai?shelf=read');
    console.log("Goodreads Success! Items:", feed.items.length);
  } catch (e) {
    console.log("Goodreads Error:", e.message);
  }

  console.log("\nTesting MyDramaList...");
  try {
    const res = await fetch('https://mydramalist.com/dramalist/sushversesai', {
      headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' }
    });
    console.log("MDL Status:", res.status);
  } catch (e) {
    console.log("MDL Error:", e.message);
  }
}

testFetch();
