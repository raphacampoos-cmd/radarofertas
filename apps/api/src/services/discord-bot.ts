import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js'
import { db } from '@radarofertas/db/client'
import { offers, offerCategories, categories, discordAlerts } from '@radarofertas/db/schema'
import { ilike, eq, desc, and, inArray } from 'drizzle-orm'

let client: Client | null = null

export async function initDiscordBot() {
  const token = process.env.DISCORD_BOT_TOKEN

  if (!token) {
    console.log('⚠️ DISCORD_BOT_TOKEN não encontrado. Agente Discord inativo.')
    return
  }

  client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildMessages,
    ]
  })

  client.on('ready', async () => {
    console.log(`🤖 Agente Discord Bot online como ${client?.user?.tag}!`)
    client?.user?.setActivity('/procurar promoções')
    // Os comandos slash (/procurar, /alertas) são registados globalmente por
    // registerDiscordCommands() (chamado uma vez no arranque do servidor, em index.ts).
    // Não repetir o registo aqui por-servidor para evitar comandos duplicados no Discord.
  })

  // Lidar com mensagens normais
  client.on('messageCreate', async (message) => {
    if (message.author.bot) return

    const content = message.content.toLowerCase()
    
    // Resposta automática a dúvidas comuns
    if (content.includes('como funciona') || content.includes('é seguro')) {
      await message.reply('👋 Olá! O RadarOfertas é 100% seguro e deteta quedas de preço em tempo real. Lê mais sobre o nosso algoritmo aqui: https://radarofertas-psi.vercel.app/como-funciona')
    }

    if (content.includes('cupão') || content.includes('cupom') || content.includes('desconto extra')) {
      await message.reply('🎟️ Andas à caça de cupões? Podes ver todos os códigos ativos no nosso site, ou usar o comando `/procurar <produto>` para ver se há alguma oferta com cupão aplicado na loja!')
    }
  })

  // Lidar com comandos /slash
  client.on('interactionCreate', async (interaction) => {
    if (!interaction.isChatInputCommand()) return

    if (interaction.commandName === 'procurar') {
      const termo = interaction.options.getString('produto')
      if (!termo) return

      await interaction.deferReply()

      try {
        const resultados = await db.select()
          .from(offers)
          .where(
            and(
              eq(offers.status, 'active'),
              ilike(offers.title, `%${termo}%`)
            )
          )
          .orderBy(desc(offers.dealScore))
          .limit(3)

        if (resultados.length === 0) {
          await interaction.editReply(`Não encontrei nenhuma oferta ativa para "**${termo}**" no momento. 😔 Tenta outro produto!`)
          return
        }

        const embed = new EmbedBuilder()
          .setColor('#f97316')
          .setTitle(`🔎 Resultados para: ${termo}`)

        resultados.forEach(oferta => {
          embed.addFields({
            name: oferta.title,
            value: `💰 **€${oferta.priceCurrent}** (antes €${oferta.priceOriginal})\n🔥 Desconto: ${oferta.discountPct}%\n🔗 [Ver Oferta](https://radarofertas-psi.vercel.app/oferta/${oferta.slug})`
          })
        })

        await interaction.editReply({ embeds: [embed] })
      } catch (error) {
        console.error(error)
        await interaction.editReply('Ocorreu um erro ao procurar na base de dados.')
      }
    }

    if (interaction.commandName === 'alertas') {
      const categoria = interaction.options.getString('categoria')
      if (!categoria) return

      const userId = interaction.user.id

      try {
        const existing = await db.select().from(discordAlerts).where(
          and(eq(discordAlerts.discordUserId, userId), eq(discordAlerts.categoryKey, categoria))
        )

        if (existing.length > 0) {
          // Já estava inscrito: alternar para desativar
          await db.delete(discordAlerts).where(eq(discordAlerts.id, existing[0].id))
          await interaction.reply({ content: `🔕 Alertas desativados para **${categoria}**. Usa \`/alertas\` outra vez para reativar.`, ephemeral: true })
        } else {
          await db.insert(discordAlerts).values({ discordUserId: userId, categoryKey: categoria })
          await interaction.reply({ content: `✅ Ativado! Vou enviar-te uma mensagem privada sempre que houver uma oferta brutal na categoria **${categoria}**. Usa \`/alertas\` outra vez com a mesma categoria para desativar.`, ephemeral: true })
        }
      } catch (error) {
        console.error('Erro ao gravar inscrição de alertas:', error)
        await interaction.reply({ content: '❌ Não consegui gravar a tua inscrição agora. Tenta outra vez daqui a pouco.', ephemeral: true })
      }
    }
  })

  await client.login(token)
}

