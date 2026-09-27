export interface CampaignConfig {
  slug: string
  name: string
  badge: string
  h1: string
  subtitle: string
  targetDate: string
  metaTitle: string
  metaDescription: string
  canonicalUrl: string
  newsletterTitle: string
  newsletterDescription: string
  guideTitle: string
  guideSections: Array<{
    title: string
    paragraphs: string[]
  }>
  faqs: Array<{
    question: string
    answer: string
  }>
}

export const CAMPAIGNS: Record<string, CampaignConfig> = {
  'black-friday': {
    slug: 'black-friday',
    name: 'Black Friday 2026',
    badge: '🔥 Evento do Ano',
    h1: 'Black Friday 2026 em Portugal – Melhores Ofertas e Códigos',
    subtitle: 'Rastreamos em tempo real as descidas de preço genuínas nas lojas mais populares em Portugal para não caíres em falsos descontos.',
    targetDate: '2026-11-27T00:00:00Z',
    metaTitle: 'Black Friday 2026 em Portugal – Melhores Ofertas e Códigos',
    metaDescription: 'Guia completo da Black Friday 2026 em Portugal: datas, histórico de preços real para evitar falsos descontos, cupões e as melhores ofertas verificadas.',
    canonicalUrl: 'https://radarofertas-psi.vercel.app/black-friday',
    newsletterTitle: 'Avisa-me das melhores ofertas da Black Friday',
    newsletterDescription: 'Recebe alertas no teu email logo que os nossos radares detetem mínimos históricos e quebras de preço reais. Sem spam e podes cancelar quando quiseres.',
    guideTitle: 'Guia Completo da Black Friday 2026 em Portugal',
    guideSections: [
      {
        title: 'Quando é a Black Friday 2026 em Portugal?',
        paragraphs: [
          'A Black Friday 2026 realiza-se oficialmente na sexta-feira, 27 de novembro de 2026. No entanto, a maioria dos retalhistas inicia semanas de promoções logo a partir do início de novembro, com a chamada "Black Week" a arrancar na semana do evento.',
          'Durante todo este período, as alterações de preço são frequentes e repentinas, pelo que ter um comparador atento faz toda a diferença para apanhar as melhores oportunidades antes que o stock esgote.',
        ],
      },
      {
        title: 'Como confirmar se um desconto é real e evitar fraudes',
        paragraphs: [
          'Em períodos de grande volume promocional, muitas lojas aumentam gradualmente os preços nas semanas anteriores para depois anunciarem reduções percentuais inflacionadas. No RadarOfertas usamos três mecanismos de verificação automática:',
          '1. Histórico de preços: Comparamos o preço anunciado com o histórico registado na nossa plataforma para identificar descidas reais.',
          '2. Alerta de Mínimo Histórico: Identificamos apenas quando um telemóvel, ecrã, consola ou eletrodoméstico atinge o valor mais baixo alguma vez registado na nossa base de dados.',
          '3. Algoritmo Deal Score: Cada promoção é pontuada de 0 a 100 com base na fiabilidade do comerciante e na consistência da descida de preço.',
        ],
      },
      {
        title: 'Lojas que costumamos acompanhar',
        paragraphs: [
          'No RadarOfertas monitorizamos diariamente a evolução de preços e códigos de desconto nas principais plataformas com envio para Portugal. Consulta as nossas páginas dedicadas para veres o histórico e promoções atuais:',
        ],
      },
    ],
    faqs: [
      {
        question: 'Quando é a Black Friday 2026 em Portugal?',
        answer: 'A Black Friday 2026 realiza-se a 27 de novembro de 2026. As campanhas de aquecimento costumam começar semanas antes, estendendo-se depois até à Cyber Monday na segunda-feira seguinte.',
      },
      {
        question: 'Como posso saber se uma promoção da Black Friday é verdadeira?',
        answer: 'Verifica sempre o histórico de preços. No RadarOfertas disponibilizamos o histórico de preços e indicamos o selo de Mínimo Histórico quando o preço atual é verdadeiramente o mais baixo registado.',
      },
      {
        question: 'As compras feitas na Black Friday têm direito a devolução?',
        answer: 'Sim. Em Portugal e na União Europeia as compras online beneficiam por lei de um prazo mínimo de 14 dias de reflexão para devolução, e diversas lojas alargam este prazo durante o período de compras festivas.',
      },
      {
        question: 'Como funciona o alerta de ofertas do RadarOfertas?',
        answer: 'Podes subscrever o nosso aviso por email ou seguir o canal oficial no Telegram. O nosso sistema envia notificações automáticas sempre que surge uma oferta com Deal Score elevado ou mínimo histórico confirmado.',
      },
    ],
  },

  'cyber-monday': {
    slug: 'cyber-monday',
    name: 'Cyber Monday 2026',
    badge: '💻 Especial Tecnologia',
    h1: 'Cyber Monday 2026 em Portugal – Descontos em Tecnologia e Gaming',
    subtitle: 'Descobre as maiores descidas de preço em computadores, componentes, telemóveis, periféricos e videojogos.',
    targetDate: '2026-11-30T00:00:00Z',
    metaTitle: 'Cyber Monday 2026 em Portugal – Descontos em Tecnologia e Gaming',
    metaDescription: 'Encontra as melhores promoções da Cyber Monday 2026 em Portugal. Tecnologia, telemóveis, informática e gaming com histórico de preços auditado.',
    canonicalUrl: 'https://radarofertas-psi.vercel.app/cyber-monday',
    newsletterTitle: 'Avisa-me das ofertas da Cyber Monday',
    newsletterDescription: 'Recebe alertas em primeira mão das descidas de preço e cupões de informática e tecnologia durante a Cyber Monday.',
    guideTitle: 'O que precisas de saber sobre a Cyber Monday 2026',
    guideSections: [
      {
        title: 'O que é a Cyber Monday e quando acontece?',
        paragraphs: [
          'A Cyber Monday decorre na primeira segunda-feira após a Black Friday, marcando o encerramento do fim de semana mais concorrido de compras do ano. Em 2026, tem lugar a 30 de novembro.',
          'Tradicionalmente focada no comércio eletrónico e em produtos tecnológicos, é a oportunidade perfeita para adquirir ecrãs, computadores portáteis, componentes de hardware, periféricos gaming e telemóveis com descontos suplementares.',
        ],
      },
      {
        title: 'Como aproveitar os descontos em eletrónica',
        paragraphs: [
          'O stock de produtos de tecnologia com descontos agressivos costuma esgotar com rapidez. Recomendamos definir previamente os modelos pretendidos e utilizar o nosso Deal Score para confirmar que a poupança anunciada é autêntica.',
        ],
      },
      {
        title: 'Lojas que costumamos acompanhar',
        paragraphs: [
          'Acompanhamos a evolução de preços e campanhas em lojas de tecnologia e grandes superfícies com expedição para Portugal:',
        ],
      },
    ],
    faqs: [
      {
        question: 'Quando se realiza a Cyber Monday 2026?',
        answer: 'A Cyber Monday 2026 acontece na segunda-feira, 30 de novembro de 2026.',
      },
      {
        question: 'Qual é a diferença entre a Black Friday e a Cyber Monday?',
        answer: 'Enquanto a Black Friday abrange todas as categorias de retalho, a Cyber Monday destaca-se especialmente em comércio digital, tecnologia, eletrónica de consumo, software e videojogos.',
      },
      {
        question: 'Os descontos da Cyber Monday são maiores do que os da Black Friday?',
        answer: 'Depende do artigo e do stock restante. Frequentemente surgem cupões de última oportunidade e liquidações pontuais em artigos tecnológicos que não esgotaram na sexta-feira anterior.',
      },
    ],
  },

  'singles-day': {
    slug: 'singles-day',
    name: 'Singles\' Day 2026 (11.11)',
    badge: '🛍️ Maior Festival Global',
    h1: '11.11 Singles\' Day 2026 em Portugal – Melhores Promoções',
    subtitle: 'Acompanha o maior festival global de compras com cupões especiais e descidas de preço em gadgets, acessórios e eletrónica.',
    targetDate: '2026-11-11T00:00:00Z',
    metaTitle: '11.11 Singles\' Day 2026 em Portugal – Melhores Promoções',
    metaDescription: 'Descobre as melhores pechinchas do Singles\' Day 11.11 em Portugal. Descontos em eletrónica, acessórios e gadgets com Deal Score transparente.',
    canonicalUrl: 'https://radarofertas-psi.vercel.app/singles-day',
    newsletterTitle: 'Avisa-me das melhores pechinchas do 11.11',
    newsletterDescription: 'Sê o primeiro a receber os cupões promocionais do Singles\' Day antes que fiquem sem utilizações.',
    guideTitle: 'Guia do Singles\' Day (11.11) 2026',
    guideSections: [
      {
        title: 'O que é o 11.11 Singles\' Day?',
        paragraphs: [
          'Celebrado a 11 de novembro (11/11), o Dia dos Solteiros (Singles\' Day) começou como uma celebração simbólica e transformou-se no maior dia mundial de vendas online, ultrapassando os volumes conjuntos da Black Friday e Cyber Monday.',
          'Em Portugal e na Europa, diversas marcas e lojas online aderem à data lançando códigos promocionais temporários e descontos diretos muito atrativos.',
        ],
      },
      {
        title: 'Dicas para poupar no 11.11',
        paragraphs: [
          'Muitos dos melhores negócios envolvem cupões de desconto que têm limites de utilização. O RadarOfertas verifica a validade dos códigos e filtra as promoções verdadeiras para que encontres as melhores oportunidades em tempo útil.',
        ],
      },
      {
        title: 'Lojas que costumamos acompanhar',
        paragraphs: [
          'Monitorizamos cupões ativos e campanhas especiais nas lojas que habitualmente acompanhamos:',
        ],
      },
    ],
    faqs: [
      {
        question: 'Quando é o Singles\' Day 2026?',
        answer: 'O Singles\' Day realiza-se todos os anos no dia 11 de novembro (11/11), antecipando em duas semanas a Black Friday.',
      },
      {
        question: 'Vale a pena comprar no 11.11 ou é melhor esperar pela Black Friday?',
        answer: 'Em gadgets, acessórios para telemóvel, pequenos aparelhos inteligentes e marcas diretas, o 11.11 tem frequentemente cupões únicos que igualam ou superam a Black Friday.',
      },
    ],
  },

  'natal': {
    slug: 'natal',
    name: 'Prendas de Natal 2026',
    badge: '🎁 Época Natalícia',
    h1: 'Prendas de Natal 2026 – Melhores Ideias e Descontos em Portugal',
    subtitle: 'Encontra os melhores presentes para a família com garantia de preço justo, histórico de preços e cupões atualizados.',
    targetDate: '2026-12-25T00:00:00Z',
    metaTitle: 'Prendas de Natal 2026 – Melhores Ideias e Descontos em Portugal',
    metaDescription: 'Ideias de prendas e descontos de Natal 2026 em Portugal. Compara preços, garante que compras ao melhor valor histórico e poupa nas compras natalícias.',
    canonicalUrl: 'https://radarofertas-psi.vercel.app/natal',
    newsletterTitle: 'Recebe as melhores ideias de presentes com desconto',
    newsletterDescription: 'Ideias originais de prendas de Natal com descontos comprovados entregues diretamente na tua caixa de correio eletrónico.',
    guideTitle: 'Guia de Compras e Prendas de Natal 2026',
    guideSections: [
      {
        title: 'Como antecipar as compras de Natal e poupar',
        paragraphs: [
          'Comprar as prendas de Natal com semanas de antecedência evita o aumento típico de preços em meados de dezembro, bem como atrasos na entrega dos serviços de transporte e estafetas.',
          'No RadarOfertas agrupamos promoções verificadas em brinquedos, tecnologia, eletrodomésticos e cuidado pessoal para que encontres o presente certo dentro do teu orçamento.',
        ],
      },
      {
        title: 'Prazos de devolução alargados',
        paragraphs: [
          'Muitas lojas online em Portugal oferecem políticas de devolução prolongadas durante a campanha de Natal (muitas vezes até meados ou final de janeiro), permitindo que quem recebe o presente possa efetuar uma troca se necessário.',
        ],
      },
      {
        title: 'Lojas que costumamos acompanhar',
        paragraphs: [
          'Descobre ofertas de Natal nas lojas que seguimos regularmente:',
        ],
      },
    ],
    faqs: [
      {
        question: 'Qual é a melhor altura para comprar presentes de Natal?',
        answer: 'Entre novembro (aproveitando o 11.11, Black Friday e Cyber Monday) e os primeiros dias de dezembro. Comprar cedo garante stock disponível e entregas atempadas antes do dia 24.',
      },
      {
        question: 'Como ter a certeza de que a encomenda chega antes do Natal?',
        answer: 'Verifica sempre a previsão de entrega indicada pela loja no momento da compra e procura encomendar com pelo menos uma a duas semanas de margem relativamente ao dia 24 de dezembro.',
      },
    ],
  },
}
