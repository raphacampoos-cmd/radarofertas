const jsdom = require('jsdom');
const { JSDOM } = jsdom;

fetch('https://www.amazon.es/gp/bestsellers/?language=pt_PT', {
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
    'Accept-Language': 'pt-PT,pt;q=0.9'
  }
})
.then(r => r.text())
.then(html => {
  const dom = new JSDOM(html);
  const links = Array.from(dom.window.document.querySelectorAll('a'))
    .map(a => a.href)
    .filter(h => h.includes('/dp/'));
  
  // unique links
  const unique = [...new Set(links)];
  console.log(unique.slice(0, 10));
});
