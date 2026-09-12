/**
 * DADOS DO ESTÚDIO — edite aqui todos os dados de negócio.
 * Nome, chave PIX, WhatsApp e os preços dos serviços.
 *
 * Este arquivo precisa ser carregado ANTES de pix.js, main.js e booking.js.
 */

var siteConfig = {
  studioName: "Mario Veiga Ink-Tattoo",
  tagline: "Tatuagem artística com traço próprio",

  city: "Bela Vista e Campo Grande, MS",
  address: "Bela Vista – MS",

  locations: [
    {
      name: "Bela Vista  MS",
      lat: -22.113451,
      lng: -56.5521839,
    },
    {
      name: "Campo Grande  MS",
      lat: -20.4238692,
      lng: -54.5737784,
    },
  ],

  instagram: "https://instagram.com/marioveiga_inktattoo",
  /** URL da foto de um trabalho (coloque aqui a imagem do seu portfólio) */
  aboutImage: "",
  /** WhatsApp com DDI + DDD + número, somente dígitos */
  whatsappNumber: "5567982022583",
  pix: {
    /** Chave PIX: "CPF" | "PHONE" | "EMAIL" | "RANDOM" */
    keyType: "CPF",
    /** Valor da chave PIX (CPF só com dígitos) */
    key: "04570802133",
    /** Nome que aparece no pagamento (máx. 25 caracteres) */
    merchantName: "MARIO VEIGA",
    /** Cidade que aparece no pagamento (máx. 15 caracteres) */
    merchantCity: "BELA VISTA",
  },
  /** Preços de exemplo — ajuste conforme seu orçamento */
  services: [
    {
      id: "pequena",
      name: "Tatuagem Pequena",
      description: "Até 5 cm — traços, símbolos e lettering",
      price: 150,
      durationMin: 60,
    },
    {
      id: "media",
      name: "Tatuagem Média",
      description: "5 a 15 cm — detalhes, sombras e composições",
      price: 350,
      durationMin: 120,
    },
    {
      id: "grande",
      name: "Tatuagem Grande",
      description: "Acima de 15 cm ou projeto fechado (por sessão)",
      price: 600,
      durationMin: 240,
    },
    {
      id: "coverup",
      name: "Cover-up",
      description: "Cobertura e repaginação de tatuagens antigas",
      price: 400,
      durationMin: 180,
    },
    {
      id: "retoque",
      name: "Retoque",
      description: "Retoque de trabalhos feitos no estúdio",
      price: 100,
      durationMin: 45,
    },
  ],
  /** Dias abertos: 0=domingo … 6=sábado */
  openDays: [1, 2, 3, 4, 5, 6],
  /** Horários disponíveis para agendamento */
  businessHours: [
    "09:00",
    "10:00",
    "11:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
  ],
  txidPrefix: "INK",
};
