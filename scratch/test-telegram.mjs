const token = '8889237428:AAHE1qahwf3OkCZ9KHxXTVNkOoYSe7IDXpI';
const chat_id = '@radarofertaspt';

const text = `🚨 *TESTE DE SISTEMA BEM SUCEDIDO!* 🚨\n\n`
           + `📦 *Sony PlayStation 5 Slim*\n\n`
           + `💰 Preço: *€349.99* ~~(antes €449.99)~~\n`
           + `📉 Desconto: *22%*\n\n`
           + `🤖 O robô do RadarOfertas está oficialmente ligado ao canal e tem permissões para publicar!\n`
           + `\n🛒 *Compra aqui:* [Ver Oferta](https://radarofertas-psi.vercel.app)`;

async function test() {
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id,
      text,
      parse_mode: 'Markdown'
    })
  });
  const data = await res.json();
  console.log(data);
}
test();
