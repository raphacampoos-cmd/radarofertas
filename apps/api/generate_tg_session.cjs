const { TelegramClient } = require("telegram");
const { StringSession } = require("telegram/sessions");
const input = require("input");

const apiId = parseInt(process.env.TG_API_ID || "0", 10);
const apiHash = process.env.TG_API_HASH || "";

if (!apiId || !apiHash) {
  console.error("ERRO: Precisas de definir TG_API_ID e TG_API_HASH nas variáveis de ambiente!");
  console.log("Vai a https://my.telegram.org, cria uma aplicação, copia os valores e corre:");
  console.log("No Windows (PowerShell):");
  console.log("$env:TG_API_ID=\"1234567\"; $env:TG_API_HASH=\"abc123def\"; node generate_tg_session.cjs");
  process.exit(1);
}

const stringSession = new StringSession("");

(async () => {
  console.log("A iniciar cliente Telegram para gerar sessão...");
  const client = new TelegramClient(stringSession, apiId, apiHash, {
    connectionRetries: 5,
  });

  await client.start({
    phoneNumber: async () => await input.text("Insere o teu número de telemóvel (+351...): "),
    password: async () => await input.text("Insere a password de verificação em 2 Passos (se tiveres): "),
    phoneCode: async () => await input.text("Insere o código que recebeste no Telegram: "),
    onError: (err) => console.log(err),
  });

  console.log("Login com sucesso!");
  console.log("Aqui está a tua StringSession (Guarda isto como um segredo!):");
  console.log("\n" + client.session.save() + "\n");
  console.log("Coloca este valor na variável TG_SNIPER_SESSION no teu .env ou Railway.");
  
  await client.disconnect();
})();
