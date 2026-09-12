# Tattoo Ink

Site institucional e de agendamento para um estúdio de tatuagem, desenvolvido em HTML, CSS e JavaScript puro.

## Objetivo

Apresentar o estúdio, seus serviços e permitir que o cliente realize o agendamento e o pagamento via Pix diretamente no navegador.

## Funcionalidades

- Página inicial com apresentação do estúdio
- Seção de serviços e informações
- Página de agendamento em etapas
- Geração de código Pix e QR Code
- Layout responsivo para desktop e mobile

## Estrutura do projeto

```text
/
├── index.html
├── agendar.html
├── 404.html
├── assets/
│   ├── css/
│   ├── img/
│   └── js/
│       ├── config.js
│       ├── booking.js
│       ├── main.js
│       ├── pix.js
│       └── qrcode.min.js
├── README.md
└── LEIA-ME.md
```

## Como rodar localmente

Na pasta do projeto, execute:

```bash
python -m http.server 8080
```

Depois abra no navegador:

```text
http://localhost:8080
```

## Onde editar os dados do site

Os principais dados do negócio ficam em:

- `assets/js/config.js`

Ali você pode ajustar:

- nome do estúdio
- serviços e preços
- WhatsApp
- Instagram
- chave Pix
- horários de atendimento

## Arquivos principais

- `index.html` — página inicial
- `agendar.html` — fluxo de agendamento
- `assets/css/style.css` — estilos gerais
- `assets/js/main.js` — interações da página
- `assets/js/booking.js` — lógica do agendamento
- `assets/js/pix.js` — geração do Pix

## Próximos passos sugeridos

- revisar textos e imagens
- melhorar o SEO e a descrição do site
- adicionar mais páginas internas
- otimizar a experiência no mobile
- integrar com WhatsApp ou backend real no futuro

## Observação

Este projeto foi pensado para ser simples de manter e evoluir sem framework ou build tools. Por isso, a maioria das alterações pode ser feita diretamente nos arquivos HTML, CSS e JS.
