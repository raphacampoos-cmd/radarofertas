import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_1klPRVn0hEqf@ep-gentle-snow-zawbvp2f-pooler.c-2.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const sql = postgres(connectionString, { max: 1 });

const storesData = [
  // ── 1. NOVAS LOJAS POPULARES EM PORTUGAL ──────────────────────────────────
  {
    name: 'PC Componentes',
    slug: 'pc-componentes',
    website: 'https://www.pccomponentes.pt',
    country: 'ES',
    affiliateNetwork: 'direct',
    affiliateTag: null,
    commissionMin: '0.0300',
    commissionMax: '0.0600',
    reliability: '0.96',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos PC Componentes',
    seoDescription: 'Encontra os melhores cupões de desconto e promoções na PC Componentes para Portugal. Poupa em informática, componentes de PC, portáteis e gaming.',
    seoText: `A PC Componentes é uma das lojas de tecnologia e informática mais procuradas pelos consumidores em Portugal, destacando-se pelo catálogo especializado em componentes para PC, computadores de secretária pré-configurados, portáteis e periféricos gaming.

Como utilizar um código promocional na PC Componentes:
Para aplicar um código de desconto na PC Componentes, seleciona os artigos pretendidos e acede ao carrinho de compras. No ecrã de resumo antes do pagamento, localiza o campo indicado como "Tens um código promocional?" ou "Cupão". Insere o teu código e clica em aplicar. O desconto será refletido automaticamente no total a liquidar.

Principais campanhas e momentos de poupança:
A PC Componentes realiza eventos promocionais de grande escala ao longo do ano. O mais emblemático é o "PcDays", realizado habitualmente em julho, além da Black Friday em novembro, dos Dias Laranjas e de promoções dedicadas a marcas específicas de hardware (como ASUS, MSI ou Corsair).

Envios e devoluções para Portugal:
As encomendas expedidas para Portugal continental chegam habitualmente em 24 a 48 horas úteis, com tracking detalhado. Os equipamentos beneficiam de 3 anos de garantia legal em Portugal. O processo de devolução e garantia é gerido online, com recolha por transportadora no domicílio ou entrega em pontos autorizados.`,
    seoFaqs: [
      {
        question: 'Onde introduzir o código de desconto na PC Componentes?',
        answer: 'No carrinho de compras da PC Componentes, procura a opção "Tens um código promocional?", insere o código alfanumérico e clica em aplicar antes de efetuares o pagamento.'
      },
      {
        question: 'A PC Componentes entrega rapidamente em Portugal?',
        answer: 'Sim, para Portugal continental o prazo habitual de entrega situa-se entre 24 e 48 horas úteis através de empresas transportadoras parceiras.'
      },
      {
        question: 'Quais são as melhores épocas de descontos na PC Componentes?',
        answer: 'As datas com maiores reduções de preço são os PcDays (em julho), a Black Friday (em novembro), a Cyber Week e os Dias Laranjas ao longo do ano.'
      },
      {
        question: 'Como funciona a garantia na PC Componentes?',
        answer: 'Todos os produtos novos adquiridos na PC Componentes têm 3 anos de garantia legal. Em caso de anomalia, o processo de assistência (RMA) pode ser aberto na área de cliente com recolha ao domicílio.'
      }
    ]
  },
  {
    name: 'AliExpress',
    slug: 'aliexpress',
    website: 'https://pt.aliexpress.com',
    country: 'CN',
    affiliateNetwork: 'direct',
    affiliateTag: null,
    commissionMin: '0.0300',
    commissionMax: '0.0900',
    reliability: '0.90',
    active: true,
    seoTitle: 'Códigos Promocionais e Cupões AliExpress',
    seoDescription: 'Descobre os melhores cupões e códigos promocionais do AliExpress para Portugal. Poupas em gadgets, eletrónica, ferramentas e moda com entregas rápidas.',
    seoText: `O AliExpress é um dos maiores marketplaces globais do mundo, disponibilizando milhões de produtos diretamente de fabricantes e revendedores a preços de fábrica, com especial foco em eletrónica, pequenos gadgets, vestuário e produtos para o lar.

Como aplicar códigos promocionais no AliExpress:
No AliExpress é possível acumular diferentes tipos de descontos: códigos gerais da plataforma, cupões de vendedores e descontos por moedas. No momento da encomenda (checkout), insere o código no campo "Código Promocional" à direita do resumo do pedido e valida para aplicar a dedução.

Grandes épocas de desconto no AliExpress:
O maior evento do ano no AliExpress é o Festival Global de Compras 11.11 (Dia dos Solteiros em novembro), com descontos profundos em todo o catálogo. Outros momentos fortes incluem o Aniversário do AliExpress em março, os "Choice Days" no início de cada mês e os saldos de Verão em junho.

Envios, alfândega e prazos para Portugal:
Para entregas em Portugal, as compras elegíveis na secção "Choice" ou enviadas de armazéns europeus contam com prazos de entrega reduzidos (frequentemente de 5 a 10 dias). No que diz respeito a taxas, o AliExpress recolhe o IVA à taxa legal portuguesa no ato da compra através do sistema europeu IOSS para encomendas até 150€, evitando retenções alfandegárias inesperadas.`,
    seoFaqs: [
      {
        question: 'Como aplicar cupões e códigos promocionais no AliExpress?',
        answer: 'No ecrã de confirmação do pedido, introduz o código promocional no campo correspondente antes de selecionar o método de pagamento para que o desconto seja abatido.'
      },
      {
        question: 'As compras no AliExpress pagam alfândega em Portugal?',
        answer: 'Para compras até 150€, o AliExpress cobra o IVA português diretamente no checkout (sistema IOSS), pelo que a encomenda chega a Portugal sem taxas alfandegárias adicionais.'
      },
      {
        question: 'O que é o serviço AliExpress Choice?',
        answer: 'O Choice é o serviço logístico próprio do AliExpress que oferece produtos selecionados com envios mais rápidos (geralmente entre 5 e 10 dias para Portugal), portes grátis a partir de um valor mínimo e devoluções simplificadas.'
      },
      {
        question: 'Quando é o 11.11 no AliExpress?',
        answer: 'O Festival 11.11 ocorre todos os anos em novembro (com aquecimento nos primeiros dias e pico a 11 de novembro), sendo a maior campanha de descontos do ano no marketplace.'
      }
    ]
  },
  {
    name: 'Zalando',
    slug: 'zalando',
    website: 'https://www.zalando.pt',
    country: 'DE',
    affiliateNetwork: 'direct',
    affiliateTag: null,
    commissionMin: '0.0400',
    commissionMax: '0.0800',
    reliability: '0.97',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos Zalando Portugal',
    seoDescription: 'Encontra os melhores cupões de desconto e saldos da Zalando para Portugal. Vestuário, calçado, malas e moda de marca com portes e devoluções grátis.',
    seoText: `A Zalando é uma das principais referências europeias no comércio eletrónico de moda, calçado e acessórios, disponibilizando um catálogo de centenas de marcas internacionais com um portal dedicado aos consumidores portugueses (Zalando.pt).

Como utilizar um código de desconto na Zalando:
Após escolheres os artigos de vestuário ou calçado, acede ao saco de compras e clica em finalizar encomenda. No passo de confirmação do pagamento, localiza a secção "Tens um vale de desconto?". Introduz o código promocional e confirma a sua aplicação para verificar a redução imediata no valor final.

Campanhas e saldos na Zalando:
A Zalando destaca-se pelas campanhas sazonais de saldos de Inverno e de Verão, pelas vendas de meia-estação (Mid-Season Sale) e pela Cyber Week / Black Friday em novembro. Além disso, a plataforma disponibiliza com frequência campanhas promocionais de percentagem extra em artigos já com desconto.

Entregas e política de devoluções em Portugal:
A Zalando oferece uma experiência de compra conveniente com portes gratuitos em encomendas elegíveis e uma das políticas de devolução mais generosas do mercado, permitindo devolver artigos até 100 dias após a receção, de forma totalmente gratuita, através de pontos de entrega parceiros ou recolha ao domicílio.`,
    seoFaqs: [
      {
        question: 'Onde insiro o vale ou código promocional na Zalando?',
        answer: 'Na etapa final de pagamento da encomenda na Zalando, clica na opção "Tens um vale de desconto?", digita o código e clica em resgatar.'
      },
      {
        question: 'A Zalando cobra portes de envio para Portugal?',
        answer: 'A Zalando oferece entregas gratuitas para Portugal em encomendas que atinjam o valor mínimo estipulado no site. Abaixo desse valor é aplicada uma taxa de envio padrão.'
      },
      {
        question: 'Quanto tempo tenho para devolver um artigo na Zalando?',
        answer: 'A Zalando disponibiliza um prazo alargado de 100 dias para devoluções gratuitas, desde que os produtos se encontrem nas condições originais com as respetivas etiquetas.'
      },
      {
        question: 'Como funciona o processo de devolução gratuito?',
        answer: 'Podes solicitar a devolução na tua área de cliente da Zalando, imprimir a etiqueta de envio pré-paga e entregar o pacote num ponto de recolha autorizado ou agendar recolha ao domicílio.'
      }
    ]
  },
  {
    name: 'El Corte Inglés',
    slug: 'el-corte-ingles',
    website: 'https://www.elcorteingles.pt',
    country: 'PT',
    affiliateNetwork: 'direct',
    affiliateTag: null,
    commissionMin: '0.0300',
    commissionMax: '0.0700',
    reliability: '0.98',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos El Corte Inglés',
    seoDescription: 'Descobre códigos de desconto e as melhores campanhas promocionais do El Corte Inglés em Portugal. Moda, eletrodomésticos, tecnologia, perfumaria e casa.',
    seoText: `O El Corte Inglés é um dos grandes armazéns de retalho mais prestigiados na Península Ibérica, marcando forte presença em Portugal tanto através dos seus centros comerciais em Lisboa e Vila Nova de Gaia como na sua plataforma de comércio eletrónico.

Como utilizar um código promocional no El Corte Inglés online:
No processo de compra no site do El Corte Inglés, depois de reunires os teus artigos no carrinho, avança para o ecrã de pagamento. No campo identificado como "Código promocional" ou "Cupão", introduz o código que possuis e valida. O montante correspondente é subtraído ao total antes da autorização do pagamento.

Momentos altos de descontos e promoções:
O El Corte Inglés é conhecido pelas suas campanhas clássicas ao longo do ano, tais como os Dias de Ouro, as Vendas Privadas para titulares de cartão da loja, as campanhas com devolução em talão de desconto para compras futuras, e os tradicionais saldos de Janeiro e Julho, sem esquecer a Black Friday.

Opções de entrega e levantamento em Portugal:
Nas compras efetuadas online, o El Corte Inglés disponibiliza entrega ao domicílio com possibilidade de agendamento em grandes eletrodomésticos, bem como o serviço Click & Collect e Click & Car para levantamento rápido e sem custos nos grandes armazéns ou em postos de abastecimento parceiros.`,
    seoFaqs: [
      {
        question: 'Onde aplicar o código promocional no site do El Corte Inglés?',
        answer: 'No passo de pagamento e resumo da tua encomenda online, insere o código na caixa "Código promocional" e confirma a validação antes de pagar.'
      },
      {
        question: 'O que é o serviço Click & Collect do El Corte Inglés?',
        answer: 'É um serviço que permite encomendar artigos online e fazer o levantamento gratuito nos grandes armazéns do El Corte Inglés ou em pontos parceiros selecionados.'
      },
      {
        question: 'Quais são as principais épocas de saldos no El Corte Inglés?',
        answer: 'Destacam-se os Dias de Ouro, os Saldos de Inverno (janeiro/fevereiro), os Saldos de Verão (julho/agosto), a Black Friday e as campanhas de devolução em talão.'
      },
      {
        question: 'Como posso devolver artigos comprados na loja online?',
        answer: 'Podes devolver as tuas compras online diretamente no balcão de apoio ao cliente de um dos armazéns em Portugal ou agendar a recolha ao domicílio através do site.'
      }
    ]
  },
  {
    name: 'MediaMarkt',
    slug: 'mediamarkt',
    website: 'https://mediamarkt.pt',
    country: 'PT',
    affiliateNetwork: 'direct',
    affiliateTag: null,
    commissionMin: '0.0200',
    commissionMax: '0.0500',
    reliability: '0.96',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos MediaMarkt Portugal',
    seoDescription: 'Encontra os melhores cupões de desconto e promoções na MediaMarkt em Portugal. TV, smartphones, grandes eletrodomésticos, informática e consolas.',
    seoText: `A MediaMarkt é uma das maiores cadeias europeias de retalho de eletrónica de consumo, eletrodomésticos e entretenimento, com ampla presença em Portugal através de lojas físicas e da sua loja online.

Como aplicar um código promocional na MediaMarkt:
No carrinho de compras da MediaMarkt online, na página de resumo da encomenda ou no processo de checkout, localiza a opção para inserir códigos de desconto ou cupões promocionais. Insere o código e valida para deduzir o valor da campanha ao total da compra.

Campanhas populares e descontos:
A MediaMarkt é famosa por campanhas marcantes como os "Dias Sem IVA", as promoções noturnas "Red Night", as campanhas de aniversário com produtos a preço de custo e a época da Black Friday em novembro.

Modalidades de entrega e recolha em loja:
A loja disponibiliza opções de entrega ao domicílio com serviços adicionais de instalação e recolha do equipamento antigo para grandes eletrodomésticos. Permite ainda o levantamento gratuito em loja física (Pick-up em loja) para encomendas elegíveis.`,
    seoFaqs: [
      {
        question: 'Como funciona a campanha dos Dias Sem IVA na MediaMarkt?',
        answer: 'Durante os Dias Sem IVA, a MediaMarkt aplica um desconto equivalente ao valor do imposto (23% ou valor correspondente deduzido no PVP) em categorias e produtos selecionados.'
      },
      {
        question: 'Posso levantar a minha encomenda gratuitamente numa loja MediaMarkt?',
        answer: 'Sim, a opção de levantamento em loja física é gratuita para a grande maioria dos produtos encomendados através do site da MediaMarkt.'
      },
      {
        question: 'Quais são as épocas com maiores descontos na MediaMarkt?',
        answer: 'Destacam-se a Black Friday em novembro, os Dias Sem IVA, as campanhas Red Night e os saldos sazonais de início de ano.'
      },
      {
        question: 'Como funcionam as devoluções de compras na MediaMarkt?',
        answer: 'Podes efetuar a devolução de artigos comprados online dirigindo-te a qualquer loja física MediaMarkt em Portugal ou solicitando a recolha à distância na tua área de cliente.'
      }
    ]
  },
  {
    name: 'Decathlon',
    slug: 'decathlon',
    website: 'https://www.decathlon.pt',
    country: 'PT',
    affiliateNetwork: 'direct',
    affiliateTag: null,
    commissionMin: '0.0300',
    commissionMax: '0.0600',
    reliability: '0.97',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos Decathlon Portugal',
    seoDescription: 'Descobre códigos de desconto e promoções na Decathlon em Portugal. Roupa desportiva, calçado, bicicletas, fitness e equipamento para dezenas de modalidades.',
    seoText: `A Decathlon é a maior referência de retalho desportivo em Portugal, conhecida pela acessibilidade dos seus produtos e pela inovação das suas marcas próprias (como Kipsta, Domyos, Quechua, Btwin e Kalenji), cobrindo dezenas de desportos para todos os níveis de prática.

Como usar um código promocional na Decathlon:
No checkout do site da Decathlon, antes de escolheres a forma de pagamento, encontras a caixa para introduzir "Código Promocional" ou "Cartão Presente / Vale". Insere o teu código de desconto ou vale de fidelidade e clica em aplicar.

Vantagens do programa de fidelidade e promoções:
O Clube Decathlon permite acumular pontos com todas as compras, que podem ser convertidos em vouchers de desconto direto. A loja realiza com regularidade campanhas de "Fim de Coleção", promoções especiais de Verão e Inverno, e a campanha Trocathlon para compra e venda de equipamento usado.

Entregas e recolhas gratuitas:
A Decathlon disponibiliza o serviço Click & Collect gratuito, permitindo encomendar online e levantar o artigo na loja física mais próxima em apenas 2 horas (para artigos em stock). As entregas ao domicílio têm custos reduzidos e política de devolução alargada para utilizadores com conta Decathlon.`,
    seoFaqs: [
      {
        question: 'Onde introduzo o código promocional na Decathlon online?',
        answer: 'No carrinho ou no ecrã de pagamento do site da Decathlon, insere o teu código ou vale na opção indicada e valida para abater o valor na encomenda.'
      },
      {
        question: 'Como funciona o levantamento gratuito em loja na Decathlon?',
        answer: 'Através do serviço Click & Collect podes levantar gratuitamente a tua encomenda online em qualquer loja Decathlon de Portugal, muitas vezes em apenas 2 horas.'
      },
      {
        question: 'O que é o programa de pontos Clube Decathlon?',
        answer: 'É o programa de fidelidade gratuito da Decathlon que acumula pontos a cada compra, permitindo gerar vales de desconto para utilizar em encomendas futuras.'
      },
      {
        question: 'Qual é o prazo de devolução na Decathlon?',
        answer: 'Para clientes com conta Decathlon registada, o prazo de devolução e troca pode chegar a vários meses ou até 2 anos em produtos de marca própria, mediante apresentação da fatura digital.'
      }
    ]
  },

  // ── 2. LOJAS EXISTENTES NA BASE DE DADOS A ATUALIZAR COM TEXTO E FAQS ─────
  {
    name: 'Fnac',
    slug: 'fnac',
    website: 'https://www.fnac.pt',
    country: 'PT',
    affiliateNetwork: 'awin',
    affiliateTag: null,
    commissionMin: '0.0200',
    commissionMax: '0.0600',
    reliability: '0.98',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos Fnac Portugal',
    seoDescription: 'Encontra os melhores cupões de desconto e promoções da Fnac em Portugal. Poupas em livros, smartphones, portáteis, gaming e eletrodomésticos.',
    seoText: `A Fnac é um dos maiores nomes do retalho cultural e tecnológico em Portugal, oferecendo uma vasta gama de produtos que engloba literatura, música, informática, fotografia, telemóveis e grandes eletrodomésticos, tanto através das suas lojas físicas como do site Fnac.pt.

Como utilizar um código promocional na Fnac:
Durante a finalização da tua encomenda na Fnac.pt, acede à página de seleção do meio de pagamento. Localiza a secção dedicada a "Código Promocional" ou "Cartão Oferta". Insere o teu código alfanumérico e clica em validar para abater o desconto no total da encomenda antes de pagar.

Campanhas emblemáticas e Cartão FNAC:
A Fnac promove campanhas regulares de grande impacto, nomeadamente os Dias Aderente (com descontos exclusivos de 10% a 20% em tecnologia e livros para membros), a Black Friday, a Cyber Week e as campanhas sazonais de saldos. Os aderentes ao Cartão FNAC beneficiam ainda de descontos imediatos de 5% em livros e tecnologia selecionada.

Entregas e recolhas em Portugal:
A loja online oferece o serviço de Click & Collect gratuito, permitindo levantar artigos com stock disponível numa loja Fnac à escolha em cerca de 1 hora. Os membros do Cartão FNAC beneficiam frequentemente de portes de envio gratuitos ao domicílio, e as devoluções podem ser realizadas de forma prática em qualquer loja física no país.`,
    seoFaqs: [
      {
        question: 'Onde coloco o código promocional no site da Fnac?',
        answer: 'No passo de pagamento da tua encomenda na Fnac.pt, localiza o campo "Código Promocional / Cartão de Desconto", insere o código e clica em validar antes de finalizar o pedido.'
      },
      {
        question: 'Quais as vantagens do Cartão FNAC nas compras online?',
        answer: 'O Cartão FNAC oferece descontos diretos de 5% em livros e tecnologia, portes grátis em milhares de artigos, acesso prioritário a campanhas exclusivas e acumulação de saldo em cartão.'
      },
      {
        question: 'É possível levantar compras online gratuitamente numa loja Fnac?',
        answer: 'Sim, o serviço Click & Collect da Fnac permite levantar a tua encomenda gratuitamente em qualquer loja física de Portugal continental e ilhas, muitas vezes em apenas 1 hora.'
      },
      {
        question: 'Como funciona a política de devolução na Fnac?',
        answer: 'Podes devolver artigos comprados online no prazo de 14 dias (ou alargado para aderentes) dirigindo-te diretamente a uma loja Fnac em Portugal com a fatura de compra.'
      }
    ]
  },
  {
    name: 'Prozis',
    slug: 'prozis',
    website: 'https://www.prozis.com/pt',
    country: 'PT',
    affiliateNetwork: 'direct',
    affiliateTag: 'RADAROFERTAS',
    commissionMin: '0.0800',
    commissionMax: '0.1500',
    reliability: '0.98',
    active: true,
    seoTitle: 'Códigos Promocionais e Cupões Prozis Portugal',
    seoDescription: 'Descobre os melhores cupões de desconto Prozis válidos em Portugal. Utiliza o código RADAROFERTAS para poupar em nutrição desportiva, snacks e vestuário.',
    seoText: `A Prozis é a marca líder europeia em nutrição desportiva, alimentação funcional, vestuário desportivo e pequenos eletrodomésticos para um estilo de vida ativo e saudável, desenvolvendo e fabricando grande parte do seu portfólio em Portugal.

Como utilizar o cupão de desconto na Prozis:
Ao fazeres as tuas compras no site ou na app da Prozis, adiciona os artigos ao carrinho. No ecrã de revisão do pedido, antes de avançares para o pagamento, localiza o campo "Código Promocional / Cupão". Insere o código RADAROFERTAS e clica em aplicar para desbloquear ofertas exclusivas e descontos adicionais no montante total.

Campanhas de descontos e Prozis Points:
A Prozis dinamiza campanhas semanais temáticas com oferta de produtos (brindes por escalões de valor), campanhas especiais de Black Friday, saldos de Verão e descontos por acumulação de Prozis Points, que podem ser trocados por produtos gratuitos em compras posteriores.

Entregas rápidas e devoluções em Portugal:
Com armazém central localizado em Portugal, as encomendas para Portugal continental são habitualmente entregues em 24 a 48 horas úteis através de transportadoras de referência. Os portes de envio são gratuitos em encomendas que atinjam o valor mínimo elegível, com opção de entrega ao domicílio ou em pontos de recolha parceiros.`,
    seoFaqs: [
      {
        question: 'Qual é o código promocional Prozis com desconto?',
        answer: 'Podes utilizar o código RADAROFERTAS no carrinho de compras da Prozis para garantir descontos e produtos de oferta exclusivos na tua encomenda.'
      },
      {
        question: 'Onde introduzo o cupão de desconto no site da Prozis?',
        answer: 'No carrinho de compras da Prozis, procura o campo "Código Promocional", digita RADAROFERTAS e clica em aplicar antes de selecionar o meio de pagamento.'
      },
      {
        question: 'A Prozis oferece portes de envio gratuitos para Portugal?',
        answer: 'Sim, as encomendas para Portugal continental beneficiam de portes grátis quando o valor total atinge o montante mínimo estipulado no site da Prozis.'
      },
      {
        question: 'Qual é o prazo habitual de entrega das encomendas da Prozis?',
        answer: 'Para Portugal continental, o prazo típico de entrega é de 24 a 48 horas úteis após a confirmação do pagamento, com acompanhamento de envio por SMS ou email.'
      }
    ]
  },
  {
    name: 'PCDIGA',
    slug: 'pcdiga',
    website: 'https://www.pcdiga.com',
    country: 'PT',
    affiliateNetwork: 'direct',
    affiliateTag: null,
    commissionMin: '0.0300',
    commissionMax: '0.0600',
    reliability: '0.96',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos PCDIGA',
    seoDescription: 'Encontra os melhores descontos e promoções na PCDIGA em Portugal. Poupança em computadores, hardware, monitores, smartphones e gaming.',
    seoText: `A PCDIGA é uma das maiores especialistas nacionais no comércio de informática, hardware, periféricos gaming e eletrónica de consumo em Portugal, combinando uma forte loja online com uma rede abrangente de lojas físicas em vários pontos do país.

Como utilizar um código promocional na PCDIGA:
Para descontar um código na PCDIGA, adiciona os artigos ao teu carrinho e acede ao ecrã de checkout. Localiza o espaço reservado para "Código Promocional" ou "Cupão", introduz o código que possuis e clica no botão de validação. O valor a pagar é recalculado antes da confirmação do método de pagamento.

Campanhas e momentos de poupança:
A PCDIGA organiza regularmente campanhas temáticas muito concorridas, como os "Mega Saldos", as promoções especiais de fim de semana, a Black Friday, a Cyber Monday e campanhas direcionadas para montagem de computadores à medida com componentes selecionados.

Entregas e levantamento gratuito em loja:
A PCDIGA permite o levantamento gratuito das compras online em qualquer uma das suas lojas físicas em Portugal (Lisboa, Porto, Braga, Leiria, Coimbra, Sintra, entre outras). Os envios ao domicílio são expedidos rapidamente por transportadora com número de seguimento. Todos os artigos novos incluem garantia legal de 3 anos.`,
    seoFaqs: [
      {
        question: 'Onde introduzo o cupão de desconto na PCDIGA?',
        answer: 'No carrinho de compras da PCDIGA, insere o teu código promocional no campo correspondente e clica em validar antes de avançares para o pagamento.'
      },
      {
        question: 'Posso levantar a minha encomenda numa loja PCDIGA sem pagar portes?',
        answer: 'Sim, a PCDIGA disponibiliza o levantamento gratuito em qualquer uma das suas lojas físicas espalhadas por Portugal continental.'
      },
      {
        question: 'Quais as melhores épocas de descontos na PCDIGA?',
        answer: 'Destacam-se a Black Friday em novembro, os Mega Saldos sazonais e as campanhas promocionais de fim de semana em hardware e periféricos.'
      },
      {
        question: 'Qual é o prazo de garantia dos produtos na PCDIGA?',
        answer: 'De acordo com a legislação portuguesa, todos os produtos de consumo novos comercializados pela PCDIGA beneficiam de 3 anos de garantia legal contra defeitos de fabrico.'
      }
    ]
  },
  {
    name: 'Zumub',
    slug: 'zumub',
    website: 'https://www.zumub.com/pt',
    country: 'PT',
    affiliateNetwork: 'direct',
    affiliateTag: 'RADAROFERTAS',
    commissionMin: '0.0800',
    commissionMax: '0.1200',
    reliability: '0.97',
    active: true,
    seoTitle: 'Códigos Promocionais e Cupões Zumub Portugal',
    seoDescription: 'Descobre códigos de desconto e cupões para a Zumub em Portugal. Usa o código RADAROFERTAS para poupar em suplementação, proteínas, creatinas e saúde.',
    seoText: `A Zumub é uma das principais plataformas de nutrição desportiva e suplementação alimentar em Portugal, disponibilizando milhares de produtos de marca própria e das principais marcas internacionais de fitness a preços altamente competitivos.

Como usar um código promocional na Zumub:
No carrinho de compras do site da Zumub, antes de clicares para finalizar a encomenda, encontras o campo "Código de Desconto / Cupão". Escreve o código RADAROFERTAS e valida. O desconto em percentagem e as respetivas ofertas promocionais são adicionados de imediato à tua encomenda.

Promoções diárias e pontos Zumub:
A Zumub oferece promoções rotativas diárias em categorias populares (como whey protein, creatina e aveia), ofertas especiais de fim de semana e campanhas de Black Friday. Adicionalmente, o programa de pontos da loja permite abater saldo acumulado em encomendas subsequentes.

Entregas rápidas em 24h para Portugal:
Com logística baseada em território nacional, a Zumub oferece um dos serviços de entrega mais rápidos do mercado, com encomendas entregues em 24 horas úteis em Portugal continental. Os portes de envio são gratuitos para encomendas que perfaçam o valor mínimo estabelecido.`,
    seoFaqs: [
      {
        question: 'Qual é o cupão de desconto ativo na Zumub?',
        answer: 'Podes utilizar o cupão RADAROFERTAS no checkout da Zumub para obter desconto direto e produtos de oferta adicionais no teu carrinho.'
      },
      {
        question: 'Onde coloco o código de desconto na Zumub?',
        answer: 'No carrinho de compras da Zumub, procura a caixa "Código de Desconto / Cupão", introduz RADAROFERTAS e clica em aplicar antes de efetuar o pagamento.'
      },
      {
        question: 'A Zumub entrega em 24 horas em Portugal?',
        answer: 'Sim, a vasta maioria das encomendas finalizadas e pagas em dias úteis é entregue em Portugal continental no prazo de 24 horas úteis.'
      },
      {
        question: 'Como conseguir portes grátis na Zumub?',
        answer: 'Basta que o total das tuas compras atinja o valor mínimo de encomenda estipulado no site da Zumub para beneficiares de portes de envio totalmente gratuitos.'
      }
    ]
  },
  {
    name: 'adidas PT',
    slug: 'adidas-pt',
    website: 'https://www.adidas.pt',
    country: 'PT',
    affiliateNetwork: 'awin',
    affiliateTag: '77026',
    commissionMin: '0.0500',
    commissionMax: '0.1000',
    reliability: '0.98',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos adidas Portugal',
    seoDescription: 'Encontra os melhores códigos de desconto e promoções oficiais da adidas em Portugal. Sapatilhas, fatos de treino e vestuário desportivo com desconto adiClub.',
    seoText: `A adidas é uma das maiores marcas mundiais de vestuário, calçado e acessórios desportivos, com loja online oficial em Portugal (adidas.pt) que disponibiliza desde os modelos de moda urbana mais icónicos (como Samba, Gazelle e Stan Smith) até equipamento técnico de alta performance.

Como utilizar um código promocional na adidas:
No cesto de compras da loja oficial da adidas em Portugal, clica em "Resumo do Pedido". Abre o campo "Código Promocional" ou "Voucher", introduz o teu código e clica em aplicar. O desconto é calculado de imediato sobre os produtos elegíveis.

Benefícios do programa adiClub e campanhas:
O programa de membros gratuito adiClub oferece vantagens decisivas aos utilizadores em Portugal: acesso antecipado a lançamentos de sapatilhas, descontos exclusivos de membro e vouchers comemorativos de aniversário. A marca realiza ainda grandes saldos de fim de estação, campanhas de Black Friday e semanas de desconto para membros.

Envios e devoluções para Portugal:
Os membros do adiClub têm portes de envio gratuitos na maioria das encomendas para Portugal. A política de devolução é simples e sem encargos adicionais, concedendo um prazo confortável de até 30 ou 60 dias para devolução através de pontos de recolha parceiros em Portugal.`,
    seoFaqs: [
      {
        question: 'Onde aplicar o código promocional no site da adidas?',
        answer: 'No carrinho de compras da adidas.pt, localiza a opção "Código Promocional" no resumo da encomenda, insere o teu código e valida antes de pagar.'
      },
      {
        question: 'O que é o programa adiClub da adidas?',
        answer: 'É o clube de fidelização gratuito da adidas que oferece acumulação de pontos, portes de envio gratuitos, acesso antecipado a sapatilhas exclusivas e descontos especiais.'
      },
      {
        question: 'A adidas oferece devoluções gratuitas em Portugal?',
        answer: 'Sim, as devoluções na loja online da adidas são totalmente gratuitas dentro do prazo estipulado, podendo ser entregues num ponto de recolha de transportadora em Portugal.'
      },
      {
        question: 'Quais são as épocas com maiores saldos na adidas?',
        answer: 'Destacam-se os saldos de fim de estação (Verão e Inverno), a Cyber Week e a Black Friday em novembro, além de dias promocionais exclusivos para membros adiClub.'
      }
    ]
  },
  {
    name: 'ESR (EU)',
    slug: 'esr-eu',
    website: 'https://www.esrgear.com',
    country: 'EU',
    affiliateNetwork: 'awin',
    affiliateTag: '128639',
    commissionMin: '0.0800',
    commissionMax: '0.1500',
    reliability: '0.95',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos ESR Gear Europa',
    seoDescription: 'Descobre os melhores cupões de desconto e capas MagSafe da ESR com entrega em Portugal. Proteção premium, películas e carregadores sem fios para iPhone e iPad.',
    seoText: `A ESR é uma marca líder internacional especializada no desenvolvimento de acessórios de proteção e carregamento para dispositivos móveis, com especial destaque para capas magnéticas MagSafe, películas de vidro temperado e suportes veiculares para iPhone, iPad e outros smartphones.

Como usar um cupão de desconto no site da ESR:
Ao adicionares capas ou carregadores ao carrinho no site europeu da ESR, segue para o ecrã de checkout. No lado direito, por baixo dos artigos selecionados, localiza o campo "Discount code or gift card". Insere o teu código e clica em "Apply" para atualizar o montante final.

Grandes promoções e campanhas da ESR:
A ESR realiza campanhas frequentes com descontos em percentagem nos lançamentos de novas gerações de smartphones, campanhas de Black Friday, pacotes promocionais "compra 2 e poupa extra" e descontos especiais de boas-vindas para novos subscritores.

Envios e entregas em Portugal:
Os envios para Portugal são expedidos a partir de armazéns na Europa com número de rastreio, sem qualquer tipo de taxas alfandegárias. A loja disponibiliza portes gratuitos em encomendas que atinjam o valor mínimo de compra estipulado no checkout europeu.`,
    seoFaqs: [
      {
        question: 'Onde coloco o código de desconto no site da ESR?',
        answer: 'No checkout do site oficial da ESR, introduz o teu cupão no campo "Discount code or gift card" e clica em Apply para aplicar a dedução imediata.'
      },
      {
        question: 'As encomendas da ESR para Portugal pagam alfândega?',
        answer: 'Não, as encomendas para Portugal são enviadas de armazéns situados na União Europeia com trânsito livre de encargos alfandegários.'
      },
      {
        question: 'A ESR tem portes grátis para Portugal?',
        answer: 'Sim, a ESR oferece portes de envio gratuitos em compras que alcancem o valor mínimo de compra indicado no site europeu.'
      },
      {
        question: 'As capas da ESR são compatíveis com MagSafe?',
        answer: 'Sim, a maioria das capas e suportes da linha HaloLock da ESR foi desenvolvida especificamente para garantir compatibilidade e fixação magnética forte com a tecnologia MagSafe.'
      }
    ]
  },
  {
    name: 'OutIn',
    slug: 'outin',
    website: 'https://outin.com',
    country: 'EU',
    affiliateNetwork: 'awin',
    affiliateTag: '36144',
    commissionMin: '0.0800',
    commissionMax: '0.1200',
    reliability: '0.96',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos OutIn Máquinas Café Portáteis',
    seoDescription: 'Encontra os melhores cupões de desconto da OutIn válidos em Portugal. Poupa na máquina de café expresso portátil OutIn Nano e acessórios de viagem.',
    seoText: `A OutIn é uma marca inovadora pioneira no desenvolvimento de máquinas de café expresso portáteis a bateria (com destaque para a aclamada OutIn Nano), permitindo aos amantes de café desfrutar de um expresso autêntico em viagens, campismo, escritório ou no carro.

Como aplicar um código de desconto na OutIn:
Ao selecionares a tua máquina OutIn Nano ou acessórios no site oficial, avança para o checkout. No campo "Discount code", digita o código promocional e clica em aplicar. O valor do desconto é imediatamente abatido ao total da encomenda.

Promoções e campanhas sazonais OutIn:
A OutIn promove campanhas de desconto em pacotes promocionais (máquina de café mais bolsa de transporte ou adaptador para cápsulas), campanhas de Primavera e Verão voltadas para atividades ao ar livre, e promoções na Black Friday.

Envios para Portugal e garantia oficial:
A OutIn faz envios rápidos para Portugal através de centros de distribuição europeus, sem custos alfandegários e com portes gratuitos em compras acima do valor mínimo. Todos os equipamentos contam com garantia oficial da marca e suporte técnico.`,
    seoFaqs: [
      {
        question: 'Como aplicar um código de desconto na OutIn?',
        answer: 'No ecrã de finalização de compra do site da OutIn, escreve o código no campo "Discount code" e clica em aplicar antes de efetuar o pagamento.'
      },
      {
        question: 'A máquina OutIn Nano funciona com cápsulas de café?',
        answer: 'Sim, a OutIn Nano é compatível com café moído e com cápsulas originais do tipo Nespresso, permitindo preparar expresso quente com auto-aquecimento de água.'
      },
      {
        question: 'As encomendas da OutIn pagam alfândega em Portugal?',
        answer: 'Não, os envios com destino a Portugal são expedidos a partir da Europa sem incidência de taxas aduaneiras.'
      },
      {
        question: 'Qual é o prazo de entrega em Portugal?',
        answer: 'As encomendas da OutIn com destino a Portugal continental são habitualmente entregues entre 3 a 7 dias úteis com código de rastreamento.'
      }
    ]
  },
  {
    name: 'LaserPecker',
    slug: 'laserpecker',
    website: 'https://www.laserpecker.net',
    country: 'EU',
    affiliateNetwork: 'awin',
    affiliateTag: '59557',
    commissionMin: '0.0400',
    commissionMax: '0.0800',
    reliability: '0.95',
    active: true,
    seoTitle: 'Códigos Promocionais e Descontos LaserPecker Portugal',
    seoDescription: 'Descobre códigos de desconto e as melhores promoções da LaserPecker. Poupança em gravadoras e cortadoras a laser compactas e profissionais.',
    seoText: `A LaserPecker é uma das marcas de referência global no fabrico de gravadoras e cortadoras a laser portáteis e compactas, amplamente utilizadas por criadores, designers, artesãos e pequenas empresas para personalização de madeira, metal, couro e outros materiais.

Como utilizar um código promocional na LaserPecker:
No checkout da loja oficial LaserPecker, introduz o teu código promocional no campo "Discount code" à direita do resumo dos produtos. Clica no botão aplicar para que a percentagem ou valor de desconto seja deduzido ao preço da máquina ou do bundle.

Campanhas de desconto e ofertas especiais:
A marca realiza regularmente campanhas de pré-venda e lançamento de novos modelos, descontos na Black Friday, e preços vantajosos em pacotes completos que incluem base giratória, filtro de fumo e óculos de proteção.

Envios para Portugal e garantia do fabricante:
As encomendas destinadas a Portugal são expedidas a partir de armazéns situados na União Europeia, garantindo receção rápida sem taxas alfandegárias. Os equipamentos contam com garantia internacional do fabricante e apoio técnico online.`,
    seoFaqs: [
      {
        question: 'Onde introduzo o cupão de desconto no site da LaserPecker?',
        answer: 'Na página de checkout da LaserPecker, digita o teu cupão na caixa "Discount code" e clica em Apply para que o desconto seja ativado no total.'
      },
      {
        question: 'As gravadoras LaserPecker são enviadas da Europa para Portugal?',
        answer: 'Sim, a marca dispõe de logística na Europa, pelo que as encomendas chegam a Portugal sem necessidade de procedimentos ou taxas aduaneiras.'
      },
      {
        question: 'Que materiais podem ser gravados com as máquinas LaserPecker?',
        answer: 'Dependendo do modelo e do tipo de laser (diodo ou fibra), é possível gravar e cortar madeira, couro, acrílico, metal, plástico, vidro e cerâmica.'
      },
      {
        question: 'Existe garantia nos equipamentos LaserPecker?',
        answer: 'Sim, todos os equipamentos oficiais da LaserPecker beneficiam de garantia do fabricante com assistência técnica e peças de substituição.'
      }
    ]
  }
];

