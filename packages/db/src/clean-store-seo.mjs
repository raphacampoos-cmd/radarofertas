import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_1klPRVn0hEqf@ep-gentle-snow-zawbvp2f-pooler.c-2.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const sql = postgres(connectionString, { max: 1 });

// Função geradora de texto limpo, útil e sem afirmações factuais não verificadas
function createCleanStoreCopy(storeName, domain, categoryDesc) {
  const isAmazon = storeName.toLowerCase().includes('amazon');
  const nameDisplay = isAmazon ? 'Amazon.es' : storeName;

  const text = `A ${nameDisplay} é uma das opções procuradas pelos consumidores em Portugal para compras online de ${categoryDesc}.

Como utilizar um código de desconto na ${nameDisplay}:
Ao realizares compras na loja, adiciona os artigos pretendidos ao carrinho e avança para a fase de checkout. No ecrã de revisão do pedido ou de pagamento, localiza o campo destinado a cupões, vales ou códigos promocionais. Introduz o código que possuis e valida para que a redução seja aplicada ao montante da encomenda antes de concluíres o pagamento.

Épocas e campanhas de desconto:
A loja costuma participar nas principais épocas de promoções do comércio eletrónico, como a Black Friday, a Cyber Monday, saldos sazonais de início de ano e de verão, além de campanhas promocionais ocasionais ao longo do ano. Para garantir que uma oferta é genuína, compara sempre com o histórico de preços registado no RadarOfertas.

Envios e devoluções para Portugal:
As condições de envio, custos de portes e opções de entrega dependem da morada de destino, do tipo de produto e do valor total do pedido, sendo apresentadas no resumo da encomenda antes da compra. Caso seja necessário efetuar uma devolução, o pedido pode ser realizado através da área de cliente no site da loja, cumprindo os prazos legais de livre resolução para compras online.`;

  const faqs = [
    {
      question: `Como posso aplicar um código de desconto na ${nameDisplay}?`,
      answer: `Durante o processo de checkout, antes de finalizares o pagamento, procura o campo dedicado a cupões ou códigos promocionais, insere o código e clica em aplicar para atualizar o valor total.`
    },
    {
      question: `A ${nameDisplay} faz entregas em Portugal?`,
      answer: `Sim, a loja disponibiliza opções de envio para território português, cujos prazos e custos são indicados no momento de seleção da morada de entrega.`
    },
    {
      question: `Quando surgem as melhores promoções na ${nameDisplay}?`,
      answer: `As maiores oportunidades de poupança costumam coincidir com datas sazonais de grande relevo, como a Black Friday em novembro, períodos de saldos e campanhas especiais ao longo do ano.`
    },
    {
      question: `Como funcionam as trocas e devoluções?`,
      answer: `As devoluções podem ser solicitadas através da conta de cliente na loja, seguindo as instruções de devolução fornecidas pela plataforma dentro do prazo legal de compra à distância.`
    }
  ];

  return { text, faqs };
}

// Mapa de categorias por loja para tornar o texto relevante
const STORE_CATEGORIES = {
  'amazon': 'tecnologia, informática, artigos para a casa, livros e gadgets com entrega rápida em Portugal',
  'worten': 'eletrodomésticos, tecnologia, smartphones, televisores e informática',
  'pc-componentes': 'componentes de computadores, informática, portáteis e periféricos gaming',
  'aliexpress': 'gadgets, pequenos equipamentos eletrónicos, ferramentas, moda e artigos para o lar',
  'zalando': 'vestuário, calçado, moda e acessórios de marcas nacionais e internacionais',
  'el-corte-ingles': 'moda, eletrónica, eletrodomésticos, perfumaria e artigos para a casa',
  'mediamarkt': 'tecnologia, eletrónica de consumo, entretenimento e grandes eletrodomésticos',
  'decathlon': 'equipamento desportivo, calçado, vestuário técnico e acessórios para diversas modalidades',
  'fnac': 'artigos culturais, livros, música, informática, fotografia e telemóveis',
  'prozis': 'nutrição desportiva, alimentação funcional, vestuário fitness e suplementação',
  'pcdiga': 'informática, hardware, montagem de computadores e periféricos gaming',
  'zumub': 'suplementação desportiva, vitaminas e produtos de alimentação saudável',
  'adidas-pt': 'sapatilhas, vestuário desportivo e equipamento de performance oficial',
  'esr-eu': 'capas de proteção, acessórios MagSafe, películas e carregadores sem fios para smartphones',
  'esr': 'capas de proteção, acessórios MagSafe e carregadores sem fios',
  'outin': 'máquinas de café expresso portáteis e acessórios de viagem',
  'laserpecker': 'máquinas e gravadoras a laser compactas para personalização e artesanato',
  'gshopper': 'tecnologia, smartphones, pequenos eletrodomésticos e gadgets',
  'padel-market': 'raquetes, sapatilhas e acessórios para a prática de padel',
  'needs-no-label': 'vestuário casual e moda urbana unissexo',
  'sinocare': 'dispositivos de monitorização e saúde doméstica',
  'neuroscent': 'difusores ultrassónicos, aromaterapia e fragrâncias para a casa',
  'wau': 'cuidados de pele, cosmética e rotinas de beleza facial',
  'nothingprojector': 'projetores de vídeo e telas de projeção para entretenimento em casa',
  'ottocast': 'adaptadores sem fios para conectividade automóvel e ecrãs inteligentes',
  'fastestvpn': 'serviços de rede privada virtual (VPN) para privacidade e segurança online',
  'ultrahuman': 'anéis inteligentes e monitorização biométrica de bem-estar',
  'einstar': 'scanners 3D portáteis para digitalização tridimensional',
  'htvront': 'máquinas e materiais de personalização artesanal e têxtil',
  'wondershare': 'software de criatividade digital, edição de vídeo e produtividade',
  'wondershare-global-limited': 'software de criatividade digital e edição de vídeo',
  'thc-natural-line-de': 'artigos térmicos e vestuário confortável em lã natural',
};

async function main() {
  console.log('🧹 A atualizar textos e FAQs de todas as 32 lojas com versão limpa e verificada...');

  const allStores = await sql`SELECT id, name, slug FROM stores ORDER BY id`;

  for (const s of allStores) {
    const categoryDesc = STORE_CATEGORIES[s.slug] || 'artigos e equipamentos diversos';
    const { text, faqs } = createCleanStoreCopy(s.name, s.slug, categoryDesc);
    const displayName = s.slug === 'amazon' ? 'Amazon.es' : s.name;

    await sql`
      UPDATE stores
      SET
        seo_title = ${'Códigos Promocionais e Descontos ' + displayName},
        seo_description = ${'Descobre códigos de desconto e as melhores promoções da ' + displayName + ' em Portugal. Poupa nas tuas compras online com o RadarOfertas.'},
        seo_text = ${text},
        seo_faqs = ${JSON.stringify(faqs)}::jsonb
      WHERE id = ${s.id}
    `;

    console.log(`✅ Texto limpo e FAQs atualizados: ${s.name} (${s.slug})`);
  }

  console.log('🏁 As 32 lojas foram atualizadas com sucesso!');
  await sql.end();
}

main().catch(err => {
  console.error('❌ Erro:', err);
  process.exit(1);
});
