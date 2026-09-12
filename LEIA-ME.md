# Mario Veiga Ink-Tattoo — versão HTML/CSS/JS puro

Conversão do projeto React/Vite/TypeScript original para HTML, CSS e
JavaScript simples, sem build, sem npm, sem framework. Basta abrir os
arquivos num navegador ou hospedar como estão.

## Estrutura

```
index.html              → página inicial (hero, sobre, serviços, como funciona, contato)
agendar.html            → fluxo de agendamento em 4 passos + pagamento Pix
404.html                → página de erro (o GitHub Pages usa isso automaticamente)
assets/css/style.css    → todo o visual do site
assets/js/config.js     → EDITE AQUI: nome do estúdio, preços, WhatsApp, chave Pix
assets/js/pix.js        → geração do código Pix "copia e cola" e do QR Code
assets/js/main.js       → menu, rolagem suave, animações, cards de serviço
assets/js/booking.js    → lógica dos 4 passos do agendamento
```

## O que mudou em relação ao projeto original

- **Sem React, sem Vite, sem build.** Os arquivos rodam direto no navegador.
- **Sem react-router:** viraram duas páginas reais (`index.html` e
  `agendar.html`), o que também é mais simples pro GitHub Pages.
- **Sem i18n (inglês/chinês):** todo o conteúdo do site já estava escrito
  fixo em português nos componentes originais, então o sistema de tradução
  foi removido. Se você quiser um site multi-idioma no futuro, dá pra
  reintroduzir isso depois.
- **Sem o SDK de analytics da Enter (`@enter-pro/analytics-sdk`)**: ele era
  específico da plataforma Enter/Lovable e não faz sentido fora dela. Se
  quiser métricas de visitas, posso te ajudar a colocar Google Analytics ou
  Plausible depois.
- **A lógica do Pix foi 100% preservada** (mesmo algoritmo EMV/CRC16), só
  traduzida de TypeScript para JavaScript puro — o QR Code continua sendo
  gerado no navegador da pessoa, sem servidor.
- **shadcn/Tailwind viraram CSS escrito à mão** em `assets/css/style.css`,
  mas o visual (cores, fontes, espaçamentos) é o mesmo.

## Como editar os dados do estúdio

Abra `assets/js/config.js`. Lá estão: nome, preços dos serviços, duração,
WhatsApp, Instagram, chave Pix e horários de atendimento. Não precisa mexer
em mais nenhum outro arquivo pra isso.

## Como testar localmente

Como o site usa `fetch`/módulos simples, o ideal é rodar por um servidor
local em vez de abrir o arquivo direto (`file://`). O jeito mais fácil:

```bash
# dentro da pasta do site
python3 -m http.server 8080
```

Depois acesse `http://localhost:8080` no navegador.

## Como publicar no GitHub Pages

1. Suba esta pasta inteira para um repositório no GitHub.
2. Nas configurações do repositório, vá em **Settings → Pages**.
3. Em "Source", selecione a branch (ex: `main`) e a pasta raiz (`/`).
4. Salve — o GitHub te dá uma URL tipo `https://seu-usuario.github.io/seu-repo/`.
