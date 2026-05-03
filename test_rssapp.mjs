import Parser from 'rss-parser';

async function checkFeeds() {
  const parser = new Parser();
  const feed1 = await parser.parseURL('https://rss.app/feeds/7x7QHhV4tfOvjeLw.xml');
  console.log("Feed 1 Title:", feed1.title);
  console.log("Feed 1 First Item:", JSON.stringify(feed1.items[0], null, 2));

  console.log("\n------------------\n");

  const feed2 = await parser.parseURL('https://rss.app/feeds/5GpQMfDKStj5cxI7.xml');
  console.log("Feed 2 Title:", feed2.title);
  console.log("Feed 2 First Item:", JSON.stringify(feed2.items[0], null, 2));
}

checkFeeds().catch(console.error);