// Configuração dos canais
const CANAIS = {
  TOP_OFERTAS: '1550193887304482896',
  TECH: '1550193836351946835',
  GAMING: '1550193803082731680',
  CASA: '1550193736770658424'
}

// Função para enviar uma oferta diretamente para o canal certo
export async function sendOfferToDiscord(oferta: any) {
  if (!client || !client.isReady()) return

  // Ir buscar os slugs de categoria reais da oferta (M:N via offerCategories)
  const offerCats = await db
    .select({ slug: categories.slug })
    .from(offerCategories)
    .innerJoin(categories, eq(offerCategories.categoryId, categories.id))
    .where(eq(offerCategories.offerId, oferta.id))
  const categorySlugs = offerCats.map(c => c.slug)

  const isTop = oferta.discountPct >= 40 || oferta.dealScore >= 90
  const isGaming = categorySlugs.includes('gaming') || oferta.title.toLowerCase().includes('ps5')
  const isCasa = categorySlugs.includes('casa')
  const isTech = categorySlugs.includes('tecnologia-e-informatica') || categorySlugs.includes('smartphones-e-acessorios')

  // Escolher o canal com base no desconto ou categoria
  let canalId = CANAIS.TECH // default
  if (isTop) canalId = CANAIS.TOP_OFERTAS
  else if (isCasa) canalId = CANAIS.CASA
  else if (isGaming) canalId = CANAIS.GAMING

  const embed = new EmbedBuilder()
    .setColor('#ef4444')
    .setTitle(`🔥 NOVO DESCONTO: ${oferta.title}`)
    .setURL(`https://radarofertas-psi.vercel.app/oferta/${oferta.slug}`)
    .setImage(oferta.imageUrl)
    .setDescription(`💰 **€${oferta.priceCurrent}** (antes €${oferta.priceOriginal})\n📉 Caiu ${oferta.discountPct}%!`)
    .setFooter({ text: 'RadarOfertas PT', iconURL: 'https://radarofertas-psi.vercel.app/favicon.ico' })

  try {
    const channel = await client.channels.fetch(canalId)
    if (channel && 'send' in channel) {
      await (channel as any).send({ embeds: [embed] })
    }
  } catch (err) {
    console.error('Erro ao enviar para canal Discord:', err)
  }

  // Notificar por DM quem se inscreveu via /alertas nas categorias correspondentes
  const alertKeys: string[] = []
  if (isTop) alertKeys.push('top')
  if (isTech) alertKeys.push('tech')
  if (isGaming) alertKeys.push('gaming')
  if (isCasa) alertKeys.push('casa')

  if (alertKeys.length > 0) {
    try {
      const subscribers = await db.select().from(discordAlerts).where(inArray(discordAlerts.categoryKey, alertKeys))
      for (const sub of subscribers) {
        try {
          const user = await client.users.fetch(sub.discordUserId)
          await user.send({ embeds: [embed] })
        } catch (err) {
          console.error(`Erro ao enviar DM de alerta para ${sub.discordUserId}:`, err)
        }
      }
    } catch (err) {
      console.error('Erro ao consultar inscritos de alertas:', err)
    }
  }
}

// Função para registar os comandos Slash na API do Discord
export async function registerDiscordCommands() {
  const token = process.env.DISCORD_BOT_TOKEN
  const clientId = process.env.DISCORD_CLIENT_ID

  if (!token || !clientId) return

  const rest = new REST({ version: '10' }).setToken(token)

  const commands = [
    {
      name: 'procurar',
      description: 'Procura por uma oferta ativa na base de dados do RadarOfertas',
      options: [
        {
          name: 'produto',
          description: 'O que queres procurar? (Ex: ps5, airfryer, samsung)',
          type: 3, // STRING
          required: true,
        }
      ]
    },
    {
      name: 'alertas',
      description: 'Ativa notificações por mensagem privada para uma categoria',
      options: [
        {
          name: 'categoria',
          description: 'Que categoria te interessa?',
          type: 3,
          required: true,
          choices: [
            { name: '🔥 Top Ofertas (+40% Desconto)', value: 'top' },
            { name: '📱 Tech & Smartphones', value: 'tech' },
            { name: '🎮 Gaming', value: 'gaming' },
            { name: '🏠 Casa & Cozinha', value: 'casa' },
          ]
        }
      ]
    }
  ]

  try {
    console.log('A registar comandos Slash (/) do Discord...')
    await rest.put(
      Routes.applicationCommands(clientId),
      { body: commands }
    )
    console.log('✅ Comandos registados com sucesso!')
  } catch (error) {
    console.error('❌ Erro ao registar comandos:', error)
  }
}
