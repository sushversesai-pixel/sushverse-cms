async function testProxy() {
  const url = 'https://mydramalist.com/dramalist/sushversesai';
  
  console.log("Testing corsproxy.io...");
  try {
    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });
    console.log("Status:", res.status);
    const html = await res.text();
    console.log("Data Length:", html.length);
    if (html.includes("Cloudflare") || html.includes("Just a moment...")) {
        console.log("Blocked by Cloudflare via proxy.");
    } else {
        console.log("Successfully bypassed!");
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testProxy();
