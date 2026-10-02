// Dados do Cardápio - Drika Personal Chef
// Atualizado com os cardápios oficiais: Low Carb e Tradicional & Fit (R$ 24,90/marmita)
// Cada item possui 'active: true' por padrão, podendo ser ativado/desativado no Painel da Chef

const DEFAULT_MENU_DATA = [
  // ==========================================
  // --- CARDÁPIO LOW CARB (R$ 24,90) ---
  // ==========================================
  {
    id: "lowcarb-01",
    title: "1. Lasanha de berinjela à bolonhesa",
    category: "lowcarb",
    categoryName: "Cardápio Low Carb",
    price: 24.90,
    image: "assets/refeicoes/1. lasanha de beringela.jpg",
    tags: ["Low Carb", "Sem Glúten", "Bolonhesa Caseira"],
    description: "Deliciosa lasanha artesanal montada com lâminas de berinjela fresca da horta, molho bolonhesa lento com carne de primeira e finalizada no forno.",
    calories: "340 kcal",
    portion: "400g",
    active: true
  },
  {
    id: "lowcarb-02",
    title: "2. Filé de sobrecoxa crocante com suflê de legumes e purê de abóbora",
    category: "lowcarb",
    categoryName: "Cardápio Low Carb",
    price: 24.90,
    image: "assets/refeicoes/2. FILE DE SOBRECOXA (2).jpg",
    tags: ["Low Carb", "High Protein", "Purê de Abóbora"],
    description: "Sobrecoxa dourada e crocante por fora, macia por dentro, acompanhada de suflê leve de legumes selecionados e purê aveludado de abóbora cabotiá.",
    calories: "380 kcal",
    portion: "420g",
    active: true
  },
  {
    id: "lowcarb-03",
    title: "3. Carne moída temperada com arroz de legumes",
    category: "lowcarb",
    categoryName: "Cardápio Low Carb",
    price: 24.90,
    image: "assets/refeicoes/3. CARNE MOIDA TEMPERADA COM LEGUMES.jpg",
    tags: ["Low Carb", "Sem Glúten", "Rico em Fibras"],
    description: "Carne bovina de primeira moída e refogada com ervas aromáticas e tempero caseiro da Chef, servida com arroz leve de legumes frescos picados.",
    calories: "360 kcal",
    portion: "400g",
    active: true
  },
  {
    id: "lowcarb-04",
    title: "4. Cubos de peito de frango com salada de legumes e grão-de-bico",
    category: "lowcarb",
    categoryName: "Cardápio Low Carb",
    price: 24.90,
    image: "assets/refeicoes/4.jpg",
    tags: ["Low Carb", "Grão-de-Bico", "High Protein"],
    description: "Cubos suculentos de peito de frango grelhados com ervas frescas, servidos com salada colorida de legumes cozidos no ponto e grão-de-bico temperado.",
    calories: "370 kcal",
    portion: "400g",
    active: true
  },
  {
    id: "lowcarb-05",
    title: "5. Caminha de batata-doce com frango cremoso e queijo",
    category: "lowcarb",
    categoryName: "Cardápio Low Carb",
    price: 24.90,
    image: "assets/refeicoes/5. CAMINHA DE BATATA DOCE.jpg",
    tags: ["Fit", "Frango Cremoso", "Batata-Doce"],
    description: "Base rústica e macia de batata-doce selecionada com generosa cobertura de frango desfiado cremoso e camada de queijo gratinado.",
    calories: "390 kcal",
    portion: "420g",
    active: true
  },
  {
    id: "lowcarb-06",
    title: "6. Pernil desfiado cremoso com purê de abóbora e couve",
    category: "lowcarb",
    categoryName: "Cardápio Low Carb",
    price: 24.90,
    image: "assets/refeicoes/6. PERNIL DESFIADO.jpg",
    tags: ["Low Carb", "Pernil Suculento", "Couve Refogada"],
    description: "Pernil suíno assado lentamente com especiarias e desfiado ao molho cremoso, acompanhado de purê cremoso de abóbora e couve refogadinha no alho.",
    calories: "410 kcal",
    portion: "420g",
    active: true
  },
  {
    id: "lowcarb-07",
    title: "7. Quibe recheado com cream cheese e salada de lentilha",
    category: "lowcarb",
    categoryName: "Cardápio Low Carb",
    price: 24.90,
    image: "assets/refeicoes/7. QUIBE RECHEADO.jpg",
    tags: ["Low Carb", "Cream Cheese", "Salada de Lentilha"],
    description: "Quibe artesanal de carne assado, recheado com farto cream cheese e servido com salada fresca e refrescante de lentilhas com ervas da horta.",
    calories: "380 kcal",
    portion: "400g",
    active: true
  },
  {
    id: "lowcarb-08",
    title: "8. Escondidinho de inhame com pernil desfiado",
    category: "lowcarb",
    categoryName: "Cardápio Low Carb",
    price: 24.90,
    image: "assets/refeicoes/8. ESCONDIDINHO.jpg",
    tags: ["Funcional", "Low Carb", "Inhame do Bem"],
    description: "Delicioso purê aveludado de inhame com alto valor nutricional, cobrindo pernil suíno desfiado e bem temperado, assado até dourar.",
    calories: "370 kcal",
    portion: "420g",
    active: true
  },
  {
    id: "lowcarb-09",
    title: "9. Frango em cubos com suflê de legumes",
    category: "lowcarb",
    categoryName: "Cardápio Low Carb",
    price: 24.90,
    image: "assets/refeicoes/9. FRANGO EM CUBOS.jpg",
    tags: ["Low Carb", "Suflê Leve", "High Protein"],
    description: "Peito de frango em cubinhos dourados ao azeite e ervas, acompanhado de um suflê aerado, leve e recheado de legumes frescos da estação.",
    calories: "350 kcal",
    portion: "400g",
    active: true
  },

  // ====================================================
  // --- CARDÁPIO TRADICIONAL E FIT (R$ 24,90) ---
  // ====================================================
  {
    id: "fit-01",
    title: "1. Quibe de forno recheado com cream cheese e arroz de lentilhas",
    category: "tradicional_fit",
    categoryName: "Cardápio Tradicional e Fit",
    price: 24.90,
    image: "assets/refeicoes/1. kibe de forno.jpg",
    tags: ["Tradicional & Fit", "Cream Cheese", "Arroz com Lentilha"],
    description: "Quibe de forno assado com recheio cremoso de cream cheese, acompanhado do clássico arroz com lentilhas acebolado com toque especial da Chef.",
    calories: "420 kcal",
    portion: "420g",
    active: true
  },
  {
    id: "fit-02",
    title: "2. Filé de sobrecoxa crocante com arroz, feijão e creme de milho",
    category: "tradicional_fit",
    categoryName: "Cardápio Tradicional e Fit",
    price: 24.90,
    image: "assets/refeicoes/2. file de sobrecoxa.jpg",
    tags: ["Tradicional", "Creme de Milho", "Feijão Caseiro"],
    description: "Sobrecoxa crocante e suculenta, servida com arroz branco soltinho, feijão carioca com tempero da horta e creme de milho aveludado e quentinho.",
    calories: "450 kcal",
    portion: "450g",
    active: true
  },
  {
    id: "fit-03",
    title: "3. Talharim com frango desfiado ao creme de milho e queijo",
    category: "tradicional_fit",
    categoryName: "Cardápio Tradicional e Fit",
    price: 24.90,
    image: "assets/refeicoes/3. talharim.jpg",
    tags: ["Massa Caseira", "Creme de Milho", "Queijo Gratinado"],
    description: "Massa talharim envolvida em molho aveludado de creme de milho fresco, frango desfiado macio e finalização irresistível com queijo derretido.",
    calories: "460 kcal",
    portion: "420g",
    active: true
  },
  {
    id: "fit-04",
    title: "4. Frango oriental com gergelim, arroz e brócolis com cenoura",
    category: "tradicional_fit",
    categoryName: "Cardápio Tradicional e Fit",
    price: 24.90,
    image: "assets/refeicoes/4. frango oriental com gergilim.jpg",
    tags: ["Fit", "Toque Oriental", "Gergelim & Brócolis"],
    description: "Cubos de frango salteados em molho estilo oriental suave, gergelim torrado crocante, arroz branquinho e mix crocante de brócolis e cenoura.",
    calories: "400 kcal",
    portion: "420g",
    active: true
  },
  {
    id: "fit-05",
    title: "5. Brasileirinho de frango grelhado ao creme de milho com arroz e feijão carioquinha",
    category: "tradicional_fit",
    categoryName: "Cardápio Tradicional e Fit",
    price: 24.90,
    image: "assets/refeicoes/5. brasileirinho de frango.jpg",
    tags: ["Brasileirinho", "Frango Grelhado", "Feijão Carioquinha"],
    description: "Frango grelhado ao ponto coberto com delicioso creme de milho artesanal, servido com o autêntico arroz branco e feijão carioquinha caseiro.",
    calories: "430 kcal",
    portion: "450g",
    active: true
  },
  {
    id: "fit-06",
    title: "6. Brasileirinho de frango grelhado ao creme de milho com arroz e feijão carioquinha",
    category: "tradicional_fit",
    categoryName: "Cardápio Tradicional e Fit",
    price: 24.90,
    image: "assets/refeicoes/5. brasileirinho de frango.jpg",
    tags: ["Brasileirinho", "Confort Food", "Caseiro & Saboroso"],
    description: "Segunda porção do consagrado brasileirinho de frango ao creme de milho verde com arroz e feijão, preparado com o carinho e afeto da Chef Drika.",
    calories: "430 kcal",
    portion: "450g",
    active: true
  },
  {
    id: "fit-07",
    title: "7. Brasileirinho de pernil suíno desfiado com arroz, feijão carioca e couve",
    category: "tradicional_fit",
    categoryName: "Cardápio Tradicional e Fit",
    price: 24.90,
    image: "assets/refeicoes/7. brasileirinho de pernil.jpg",
    tags: ["Brasileirinho", "Pernil Suíno", "Couve Refogada"],
    description: "Pernil suíno macio e desfiado com tempero caseiro, arroz solto, feijão carioca encorpado e couve manteiga fresca fininha refogada no alho.",
    calories: "460 kcal",
    portion: "450g",
    active: true
  },
  {
    id: "fit-08",
    title: "8. Brasileirinho de carne moída à primavera com arroz e feijão",
    category: "tradicional_fit",
    categoryName: "Cardápio Tradicional e Fit",
    price: 24.90,
    image: "assets/refeicoes/8. brasileirinho de carne moida.jpg",
    tags: ["Brasileirinho", "Primavera", "Carne Moída Especial"],
    description: "Carne moída nobre preparada com cubinhos coloridos de cenoura, milho e legumes à primavera, acompanhada da clássica dupla de arroz e feijão.",
    calories: "440 kcal",
    portion: "450g",
    active: true
  },
  {
    id: "fit-09",
    title: "9. Escondidinho de inhame com pernil desfiado e queijo",
    category: "tradicional_fit",
    categoryName: "Cardápio Tradicional e Fit",
    price: 24.90,
    image: "assets/refeicoes/9. escondidinho de inhame.jpg",
    tags: ["Escondidinho", "Inhame Nutritivo", "Queijo Gratinado"],
    description: "Combinação perfeita de purê cremoso de inhame com pernil suíno desfiado aromático, gratinado com camada dourada de queijo derretido.",
    calories: "440 kcal",
    portion: "430g",
    active: true
  },

  // ====================================================
  // --- PRODUTOS ARTESANAIS DA HORTA (COMPLEMENTARES) ---
  // ====================================================
  {
    id: "artesanal-01",
    title: "Geleia Artesanal de Jabuticaba da Horta",
    category: "produtos",
    categoryName: "Produtos Artesanais da Horta",
    price: 28.00,
    image: "assets/logo.jpg",
    tags: ["100% Fruta", "Sem Conservantes", "Edição Limitada"],
    description: "Produzida com jabuticabas frescas colhidas na horta urbana, cozimento lento e toque sutil de especiarias. Pote de vidro 240g.",
    portion: "240g",
    active: true
  },
  {
    id: "artesanal-02",
    title: "Compota Gourmet de Jiló Agridoce",
    category: "produtos",
    categoryName: "Produtos Artesanais da Horta",
    price: 26.00,
    image: "assets/logo.jpg",
    tags: ["Receita Exclusiva", "Agridoce", "Famosa da Chef"],
    description: "A famosa receita autoral da Chef Adriana! Feita com jiló fresco selecionado, especiarias nobres e redução suave. Surpreendente e deliciosa.",
    portion: "220g",
    active: true
  },
  {
    id: "artesanal-03",
    title: "Molho Pesto Especial de Ora-pro-nóbis & Castanhas",
    category: "produtos",
    categoryName: "Produtos Artesanais da Horta",
    price: 32.00,
    image: "assets/logo.jpg",
    tags: ["PANC", "Superfood", "Azeite Extravirgem"],
    description: "Pesto fresco à base de folhas jovens de ora-pro-nóbis da horta, castanha de caju brasileira, queijo curado artesanal e azeite extravirgem.",
    portion: "200g",
    active: true
  },

  // ====================================================
  // --- SERVIÇOS DE PERSONAL CHEF & EVENTOS ---
  // ====================================================
  {
    id: "chef-01",
    title: "Experiência Personal Chef em Domicílio (Menu 3 Passos)",
    category: "personalchef",
    categoryName: "Serviços de Personal Chef & Eventos",
    price: 180.00,
    priceUnit: "por pessoa (mín. 4 pessoas)",
    image: "assets/logo.jpg",
    tags: ["Experiência VIP", "Chef na sua Cozinha", "Menu Personalizado"],
    description: "A Chef Adriana vai até a sua residência para preparar um almoço ou jantar inesquecível. Inclui compras dos melhores ingredientes, pré-preparo, serviço e cozinha impecável.",
    portion: "Menu Personalizado",
    active: true
  },
  {
    id: "chef-02",
    title: "Consultoria & Plano de Marmitas da Semana Sob Medida",
    category: "personalchef",
    categoryName: "Serviços de Personal Chef & Eventos",
    price: 350.00,
    image: "assets/logo.jpg",
    tags: ["Nutrição Personalizada", "Semana Completa", "Praticidade"],
    description: "Elaboração de cardápio semanal exclusivo de acordo com sua dieta ou recomendação médica, preparo e entrega das refeições porcionadas e etiquetadas.",
    portion: "Pacote 10 marmitas personalizadas",
    active: true
  }
];

