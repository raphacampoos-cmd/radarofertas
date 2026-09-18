import { Client, GatewayIntentBits, REST, Routes, EmbedBuilder } from 'discord.js'
import { db } from '@radarofertas/db/client'
import { offers } from '@radarofertas/db/schema'
import { ilike, eq, desc, and } from 'drizzle-orm'

let client: Client | null = null

export async function initDiscordBot() {
  const token = process.env.DISCORD_BOT_TOKEN
  const clientId = process.env.DISCORD_CLIENT_ID

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

    // Registar comandos instantaneamente em todos os servidores (Guilds) que o bot estiver
    const rest = new REST({ version: '10' }).setToken(token)
    const commands = [
      {
        name: 'procurar',
        description: 'Procura por uma oferta ativa na base de dados do RadarOfertas',
        options: [{ name: 'produto', description: 'O que queres procurar? (Ex: ps5, airfryer)', type: 3, required: true }]
      }
    ]

    for (const [guildId, guild] of client!.guilds.cache) {
      try {
        await rest.put(Routes.applicationGuildCommands(clientId!, guildId), { body: commands })
        console.log(`✅ Comandos registados no servidor: ${guild.name}`)
      } catch (err) {
        console.error(`Erro ao registar comandos no servidor ${guild.name}:`, err)
      }
    }
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
      // Para já vamos simular o registo (numa fase 2 ligamos a uma tabela real de subscritores)
      await interaction.reply({ content: `✅ Boa! A partir de agora vou enviar-te uma mensagem privada sempre que houver uma oferta brutal na categoria **${categoria}**.`, ephemeral: true })
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

  // Escolher o canal com base no desconto ou categoria
  let canalId = CANAIS.TECH // default
  
  if (oferta.discountPct >= 40 || oferta.dealScore >= 90) {
    canalId = CANAIS.TOP_OFERTAS
  } else if (oferta.categoryId === 2) {
    canalId = CANAIS.CASA
  } else if (oferta.title.toLowerCase().includes('ps5') || oferta.title.toLowerCase().includes('gaming')) {
    canalId = CANAIS.GAMING
  }

  try {
    const channel = await client.channels.fetch(canalId)
    if (channel && 'send' in channel) {
      const embed = new EmbedBuilder()
        .setColor('#ef4444')
        .setTitle(`🔥 NOVO DESCONTO: ${oferta.title}`)
        .setURL(`https://radarofertas-psi.vercel.app/oferta/${oferta.slug}`)
        .setImage(oferta.imageUrl)
        .setDescription(`💰 **€${oferta.priceCurrent}** (antes €${oferta.priceOriginal})\n📉 Caiu ${oferta.discountPct}%!`)
        .setFooter({ text: 'RadarOfertas PT', iconURL: 'https://radarofertas-psi.vercel.app/favicon.ico' })
      
      await (channel as any).send({ embeds: [embed] })
    }
  } catch (err) {
    console.error('Erro ao enviar para canal Discord:', err)
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
