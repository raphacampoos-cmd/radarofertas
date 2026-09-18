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
  
  const items = Array.from(document.querySelectorAll('.zg-grid-general-faceout, .p13n-sc-uncoverable-faceout')).slice(0, 3);
  
  const results = items.map(item => {
    // try to find any text block inside
    const spans = Array.from(item.querySelectorAll('span, div')).map(e => e.textContent.trim()).filter(t => t.length > 20);
    return {
      spans
    };
  });
  
  console.log(JSON.stringify(results, null, 2));
});