async function main() {
  console.log(`🚀 A iniciar processamento de ${storesData.length} lojas...`);

  for (const item of storesData) {
    // 1. Verificar se a loja já existe por slug
    const [existing] = await sql`SELECT id, name, slug FROM stores WHERE slug = ${item.slug} LIMIT 1`;

    if (existing) {
      // Atualizar SEO e dados
      await sql`
        UPDATE stores
        SET
          seo_title = ${item.seoTitle},
          seo_description = ${item.seoDescription},
          seo_text = ${item.seoText},
          seo_faqs = ${JSON.stringify(item.seoFaqs)}::jsonb,
          website = COALESCE(website, ${item.website}),
          country = COALESCE(country, ${item.country}),
          affiliate_network = COALESCE(affiliate_network, ${item.affiliateNetwork}),
          affiliate_tag = COALESCE(affiliate_tag, ${item.affiliateTag}),
          commission_min = COALESCE(commission_min, ${item.commissionMin}),
          commission_max = COALESCE(commission_max, ${item.commissionMax}),
          reliability = COALESCE(reliability, ${item.reliability}),
          active = true
        WHERE id = ${existing.id}
      `;
      console.log(`✅ Atualizada loja existente: ${item.name} (${item.slug})`);
    } else {
      // Inserir nova loja
      await sql`
        INSERT INTO stores (
          name, slug, website, country, affiliate_network, affiliate_tag,
          commission_min, commission_max, reliability, active,
          seo_title, seo_description, seo_text, seo_faqs
        ) VALUES (
          ${item.name}, ${item.slug}, ${item.website}, ${item.country},
          ${item.affiliateNetwork}, ${item.affiliateTag},
          ${item.commissionMin}, ${item.commissionMax}, ${item.reliability},
          ${item.active}, ${item.seoTitle}, ${item.seoDescription},
          ${item.seoText}, ${JSON.stringify(item.seoFaqs)}::jsonb
        )
      `;
      console.log(`🎉 Inserida nova loja: ${item.name} (${item.slug})`);
    }
  }

  console.log('🏁 Todas as lojas processadas com sucesso!');
  await sql.end();
}

main().catch(err => {
  console.error('❌ Erro no script:', err);
  process.exit(1);
});
