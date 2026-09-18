const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

fetch('https://www.amazon.es/gp/bestsellers/?language=pt_PT', {
  headers: { 'User-Agent': UA, 'Accept-Language': 'pt-PT,pt;q=0.9' }
})
.then(r => r.text())
.then(html => {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  
  // Amazon bestsellers usually use .zg-grid-general-faceout
  const items = Array.from(document.querySelectorAll('.zg-grid-general-faceout, .p13n-sc-uncoverable-faceout')).slice(0, 5);
  
  const results = items.map(item => {
    const linkEl = item.querySelector('a.a-link-normal');
    const imgEl = item.querySelector('img');
    const titleEl = item.querySelector('div._cDEzb_p13n-sc-css-line-clamp-3_g3dy1') || item.querySelector('div[class*="line-clamp"]');
    const priceEl = item.querySelector('.p13n-sc-price') || item.querySelector('span.a-color-price');
    
    return {
      title: imgEl ? imgEl.alt : (titleEl ? titleEl.textContent : 'No Title'),
      url: linkEl ? 'https://www.amazon.es' + linkEl.href.split('?')[0] : 'No URL',
      image: imgEl ? imgEl.src : 'No Image',
      priceText: priceEl ? priceEl.textContent : 'No Price'
    };
  });
  
  console.log(JSON.stringify(results, null, 2));
});
