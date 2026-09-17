const url = 'https://www.amazon.es/dp/B004U0QTU0';
const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36' };

fetch(url, { headers })
  .then(r => r.text())
  .then(html => {
    // Tentar open graph
    const ogMatch = html.match(/<meta property="og:image" content="([^"]+)"/i);
    // Tentar JSON do landing image
    const landingMatch = html.match(/"large":"([^"]+)"/i);
    
    console.log('OG Image:', ogMatch ? ogMatch[1] : 'Not found');
    console.log('Landing Image:', landingMatch ? landingMatch[1] : 'Not found');
    
    if (html.includes('api-services-support@amazon.com')) {
      console.log('BOT DETECTED!');
    }
  }).catch(console.error);
