async function testAPI() {
  try {
    const res = await fetch("https://mydramalist.com/v1/titles/699543", {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    console.log("Status:", res.status);
    const text = await res.text();
    console.log("Response:", text.substring(0, 100));
  } catch (e) {
    console.error("Error:", e.message);
  }
}
testAPI();