// Imagens Institucionais Padrão com Suporte a Carrossel Automático
const DEFAULT_SITE_IMAGES = {
  logo: "assets/LOGO.jpg",
  heroMode: "carousel", // 'carousel' ou 'single'
  heroChef: "assets/CHEF.jpg",
  heroCarousel: [
    { url: "assets/refeicoes/1. lasanha de beringela.jpg", caption: "Lasanha de Beringela Low Carb", tag: "Low Carb" },
    { url: "assets/refeicoes/2. FILE DE SOBRECOXA (2).jpg", caption: "Filé de Sobrecoxa com Purê & Legumes", tag: "Tradicional & Fit" },
    { url: "assets/refeicoes/3. CARNE MOIDA TEMPERADA COM LEGUMES.jpg", caption: "Carne Moída com Cenoura e Vagem Fresca", tag: "Prato da Semana" },
    { url: "assets/refeicoes/4.jpg", caption: "Refeição Completa, Saudável & Balanceada", tag: "Fit & Saudável" },
    { url: "assets/refeicoes/5. CAMINHA DE BATATA DOCE.jpg", caption: "Caminha de Batata Doce com Frango", tag: "Nutrição Ativa" },
    { url: "assets/refeicoes/6. PERNIL DESFIADO.jpg", caption: "Pernil Desfiado com Purê & Ervas Finas", tag: "Sabor Caseiro" },
    { url: "assets/refeicoes/7. QUIBE RECHEADO.jpg", caption: "Quibe Artesanal Recheado de Forno", tag: "Low Carb" },
    { url: "assets/refeicoes/8. ESCONDIDINHO.jpg", caption: "Escondidinho Cremoso Fit", tag: "Cozinha Afetiva" },
    { url: "assets/refeicoes/9. FRANGO EM CUBOS.jpg", caption: "Frango em Cubos com Legumes da Horta", tag: "Prato do Dia" }
  ],
  heroCarouselSubject: "Pratos Selecionados da Semana",
  heroCarouselInterval: 4000,
  aboutMode: "carousel", // 'carousel' ou 'single'
  aboutChef: "assets/quem sou eu/1.jpg",
  aboutCarousel: [
    { url: "assets/quem sou eu/1.jpg", caption: "Chef Adriana Corrêa (Drika) • Cozinha com Amor & Propósito" },
    { url: "assets/quem sou eu/2.jpg", caption: "Dedicação e Amor em Cada Refeição Preparada" },
    { url: "assets/quem sou eu/3.jpg", caption: "Ingredientes Selecionados, Frescos e Naturais" },
    { url: "assets/quem sou eu/4.jpg", caption: "Sabor Caseiro de Verdade com Técnica Gastronômica" },
    { url: "assets/quem sou eu/5.jpg", caption: "Praticidade e Nutrição para o Seu Dia a Dia" },
    { url: "assets/quem sou eu/6.jpg", caption: "Cardápios Balanceados Low Carb & Tradicional Fit" },
    { url: "assets/quem sou eu/7.jpg", caption: "Cozinha Afetiva e Gastronomia Funcional" },
    { url: "assets/quem sou eu/8.jpg", caption: "Direto da Horta para a Sua Mesa com Muito Carinho" },
    { url: "assets/quem sou eu/9.jpg", caption: "Chef Adriana Corrêa • Personal Chef & Marmitas Congeladas" }
  ],
  aboutCarouselInterval: 4000,
  flyerLowCarb: "assets/cardapio-low-carb.jpg",
  flyerTradicionalFit: "assets/cardapio-tradicional-fit.jpg"
};

