async function testSizes() {
  const asin = 'B004U0QTU0'; // Scitec Whey (Failing)
  const urls = [
    `https://images-eu.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`,
    `https://images-eu.ssl-images-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`,
    `https://m.media-amazon.com/images/P/${asin}.01._SCLZZZZZZZ_.jpg`,
    `https://m.media-amazon.com/images/I/${asin}.jpg`, // Usually 404 but sometimes works
    `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`,
  ];

  for (const url of urls) {
    const res = await fetch(url);
    const buf = await res.arrayBuffer();
    console.log(`URL: ${url}`);
    console.log(`Status: ${res.status}, Bytes: ${buf.byteLength}\n`);
  }
}
testSizes().catch(console.error);
