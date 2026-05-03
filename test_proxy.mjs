async function testProxy() {
  const url = 'https://mydramalist.com/dramalist/sushversesai';
  
  console.log("Testing api.allorigins.win...");
  try {
    const res = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    console.log("Status:", res.status);
    console.log("Data Length:", data.contents ? data.contents.length : 0);
    // Check if Cloudflare block is in the HTML
    if (data.contents && data.contents.includes("Cloudflare")) {
        console.log("Blocked by Cloudflare via proxy.");
    } else {
        console.log("Successfully bypassed!");
    }
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testProxy();