// Depoimentos Reais
const REVIEWS_DATA = [
  {
    id: 1,
    name: "Stela S. M.",
    role: "Cliente Recorrente de Marmitas",
    avatar: "👩‍💼",
    text: "A Adriana é uma profissional exímia e dona de um conhecimento e técnica extraordinária! As marmitas low carb e fit têm sabor de comida de verdade feita na hora. Parabéns pelo excelente trabalho!",
    rating: 5
  },
  {
    id: 2,
    name: "Camila Guimarães",
    role: "Jantar de Aniversário Particular",
    avatar: "👩‍🌾",
    text: "A experiência com a Chef Drika no meu aniversário foi impecável! Todos os convidados elogiaram o sabor, a apresentação elegante e o carinho em cada detalhe.",
    rating: 5
  },
  {
    id: 3,
    name: "Rodrigo Mendonça",
    role: "Executivo em Home Office",
    avatar: "👨‍💻",
    text: "As marmitas congeladas da Drika salvaram minha rotina. O combo semanal com 10 marmitas é super prático, tempero suave no ponto certo, tudo fresquinho e saudável!",
    rating: 5
  }
];

// Aparições na Mídia
const DEFAULT_MEDIA_DATA = [
  {
    id: "media-01",
    title: "Parla Podcast",
    role: "Entrevista Exclusiva",
    desc: "A Chef Adriana Corrêa compartilhou sua história de vida e ensinou segredos da culinária com PANCs e gastronomia afetiva.\n\n📺 Ao vivo no YouTube – Parla Podcast\n🎙️ Apresentação: Leo Cardi & Hugo Martinelli\nhttps://www.youtube.com/watch?v=OnMrlKMM8ug",
    tag: "Podcast & Vídeo",
    linkUrl: "https://www.youtube.com/watch?v=OnMrlKMM8ug",
    image: "assets/logo.jpg"
  },
  {
    id: "media-02",
    title: "TV - Programa Papo em Dia",
    role: "Apresentação Culinária ao Vivo",
    desc: "Demonstração prática de gastronomia saudável na televisão com receitas autorais colhidas diretamente da horta.",
    tag: "Televisão",
    linkUrl: "",
    image: "assets/logo.jpg"
  }
];
