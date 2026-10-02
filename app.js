// Lógica da Aplicação - Drika Personal Chef
(function () {
  'use strict';

  // Configurações Globais Oficiais
  const DEFAULT_PHONE_NUMBER = "5511984337478"; // WhatsApp Oficial (11) 98433-7478
  const CART_STORAGE_KEY = "drika_chef_cart_v3";
  const MENU_STORAGE_KEY = "drika_custom_menu_v3";
  const SITE_IMAGES_STORAGE_KEY = "drika_custom_site_images_v3";
  const MEDIA_STORAGE_KEY = "drika_custom_media_v3";
  const AUTH_STORAGE_KEY = "drika_admin_credentials_v1";
  const PIX_STORAGE_KEY = "drika_pix_config_v1";
  const SESSION_AUTH_KEY = "drika_admin_authenticated";

  // Credenciais Padrão da Chef
  const DEFAULT_CREDENTIALS = {
    username: "drika",
    password: "drika2026"
  };

  // Configuração Padrão do Pix
  const DEFAULT_PIX_CONFIG = {
    key: "11984337478",
    keyType: "Celular / WhatsApp",
    owner: "Adriana Corrêa (Chef Drika)",
    bank: "Banco Digital / Pix",
    instructions: "Após transferir o valor, anexe o comprovante na conversa para agilizar a confirmação."
  };

  // Estado da Aplicação
  let currentCategory = "all";
  let searchKeyword = "";
  let cart = [];
  let currentMenuData = [];
  let currentSiteImages = {};
  let currentMediaData = [];
  let currentAdminTab = "menu-images";
  let adminDishFilter = "all"; // 'all' | 'active' | 'inactive'
  let isAuthenticated = false;
  let editingItemId = null;
  let editingMediaId = null;

  // Inicialização ao carregar o DOM
  document.addEventListener("DOMContentLoaded", () => {
    loadMenuData();
    loadSiteImages();
    loadMediaData();
    loadCartFromStorage();
    checkAuthSession();
    renderSiteImages();
    renderMenu();
    renderReviews();
    renderMedia();
    setupEventListeners();
    updateCartUI();
    setupDatePicker();

    if (window.lucide) {
      lucide.createIcons();
    }
  });

  // --- CONFIGURAÇÃO PIX & CONTATO ---
  function getPixConfig() {
    try {
      const saved = localStorage.getItem(PIX_STORAGE_KEY);
      return saved ? { ...DEFAULT_PIX_CONFIG, ...JSON.parse(saved) } : DEFAULT_PIX_CONFIG;
    } catch (e) {
      return DEFAULT_PIX_CONFIG;
    }
  }

  function savePixConfig(config) {
    try {
      localStorage.setItem(PIX_STORAGE_KEY, JSON.stringify(config));
      showToast("Configurações de Pix atualizadas com sucesso! 💠");
    } catch (e) {
      console.error("Erro ao salvar Pix:", e);
    }
  }

  function getChefPhoneNumber() {
    const pix = getPixConfig();
    return pix.whatsappPhone || DEFAULT_PHONE_NUMBER;
  }

  // --- AUTENTICAÇÃO E SEGURANÇA ---
  function getCredentials() {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_CREDENTIALS;
    } catch (e) {
      return DEFAULT_CREDENTIALS;
    }
  }

  function saveCredentials(username, password) {
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({ username, password }));
      showToast("Credenciais de acesso atualizadas com sucesso! 🔒");
    } catch (e) {
      console.error("Erro ao salvar credenciais:", e);
    }
  }

  function checkAuthSession() {
    isAuthenticated = sessionStorage.getItem(SESSION_AUTH_KEY) === "true";
    updateAdminUIState();
  }

  function login(username, password) {
    const creds = getCredentials();
    if (username.trim().toLowerCase() === creds.username.toLowerCase() && password === creds.password) {
      isAuthenticated = true;
      sessionStorage.setItem(SESSION_AUTH_KEY, "true");
      closeLoginModal();
      openAdminModal("menu-images");
      updateAdminUIState();
      showToast("Acesso autorizado! Bem-vinda, Chef Drika 👩‍🍳");
      return true;
    } else {
      return false;
    }
  }

  function logout() {
    isAuthenticated = false;
    sessionStorage.removeItem(SESSION_AUTH_KEY);
    closeAdminModal();
    updateAdminUIState();
    showToast("Sessão da Chef encerrada com segurança.");
  }

  function updateAdminUIState() {
    const adminBar = document.getElementById("admin-logged-bar");
    if (adminBar) {
      if (isAuthenticated) {
        adminBar.classList.remove("hidden");
      } else {
        adminBar.classList.add("hidden");
      }
    }
  }

  // --- CARREGAMENTO DE DADOS COM SUPORTE A ATIVAÇÃO/DESATIVAÇÃO ---
  function loadMenuData() {
    try {
      const saved = localStorage.getItem(MENU_STORAGE_KEY);
      if (saved) {
        currentMenuData = JSON.parse(saved);
        // Garante que cada item tenha o campo active (padrão true se indefinido)
        currentMenuData.forEach((item) => {
          if (item.active === undefined) item.active = true;
        });
      } else {
        currentMenuData = JSON.parse(JSON.stringify(DEFAULT_MENU_DATA));
        currentMenuData.forEach((item) => {
          if (item.active === undefined) item.active = true;
        });
      }
    } catch (e) {
      currentMenuData = JSON.parse(JSON.stringify(DEFAULT_MENU_DATA));
      currentMenuData.forEach((item) => {
        if (item.active === undefined) item.active = true;
      });
    }
  }

  function saveMenuData() {
    try {
      localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(currentMenuData));
    } catch (e) {
      console.error("Erro ao salvar cardápio no LocalStorage:", e);
      alert("Aviso: Limite de armazenamento local atingido. Tente usar imagens menores ou links de imagem.");
    }
  }

  function loadMediaData() {
    try {
      const saved = localStorage.getItem(MEDIA_STORAGE_KEY);
      if (saved) {
        currentMediaData = JSON.parse(saved);
      } else {
        currentMediaData = JSON.parse(JSON.stringify(DEFAULT_MEDIA_DATA));
      }
    } catch (e) {
      currentMediaData = JSON.parse(JSON.stringify(DEFAULT_MEDIA_DATA));
    }
  }

  function saveMediaData() {
    try {
      localStorage.setItem(MEDIA_STORAGE_KEY, JSON.stringify(currentMediaData));
    } catch (e) {
      console.error("Erro ao salvar mídia:", e);
    }
  }

  function loadSiteImages() {
    try {
      const saved = localStorage.getItem(SITE_IMAGES_STORAGE_KEY);
      if (saved) {
        currentSiteImages = JSON.parse(saved);
      } else {
        currentSiteImages = JSON.parse(JSON.stringify(DEFAULT_SITE_IMAGES));
      }
    } catch (e) {
      currentSiteImages = JSON.parse(JSON.stringify(DEFAULT_SITE_IMAGES));
    }
  }

  function saveSiteImages() {
    try {
      localStorage.setItem(SITE_IMAGES_STORAGE_KEY, JSON.stringify(currentSiteImages));
    } catch (e) {
      console.error("Erro ao salvar imagens do site:", e);
    }
  }

  function renderSiteImages() {
    const logoImgs = document.querySelectorAll(".site-logo-img");
    logoImgs.forEach((img) => {
      if (currentSiteImages.logo) img.src = currentSiteImages.logo;
    });

    const heroChefImg = document.getElementById("hero-chef-img");
    if (heroChefImg && currentSiteImages.heroChef) {
      heroChefImg.src = currentSiteImages.heroChef;
    }

    const aboutChefImg = document.getElementById("about-chef-img");
    if (aboutChefImg && currentSiteImages.aboutChef) {
      aboutChefImg.src = currentSiteImages.aboutChef;
    }
  }

  // --- PERSISTÊNCIA DO CARRINHO ---
  function loadCartFromStorage() {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      cart = saved ? JSON.parse(saved) : [];
    } catch (e) {
      cart = [];
    }
  }

  function saveCartToStorage() {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (e) {
      console.error("Erro ao salvar carrinho:", e);
    }
  }

  // --- CATEGORIAS & LABELS ---
  function getCategoryLabel(category) {
    const map = {
      lowcarb: "Cardápio Low Carb",
      tradicional_fit: "Cardápio Tradicional e Fit",
      marmitas: "Marmitas Saudáveis & Fit",
      produtos: "Produtos Artesanais da Horta",
      personalchef: "Serviços de Personal Chef & Eventos",
      doces: "Doces & Sobremesas Fit",
      ceias: "Ceias & Menus de Festas"
    };
    return map[category] || "Especialidade";
  }

  function updateCategoryButtonsUI() {
    document.querySelectorAll(".category-btn").forEach((btn) => {
      const cat = btn.getAttribute("data-category");
      if (cat === currentCategory) {
        btn.className = "category-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-[#384F32] text-white shadow-md transition whitespace-nowrap active:scale-95";
      } else {
        btn.className = "category-btn px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-white text-[#384F32] border border-[#DCD5C8] hover:bg-[#F3EFEA] transition whitespace-nowrap active:scale-95";
      }
    });
  }

  // --- RENDERIZAÇÃO DO CARDÁPIO NA PÁGINA PRINCIPAL (SOMENTE PRATOS ATIVOS) ---
  function renderMenu() {
    const grid = document.getElementById("menu-grid");
    if (!grid) return;

    // Filtra estritamente apenas os pratos com active !== false
    const filtered = currentMenuData.filter((item) => {
      const isActive = item.active !== false;
      if (!isActive) return false; // PRATOS DESATIVADOS NÃO SÃO EXIBIDOS NA PÁGINA PRINCIPAL

      const matchesCategory = currentCategory === "all" || item.category === currentCategory;
      const matchesSearch =
        !searchKeyword ||
        item.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.description.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (item.tags && item.tags.some((t) => t.toLowerCase().includes(searchKeyword.toLowerCase())));
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div class="col-span-full py-12 text-center bg-white rounded-3xl border border-stone-200 p-8 shadow-xs">
          <div class="inline-flex p-4 rounded-full bg-amber-50 text-amber-600 mb-3">
            <i data-lucide="search-x" class="w-8 h-8"></i>
          </div>
          <h3 class="text-xl font-serif font-bold text-gray-800 mb-1">Nenhum item disponível no momento</h3>
          <p class="text-gray-500 max-w-md mx-auto text-sm">Os pratos desta categoria podem estar em pausa para reposição de insumos frescos da horta. Tente outra categoria ou confira nossos outros pratos ativos!</p>
          <button id="btn-reset-filters" class="mt-4 px-5 py-2.5 text-xs font-bold text-white bg-earth-olive rounded-xl hover:bg-earth-dark transition shadow-sm">
            Ver todas as opções ativas
          </button>
        </div>
      `;
      const resetBtn = document.getElementById("btn-reset-filters");
      if (resetBtn) {
        resetBtn.addEventListener("click", () => {
          currentCategory = "all";
          searchKeyword = "";
          const searchInput = document.getElementById("menu-search-input");
          if (searchInput) searchInput.value = "";
          updateCategoryButtonsUI();
          renderMenu();
        });
      }
      if (window.lucide) lucide.createIcons();
      return;
    }

    grid.innerHTML = filtered
      .map((item) => {
        const isChefService = item.category === "personalchef";
        const isMarmita = item.category === "lowcarb" || item.category === "tradicional_fit" || item.category === "marmitas";
        const priceLabel = item.priceUnit
          ? `R$ ${Number(item.price).toFixed(2).replace('.', ',')} <span class="text-xs text-gray-500 font-normal">/${item.priceUnit}</span>`
          : `R$ ${Number(item.price).toFixed(2).replace('.', ',')}`;

        const isLowCarb = item.category === "lowcarb";
        const categoryBadgeColor = isLowCarb 
          ? "bg-emerald-100 text-emerald-900 border-emerald-200" 
          : (item.category === "tradicional_fit" ? "bg-amber-100 text-amber-900 border-amber-200" : "bg-stone-100 text-stone-800 border-stone-200");

        return `
        <div class="bg-white rounded-3xl overflow-hidden border border-[#E8E2D6] card-hover-effect flex flex-col justify-between shadow-sm relative group">
          
          <!-- Imagem / Logo Oficial Drika -->
          <div class="relative overflow-hidden aspect-[4/3] bg-gradient-to-br from-stone-100 to-[#FAF8F4] flex items-center justify-center border-b border-[#F0EBE1]">
            <img 
              src="${item.image}" 
              alt="${item.title}" 
              class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
            
            <!-- Tags flutuantes -->
            <div class="absolute top-3 left-3 flex flex-wrap gap-1.5 max-w-[85%]">
              ${(item.tags || [])
                .map((tag) => {
                  const isPanc = tag.includes("PANC") || tag.includes("Orgânico");
                  const isLow = tag.includes("Low Carb") || tag.includes("Fit");
                  return `<span class="px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                    isPanc ? "tag-panc" : (isLow ? "bg-emerald-900/90 text-white backdrop-blur-sm shadow-sm" : "bg-white/95 text-stone-800 backdrop-blur-sm shadow-sm border border-stone-200")
                  }">${tag}</span>`;
                })
                .join("")}
            </div>

            <!-- Porção / Peso -->
            ${item.portion ? `<span class="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-black/70 text-white text-[11px] font-semibold backdrop-blur-sm">${item.portion}</span>` : ""}
            
            ${isMarmita ? `<span class="absolute bottom-3 left-3 px-2 py-0.5 rounded text-[10px] font-bold bg-white/90 text-earth-olive border border-earth-sand/80 shadow-xs">Marmita Congelada</span>` : ""}
          </div>

          <!-- Informações do Prato -->
          <div class="p-6 flex-1 flex flex-col justify-between">
            <div>
              <div class="flex items-center justify-between gap-2 mb-2">
                <span class="text-[11px] font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${categoryBadgeColor}">
                  ${item.categoryName || getCategoryLabel(item.category)}
                </span>
                ${item.calories ? `<span class="text-[11px] text-stone-500 font-medium">🔥 ${item.calories}</span>` : ""}
              </div>

              <h3 class="text-lg font-bold text-[#1D261C] font-serif-title leading-snug mb-2 group-hover:text-earth-olive transition-colors">
                ${item.title}
              </h3>
              
              <p class="text-xs sm:text-sm text-[#5C695A] line-clamp-3 mb-4 leading-relaxed">
                ${item.description}
              </p>
            </div>

            <div class="pt-4 border-t border-[#F0EBE1] flex items-center justify-between gap-2">
              <div>
                <span class="text-[11px] text-stone-400 block font-medium">Valor unitário</span>
                <span class="text-xl font-extrabold text-[#233420] font-serif-title">${priceLabel}</span>
              </div>
              <button 
                onclick="window.drikaApp.addToCart('${item.id}')"
                class="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#384F32] hover:bg-[#233420] text-white shadow-md hover:shadow-lg transition active:scale-95"
                title="Adicionar ao pedido"
              >
                <i data-lucide="${isChefService ? 'calendar-plus' : 'plus'}" class="w-4 h-4"></i>
                <span>${isChefService ? "Agendar" : "Adicionar"}</span>
              </button>
            </div>
          </div>
        </div>
      `;
      })
      .join("");

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  // --- GERENCIAMENTO DO CARRINHO & DESCONTOS DE COMBOS ---
  function addToCart(itemId, qty = 1) {
    const item = currentMenuData.find((i) => i.id === itemId);
    if (!item) return;

    // Se o item estiver desativado pela Chef, bloqueia adição
    if (item.active === false) {
      showToast(`O prato "${item.title}" está temporariamente pausado por falta de insumos.`);
      return;
    }

    const existingIndex = cart.findIndex((i) => i.id === itemId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
    } else {
      cart.push({
        id: item.id,
        title: item.title,
        price: Number(item.price),
        category: item.category,
        image: item.image,
        quantity: qty,
        portion: item.portion || ""
      });
    }

    saveCartToStorage();
    updateCartUI();
    showToast(`"${item.title}" adicionado ao pedido! 🌿`);
  }

  function updateQuantity(itemId, delta) {
    const itemIndex = cart.findIndex((i) => i.id === itemId);
    if (itemIndex === -1) return;

    cart[itemIndex].quantity += delta;
    if (cart[itemIndex].quantity <= 0) {
      cart.splice(itemIndex, 1);
    }

    saveCartToStorage();
    updateCartUI();
  }

  function removeFromCart(itemId) {
    cart = cart.filter((i) => i.id !== itemId);
    saveCartToStorage();
    updateCartUI();
    showToast("Item removido do carrinho.");
  }

  function clearCart() {
    if (cart.length === 0) return;
    if (confirm("Deseja realmente limpar todos os itens do carrinho?")) {
      cart = [];
      saveCartToStorage();
      updateCartUI();
      showToast("Carrinho limpo.");
    }
  }

  // Atalho para adicionar kits completos em 1 clique (apenas pratos ATIVOS)
  function addComboShortcut(comboType) {
    if (comboType === "kit-5-lowcarb") {
      const lowCarbItems = currentMenuData.filter((i) => i.category === "lowcarb" && i.active !== false).slice(0, 5);
      if (lowCarbItems.length === 0) {
        showToast("Não há marmitas Low Carb ativas no momento.");
        return;
      }
      lowCarbItems.forEach((item) => addToCart(item.id, 1));
      showToast("Kit 5 Marmitas Low Carb adicionado ao carrinho com desconto! 🥑✨");
      openCartDrawer();
    } else if (comboType === "kit-5-fit") {
      const fitItems = currentMenuData.filter((i) => i.category === "tradicional_fit" && i.active !== false).slice(0, 5);
      if (fitItems.length === 0) {
        showToast("Não há marmitas Fit ativas no momento.");
        return;
      }
      fitItems.forEach((item) => addToCart(item.id, 1));
      showToast("Kit 5 Marmitas Tradicional & Fit adicionado com desconto! 🍱✨");
      openCartDrawer();
    } else if (comboType === "kit-10-misto") {
      const lowCarbItems = currentMenuData.filter((i) => i.category === "lowcarb" && i.active !== false).slice(0, 5);
      const fitItems = currentMenuData.filter((i) => i.category === "tradicional_fit" && i.active !== false).slice(0, 5);
      if (lowCarbItems.length === 0 && fitItems.length === 0) {
        showToast("Não há marmitas ativas disponíveis para o kit misto no momento.");
        return;
      }
      lowCarbItems.forEach((item) => addToCart(item.id, 1));
      fitItems.forEach((item) => addToCart(item.id, 1));
      showToast("Kit 10 Marmitas Misto (Super Desconto) adicionado! 🎉");
      openCartDrawer();
    }
  }

  function getCartSubtotal() {
    return cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  function getTotalItemsCount() {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getMarmitaCount() {
    return cart
      .filter((i) => i.category === "lowcarb" || i.category === "tradicional_fit" || i.category === "marmitas")
      .reduce((sum, item) => sum + item.quantity, 0);
  }

  // Cálculo de desconto dos combos
  function getComboDiscountDetails() {
    const count = getMarmitaCount();
    if (count < 5) {
      return { count, discount: 0, label: "", finalMarmitasTotal: count * 24.90 };
    }

    const groupsOf10 = Math.floor(count / 10);
    const remAfter10 = count % 10;
    const groupsOf5 = Math.floor(remAfter10 / 5);

    const discount = (groupsOf10 * 19.10) + (groupsOf5 * 4.60);
    let label = "";
    if (groupsOf10 > 0 && groupsOf5 > 0) {
      label = `Combo Semanal (${groupsOf10 * 10 + groupsOf5 * 5} marmitas com desconto)`;
    } else if (groupsOf10 > 0) {
      label = `Combo Semanal ${groupsOf10 * 10} Marmitas (R$ 229,90/kit)`;
    } else if (groupsOf5 > 0) {
      label = `Combo Semanal 5 Marmitas (R$ 119,90/kit)`;
    }

    return { count, discount, label, finalMarmitasTotal: (count * 24.90) - discount };
  }

  function updateCartUI() {
    const totalCount = getTotalItemsCount();
    const subtotal = getCartSubtotal();
    const { count: marmitaCount, discount: comboDiscount, label: comboLabel } = getComboDiscountDetails();
    const totalFinal = Math.max(0, subtotal - comboDiscount);

    const badges = document.querySelectorAll(".cart-count-badge");
    badges.forEach((badge) => {
      badge.textContent = totalCount;
      if (totalCount > 0) {
        badge.classList.remove("hidden");
        badge.classList.add("flex");
      } else {
        badge.classList.add("hidden");
        badge.classList.remove("flex");
      }
    });

    const cartItemsContainer = document.getElementById("cart-items-container");
    const cartEmptyState = document.getElementById("cart-empty-state");
    const cartFooter = document.getElementById("cart-footer");
    const subtotalEl = document.getElementById("cart-subtotal-val");
    const discountEl = document.getElementById("cart-discount-row");
    const totalEl = document.getElementById("cart-total-val");
    const pixBox = document.getElementById("cart-pix-box");

    if (subtotalEl) {
      subtotalEl.textContent = `R$ ${subtotal.toFixed(2).replace('.', ',')}`;
    }

    if (discountEl) {
      if (comboDiscount > 0) {
        discountEl.classList.remove("hidden");
        discountEl.innerHTML = `
          <div class="flex items-center justify-between text-xs font-bold text-emerald-700 bg-emerald-50 p-2.5 rounded-xl border border-emerald-200">
            <span class="flex items-center gap-1.5">
              <i data-lucide="tag" class="w-3.5 h-3.5"></i>
              <span>${comboLabel}</span>
            </span>
            <span>- R$ ${comboDiscount.toFixed(2).replace('.', ',')}</span>
          </div>
        `;
      } else {
        discountEl.classList.add("hidden");
      }
    }

    if (totalEl) {
      totalEl.textContent = `R$ ${totalFinal.toFixed(2).replace('.', ',')}`;
    }

    if (pixBox) {
      const pix = getPixConfig();
      pixBox.innerHTML = `
        <div class="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2 text-xs">
          <div class="flex items-center justify-between">
            <span class="font-bold text-earth-dark flex items-center gap-1.5">
              <i data-lucide="qr-code" class="w-4 h-4 text-emerald-700"></i>
              <span>Pagamento via Pix (Transferência Rápida)</span>
            </span>
            <span class="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">Oficial</span>
          </div>
          <div class="flex items-center gap-2 bg-white p-2 rounded-xl border border-stone-200">
            <code class="font-mono text-xs font-bold text-stone-800 flex-1 truncate select-all" id="pix-key-display">${pix.key}</code>
            <button 
              type="button" 
              onclick="window.drikaApp.copyPixKey()" 
              class="px-2.5 py-1 text-[11px] font-bold bg-earth-olive hover:bg-earth-dark text-white rounded-lg transition active:scale-95 flex items-center gap-1"
              title="Copiar Chave Pix"
            >
              <i data-lucide="copy" class="w-3 h-3"></i>
              <span>Copiar</span>
            </button>
          </div>
          <div class="text-[11px] text-stone-600 flex justify-between">
            <span><strong>Titular:</strong> ${pix.owner}</span>
            <span><strong>Tipo:</strong> ${pix.keyType}</span>
          </div>
        </div>
      `;
    }

    const comboNoticeEl = document.getElementById("cart-combo-notice");
    if (comboNoticeEl) {
      if (marmitaCount === 3 || marmitaCount === 4) {
        const needed = 5 - marmitaCount;
        comboNoticeEl.classList.remove("hidden");
        comboNoticeEl.innerHTML = `💡 <em>Adicione mais <strong>${needed} marmita${needed > 1 ? 's' : ''}</strong> para ativar o desconto do <strong>Kit 5 por R$ 119,90</strong>!</em>`;
      } else if (marmitaCount === 8 || marmitaCount === 9) {
        const needed = 10 - marmitaCount;
        comboNoticeEl.classList.remove("hidden");
        comboNoticeEl.innerHTML = `🔥 <em>Faltam apenas <strong>${needed} marmita${needed > 1 ? 's' : ''}</strong> para ativar o <strong>Super Desconto do Kit 10 por R$ 229,90</strong>!</em>`;
      } else {
        comboNoticeEl.classList.add("hidden");
      }
    }

    if (!cartItemsContainer) return;

    if (cart.length === 0) {
      if (cartEmptyState) cartEmptyState.classList.remove("hidden");
      if (cartItemsContainer) cartItemsContainer.classList.add("hidden");
      if (cartFooter) cartFooter.classList.add("opacity-50", "pointer-events-none");
    } else {
      if (cartEmptyState) cartEmptyState.classList.add("hidden");
      if (cartItemsContainer) cartItemsContainer.classList.remove("hidden");
      if (cartFooter) cartFooter.classList.remove("opacity-50", "pointer-events-none");

      cartItemsContainer.innerHTML = cart
        .map(
          (item) => `
        <div class="flex gap-3 py-3 border-b border-[#F0EBE1] items-center">
          <img src="${item.image}" alt="${item.title}" class="w-14 h-14 rounded-xl object-cover bg-stone-100 flex-shrink-0 border border-stone-200" />
          <div class="flex-1 min-w-0">
            <h4 class="text-xs sm:text-sm font-semibold text-[#1D261C] truncate">${item.title}</h4>
            <span class="text-xs text-[#BD6645] font-semibold">R$ ${Number(item.price).toFixed(2).replace('.', ',')} un.</span>
            ${item.portion ? `<span class="text-[11px] text-gray-400 block">${item.portion}</span>` : ""}
            
            <div class="flex items-center gap-2 mt-1.5">
              <div class="inline-flex items-center border border-[#D8D0C2] rounded-lg bg-[#FAF8F4] overflow-hidden">
                <button 
                  onclick="window.drikaApp.updateQuantity('${item.id}', -1)"
                  class="px-2 py-0.5 text-stone-600 hover:bg-stone-200 transition font-bold text-xs"
                  aria-label="Diminuir quantidade"
                >-</button>
                <span class="px-2 text-xs font-bold text-stone-800">${item.quantity}</span>
                <button 
                  onclick="window.drikaApp.updateQuantity('${item.id}', 1)"
                  class="px-2 py-0.5 text-stone-600 hover:bg-stone-200 transition font-bold text-xs"
                  aria-label="Aumentar quantidade"
                >+</button>
              </div>
              <span class="text-xs font-bold text-[#233420] ml-auto">R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
          <button 
            onclick="window.drikaApp.removeFromCart('${item.id}')"
            class="p-1.5 text-gray-400 hover:text-red-500 transition rounded-lg hover:bg-red-50"
            title="Remover item"
          >
            <i data-lucide="trash-2" class="w-4 h-4"></i>
          </button>
        </div>
      `
        )
        .join("");
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function copyPixKey() {
    const pix = getPixConfig();
    navigator.clipboard.writeText(pix.key).then(() => {
      showToast("Chave Pix copiada com sucesso! 💠📋");
    }).catch(() => {
      prompt("Copie a Chave Pix manualmente:", pix.key);
    });
  }

  // --- CONTROLE DO DRAWER DO CARRINHO ---
  function openCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-backdrop");
    if (drawer && backdrop) {
      backdrop.classList.remove("hidden");
      setTimeout(() => {
        backdrop.classList.remove("opacity-0");
        drawer.classList.remove("translate-x-full");
      }, 10);
      document.body.classList.add("overflow-hidden");
    }
  }

  function closeCartDrawer() {
    const drawer = document.getElementById("cart-drawer");
    const backdrop = document.getElementById("cart-backdrop");
    if (drawer && backdrop) {
      drawer.classList.add("translate-x-full");
      backdrop.classList.add("opacity-0");
      setTimeout(() => {
        backdrop.classList.add("hidden");
      }, 300);
      document.body.classList.remove("overflow-hidden");
    }
  }

  // --- CONTROLE DO MODAL DE PANFLETOS OFICIAIS ---
  function openFlyerModal(type = "lowcarb") {
    const modal = document.getElementById("flyer-modal");
    const backdrop = document.getElementById("flyer-backdrop");
    const flyerImg = document.getElementById("flyer-modal-img");
    const flyerTitle = document.getElementById("flyer-modal-title");
    const flyerDownloadBtn = document.getElementById("flyer-download-btn");

    if (modal && backdrop && flyerImg && flyerTitle) {
      if (type === "lowcarb") {
        flyerImg.src = currentSiteImages.flyerLowCarb || "assets/cardapio-low-carb.jpg";
        flyerTitle.textContent = "Cardápio Oficial Low Carb • Setembro (R$ 24,90/un)";
        if (flyerDownloadBtn) flyerDownloadBtn.href = flyerImg.src;
      } else {
        flyerImg.src = currentSiteImages.flyerTradicionalFit || "assets/cardapio-tradicional-fit.jpg";
        flyerTitle.textContent = "Cardápio Oficial Tradicional & Fit • Setembro (R$ 24,90/un)";
        if (flyerDownloadBtn) flyerDownloadBtn.href = flyerImg.src;
      }

      backdrop.classList.remove("hidden");
      modal.classList.remove("hidden");
      setTimeout(() => {
        backdrop.classList.remove("opacity-0");
        modal.classList.remove("opacity-0", "scale-95");
      }, 10);
      document.body.classList.add("overflow-hidden");
    }
  }

  function closeFlyerModal() {
    const modal = document.getElementById("flyer-modal");
    const backdrop = document.getElementById("flyer-backdrop");
    if (modal && backdrop) {
      modal.classList.add("opacity-0", "scale-95");
      backdrop.classList.add("opacity-0");
      setTimeout(() => {
        modal.classList.add("hidden");
        backdrop.classList.add("hidden");
      }, 300);
      document.body.classList.remove("overflow-hidden");
    }
  }

  // --- CONFIGURAÇÃO DE DATA MÍNIMA ---
  function setupDatePicker() {
    const dateInput = document.getElementById("checkout-date");
    if (dateInput) {
      const today = new Date();
      const minDate = today.toISOString().split("T")[0];
      dateInput.min = minDate;
      dateInput.value = minDate;
    }
  }

  // --- FINALIZAÇÃO VIA WHATSAPP COM PIX & COMBOS ---
  function checkoutWhatsApp() {
    if (cart.length === 0) {
      alert("Seu carrinho está vazio! Escolha itens no cardápio antes de prosseguir.");
      return;
    }

    const name = document.getElementById("checkout-name")?.value.trim();
    const phone = document.getElementById("checkout-phone")?.value.trim();
    const deliveryType = document.querySelector('input[name="delivery-type"]:checked')?.value || "delivery";
    const address = document.getElementById("checkout-address")?.value.trim();
    const date = document.getElementById("checkout-date")?.value;
    const period = document.getElementById("checkout-period")?.value;
    const notes = document.getElementById("checkout-notes")?.value.trim();

    if (!name) {
      alert("Por favor, preencha o seu nome completo.");
      document.getElementById("checkout-name")?.focus();
      return;
    }

    if (!phone) {
      alert("Por favor, preencha o seu número de WhatsApp para contato.");
      document.getElementById("checkout-phone")?.focus();
      return;
    }

    if (deliveryType === "delivery" && !address) {
      alert("Por favor, preencha o endereço completo de entrega.");
      document.getElementById("checkout-address")?.focus();
      return;
    }

    let formattedDate = "A combinar";
    if (date) {
      const [y, m, d] = date.split("-");
      formattedDate = `${d}/${m}/${y}`;
    }

    const subtotal = getCartSubtotal();
    const { count: marmitaCount, discount: comboDiscount, label: comboLabel } = getComboDiscountDetails();
    const totalFinal = Math.max(0, subtotal - comboDiscount);
    const pix = getPixConfig();
    const chefPhone = getChefPhoneNumber();

    let msg = `🌿 *NOVO PEDIDO - DRIKA PERSONAL CHEF* 🌿\n`;
    msg += `------------------------------------\n`;
    msg += `👤 *Cliente:* ${name}\n`;
    msg += `📱 *WhatsApp:* ${phone}\n`;
    msg += `🚚 *Modalidade:* ${deliveryType === "delivery" ? "Entrega / Delivery" : "Retirada no Local"}\n`;
    if (deliveryType === "delivery") {
      msg += `📍 *Endereço:* ${address}\n`;
    }
    msg += `📅 *Data Desejada:* ${formattedDate} (${period || "Horário a combinar"})\n`;
    if (notes) {
      msg += `📝 *Observações / Restrições:* ${notes}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `🛒 *ITENS DO PEDIDO (${getTotalItemsCount()} no total):*\n\n`;

    cart.forEach((item, index) => {
      msg += `${index + 1}. *${item.quantity}x* ${item.title}\n`;
      msg += `   └ R$ ${(item.price * item.quantity).toFixed(2).replace('.', ',')} (${item.portion || "Porção padrão"})\n`;
    });

    msg += `\n------------------------------------\n`;
    msg += `💰 *Subtotal dos Itens:* R$ ${subtotal.toFixed(2).replace('.', ',')}\n`;
    
    if (comboDiscount > 0) {
      msg += `🎁 *Desconto ${comboLabel}:* -R$ ${comboDiscount.toFixed(2).replace('.', ',')}\n`;
      msg += `✨ *TOTAL DOS ITENS COM DESCONTO:* R$ ${totalFinal.toFixed(2).replace('.', ',')}\n`;
    } else {
      msg += `✨ *TOTAL DOS ITENS:* R$ ${totalFinal.toFixed(2).replace('.', ',')}\n`;
    }

    if (deliveryType === "delivery") {
      msg += `*(Taxa de entrega calculada de acordo com o endereço)*\n`;
    }

    msg += `------------------------------------\n`;
    msg += `💠 *PAGAMENTO VIA PIX:*\n`;
    msg += `🔑 *Chave Pix:* ${pix.key}\n`;
    msg += `👤 *Titular:* ${pix.owner} (${pix.keyType})\n`;
    msg += `ℹ️ ${pix.instructions}\n`;
    msg += `------------------------------------\n`;
    msg += `Olá Chef Drika! Gostaria de confirmar a disponibilidade dos pratos e fechar este pedido. Aguardo sua confirmação! ✨`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${chefPhone}?text=${encodedMsg}`;
    window.open(whatsappUrl, "_blank");
  }

  // --- ORÇAMENTO RÁPIDO PARA EVENTOS ---
  function sendEventQuoteWhatsApp(e) {
    if (e) e.preventDefault();
    const eventName = document.getElementById("event-name")?.value.trim();
    const eventPhone = document.getElementById("event-phone")?.value.trim();
    const eventType = document.getElementById("event-type")?.value;
    const eventGuests = document.getElementById("event-guests")?.value;
    const eventDate = document.getElementById("event-date")?.value;
    const eventDetails = document.getElementById("event-details")?.value.trim();

    if (!eventName || !eventPhone) {
      alert("Por favor, informe seu nome e telefone para contato.");
      return;
    }

    const chefPhone = getChefPhoneNumber();

    let msg = `✨ *SOLICITAÇÃO DE ORÇAMENTO - EVENTOS & PERSONAL CHEF* ✨\n`;
    msg += `------------------------------------\n`;
    msg += `👤 *Nome:* ${eventName}\n`;
    msg += `📱 *Telefone:* ${eventPhone}\n`;
    msg += `🎉 *Tipo de Evento:* ${eventType || "Evento Gastronômico"}\n`;
    msg += `👥 *Nº de Convidados:* ${eventGuests || "A definir"}\n`;
    msg += `📅 *Data Prevista:* ${eventDate || "A combinar"}\n`;
    if (eventDetails) {
      msg += `📋 *Detalhes / Preferências:* ${eventDetails}\n`;
    }
    msg += `------------------------------------\n`;
    msg += `Olá Chef Adriana! Gostaria de receber uma proposta personalizada para este evento. Muito obrigado(a)! 🌿`;

    const encodedMsg = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${chefPhone}?text=${encodedMsg}`;
    window.open(whatsappUrl, "_blank");
  }

  // --- RENDERIZADORES DE DEPOIMENTOS & MÍDIA ---
  function renderReviews() {
    const container = document.getElementById("reviews-grid");
    if (!container) return;

    container.innerHTML = REVIEWS_DATA.map(
      (r) => `
      <div class="bg-white rounded-3xl p-7 border border-[#E8E2D6] shadow-sm flex flex-col justify-between card-hover-effect">
        <div>
          <div class="flex items-center gap-1 text-amber-400 mb-3">
            ${Array(r.rating).fill('<i data-lucide="star" class="w-4 h-4 fill-amber-400"></i>').join("")}
          </div>
          <p class="text-[#3A4538] text-sm leading-relaxed italic mb-6">
            "${r.text}"
          </p>
        </div>
        <div class="flex items-center gap-3 pt-4 border-t border-[#F0EBE1]">
          <div class="w-10 h-10 rounded-full bg-[#EAE4D8] flex items-center justify-center text-lg">
            ${r.avatar}
          </div>
          <div>
            <h4 class="font-bold text-sm text-[#1D261C]">${r.name}</h4>
            <span class="text-xs text-[#7D8A7A]">${r.role}</span>
          </div>
        </div>
      </div>
    `
    ).join("");
  }

  function renderMedia() {
    const container = document.getElementById("media-grid");
    if (!container) return;

    container.innerHTML = currentMediaData.map(
      (m) => {
        const hasYoutube = m.linkUrl && (m.linkUrl.includes("youtube.com") || m.linkUrl.includes("youtu.be"));
        const linkButton = m.linkUrl
          ? `
            <div class="mt-4 pt-3 border-t border-[#F0EBE1]">
              <a 
                href="${m.linkUrl}" 
                target="_blank" 
                rel="noopener noreferrer"
                class="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold ${hasYoutube ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm' : 'bg-[#384F32] hover:bg-[#233420] text-white shadow-sm'} transition active:scale-95"
              >
                <i data-lucide="${hasYoutube ? 'play-circle' : 'external-link'}" class="w-4 h-4"></i>
                <span>${hasYoutube ? 'Assistir no YouTube' : 'Ver Matéria Completa'}</span>
              </a>
            </div>
          `
          : "";

        return `
        <div class="bg-white rounded-3xl overflow-hidden border border-[#E8E2D6] shadow-sm flex flex-col justify-between card-hover-effect">
          <div class="aspect-video relative overflow-hidden bg-stone-100 group">
            <img src="${m.image}" alt="${m.title}" class="w-full h-full object-cover transition duration-300 group-hover:scale-105" />
            <span class="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-white/90 text-stone-800 backdrop-blur-sm shadow-sm">
              ${m.tag}
            </span>
          </div>
          <div class="p-5 flex-1 flex flex-col justify-between">
            <div>
              <span class="text-[10px] font-bold text-earth-terracotta uppercase tracking-wider block mb-1">${m.role}</span>
              <h4 class="font-bold text-base text-stone-900 font-serif-title mb-2">${m.title}</h4>
              <p class="text-xs text-stone-600 line-clamp-3 leading-relaxed whitespace-pre-line">${m.desc}</p>
            </div>
            ${linkButton}
          </div>
        </div>
      `;
      }
    ).join("");
  }

  // --- CONTROLE DE LOGIN E PAINEL PRIVADO DA CHEF ---
  function handleAdminAccessClick() {
    if (isAuthenticated) {
      openAdminModal("menu-images");
    } else {
      openLoginModal();
    }
  }

  function openLoginModal() {
    const modal = document.getElementById("login-modal");
    const backdrop = document.getElementById("login-backdrop");
    const userInput = document.getElementById("login-user");
    const errorMsg = document.getElementById("login-error-msg");

    if (errorMsg) errorMsg.classList.add("hidden");
    if (modal && backdrop) {
      backdrop.classList.remove("hidden");
      modal.classList.remove("hidden");
      setTimeout(() => {
        backdrop.classList.remove("opacity-0");
        modal.classList.remove("opacity-0", "scale-95");
        if (userInput) userInput.focus();
      }, 10);
      document.body.classList.add("overflow-hidden");
    }
  }

  function closeLoginModal() {
    const modal = document.getElementById("login-modal");
    const backdrop = document.getElementById("login-backdrop");
    if (modal && backdrop) {
      modal.classList.add("opacity-0", "scale-95");
      backdrop.classList.add("opacity-0");
      setTimeout(() => {
        modal.classList.add("hidden");
        backdrop.classList.add("hidden");
      }, 300);
      document.body.classList.remove("overflow-hidden");
      document.getElementById("form-login")?.reset();
    }
  }

  function submitLoginForm(e) {
    if (e) e.preventDefault();
    const user = document.getElementById("login-user")?.value || "";
    const pass = document.getElementById("login-pass")?.value || "";
    const errorMsg = document.getElementById("login-error-msg");

    if (!login(user, pass)) {
      if (errorMsg) {
        errorMsg.textContent = "Credenciais incorretas. Tente novamente.";
        errorMsg.classList.remove("hidden");
      }
    }
  }

  function openAdminModal(tab = "menu-images") {
    if (!isAuthenticated) {
      openLoginModal();
      return;
    }
    currentAdminTab = tab;
    editingItemId = null;
    editingMediaId = null;
    const modal = document.getElementById("admin-modal");
    const backdrop = document.getElementById("admin-backdrop");
    if (modal && backdrop) {
      backdrop.classList.remove("hidden");
      modal.classList.remove("hidden");
      setTimeout(() => {
        backdrop.classList.remove("opacity-0");
        modal.classList.remove("opacity-0", "scale-95");
      }, 10);
      document.body.classList.add("overflow-hidden");
      renderAdminContent();
    }
  }

  function closeAdminModal() {
    const modal = document.getElementById("admin-modal");
    const backdrop = document.getElementById("admin-backdrop");
    if (modal && backdrop) {
      modal.classList.add("opacity-0", "scale-95");
      backdrop.classList.add("opacity-0");
      setTimeout(() => {
        modal.classList.add("hidden");
        backdrop.classList.add("hidden");
      }, 300);
      document.body.classList.remove("overflow-hidden");
    }
  }

  function setAdminTab(tabName) {
    currentAdminTab = tabName;
    editingItemId = null;
    editingMediaId = null;
    renderAdminContent();
  }

  function setAdminDishFilter(filter) {
    adminDishFilter = filter;
    renderAdminContent();
  }

  // --- ATIVAR OU DESATIVAR PRATOS DA PÁGINA PRINCIPAL (NOVA FUNCIONALIDADE) ---
  function toggleItemActive(itemId) {
    const item = currentMenuData.find((i) => i.id === itemId);
    if (!item) return;

    // Inverte o estado de ativação
    item.active = item.active === false ? true : false;

    saveMenuData();
    renderMenu();
    renderAdminContent();

    if (item.active) {
      showToast(`Prato ativado! "${item.title}" agora está visível no site para pedidos. 🟢✨`);
    } else {
      showToast(`Prato pausado! "${item.title}" foi ocultado da página principal (insumos indisponíveis). ⏸️`);
    }
  }

  // --- EDIÇÃO DE TEXTO DO PRATO (LÁPIS) ---
  function startEditingItem(itemId) {
    editingItemId = itemId;
    renderAdminContent();
  }

  function cancelEditingItem() {
    editingItemId = null;
    renderAdminContent();
  }

  function saveEditedItem(itemId) {
    const item = currentMenuData.find((i) => i.id === itemId);
    if (!item) return;

    const title = document.getElementById(`edit-title-${itemId}`)?.value.trim();
    const category = document.getElementById(`edit-category-${itemId}`)?.value;
    const price = parseFloat(document.getElementById(`edit-price-${itemId}`)?.value);
    const portion = document.getElementById(`edit-portion-${itemId}`)?.value.trim();
    const tagsRaw = document.getElementById(`edit-tags-${itemId}`)?.value.trim();
    const description = document.getElementById(`edit-desc-${itemId}`)?.value.trim();
    const activeVal = document.getElementById(`edit-active-${itemId}`)?.value;

    if (!title || isNaN(price) || !description) {
      alert("Por favor, preencha os campos obrigatórios (Título, Preço e Descrição).");
      return;
    }

    item.title = title;
    item.category = category;
    item.categoryName = getCategoryLabel(category);
    item.price = price;
    item.portion = portion;
    item.tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : item.tags;
    item.description = description;
    item.active = activeVal === "true";

    saveMenuData();
    renderMenu();
    editingItemId = null;
    renderAdminContent();
    showToast(`"${title}" atualizado com sucesso! ✏️✨`);
  }

  // --- EDIÇÃO DE MÍDIA ---
  function startEditingMedia(mediaId) {
    editingMediaId = mediaId;
    renderAdminContent();
  }

  function cancelEditingMedia() {
    editingMediaId = null;
    renderAdminContent();
  }

  function saveEditedMedia(mediaId) {
    const media = currentMediaData.find((m) => m.id === mediaId);
    if (!media) return;

    const title = document.getElementById(`edit-media-title-${mediaId}`)?.value.trim();
    const role = document.getElementById(`edit-media-role-${mediaId}`)?.value.trim();
    const tag = document.getElementById(`edit-media-tag-${mediaId}`)?.value.trim();
    const linkUrl = document.getElementById(`edit-media-link-${mediaId}`)?.value.trim() || "";
    const desc = document.getElementById(`edit-media-desc-${mediaId}`)?.value.trim();

    if (!title || !desc) {
      alert("Por favor, preencha o título e a descrição.");
      return;
    }

    media.title = title;
    media.role = role || "Destaque";
    media.tag = tag || "Imprensa";
    media.linkUrl = linkUrl;
    media.desc = desc;

    saveMediaData();
    renderMedia();
    editingMediaId = null;
    renderAdminContent();
    showToast(`"${title}" atualizado com sucesso! 📺✨`);
  }

  async function handleMediaImageUpload(e, mediaId) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      showToast("Processando imagem da mídia... ⏳");
      const dataUrl = await processImageFile(file, 1000, 750);
      const media = currentMediaData.find((m) => m.id === mediaId);
      if (media) {
        media.image = dataUrl;
        saveMediaData();
        renderMedia();
        renderAdminContent();
        showToast("Imagem de mídia atualizada com sucesso! 📸");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar a imagem.");
    }
  }

  function promptMediaImageUrl(mediaId) {
    const media = currentMediaData.find((m) => m.id === mediaId);
    if (!media) return;

    const newUrl = prompt("Cole o link (URL) da nova imagem para esta matéria:", media.image);
    if (newUrl && newUrl.trim()) {
      media.image = newUrl.trim();
      saveMediaData();
      renderMedia();
      renderAdminContent();
      showToast("Link de imagem da matéria atualizado! 📺");
    }
  }

  function deleteMediaItem(mediaId) {
    const media = currentMediaData.find((m) => m.id === mediaId);
    if (!media) return;

    if (confirm(`Tem certeza que deseja excluir "${media.title}" da seção de mídia?`)) {
      currentMediaData = currentMediaData.filter((m) => m.id !== mediaId);
      saveMediaData();
      renderMedia();
      renderAdminContent();
      showToast("Matéria removida da seção de mídia.");
    }
  }

  // --- RENDERIZAÇÃO DO CONTEÚDO DO PAINEL DA CHEF ---
  function renderAdminContent() {
    document.querySelectorAll(".admin-tab-btn").forEach((btn) => {
      const tab = btn.getAttribute("data-tab");
      if (tab === currentAdminTab) {
        btn.className = "admin-tab-btn px-4 py-2 font-bold text-xs rounded-xl bg-earth-olive text-white shadow-sm transition";
      } else {
        btn.className = "admin-tab-btn px-4 py-2 font-semibold text-xs rounded-xl text-stone-600 hover:bg-stone-100 transition";
      }
    });

    const bodyContainer = document.getElementById("admin-tab-content");
    if (!bodyContainer) return;

    if (currentAdminTab === "menu-images") {
      // TAB 1: GERENCIAR IMAGENS, ITENS DO CARDÁPIO E ATIVAÇÃO/DESATIVAÇÃO
      const activeCount = currentMenuData.filter((i) => i.active !== false).length;
      const inactiveCount = currentMenuData.length - activeCount;

      const filteredList = currentMenuData.filter((item) => {
        if (adminDishFilter === "active") return item.active !== false;
        if (adminDishFilter === "inactive") return item.active === false;
        return true;
      });

      bodyContainer.innerHTML = `
        <div class="space-y-4">
          <!-- CABEÇALHO DA ABA COM FILTRO DE STATUS -->
          <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-stone-200">
            <div>
              <h4 class="font-bold text-base text-stone-800 font-serif-title flex items-center gap-2">
                <span>Gestão de Disponibilidade dos Pratos</span>
              </h4>
              <p class="text-xs text-stone-500">
                Ligue ou desligue qualquer prato da página principal com 1 clique quando faltarem insumos ou mudar a data.
              </p>
            </div>
            
            <!-- Contadores e Filtro Rápido -->
            <div class="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl text-xs">
              <button 
                onclick="window.drikaApp.setAdminDishFilter('all')"
                class="px-2.5 py-1 rounded-lg font-bold transition ${adminDishFilter === 'all' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'}"
              >
                Todos (${currentMenuData.length})
              </button>
              <button 
                onclick="window.drikaApp.setAdminDishFilter('active')"
                class="px-2.5 py-1 rounded-lg font-bold transition ${adminDishFilter === 'active' ? 'bg-emerald-600 text-white shadow-xs' : 'text-emerald-700 hover:bg-emerald-50'}"
              >
                🟢 Ativos (${activeCount})
              </button>
              <button 
                onclick="window.drikaApp.setAdminDishFilter('inactive')"
                class="px-2.5 py-1 rounded-lg font-bold transition ${adminDishFilter === 'inactive' ? 'bg-amber-600 text-white shadow-xs' : 'text-amber-700 hover:bg-amber-50'}"
              >
                ⏸️ Pausados (${inactiveCount})
              </button>
            </div>
          </div>

          <!-- LISTA DOS PRATOS -->
          <div class="grid grid-cols-1 gap-4 max-h-[58vh] overflow-y-auto pr-1">
            ${filteredList.length === 0 ? `
              <div class="p-8 text-center bg-stone-50 rounded-2xl border border-stone-200">
                <p class="text-sm text-stone-500">Nenhum prato encontrado com o filtro selecionado.</p>
              </div>
            ` : ''}

            ${filteredList
              .map((item) => {
                const isEditing = editingItemId === item.id;
                const isActive = item.active !== false;

                if (isEditing) {
                  return `
                    <div class="p-5 rounded-2xl border-2 border-earth-olive bg-stone-50 shadow-md space-y-4">
                      <div class="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span class="text-xs font-bold text-earth-olive flex items-center gap-1.5">
                          <i data-lucide="edit-3" class="w-4 h-4"></i>
                          <span>Editando: ${item.title}</span>
                        </span>
                        <button onclick="window.drikaApp.cancelEditingItem()" class="text-xs text-stone-500 hover:text-stone-800">
                          ✕ Cancelar
                        </button>
                      </div>

                      <!-- Status de Ativação / Visibilidade no Site -->
                      <div class="p-3 rounded-xl bg-white border border-stone-200 flex items-center justify-between">
                        <div>
                          <label class="block text-xs font-bold text-stone-800 mb-0.5">Visibilidade na Página Principal</label>
                          <p class="text-[11px] text-stone-500">Defina se este prato está pronto para venda ou pausado por falta de insumos</p>
                        </div>
                        <select id="edit-active-${item.id}" class="p-2 text-xs font-bold rounded-xl border border-stone-300 ${isActive ? 'bg-emerald-50 text-emerald-800 border-emerald-300' : 'bg-amber-50 text-amber-800 border-amber-300'}">
                          <option value="true" ${isActive ? "selected" : ""}>🟢 ATIVO (Visível no site)</option>
                          <option value="false" ${!isActive ? "selected" : ""}>⏸️ PAUSADO (Oculto do site)</option>
                        </select>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label class="block text-[11px] font-bold text-stone-700 mb-1">Título do Prato *</label>
                          <input type="text" id="edit-title-${item.id}" value="${item.title}" class="w-full p-2.5 text-xs rounded-xl custom-input font-semibold" />
                        </div>
                        <div>
                          <label class="block text-[11px] font-bold text-stone-700 mb-1">Categoria *</label>
                          <select id="edit-category-${item.id}" class="w-full p-2.5 text-xs rounded-xl custom-input">
                            <option value="lowcarb" ${item.category === "lowcarb" ? "selected" : ""}>🥑 Cardápio Low Carb</option>
                            <option value="tradicional_fit" ${item.category === "tradicional_fit" ? "selected" : ""}>🍱 Cardápio Tradicional e Fit</option>
                            <option value="produtos" ${item.category === "produtos" ? "selected" : ""}>🍯 Produtos Artesanais da Horta</option>
                            <option value="personalchef" ${item.category === "personalchef" ? "selected" : ""}>👩‍🍳 Serviços de Personal Chef & Eventos</option>
                            <option value="marmitas" ${item.category === "marmitas" ? "selected" : ""}>🥗 Outras Marmitas</option>
                          </select>
                        </div>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label class="block text-[11px] font-bold text-stone-700 mb-1">Preço (R$) *</label>
                          <input type="number" step="0.01" id="edit-price-${item.id}" value="${Number(item.price).toFixed(2)}" class="w-full p-2.5 text-xs rounded-xl custom-input font-bold" />
                        </div>
                        <div>
                          <label class="block text-[11px] font-bold text-stone-700 mb-1">Porção / Peso</label>
                          <input type="text" id="edit-portion-${item.id}" value="${item.portion || ''}" placeholder="Ex: 400g" class="w-full p-2.5 text-xs rounded-xl custom-input" />
                        </div>
                        <div>
                          <label class="block text-[11px] font-bold text-stone-700 mb-1">Tags (separadas por vírgula)</label>
                          <input type="text" id="edit-tags-${item.id}" value="${(item.tags || []).join(', ')}" placeholder="Ex: Low Carb, Sem Glúten" class="w-full p-2.5 text-xs rounded-xl custom-input" />
                        </div>
                      </div>

                      <div>
                        <label class="block text-[11px] font-bold text-stone-700 mb-1">Descrição detalhada dos ingredientes *</label>
                        <textarea id="edit-desc-${item.id}" rows="3" class="w-full p-2.5 text-xs rounded-xl custom-input leading-relaxed">${item.description}</textarea>
                      </div>

                      <div class="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                        <button 
                          onclick="window.drikaApp.cancelEditingItem()"
                          class="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200 transition"
                        >
                          Cancelar
                        </button>
                        <button 
                          onclick="window.drikaApp.saveEditedItem('${item.id}')"
                          class="px-5 py-2 rounded-xl text-xs font-bold bg-earth-olive text-white hover:bg-earth-dark shadow-sm transition flex items-center gap-1.5"
                        >
                          <i data-lucide="check" class="w-3.5 h-3.5"></i>
                          <span>Salvar Alterações</span>
                        </button>
                      </div>
                    </div>
                  `;
                }

                return `
                  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border transition ${
                    isActive 
                      ? 'border-stone-200 bg-white hover:border-emerald-300 shadow-xs' 
                      : 'border-amber-300 bg-amber-50/40 opacity-90'
                  }">
                    
                    <!-- Foto Thumbnail -->
                    <div class="relative w-24 h-24 sm:w-20 sm:h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                      <img src="${item.image}" alt="${item.title}" id="admin-thumb-${item.id}" class="w-full h-full object-cover" />
                      ${!isActive ? `
                        <div class="absolute inset-0 bg-black/50 backdrop-blur-[1px] flex items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider text-center p-1">
                          Pausado
                        </div>
                      ` : ''}
                    </div>
                    
                    <!-- Informações do Prato -->
                    <div class="flex-1 min-w-0 space-y-1">
                      <div class="flex flex-wrap items-center gap-2">
                        <!-- Badge de Status Ativo/Pausado -->
                        ${isActive ? `
                          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                            Visível no Site
                          </span>
                        ` : `
                          <span class="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900 border border-amber-300">
                            <span class="w-1.5 h-1.5 rounded-full bg-amber-700"></span>
                            Pausado (Oculto)
                          </span>
                        `}

                        <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                          ${getCategoryLabel(item.category)}
                        </span>
                        <span class="text-xs font-bold text-earth-terracotta">R$ ${Number(item.price).toFixed(2).replace('.', ',')}</span>
                        ${item.portion ? `<span class="text-[11px] text-stone-400">(${item.portion})</span>` : ''}
                      </div>

                      <h5 class="font-bold text-sm text-stone-900 truncate ${!isActive ? 'text-stone-600' : ''}">
                        ${item.title}
                      </h5>
                      <p class="text-xs text-stone-500 line-clamp-1">${item.description}</p>
                      
                      ${!isActive ? `
                        <p class="text-[11px] text-amber-700 italic">
                          ⚠️ Este prato não está aparecendo para os clientes na página principal.
                        </p>
                      ` : ''}
                    </div>

                    <!-- Botões de Ação com Botão de Ativar/Desativar em Destaque -->
                    <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                      
                      <!-- BOTÃO PRINCIPAL DE ATIVAR / DESATIVAR -->
                      <button 
                        onclick="window.drikaApp.toggleItemActive('${item.id}')"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs ${
                          isActive 
                            ? 'bg-amber-100 text-amber-900 hover:bg-amber-200 border border-amber-300' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 border border-emerald-600'
                        }"
                        title="${isActive ? 'Desativar este prato temporariamente (falta de insumos)' : 'Reativar este prato na página principal'}"
                      >
                        <i data-lucide="${isActive ? 'pause-circle' : 'play-circle'}" class="w-3.5 h-3.5"></i>
                        <span>${isActive ? 'Pausar Prato' : 'Ativar no Site'}</span>
                      </button>

                      <!-- EDITAR TEXTO -->
                      <button 
                        onclick="window.drikaApp.startEditingItem('${item.id}')"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition border border-stone-200"
                        title="Editar Título, Preço e Descrição"
                      >
                        <i data-lucide="edit-2" class="w-3.5 h-3.5 text-stone-600"></i>
                        <span>Editar</span>
                      </button>

                      <!-- TROCAR FOTO -->
                      <label class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-stone-100 text-stone-700 hover:bg-stone-200 transition border border-stone-200" title="Trocar Foto">
                        <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                        <span>Foto</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          class="hidden" 
                          onchange="window.drikaApp.handleImageUpload(event, '${item.id}')" 
                        />
                      </label>

                      <button 
                        onclick="window.drikaApp.promptImageUrl('${item.id}')"
                        class="p-1.5 rounded-xl text-stone-500 hover:bg-stone-100 transition border border-stone-200"
                        title="Inserir Link/URL de Imagem"
                      >
                        <i data-lucide="link" class="w-3.5 h-3.5"></i>
                      </button>

                      <button 
                        onclick="window.drikaApp.deleteMenuItem('${item.id}')"
                        class="p-1.5 rounded-xl text-red-500 hover:bg-red-50 transition border border-red-100"
                        title="Excluir este Prato"
                      >
                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    } else if (currentAdminTab === "pix-settings") {
      // TAB: CONFIGURAÇÕES COMERCIAIS & CHAVE PIX
      const pix = getPixConfig();
      bodyContainer.innerHTML = `
        <form id="form-pix-config" onsubmit="window.drikaApp.handleSavePixSettings(event)" class="space-y-4 max-h-[60vh] overflow-y-auto pr-1 max-w-xl mx-auto py-2">
          <div>
            <h4 class="font-bold text-base text-stone-800 font-serif-title flex items-center gap-2">
              <i data-lucide="qr-code" class="w-5 h-5 text-emerald-700"></i>
              <span>Configuração da Chave Pix & Contato WhatsApp</span>
            </h4>
            <p class="text-xs text-stone-500">Defina a chave Pix que é enviada aos clientes no fechamento do pedido e o WhatsApp da Chef.</p>
          </div>

          <div class="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Chave Pix *</label>
                <input type="text" id="pix-input-key" required value="${pix.key}" placeholder="Ex: 11984337478 ou seu CPF/E-mail" class="w-full p-2.5 text-xs rounded-xl custom-input font-mono font-bold" />
              </div>
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Tipo da Chave *</label>
                <select id="pix-input-type" class="w-full p-2.5 text-xs rounded-xl custom-input">
                  <option value="Celular / WhatsApp" ${pix.keyType === "Celular / WhatsApp" ? "selected" : ""}>Celular / WhatsApp</option>
                  <option value="CPF" ${pix.keyType === "CPF" ? "selected" : ""}>CPF</option>
                  <option value="CNPJ" ${pix.keyType === "CNPJ" ? "selected" : ""}>CNPJ</option>
                  <option value="E-mail" ${pix.keyType === "E-mail" ? "selected" : ""}>E-mail</option>
                  <option value="Chave Aleatória" ${pix.keyType === "Chave Aleatória" ? "selected" : ""}>Chave Aleatória</option>
                </select>
              </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Nome do Titular da Conta *</label>
                <input type="text" id="pix-input-owner" required value="${pix.owner}" placeholder="Ex: Adriana Corrêa" class="w-full p-2.5 text-xs rounded-xl custom-input" />
              </div>
              <div>
                <label class="block text-xs font-bold text-stone-700 mb-1">Número do WhatsApp Oficial (com DDD) *</label>
                <input type="text" id="pix-input-phone" required value="${getChefPhoneNumber()}" placeholder="Ex: 5511984337478" class="w-full p-2.5 text-xs rounded-xl custom-input font-mono" />
              </div>
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Instruções adicionais de pagamento para o cliente</label>
              <textarea id="pix-input-inst" rows="2" class="w-full p-2.5 text-xs rounded-xl custom-input">${pix.instructions}</textarea>
            </div>

            <div class="pt-2">
              <button type="submit" class="w-full py-3 rounded-xl font-bold text-xs bg-earth-olive hover:bg-earth-dark text-white shadow-md transition flex items-center justify-center gap-2 active:scale-98">
                <i data-lucide="save" class="w-4 h-4"></i>
                <span>Salvar Configurações de Pix & Contato</span>
              </button>
            </div>
          </div>
        </form>
      `;
    } else if (currentAdminTab === "media-manager") {
      // TAB: GERENCIAR IMAGENS E TEXTOS DA SEÇÃO NA MÍDIA & ENTREVISTAS
      bodyContainer.innerHTML = `
        <div class="space-y-4">
          <div class="flex items-center justify-between pb-2 border-b border-stone-200">
            <div>
              <h4 class="font-bold text-sm text-stone-800 font-serif-title">Fotos, Links do YouTube e Textos da Mídia</h4>
              <p class="text-xs text-stone-500">Troque as fotos das entrevistas, edite textos e insira links de vídeos no YouTube.</p>
            </div>
            <span class="text-xs font-bold text-earth-olive bg-emerald-50 px-2.5 py-1 rounded-lg">
              ${currentMediaData.length} matérias na mídia
            </span>
          </div>

          <div class="grid grid-cols-1 gap-4 max-h-[58vh] overflow-y-auto pr-1">
            ${currentMediaData
              .map((media) => {
                const isEditing = editingMediaId === media.id;

                if (isEditing) {
                  return `
                    <div class="p-5 rounded-2xl border-2 border-earth-terracotta bg-stone-50 shadow-md space-y-4">
                      <div class="flex items-center justify-between border-b border-stone-200 pb-2">
                        <span class="text-xs font-bold text-earth-terracotta flex items-center gap-1.5">
                          <i data-lucide="edit-3" class="w-4 h-4"></i>
                          <span>Editando Matéria: ${media.title}</span>
                        </span>
                        <button onclick="window.drikaApp.cancelEditingMedia()" class="text-xs text-stone-500 hover:text-stone-800">
                          ✕ Cancelar
                        </button>
                      </div>

                      <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label class="block text-[11px] font-bold text-stone-700 mb-1">Título da Matéria / Programa *</label>
                          <input type="text" id="edit-media-title-${media.id}" value="${media.title}" class="w-full p-2.5 text-xs rounded-xl custom-input font-semibold" />
                        </div>
                        <div>
                          <label class="block text-[11px] font-bold text-stone-700 mb-1">Subtítulo / Papel</label>
                          <input type="text" id="edit-media-role-${media.id}" value="${media.role}" class="w-full p-2.5 text-xs rounded-xl custom-input" />
                        </div>
                        <div>
                          <label class="block text-[11px] font-bold text-stone-700 mb-1">Selo / Tag</label>
                          <input type="text" id="edit-media-tag-${media.id}" value="${media.tag}" placeholder="Ex: Podcast, TV, Revista" class="w-full p-2.5 text-xs rounded-xl custom-input" />
                        </div>
                      </div>

                      <div>
                        <label class="block text-[11px] font-bold text-stone-700 mb-1 flex items-center gap-1">
                          <i data-lucide="youtube" class="w-3.5 h-3.5 text-red-600"></i>
                          <span>Link do Vídeo no YouTube ou Link da Matéria (URL)</span>
                        </label>
                        <input type="url" id="edit-media-link-${media.id}" value="${media.linkUrl || ''}" placeholder="Ex: https://www.youtube.com/watch?v=OnMrlKMM8ug" class="w-full p-2.5 text-xs rounded-xl custom-input font-mono text-stone-700" />
                      </div>

                      <div>
                        <label class="block text-[11px] font-bold text-stone-700 mb-1">Descrição do Destaque na Mídia *</label>
                        <textarea id="edit-media-desc-${media.id}" rows="3" class="w-full p-2.5 text-xs rounded-xl custom-input leading-relaxed">${media.desc}</textarea>
                      </div>

                      <div class="flex items-center justify-end gap-2 pt-2 border-t border-stone-200">
                        <button 
                          onclick="window.drikaApp.cancelEditingMedia()"
                          class="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 hover:bg-stone-200 transition"
                        >
                          Cancelar
                        </button>
                        <button 
                          onclick="window.drikaApp.saveEditedMedia('${media.id}')"
                          class="px-5 py-2 rounded-xl text-xs font-bold bg-earth-olive text-white hover:bg-earth-dark shadow-sm transition flex items-center gap-1.5"
                        >
                          <i data-lucide="check" class="w-3.5 h-3.5"></i>
                          <span>Salvar Matéria</span>
                        </button>
                      </div>
                    </div>
                  `;
                }

                return `
                  <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-2xl border border-stone-200 bg-white shadow-sm hover:border-earth-olive/50 transition">
                    <div class="relative w-28 h-20 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 border border-stone-200">
                      <img src="${media.image}" alt="${media.title}" class="w-full h-full object-cover" />
                      <span class="absolute bottom-1 right-1 px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 text-white">
                        ${media.tag}
                      </span>
                    </div>
                    
                    <div class="flex-1 min-w-0 space-y-1">
                      <div class="flex items-center gap-2">
                        <span class="text-[10px] font-bold text-earth-olive uppercase tracking-wider block">
                          ${media.role}
                        </span>
                        ${media.linkUrl ? `
                          <a href="${media.linkUrl}" target="_blank" rel="noopener noreferrer" class="text-[10px] text-red-600 font-bold hover:underline flex items-center gap-1">
                            <i data-lucide="play-circle" class="w-3 h-3 text-red-600"></i> YouTube
                          </a>
                        ` : ''}
                      </div>
                      <h5 class="font-bold text-sm text-stone-900 truncate">${media.title}</h5>
                      <p class="text-xs text-stone-500 line-clamp-1">${media.desc}</p>
                    </div>

                    <div class="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-end">
                      <button 
                        onclick="window.drikaApp.startEditingMedia('${media.id}')"
                        class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 hover:bg-amber-100 transition border border-amber-200"
                        title="Editar Texto & Link"
                      >
                        <i data-lucide="edit-2" class="w-3.5 h-3.5 text-amber-700"></i>
                        <span>Editar</span>
                      </button>

                      <label class="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-earth-olive hover:bg-emerald-100 transition border border-emerald-200" title="Trocar Foto da Mídia">
                        <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                        <span>Trocar Foto</span>
                        <input 
                          type="file" 
                          accept="image/*" 
                          class="hidden" 
                          onchange="window.drikaApp.handleMediaImageUpload(event, '${media.id}')" 
                        />
                      </label>

                      <button 
                        onclick="window.drikaApp.promptMediaImageUrl('${media.id}')"
                        class="p-1.5 rounded-xl text-stone-500 hover:bg-stone-100 transition border border-stone-200"
                        title="Inserir Link/URL de Imagem"
                      >
                        <i data-lucide="link" class="w-3.5 h-3.5"></i>
                      </button>
                    </div>
                  </div>
                `;
              })
              .join("")}
          </div>
        </div>
      `;
    } else if (currentAdminTab === "add-dish") {
      // TAB: CADASTRAR NOVO PRATO
      bodyContainer.innerHTML = `
        <form id="form-add-dish" onsubmit="window.drikaApp.handleAddNewDish(event)" class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <h4 class="font-bold text-sm text-stone-800 font-serif-title">Cadastrar Novo Prato ou Novidade</h4>
            <p class="text-xs text-stone-500">Adicione novos pratos ao cardápio com foto, preço e escolha se já nasce ativo no site ou pausado.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Título do Prato *</label>
              <input type="text" id="new-dish-title" required placeholder="Ex: Moqueca Vegana de Taioba com PANCs" class="w-full p-2.5 text-xs rounded-xl custom-input" />
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Categoria *</label>
              <select id="new-dish-category" required class="w-full p-2.5 text-xs rounded-xl custom-input">
                <option value="lowcarb">🥑 Cardápio Low Carb</option>
                <option value="tradicional_fit">🍱 Cardápio Tradicional e Fit</option>
                <option value="produtos">🍯 Produtos Artesanais da Horta</option>
                <option value="personalchef">👩‍🍳 Serviços de Personal Chef & Eventos</option>
                <option value="marmitas">🥗 Outras Marmitas</option>
              </select>
            </div>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Preço (R$) *</label>
              <input type="number" step="0.01" id="new-dish-price" required value="24.90" class="w-full p-2.5 text-xs rounded-xl custom-input" />
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Porção / Peso</label>
              <input type="text" id="new-dish-portion" placeholder="Ex: 400g" class="w-full p-2.5 text-xs rounded-xl custom-input" />
            </div>
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Disponibilidade Inicial</label>
              <select id="new-dish-active" class="w-full p-2.5 text-xs rounded-xl custom-input font-semibold">
                <option value="true">🟢 Ativo (Aparecer no site agora)</option>
                <option value="false">⏸️ Pausado (Salvar e ativar depois)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Tags (separadas por vírgula)</label>
            <input type="text" id="new-dish-tags" placeholder="Ex: Low Carb, Fit, Sem Glúten" class="w-full p-2.5 text-xs rounded-xl custom-input" />
          </div>

          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Descrição dos Ingredientes *</label>
            <textarea id="new-dish-desc" rows="3" required placeholder="Ex: Combinação saborosa e equilibrada preparada artesanalmente..." class="w-full p-2.5 text-xs rounded-xl custom-input"></textarea>
          </div>

          <!-- Upload de Imagem do Novo Prato -->
          <div>
            <label class="block text-xs font-bold text-stone-700 mb-1">Foto do Prato</label>
            <div class="flex items-center gap-3">
              <label class="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-earth-olive text-white hover:bg-earth-dark transition shadow-sm">
                <i data-lucide="image-plus" class="w-4 h-4"></i>
                <span>Escolher Imagem do Computador</span>
                <input type="file" id="new-dish-file" accept="image/*" class="hidden" onchange="window.drikaApp.previewNewDishImage(event)" />
              </label>
              <span class="text-xs text-stone-400">ou</span>
              <input type="text" id="new-dish-img-url" placeholder="Colar link de imagem (URL)" class="flex-1 p-2.5 text-xs rounded-xl custom-input" />
            </div>
            <div id="new-dish-preview-wrap" class="mt-3 hidden">
              <p class="text-[11px] text-stone-500 font-bold mb-1">Pré-visualização da Foto:</p>
              <img id="new-dish-preview-img" src="" alt="Prévia" class="w-24 h-24 object-cover rounded-xl border border-stone-200 shadow-sm" />
            </div>
          </div>

          <button type="submit" class="w-full py-3 rounded-xl font-bold text-xs bg-earth-terracotta hover:bg-earth-terracottaHover text-white shadow-md transition flex items-center justify-center gap-2 active:scale-98">
            <i data-lucide="plus-circle" class="w-4 h-4"></i>
            <span>Salvar e Cadastrar no Cardápio</span>
          </button>
        </form>
      `;
    } else if (currentAdminTab === "site-images") {
      // TAB: IMAGENS INSTITUCIONAIS DO SITE
      bodyContainer.innerHTML = `
        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <h4 class="font-bold text-sm text-stone-800 font-serif-title">Imagens Institucionais da Marca & Panfletos</h4>
            <p class="text-xs text-stone-500">Substitua o logotipo, fotos da Chef e os panfletos dos cardápios oficiais.</p>
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <!-- Logotipo da Marca -->
            <div class="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3 sm:col-span-2">
              <span class="text-xs font-bold text-stone-700 block">Logotipo Oficial (Cabeçalho e Rodapé)</span>
              <div class="flex items-center gap-4">
                <div class="w-16 h-16 rounded-full overflow-hidden border-2 border-earth-gold bg-white flex-shrink-0">
                  <img src="${currentSiteImages.logo}" id="admin-site-logo-preview" class="w-full h-full object-cover" />
                </div>
                <div class="flex-1">
                  <label class="cursor-pointer inline-flex items-center gap-2 py-2 px-4 rounded-xl text-xs font-bold bg-white text-earth-olive border border-emerald-200 hover:bg-emerald-50 transition">
                    <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                    <span>Substituir Logotipo</span>
                    <input type="file" accept="image/*" class="hidden" onchange="window.drikaApp.handleSiteImageUpload(event, 'logo')" />
                  </label>
                </div>
              </div>
            </div>

            <!-- Foto da Chef na Hero -->
            <div class="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
              <span class="text-xs font-bold text-stone-700 block">Foto da Chef (Topo/Hero)</span>
              <div class="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-stone-200">
                <img src="${currentSiteImages.heroChef}" id="admin-site-hero-preview" class="w-full h-full object-cover" />
              </div>
              <label class="w-full cursor-pointer inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-white text-earth-olive border border-emerald-200 hover:bg-emerald-50 transition">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>Enviar Nova Foto</span>
                <input type="file" accept="image/*" class="hidden" onchange="window.drikaApp.handleSiteImageUpload(event, 'heroChef')" />
              </label>
            </div>

            <!-- Foto da Chef na Seção Sobre -->
            <div class="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
              <span class="text-xs font-bold text-stone-700 block">Foto da Chef ('Quem Sou Eu')</span>
              <div class="aspect-[4/3] rounded-xl overflow-hidden bg-white border border-stone-200">
                <img src="${currentSiteImages.aboutChef}" id="admin-site-about-preview" class="w-full h-full object-cover" />
              </div>
              <label class="w-full cursor-pointer inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-white text-earth-olive border border-emerald-200 hover:bg-emerald-50 transition">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>Enviar Nova Foto</span>
                <input type="file" accept="image/*" class="hidden" onchange="window.drikaApp.handleSiteImageUpload(event, 'aboutChef')" />
              </label>
            </div>

            <!-- Panfleto Low Carb -->
            <div class="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
              <span class="text-xs font-bold text-stone-700 block">Panfleto Oficial: Cardápio Low Carb</span>
              <div class="aspect-[3/4] rounded-xl overflow-hidden bg-white border border-stone-200 max-h-48">
                <img src="${currentSiteImages.flyerLowCarb || 'assets/cardapio-low-carb.jpg'}" class="w-full h-full object-cover" />
              </div>
              <label class="w-full cursor-pointer inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-white text-earth-olive border border-emerald-200 hover:bg-emerald-50 transition">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>Atualizar Panfleto Low Carb</span>
                <input type="file" accept="image/*" class="hidden" onchange="window.drikaApp.handleSiteImageUpload(event, 'flyerLowCarb')" />
              </label>
            </div>

            <!-- Panfleto Tradicional & Fit -->
            <div class="p-4 rounded-2xl border border-stone-200 bg-stone-50 space-y-3">
              <span class="text-xs font-bold text-stone-700 block">Panfleto Oficial: Tradicional e Fit</span>
              <div class="aspect-[3/4] rounded-xl overflow-hidden bg-white border border-stone-200 max-h-48">
                <img src="${currentSiteImages.flyerTradicionalFit || 'assets/cardapio-tradicional-fit.jpg'}" class="w-full h-full object-cover" />
              </div>
              <label class="w-full cursor-pointer inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl text-xs font-bold bg-white text-earth-olive border border-emerald-200 hover:bg-emerald-50 transition">
                <i data-lucide="upload" class="w-3.5 h-3.5"></i>
                <span>Atualizar Panfleto Tradicional & Fit</span>
                <input type="file" accept="image/*" class="hidden" onchange="window.drikaApp.handleSiteImageUpload(event, 'flyerTradicionalFit')" />
              </label>
            </div>
          </div>
        </div>
      `;
    } else if (currentAdminTab === "security") {
      // TAB: SEGURANÇA E SENHA DE ACESSO
      const creds = getCredentials();
      bodyContainer.innerHTML = `
        <form id="form-security" onsubmit="window.drikaApp.handleChangePassword(event)" class="space-y-4 max-h-[60vh] overflow-y-auto pr-1 max-w-md mx-auto py-2">
          <div>
            <h4 class="font-bold text-sm text-stone-800 font-serif-title">Segurança & Alteração de Senha</h4>
            <p class="text-xs text-stone-500">Mude o usuário e senha de acesso ao painel para manter seu site seguro.</p>
          </div>

          <div class="space-y-3 bg-stone-50 p-5 rounded-2xl border border-stone-200">
            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Nome de Usuário</label>
              <input type="text" id="sec-username" required value="${creds.username}" class="w-full p-2.5 text-xs rounded-xl custom-input" />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Nova Senha de Acesso</label>
              <input type="password" id="sec-password" required placeholder="Digite a nova senha" class="w-full p-2.5 text-xs rounded-xl custom-input" />
            </div>

            <div>
              <label class="block text-xs font-bold text-stone-700 mb-1">Confirmar Nova Senha</label>
              <input type="password" id="sec-password-confirm" required placeholder="Repita a nova senha" class="w-full p-2.5 text-xs rounded-xl custom-input" />
            </div>

            <button type="submit" class="w-full py-2.5 rounded-xl font-bold text-xs bg-earth-olive text-white hover:bg-earth-dark transition shadow-sm">
              Salvar Novas Credenciais
            </button>
          </div>
        </form>
      `;
    } else if (currentAdminTab === "backup") {
      // TAB: BACKUP & RESTAURAÇÃO
      bodyContainer.innerHTML = `
        <div class="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
          <div>
            <h4 class="font-bold text-sm text-stone-800 font-serif-title">Backup, Exportação e Restauração</h4>
            <p class="text-xs text-stone-500">Exporte os dados atualizados para publicação ou restaure o cardápio padrão.</p>
          </div>

          <div class="p-4 rounded-2xl border border-stone-200 bg-emerald-50/60 space-y-2">
            <h5 class="font-bold text-xs text-earth-dark flex items-center gap-1.5">
              <i data-lucide="download" class="w-4 h-4 text-earth-olive"></i>
              <span>Baixar Arquivo com Dados Atualizados (menu-data.json)</span>
            </h5>
            <p class="text-[11px] text-stone-600">
              Faça o download do arquivo com os 18 pratos, fotos da mídia e preços atualizados para guardar como backup no seu computador.
            </p>
            <button onclick="window.drikaApp.exportDataAsJSON()" class="px-4 py-2 rounded-xl text-xs font-bold bg-earth-olive text-white hover:bg-earth-dark transition">
              Baixar Backup JSON
            </button>
          </div>

          <div class="p-4 rounded-2xl border border-red-200 bg-red-50/60 space-y-2">
            <h5 class="font-bold text-xs text-red-800 flex items-center gap-1.5">
              <i data-lucide="rotate-ccw" class="w-4 h-4 text-red-600"></i>
              <span>Restaurar Cardápio Oficial dos Panfletos</span>
            </h5>
            <p class="text-[11px] text-red-600">
              Caso deseje voltar a todos os 18 pratos oficiais originais dos dois panfletos (R$ 24,90), clique no botão abaixo.
            </p>
            <button onclick="window.drikaApp.resetToFactoryDefaults()" class="px-4 py-2 rounded-xl text-xs font-bold bg-red-600 text-white hover:bg-red-700 transition">
              Restaurar Dados Originais
            </button>
          </div>
        </div>
      `;
    }

    if (window.lucide) {
      lucide.createIcons();
    }
  }

  function handleSavePixSettings(e) {
    if (e) e.preventDefault();
    const key = document.getElementById("pix-input-key")?.value.trim();
    const keyType = document.getElementById("pix-input-type")?.value;
    const owner = document.getElementById("pix-input-owner")?.value.trim();
    const phone = document.getElementById("pix-input-phone")?.value.trim();
    const instructions = document.getElementById("pix-input-inst")?.value.trim();

    if (!key || !owner || !phone) {
      alert("Por favor, preencha a chave Pix, o nome do titular e o telefone de contato.");
      return;
    }

    savePixConfig({
      key,
      keyType,
      owner,
      whatsappPhone: phone,
      instructions: instructions || DEFAULT_PIX_CONFIG.instructions
    });

    updateCartUI();
    setAdminTab("menu-images");
  }

  function handleChangePassword(e) {
    if (e) e.preventDefault();
    const user = document.getElementById("sec-username")?.value.trim();
    const pass = document.getElementById("sec-password")?.value;
    const passConfirm = document.getElementById("sec-password-confirm")?.value;

    if (!user || !pass) {
      alert("Por favor, preencha o usuário e a nova senha.");
      return;
    }
    if (pass !== passConfirm) {
      alert("As senhas digitadas não coincidem. Verifique e tente novamente.");
      return;
    }

    saveCredentials(user, pass);
    setAdminTab("menu-images");
  }

  // --- COMPRESSÃO E PROCESSAMENTO DE IMAGEM ---
  function processImageFile(file, maxWidth = 900, maxHeight = 900, quality = 0.85) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > maxWidth) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = Math.round((width * maxHeight) / height);
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx.drawImage(img, 0, 0, width, height);

          const compressedDataUrl = canvas.toDataURL("image/jpeg", quality);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
        img.src = e.target.result;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleImageUpload(e, itemId) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      showToast("Processando imagem... ⏳");
      const dataUrl = await processImageFile(file);

      const item = currentMenuData.find((i) => i.id === itemId);
      if (item) {
        item.image = dataUrl;
        saveMenuData();
        renderMenu();
        renderAdminContent();
        showToast("Imagem do prato atualizada com sucesso! ✨");
      }
    } catch (err) {
      console.error(err);
      alert("Erro ao carregar a imagem. Tente novamente com um arquivo menor.");
    }
  }

  function promptImageUrl(itemId) {
    const item = currentMenuData.find((i) => i.id === itemId);
    if (!item) return;

    const newUrl = prompt("Cole o link (URL) da nova imagem para este prato:", item.image);
    if (newUrl && newUrl.trim()) {
      item.image = newUrl.trim();
      saveMenuData();
      renderMenu();
      renderAdminContent();
      showToast("Link de imagem atualizado! 🌿");
    }
  }

  function deleteMenuItem(itemId) {
    const item = currentMenuData.find((i) => i.id === itemId);
    if (!item) return;

    if (confirm(`Tem certeza que deseja excluir o item "${item.title}" do cardápio?`)) {
      currentMenuData = currentMenuData.filter((i) => i.id !== itemId);
      saveMenuData();
      renderMenu();
      renderAdminContent();
      showToast("Prato removido do cardápio.");
    }
  }

  let newDishImageData = null;
  async function previewNewDishImage(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      newDishImageData = await processImageFile(file);
      const wrap = document.getElementById("new-dish-preview-wrap");
      const previewImg = document.getElementById("new-dish-preview-img");
      if (wrap && previewImg) {
        previewImg.src = newDishImageData;
        wrap.classList.remove("hidden");
      }
    } catch (err) {
      console.error(err);
    }
  }

  function handleAddNewDish(e) {
    if (e) e.preventDefault();

    const title = document.getElementById("new-dish-title")?.value.trim();
    const category = document.getElementById("new-dish-category")?.value;
    const price = parseFloat(document.getElementById("new-dish-price")?.value);
    const portion = document.getElementById("new-dish-portion")?.value.trim();
    const tagsRaw = document.getElementById("new-dish-tags")?.value.trim();
    const description = document.getElementById("new-dish-desc")?.value.trim();
    const urlInput = document.getElementById("new-dish-img-url")?.value.trim();
    const activeVal = document.getElementById("new-dish-active")?.value;

    if (!title || isNaN(price) || !description) {
      alert("Por favor, preencha todos os campos obrigatórios (*)");
      return;
    }

    const finalImage = newDishImageData || urlInput || "assets/logo.jpg";
    const tags = tagsRaw
      ? tagsRaw.split(",").map((t) => t.trim()).filter(Boolean)
      : ["Novidade da Chef", "Saudável"];

    const newDish = {
      id: "dish-" + Date.now(),
      title,
      category,
      categoryName: getCategoryLabel(category),
      price,
      image: finalImage,
      tags,
      description,
      portion: portion || "400g",
      active: activeVal !== "false"
    };

    currentMenuData.unshift(newDish);
    saveMenuData();
    renderMenu();
    newDishImageData = null;

    showToast(`"${title}" cadastrado com sucesso no cardápio! 🎉`);
    setAdminTab("menu-images");
  }

  async function handleSiteImageUpload(e, key) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    try {
      showToast("Atualizando imagem do site... ⏳");
      const dataUrl = await processImageFile(file, 1200, 1200);
      currentSiteImages[key] = dataUrl;
      saveSiteImages();
      renderSiteImages();
      renderAdminContent();
      showToast("Imagem do site atualizada com sucesso! ✨");
    } catch (err) {
      console.error(err);
      alert("Erro ao processar imagem.");
    }
  }

  function exportDataAsJSON() {
    const exportObject = {
      menu: currentMenuData,
      media: currentMediaData,
      siteImages: currentSiteImages,
      pixConfig: getPixConfig(),
      exportedAt: new Date().toISOString()
    };
    const jsonStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(exportObject, null, 2));
    const dlAnchor = document.createElement("a");
    dlAnchor.setAttribute("href", jsonStr);
    dlAnchor.setAttribute("download", `drika_personalchef_backup_${Date.now()}.json`);
    dlAnchor.click();
    showToast("Backup baixado com sucesso! 💾");
  }

  function resetToFactoryDefaults() {
    if (confirm("ATENÇÃO: Deseja realmente restaurar todos os 18 pratos e imagens oficiais originais dos panfletos?")) {
      localStorage.removeItem(MENU_STORAGE_KEY);
      localStorage.removeItem(MEDIA_STORAGE_KEY);
      localStorage.removeItem(SITE_IMAGES_STORAGE_KEY);
      loadMenuData();
      loadMediaData();
      loadSiteImages();
      renderSiteImages();
      renderMenu();
      renderMedia();
      renderAdminContent();
      showToast("Dados restaurados para os padrões originais dos panfletos! 🌿");
    }
  }

  // --- EVENT LISTENERS ---
  function setupEventListeners() {
    // Filtro por categoria
    const categoryButtons = document.querySelectorAll(".category-btn");
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        currentCategory = btn.getAttribute("data-category") || "all";
        updateCategoryButtonsUI();
        renderMenu();
      });
    });

    // Busca rápida
    const searchInput = document.getElementById("menu-search-input");
    if (searchInput) {
      searchInput.addEventListener("input", (e) => {
        searchKeyword = e.target.value;
        renderMenu();
      });
    }

    // Toggle do Drawer do Carrinho
    document.querySelectorAll(".open-cart-btn").forEach((btn) => {
      btn.addEventListener("click", openCartDrawer);
    });

    const closeCartBtn = document.getElementById("close-cart-btn");
    if (closeCartBtn) closeCartBtn.addEventListener("click", closeCartDrawer);

    const backdrop = document.getElementById("cart-backdrop");
    if (backdrop) backdrop.addEventListener("click", closeCartDrawer);

    // Modal de Panfletos
    const closeFlyerBtn = document.getElementById("close-flyer-btn");
    if (closeFlyerBtn) closeFlyerBtn.addEventListener("click", closeFlyerModal);

    const flyerBackdrop = document.getElementById("flyer-backdrop");
    if (flyerBackdrop) flyerBackdrop.addEventListener("click", closeFlyerModal);

    // Botões discretos de acesso à Área da Chef
    document.querySelectorAll(".open-admin-btn").forEach((btn) => {
      btn.addEventListener("click", handleAdminAccessClick);
    });

    const closeAdminBtn = document.getElementById("close-admin-btn");
    if (closeAdminBtn) closeAdminBtn.addEventListener("click", closeAdminModal);

    const adminBackdrop = document.getElementById("admin-backdrop");
    if (adminBackdrop) adminBackdrop.addEventListener("click", closeAdminModal);

    const closeLoginBtn = document.getElementById("close-login-btn");
    if (closeLoginBtn) closeLoginBtn.addEventListener("click", closeLoginModal);

    const loginBackdrop = document.getElementById("login-backdrop");
    if (loginBackdrop) loginBackdrop.addEventListener("click", closeLoginModal);

    // Form de Login
    const loginForm = document.getElementById("form-login");
    if (loginForm) {
      loginForm.addEventListener("submit", submitLoginForm);
    }

    // Tecla ESC para fechar modals
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        closeCartDrawer();
        closeAdminModal();
        closeLoginModal();
        closeFlyerModal();
      }
    });

    // Toggle da modalidade de entrega (Delivery vs Retirada)
    const deliveryRadio = document.getElementById("delivery-option-delivery");
    const pickupRadio = document.getElementById("delivery-option-pickup");
    const addressWrapper = document.getElementById("delivery-address-wrapper");

    if (deliveryRadio && pickupRadio && addressWrapper) {
      deliveryRadio.addEventListener("change", () => {
        addressWrapper.classList.remove("hidden");
      });
      pickupRadio.addEventListener("change", () => {
        addressWrapper.classList.add("hidden");
      });
    }

    // Botão de WhatsApp Checkout
    const checkoutBtn = document.getElementById("btn-checkout-whatsapp");
    if (checkoutBtn) {
      checkoutBtn.addEventListener("click", checkoutWhatsApp);
    }

    // Botão Limpar Carrinho
    const clearCartBtn = document.getElementById("btn-clear-cart");
    if (clearCartBtn) {
      clearCartBtn.addEventListener("click", clearCart);
    }

    // Formulário de Orçamento de Eventos
    const eventForm = document.getElementById("event-quote-form");
    if (eventForm) {
      eventForm.addEventListener("submit", sendEventQuoteWhatsApp);
    }

    // Menu Mobile Hamburger
    const mobileMenuBtn = document.getElementById("mobile-menu-toggle");
    const mobileMenuDropdown = document.getElementById("mobile-menu-dropdown");
    if (mobileMenuBtn && mobileMenuDropdown) {
      mobileMenuBtn.addEventListener("click", () => {
        mobileMenuDropdown.classList.toggle("hidden");
      });
      mobileMenuDropdown.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
          mobileMenuDropdown.classList.add("hidden");
        });
      });
    }
  }

  // --- NOTIFICAÇÃO TOAST ---
  function showToast(message) {
    let toast = document.getElementById("app-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "app-toast";
      toast.className = "fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-[#233420] text-white text-xs sm:text-sm font-semibold shadow-2xl transition-all duration-300 transform translate-y-20 opacity-0 flex items-center gap-2 border border-emerald-700";
      document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>${message}</span>`;
    toast.classList.remove("translate-y-20", "opacity-0");
    toast.classList.add("translate-y-0", "opacity-100");

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.add("translate-y-20", "opacity-0");
      toast.classList.remove("translate-y-0", "opacity-100");
    }, 2800);
  }

  // Expor API global para o frontend
  window.drikaApp = {
    addToCart,
    addComboShortcut,
    updateQuantity,
    removeFromCart,
    clearCart,
    copyPixKey,
    openCartDrawer,
    closeCartDrawer,
    openFlyerModal,
    closeFlyerModal,
    checkoutWhatsApp,
    openLoginModal,
    closeLoginModal,
    openAdminModal,
    closeAdminModal,
    logout,
    setAdminTab,
    setAdminDishFilter,
    toggleItemActive,
    startEditingItem,
    cancelEditingItem,
    saveEditedItem,
    startEditingMedia,
    cancelEditingMedia,
    saveEditedMedia,
    handleMediaImageUpload,
    promptMediaImageUrl,
    deleteMediaItem,
    handleImageUpload,
    promptImageUrl,
    deleteMenuItem,
    previewNewDishImage,
    handleAddNewDish,
    handleSiteImageUpload,
    handleSavePixSettings,
    handleChangePassword,
    exportDataAsJSON,
    resetToFactoryDefaults
  };
})();
