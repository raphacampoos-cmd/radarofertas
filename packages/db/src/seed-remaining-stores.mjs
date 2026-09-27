import postgres from 'postgres';

const connectionString = process.env.DATABASE_URL || "postgresql://neondb_owner:npg_1klPRVn0hEqf@ep-gentle-snow-zawbvp2f-pooler.c-2.eu-west-2.aws.neon.tech/neondb?channel_binding=require&sslmode=require";
const sql = postgres(connectionString, { max: 1 });

const storesData = [
  {
    slug: 'gshopper',
    seoTitle: 'Códigos Promocionais e Descontos Gshopper',
    seoDescription: 'Encontra os melhores cupões de desconto e promoções na Gshopper para Portugal. Gadgets Xiaomi, smartphones, aspiradores e tecnologia.',
    seoText: `A Gshopper é uma plataforma internacional de comércio eletrónico especializada em tecnologia de consumo, smartphones, robôs aspiradores e mobilidade elétrica de marcas asiáticas consagradas como Xiaomi, Roborock e POCO.

Como utilizar um código de desconto na Gshopper:
No carrinho de compras da Gshopper, antes de finalizar o pagamento, localiza o campo "Coupon Code". Digita o teu cupão promocional e clica em aplicar. O desconto é calculado de imediato sobre o total da encomenda.

Campanhas e grandes promoções:
A Gshopper realiza frequentes campanhas promocionais com envio prioritário da Europa, ofertas relâmpago semanais e campanhas temáticas na Black Friday e no 11.11 com cupões escalonados por valor de compra.

Envios e alfândega para Portugal:
Para entregas em Portugal, grande parte dos artigos mais procurados é expedida de armazéns localizados na União Europeia (Espanha, Alemanha ou Polónia), garantindo entrega rápida em poucos dias úteis sem taxas alfandegárias adicionais.`,
    seoFaqs: [
      {
        question: 'Onde aplicar o cupão de desconto na Gshopper?',
        answer: 'No carrinho ou no checkout da Gshopper, insere o teu código promocional no campo "Coupon Code" e clica em aplicar antes de efetuar o pagamento.'
      },
      {
        question: 'As encomendas da Gshopper para Portugal pagam alfândega?',
        answer: 'Os produtos expedidos de armazéns europeus (UE) não têm qualquer custo de alfândega e chegam a Portugal sem encargos aduaneiros.'
      },
      {
        question: 'Qual é o prazo de entrega habitual da Gshopper em Portugal?',
        answer: 'Para produtos com envio a partir de armazéns europeus, a entrega em Portugal situa-se tipicamente entre 3 a 7 dias úteis com número de seguimento.'
      }
    ]
  },
  {
    slug: 'padel-market',
    seoTitle: 'Códigos Promocionais e Descontos Padel Market',
    seoDescription: 'Descobre códigos de desconto e promoções na Padel Market com entrega em Portugal. Raquetes de padel, sapatilhas, sacos e vestuário técnico.',
    seoText: `A Padel Market é uma das lojas online de referência na Europa especializada exclusivamente no desporto de padel, oferecendo as melhores marcas mundiais como Bullpadel, Nox, Babolat, Head, Adidas e Siux.

Como utilizar um cupão na Padel Market:
Ao adicionares as tuas raquetes, sapatilhas ou tubos de bolas ao carrinho, segue para o ecrã de pagamento. Localiza a caixa identificada como "Código de desconto" ou "Cupão promocional", insere o teu código e valida para atualizar o preço final.

Promoções e saldos de padel:
A Padel Market disponibiliza promoções atrativas em raquetes de coleções anteriores (ofertas Outlet), promoções sazonais de Black Friday, e campanhas com ofertas de sacos ou overgrips na compra de raquetes de gama média e alta.

Envios rápidos para Portugal:
A loja expede diretamente para Portugal continental através de transportadoras especializadas, com prazos habituais de 24 a 48 horas úteis e portes de envio gratuitos a partir de um valor mínimo de encomenda.`,
    seoFaqs: [
      {
        question: 'Onde colocar o código de desconto na Padel Market?',
        answer: 'No passo de pagamento e resumo da tua encomenda na Padel Market, digita o código na caixa "Código promocional" e confirma a validação.'
      },
      {
        question: 'A Padel Market faz entregas em Portugal?',
        answer: 'Sim, a Padel Market envia rapidamente para todo o território português (continental e ilhas) com serviço de rastreio online.'
      },
      {
        question: 'As raquetes vendidas na Padel Market são originais?',
        answer: 'Sim, todas as raquetes e artigos de padel comercializados pela loja são 100% originais e contam com a garantia oficial dos respetivos fabricantes.'
      }
    ]
  },
  {
    slug: 'needs-no-label',
    seoTitle: 'Códigos Promocionais e Descontos Needs No Label',
    seoDescription: 'Encontra os melhores cupões de desconto e saldos da Needs No Label com entrega em Portugal. Moda streetwear e vestuário casual.',
    seoText: `A Needs No Label é uma marca internacional de vestuário casual e moda urbana (streetwear), focada em peças essenciais, t-shirts confortáveis, hoodies e conjuntos modernos de alta qualidade.

Como aplicar um código de desconto na Needs No Label:
No checkout do site oficial, insere o teu código promocional no campo "Discount code" situado por baixo do resumo dos artigos e clica em aplicar para que o montante seja recalculado.

Campanhas e novidades:
A marca lança regularmente coleções sazonais com descontos especiais de pré-venda, promoções de meia-estação e campanhas na Black Friday.

Entregas para Portugal:
Os envios são expedidos para Portugal com tracking detalhado, beneficiando de portes gratuitos em encomendas que perfaçam o montante mínimo estipulado no checkout europeu.`,
    seoFaqs: [
      {
        question: 'Como aplicar cupões no site da Needs No Label?',
        answer: 'No ecrã de checkout, digita o código promocional no campo "Discount code" e clica em aplicar antes de efetuar o pagamento.'
      },
      {
        question: 'A Needs No Label envia para Portugal?',
        answer: 'Sim, a marca realiza entregas para Portugal com código de rastreamento e entrega direta ao domicílio.'
      },
      {
        question: 'Qual é o prazo de devolução na Needs No Label?',
        answer: 'Os clientes dispõem de um prazo legal de 14 dias para solicitar a troca ou devolução de artigos não utilizados e com etiquetas originais.'
      }
    ]
  },
  {
    slug: 'sinocare',
    seoTitle: 'Códigos Promocionais e Descontos Sinocare Saúde',
    seoDescription: 'Descobre códigos de desconto e promoções na Sinocare com entrega em Portugal. Medidores de glicemia, tiras de teste e monitores de tensão arterial.',
    seoText: `A Sinocare é uma das fabricantes líderes mundiais em dispositivos médicos de diagnóstico rápido e monitorização da saúde em casa, com foco em medidores de glicemia fiáveis, tiras de teste, monitores de pressão arterial e nebulizadores.

Como utilizar um código promocional na Sinocare:
No checkout da loja online oficial, introduz o teu código promocional na caixa de cupão ("Discount code") e clica em aplicar para abater o desconto no total do pedido.

Promoções e packs económicos:
A marca oferece com frequência packs familiares económicos (combinando medidor de glicemia e lotes de 50 ou 100 tiras de teste), além de descontos em percentagem para compras recorrentes.

Envios para Portugal:
As encomendas chegam a Portugal através de centros de distribuição parceiros na Europa, garantindo receção rápida sem burocracias alfandegárias.`,
    seoFaqs: [
      {
        question: 'Onde introduzir o cupão de desconto na Sinocare?',
        answer: 'No ecrã de pagamento da loja oficial da Sinocare, insere o código no campo de desconto e valida antes de confirmar a encomenda.'
      },
      {
        question: 'Os medidores de glicemia Sinocare são certificados na Europa?',
        answer: 'Sim, os dispositivos médicos da Sinocare contam com certificação CE e cumprem os padrões de precisão clínica exigidos no espaço comunitário.'
      },
      {
        question: 'As tiras de teste Sinocare são compatíveis com qualquer medidor?',
        answer: 'Não, cada modelo de medidor Sinocare requer as tiras de teste compatíveis com a sua linha específica (ex: Safe Accu ou Safe AQ).'
      }
    ]
  },
  {
    slug: 'neuroscent',
    seoTitle: 'Códigos Promocionais e Descontos NeuroScent Aromaterapia',
    seoDescription: 'Encontra os melhores cupões de desconto e promoções na NeuroScent. Difusores ultrassónicos, óleos essenciais e fragrâncias para a casa.',
    seoText: `A NeuroScent é uma marca dedicada ao bem-estar e relaxamento através da aromaterapia, desenvolvendo difusores ultrassónicos de design elegante e óleos essenciais puros concebidos para melhorar o sono, a concentração e o conforto em casa.

Como aplicar o cupão de desconto na NeuroScent:
No checkout do site oficial, insere o teu código promocional na secção dedicada a cupões e clica em validar para deduzir o valor da campanha ao montante total.

Campanhas e conjuntos promocionais:
A NeuroScent disponibiliza frequentemente pacotes de boas-vindas com oferta de óleos essenciais na compra de difusores, além de promoções sazonais de Primavera, Outono e Black Friday.

Envios e entregas em Portugal:
A marca faz entregas para Portugal continental com envio seguro e acompanhamento online de todo o percurso da encomenda.`,
    seoFaqs: [
      {
        question: 'Onde inserir o código promocional na NeuroScent?',
        answer: 'No carrinho de compras ou no checkout da loja online, adiciona o código no campo de cupão e valida para abater o desconto.'
      },
      {
        question: 'Os óleos essenciais da NeuroScent são 100% naturais?',
        answer: 'Sim, a marca formula as suas fragrâncias com base em extratos e óleos essenciais puros, sem químicos agressivos.'
      },
      {
        question: 'Qual é o prazo de entrega para Portugal?',
        answer: 'As encomendas para Portugal continental são habitualmente entregues entre 3 a 7 dias úteis.'
      }
    ]
  },
  {
    slug: 'wau',
    seoTitle: 'Códigos Promocionais e Descontos WAU Cosmética',
    seoDescription: 'Descobre cupões de desconto e promoções na WAU com entrega em Portugal. Cosmética facial, séruns e cuidados de pele de alta eficácia.',
    seoText: `A WAU é uma marca de cosmética e cuidados de pele orientada para a beleza funcional, oferecendo fórmulas inovadoras em séruns faciais, cremes hidratantes, cuidados antienvelhecimento e rotinas diárias completas para todos os tipos de pele.

Como usar um cupão de desconto na WAU:
Durante a finalização da compra no site da WAU, digita o teu código promocional na caixa de desconto do resumo do pedido e valida para aplicar a dedução imediata.

Campanhas de cuidados de pele:
A WAU promove rotinas em packs com descontos progressivos (rotina de dia e noite), descontos especiais na Black Friday e campanhas sazonais para proteção solar e hidratação.

Entregas em Portugal:
Os envios para Portugal são efetuados a partir de entrepostos europeus com transporte rápido e garantia de satisfação.`,
    seoFaqs: [
      {
        question: 'Como aplicar um código de desconto na WAU?',
        answer: 'No checkout da loja online da WAU, insere o teu cupão na caixa de desconto e confirma para abater o valor no total a pagar.'
      },
      {
        question: 'Os produtos da WAU são adequados para peles sensíveis?',
        answer: 'Sim, a maioria das fórmulas da WAU é dermatologicamente testada e desenvolvida para minimizar riscos de irritação cutânea.'
      },
      {
        question: 'A WAU tem portes grátis para Portugal?',
        answer: 'A loja oferece portes gratuitos para Portugal em compras que perfaçam o montante mínimo de encomenda estipulado no site.'
      }
    ]
  },
  {
    slug: 'nothingprojector',
    seoTitle: 'Códigos Promocionais e Descontos Nothingprojector',
    seoDescription: 'Encontra os melhores cupões de desconto na Nothingprojector com entrega em Portugal. Projetores laser 4K e telas de projeção ALR.',
    seoText: `A Nothingprojector é uma das especialistas líderes mundiais em tecnologia de projeção doméstica e profissional de ultra-curta distância (UST), disponibilizando projetores laser 4K e telas de rejeição de luz ambiente (ALR) de marcas de referência como Formovie, Hisense, Dangbei e NexiGo.

Como aplicar o cupão de desconto na Nothingprojector:
No checkout do site oficial, insere o teu código promocional no campo "Discount code" e clica em Apply para que o desconto seja abatido no preço do equipamento ou bundle de projeção.

Momentos promocionais e bundles:
A loja oferece pacotes promocionais atrativos combinando projetor UST com tela motorizada ALR com descontos significativos face à compra individual, além de reduções especiais na Black Friday.

Envios rápidos da Europa sem alfândega:
A Nothingprojector mantém centros de distribuição na União Europeia, garantindo que os clientes em Portugal recebem os seus equipamentos sem encargos alfandegários e com entrega assegurada por transportadoras especializadas.`,
    seoFaqs: [
      {
        question: 'Onde introduzo o código promocional na Nothingprojector?',
        answer: 'No ecrã de checkout da Nothingprojector, introduz o teu cupão na caixa "Discount code" e clica em Apply antes de pagar.'
      },
      {
        question: 'Os projetores Nothingprojector pagam alfândega em Portugal?',
        answer: 'Não, os envios para clientes europeus são expedidos de armazéns dentro da União Europeia, sem quaisquer taxas aduaneiras.'
      },
      {
        question: 'O que é uma tela de projeção ALR?',
        answer: 'Uma tela ALR (Ambient Light Rejecting) rejeita a luz ambiente da divisão e reflete apenas a luz do projetor, proporcionando contraste e cores vivas mesmo durante o dia.'
      }
    ]
  },
  {
    slug: 'ottocast',
    seoTitle: 'Códigos Promocionais e Descontos Ottocast Portugal',
    seoDescription: 'Descobre os melhores cupões de desconto na Ottocast. Adaptadores CarPlay sem fios, Android Auto wireless e ecrãs inteligentes para automóveis.',
    seoText: `A Ottocast é uma marca pioneira e líder de mercado no desenvolvimento de adaptadores sem fios para automóveis, convertendo sistemas Apple CarPlay e Android Auto com fios em ligações 100% wireless práticas e instantâneas.

Como utilizar um código de desconto na Ottocast:
Ao escolheres o teu adaptador no site oficial, avança para a página de checkout. No campo de cupão promocional, insere o código e clica em aplicar para reduzir o total da compra.

Campanhas e novidades auto:
A Ottocast promove campanhas em novos lançamentos com suporte para streaming de vídeo (YouTube, Netflix em CarPlay AI Box) e descontos expressivos durante a época de Black Friday e saldos de verão.

Envios para Portugal:
Os envios para Portugal são expedidos com número de rastreamento oficial, com portes gratuitos a partir de valores mínimos e garantia de compatibilidade com centenas de modelos de automóveis.`,
    seoFaqs: [
      {
        question: 'Onde colocar o cupão de desconto na Ottocast?',
        answer: 'No ecrã de finalização de encomenda da Ottocast, digita o código promocional na caixa de desconto e confirma para abater o valor.'
      },
      {
        question: 'Os adaptadores Ottocast funcionam em qualquer carro?',
        answer: 'Funcionam na grande maioria dos automóveis que já disponham de Apple CarPlay ou Android Auto de fábrica através de cabo USB.'
      },
      {
        question: 'As encomendas da Ottocast para Portugal têm custos alfandegários?',
        answer: 'A loja dispõe de opções de envio europeu com impostos já regularizados, sem cobranças alfandegárias inesperadas.'
      }
    ]
  },
  {
    slug: 'fastestvpn',
    seoTitle: 'Códigos Promocionais e Descontos FastestVPN',
    seoDescription: 'Encontra os melhores cupões e planos vitalícios da FastestVPN para Portugal. Navegação segura, privacidade online e desbloqueio de streaming.',
    seoText: `A FastestVPN é um fornecedor global de serviços de rede privada virtual (VPN), reconhecido pelos seus planos de subscrição altamente económicos (incluindo licenças vitalícias / lifetime), segurança de topo com encriptação AES de 256 bits e suporte para até 10 ligações simultâneas por conta.

Como aplicar um código de desconto na FastestVPN:
Na página de seleção de planos da FastestVPN, seleciona o período pretendido e insere o código promocional na caixa correspondente no checkout antes de efetuar o pagamento.

Campanhas e ofertas especiais:
A FastestVPN é famosa pelas suas promoções de pacotes com gestor de palavras-passe incluído e descontos superiores a 80% em planos multianuais e vitalícios durante a Black Friday e datas festivas.

Ativação imediata em Portugal:
Sendo um serviço puramente digital, a subscrição fica ativa imediatamente após o pagamento, permitindo instalar a aplicação em telemóveis Android, iPhone, Windows, Mac e Smart TVs.`,
    seoFaqs: [
      {
        question: 'Como aplicar um código de desconto na FastestVPN?',
        answer: 'Ao escolheres o teu plano no site oficial da FastestVPN, digita o código na caixa de cupão do checkout para abater o preço da subscrição.'
      },
      {
        question: 'Quantos dispositivos posso utilizar na mesma conta FastestVPN?',
        answer: 'A FastestVPN permite ligar até 10 dispositivos em simultâneo com uma única conta, abrangendo computadores, smartphones e routers.'
      },
      {
        question: 'A FastestVPN tem garantia de reembolso?',
        answer: 'Sim, a FastestVPN disponibiliza uma garantia de reembolso de 15 a 31 dias para que possas testar o serviço sem qualquer compromisso.'
      }
    ]
  },
  {
    slug: 'ultrahuman',
    seoTitle: 'Códigos Promocionais e Descontos Ultrahuman Ring Air',
    seoDescription: 'Descobre os melhores cupões de desconto na Ultrahuman com entrega em Portugal. Smart rings, monitorização do sono, HRV e recuperação.',
    seoText: `A Ultrahuman é uma empresa pioneira de tecnologia de saúde e bem-estar inteligente, famosa pelo aclamado anel inteligente "Ultrahuman Ring Air", que monitoriza continuamente o sono, a temperatura cutânea, a variabilidade do ritmo cardíaco (HRV) e os níveis de recuperação física sem necessidade de subscrições mensais obrigatórias.

Como utilizar um cupão no site da Ultrahuman:
No carrinho de compras do site oficial da Ultrahuman, insere o teu código de desconto no campo correspondente antes de selecionar o método de pagamento para validar o abatimento no preço do anel inteligente ou kit de dimensionamento.

Envios para Portugal e kit de tamanhos:
A Ultrahuman envia kits de dimensionamento (Sizing Kit) diretamente para Portugal para que os utilizadores possam testar o tamanho exato do dedo antes da expedição do anel definitivo, garantindo o ajuste e a precisão das leituras biométricas.`,
    seoFaqs: [
      {
        question: 'Onde aplicar o código promocional na Ultrahuman?',
        answer: 'No checkout do site da Ultrahuman, introduz o código na secção de cupão e valida para abater o desconto no total do pedido.'
      },
      {
        question: 'O Ultrahuman Ring Air exige subscrição mensal?',
        answer: 'Não, o acesso às métricas e funcionalidades fundamentais da aplicação Ultrahuman está incluído na compra do anel, sem subscrições obrigatórias.'
      },
      {
        question: 'Como escolher o tamanho certo do anel?',
        answer: 'A Ultrahuman disponibiliza um kit de tamanhos de teste que é enviado previamente para que possas usar durante 24 horas e escolher o tamanho ideal.'
      }
    ]
  },
  {
    slug: 'einstar',
    seoTitle: 'Códigos Promocionais e Descontos EINSTAR Scanners 3D',
    seoDescription: 'Encontra códigos de desconto e promoções na EINSTAR Shining 3D com entrega em Portugal. Digitalização 3D portátil e acessível.',
    seoText: `A EINSTAR é a linha acessível e inovadora de scanners 3D portáteis desenvolvida pela SHINING 3D, concebida para disponibilizar digitalização 3D a cores de alta densidade e precisão a criadores de conteúdo, designers, entusiastas de impressão 3D e pequenas oficinas.

Como aplicar um código de desconto na EINSTAR:
No checkout da loja online oficial, introduz o teu código promocional no campo "Discount code" e clica em aplicar para que o montante correspondente seja abatido no preço do scanner ou dos acessórios.

Envios para Portugal e suporte técnico:
Os equipamentos EINSTAR são expedidos a partir de polos logísticos europeus com garantia oficial da marca e suporte técnico especializado para a Europa.`,
    seoFaqs: [
      {
        question: 'Onde coloco o código de desconto na EINSTAR?',
        answer: 'No ecrã de checkout da loja online, insere o código no campo de cupão e clica em Apply para deduzir o desconto.'
      },
      {
        question: 'Os scanners EINSTAR capturam texturas a cores?',
        answer: 'Sim, o scanner 3D EINSTAR dispõe de câmara RGB integrada capaz de capturar cores autênticas e texturas realistas durante a digitalização.'
      },
      {
        question: 'O software de digitalização 3D está incluído?',
        answer: 'Sim, os scanners EINSTAR vêm acompanhados do software oficial com ferramentas de processamento de malha e exportação em formatos padrão como OBJ, STL e PLY.'
      }
    ]
  },
  {
    slug: 'htvront',
    seoTitle: 'Códigos Promocionais e Descontos HTVRont Portugal',
    seoDescription: 'Descobre os melhores cupões de desconto na HTVRont. Prensas térmicas automáticas, vinil de transferência térmica e máquinas de corte artesanal.',
    seoText: `A HTVRont é uma marca de referência internacional no universo do artesanato e personalização criativa, famosa pelas suas prensas térmicas automáticas (Auto Heat Press), vinil têxtil (HTV), papéis de sublimação e máquinas de corte de precisão para personalização de t-shirts, canecas e brindes.

Como utilizar um código promocional na HTVRont:
No checkout da loja online oficial, introduz o teu cupão no campo "Discount code" e clica no botão aplicar antes de escolheres o método de pagamento.

Campanhas para criadores e artesãos:
A HTVRont realiza promoções regulares em rolos de vinil térmico, descontos nos aniversários da marca e grandes saldos durante a Black Friday em prensas térmicas automáticas.

Envios para Portugal:
A marca dispõe de logística com envio europeu, proporcionando entregas seguras em Portugal sem preocupações com custos alfandegários adicionais.`,
    seoFaqs: [
      {
        question: 'Onde aplico o cupão de desconto na HTVRont?',
        answer: 'No carrinho de compras ou no checkout da HTVRont, insere o código promocional na caixa "Discount code" e clica em aplicar.'
      },
      {
        question: 'A prensa térmica automática da HTVRont é fácil de usar?',
        answer: 'Sim, a HTVRont Auto Heat Press fecha e abre automaticamente com pressão inteligente, simplificando a personalização têxtil profissional em casa.'
      },
      {
        question: 'As encomendas da HTVRont para Portugal pagam taxas alfandegárias?',
        answer: 'Os envios com stock disponível na Europa chegam a Portugal sem encargos alfandegários adicionais.'
      }
    ]
  },
  {
    slug: 'wondershare',
    seoTitle: 'Códigos Promocionais e Descontos Wondershare Software',
    seoDescription: 'Encontra os melhores cupões de desconto na Wondershare. Poupança em Filmora, PDFelement, Recoverit e ferramentas de criatividade digital.',
    seoText: `A Wondershare é uma das maiores empresas globais de software de criatividade e produtividade digital, autora de ferramentas premiadas utilizadas por milhões de criadores em todo o mundo, como o editor de vídeo Wondershare Filmora, o editor de documentos PDFelement e o recuperador de dados Recoverit.

Como aplicar um código promocional na Wondershare:
Na página de subscrição ou compra de licença perpétua do software pretendido, clica em "Tens um código de cupão?". Digita o teu código e valida para abater a percentagem correspondente no total da licença.

Campanhas escolares e Black Friday:
A Wondershare realiza campanhas promocionais fortes no regresso às aulas com descontos para estudantes e educadores, além de promoções comemorativas de fim de ano e Black Friday.

Ativação imediata da licença digital:
Após a confirmação da compra online, a chave de ativação da licença é gerada imediatamente e associada ao teu ID Wondershare, permitindo descarregar e utilizar o software sem demoras.`,
    seoFaqs: [
      {
        question: 'Onde coloco o código de cupão no site da Wondershare?',
        answer: 'No ecrã de checkout ao comprar uma licença, clica na opção "Tens um código de cupão?", insere o código e confirma.'
      },
      {
        question: 'As licenças da Wondershare são anuais ou perpétuas?',
        answer: 'A Wondershare disponibiliza tanto subscrições anuais (com atualizações contínuas incluídas) como licenças perpétuas para a versão adquirida.'
      },
      {
        question: 'Como recebo o software após a compra?',
        answer: 'A entrega é 100% digital e instantânea. Podes descarregar o instalador diretamente no site e iniciar sessão com a conta utilizada na compra.'
      }
    ]
  },
  {
    slug: 'thc-natural-line-de',
    seoTitle: 'Códigos Promocionais e Descontos THC Natural Line',
    seoDescription: 'Descobre códigos de desconto e promoções na THC Natural Line com entrega em Portugal. Artigos térmicos e vestuário em lã natural.',
    seoText: `A THC Natural Line é uma marca europeia especializada no fabrico artesanal de artigos têxteis e vestuário de conforto produzidos com 100% lã natural de ovelha, com destaque para meias térmicas, pantufas quentes, gorros, luvas e cobertores de elevado isolamento térmico.

Como utilizar um código de desconto na THC Natural Line:
No checkout da loja online, insere o teu código promocional no campo reservado para cupões e confirma para deduzir o valor da campanha ao montante total.

Campanhas de Inverno e conforto térmico:
A marca promove ofertas sazonais especiais nos meses de Outono e Inverno, além de campanhas temáticas na Black Friday e descontos em conjuntos de presente.

Envios da Europa para Portugal:
Com produção e armazéns na Europa (Alemanha), todas as encomendas destinadas a Portugal são expedidas com acompanhamento online e sem encargos alfandegários.`,
    seoFaqs: [
      {
        question: 'Onde introduzo o cupão na THC Natural Line?',
        answer: 'No checkout da loja online, adiciona o teu código promocional no campo de cupão e valida para abater o desconto antes de pagar.'
      },
      {
        question: 'Os produtos da THC Natural Line são de lã 100% natural?',
        answer: 'Sim, a marca utiliza lã de ovelha natural com propriedades térmicas excecionais e respirabilidade superior.'
      },
      {
        question: 'As encomendas chegam a Portugal sem alfândega?',
        answer: 'Sim, a expedição é comunitária (a partir da Alemanha), sem qualquer cobrança ou taxa alfandegária para Portugal.'
      }
    ]
  }
];

async function main() {
  console.log(`🚀 A atualizar ${storesData.length} lojas restantes com SEO...`);

  for (const item of storesData) {
    const res = await sql`
      UPDATE stores
      SET
        seo_title = ${item.seoTitle},
        seo_description = ${item.seoDescription},
        seo_text = ${item.seoText},
        seo_faqs = ${JSON.stringify(item.seoFaqs)}::jsonb,
        active = true
      WHERE slug = ${item.slug}
      RETURNING id, name, slug
    `;

    if (res.length > 0) {
      console.log(`✅ Atualizada com sucesso: ${res[0].name} (${res[0].slug})`);
    } else {
      console.log(`⚠️ Loja não encontrada para slug: ${item.slug}`);
    }
  }

  console.log('🏁 Todas as lojas restantes foram atualizadas!');
  await sql.end();
}

main().catch(err => {
  console.error('❌ Erro no script:', err);
  process.exit(1);
});
