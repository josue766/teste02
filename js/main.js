/**
 * CIT - INDÚSTRIA TÊXTIL | JAVASCRIPT PRINCIPAL
 * Interatividades, Filtros de Catálogo, Simulador B2B e Animações
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initMobileNav();
  initScrollAnimations();
  initStatsCounter();
  initCatalogFilters();
  initPublicProductForm();
  initSimulator();
  initFaqAccordion();
  initProcessTimeline();
  initGaugeCalculator();
  initManagerTracker();
  initManagerLogin();
  initLiveFabricBoard();
  initTechnicalLiveTracker();
});

/* ==========================================================================
   1. Header Scroll & Navbar Efeito Glass
   ========================================================================== */
function initHeaderScroll() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const checkScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', checkScroll, { passive: true });
  checkScroll();
}

/* ==========================================================================
   2. Menu Mobile Responsivo
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.mobile-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggleBtn.setAttribute('aria-expanded', isOpen);
    toggleBtn.innerHTML = isOpen ? '✕' : '☰';
  });

  // Fechar ao clicar em qualquer link
  nav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      toggleBtn.innerHTML = '☰';
    });
  });
}

/* ==========================================================================
   3. Animações Suaves de Scroll Reveal
   ========================================================================== */
function initScrollAnimations() {
  const revealElements = document.querySelectorAll('.reveal-init');
  if (!revealElements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('reveal-active');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.15,
    rootMargin: '0px 0px -40px 0px'
  });

  revealElements.forEach(el => observer.observe(el));
}

/* ==========================================================================
   4. Contadores Numéricos Animados (Stats)
   ========================================================================== */
function initStatsCounter() {
  const statNumbers = document.querySelectorAll('.stat-number');
  if (!statNumbers.length) return;

  let animated = false;

  const runCounters = () => {
    statNumbers.forEach(item => {
      const target = parseInt(item.getAttribute('data-target'), 10) || 0;
      const prefix = item.getAttribute('data-prefix') || '';
      const suffix = item.getAttribute('data-suffix') || '';
      const duration = 2000;
      const stepTime = 25;
      const totalSteps = duration / stepTime;
      let currentStep = 0;

      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / totalSteps;
        const easeProgress = 1 - Math.pow(1 - progress, 3); // Ease-out cubic
        const currentValue = Math.floor(target * easeProgress);

        item.textContent = `${prefix}${currentValue.toLocaleString('pt-BR')}${suffix}`;

        if (currentStep >= totalSteps) {
          item.textContent = `${prefix}${target.toLocaleString('pt-BR')}${suffix}`;
          clearInterval(timer);
        }
      }, stepTime);
    });
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        runCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  const statsSection = document.querySelector('.stats-section');
  if (statsSection) {
    observer.observe(statsSection);
  }
}

/* ==========================================================================
   5. Filtros do Catálogo de Tecidos
   ========================================================================== */
function initCatalogFilters() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  if (!filterBtns.length || !document.querySelector('.fabric-card')) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filterValue = btn.getAttribute('data-filter');

      document.querySelectorAll('.fabric-card').forEach(card => {
        const category = card.getAttribute('data-category');
        if (filterValue === 'all' || category === filterValue) {
          card.style.display = 'flex';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(15px)';
          setTimeout(() => {
            card.style.display = 'none';
          }, 250);
        }
      });
    });
  });
}

function initPublicProductForm() {
  const form = document.getElementById('public-product-form');
  const grid = document.querySelector('.fabrics-grid');
  const feedback = document.getElementById('public-product-feedback');
  if (!form || !grid || !feedback) return;
  const supabaseClient = window.citSupabase;

  if (!supabaseClient) {
    feedback.textContent = 'Configure o Supabase para carregar o catalogo.';
    return;
  }

  const categoryNames = {
    moda: 'Moda & Vestuário',
    decoracao: 'Decoração & Estofados',
    tecnica: 'Linha Técnica & Uniformes'
  };

  const createProductCard = product => {
    const card = document.createElement('article');
    card.className = 'fabric-card public-product-card reveal-active';
    card.dataset.category = product.category;
    card.innerHTML = `
      <div class="fabric-img-wrap public-product-image">
        <span class="public-product-symbol">CIT</span>
        <span class="fabric-tag"></span>
      </div>
      <div class="fabric-body">
        <h3 class="fabric-title"></h3>
        <p class="fabric-desc"></p>
        <div class="fabric-specs">
          <span class="spec-item">Gramatura: <strong></strong></span>
          <span class="spec-item">Composição: <strong></strong></span>
          <span class="spec-item">Largura: <strong></strong></span>
        </div>
        <div class="fabric-footer">
          <a href="#contato" class="btn btn-outline-gold btn-sm">Solicitar Orçamento</a>
        </div>
      </div>`;
    card.querySelector('.fabric-title').textContent = product.name;
    card.querySelector('.fabric-desc').textContent = product.description;
    card.querySelector('.fabric-tag').textContent = product.tag || categoryNames[product.category];
    card.querySelectorAll('.spec-item strong')[0].textContent = product.grammage;
    card.querySelectorAll('.spec-item strong')[1].textContent = product.composition;
    card.querySelectorAll('.spec-item strong')[2].textContent = product.width;
    return card;
  };

  const loadProducts = async () => {
    const { data, error } = await supabaseClient
      .from('products')
      .select('name, category, grammage, composition, width, tag, description')
      .order('created_at', { ascending: false });

    if (error) {
      feedback.textContent = 'Nao foi possivel carregar os produtos.';
      return;
    }

    data.forEach(product => grid.appendChild(createProductCard(product)));
  };

  loadProducts();

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const product = {
      name: document.getElementById('product-name').value.trim(),
      category: document.getElementById('product-category').value,
      grammage: document.getElementById('product-grammage').value.trim(),
      composition: document.getElementById('product-composition').value.trim(),
      width: document.getElementById('product-width').value.trim(),
      tag: document.getElementById('product-tag').value.trim(),
      description: document.getElementById('product-description').value.trim()
    };

    const { data, error } = await supabaseClient
      .from('products')
      .insert(product)
      .select('name, category, grammage, composition, width, tag, description')
      .single();

    if (error) {
      feedback.textContent = 'Nao foi possivel publicar o produto.';
      return;
    }

    grid.appendChild(createProductCard(data));
    feedback.textContent = 'Produto publicado no catálogo público.';
    form.reset();
  });
}

/* ==========================================================================
   6. Simulador Interativo de Orçamento & Amostras WhatsApp
   ========================================================================== */
function initSimulator() {
  const fabricSelect = document.getElementById('sim-fabric');
  const meterInput = document.getElementById('sim-meters');
  const gaugeSelect = document.getElementById('sim-gauge');
  const purposeSelect = document.getElementById('sim-purpose');
  const btnQuoteWhatsapp = document.getElementById('sim-btn-whatsapp');

  if (!fabricSelect || !meterInput || !btnQuoteWhatsapp) return;

  const updateSimulation = () => {
    const fabricName = fabricSelect.options[fabricSelect.selectedIndex]?.text || 'Tecido CIT';
    const meters = parseInt(meterInput.value, 10) || 100;
    const gauge = gaugeSelect?.options[gaugeSelect.selectedIndex]?.text || 'Padrão';
    const purpose = purposeSelect?.options[purposeSelect.selectedIndex]?.text || 'Confecção';

    // Atualiza resumo visual
    const summaryFabric = document.getElementById('res-fabric');
    const summaryMeters = document.getElementById('res-meters');
    const summaryGauge = document.getElementById('res-gauge');
    const summaryLeadTime = document.getElementById('res-leadtime');

    if (summaryFabric) summaryFabric.textContent = fabricName;
    if (summaryMeters) summaryMeters.textContent = `${meters.toLocaleString('pt-BR')} metros`;
    if (summaryGauge) summaryGauge.textContent = gauge;

    // Estimativa de prazo baseada na metragem
    let leadTime = 'Pronta Entrega (24-48h)';
    if (meters > 5000) leadTime = '10 a 15 dias úteis (Produção sob medida)';
    else if (meters > 1000) leadTime = '5 a 7 dias úteis';
    if (summaryLeadTime) summaryLeadTime.textContent = leadTime;

    // Link WhatsApp dinâmico
    const phone = '5511999999999'; // Pode ser atualizado pelo cliente
    const msg = `Olá! Gostaria de uma cotação/amostra da CIT Indústria Têxtil:%0A%0A` +
      `📌 *Tecido:* ${encodeURIComponent(fabricName)}%0A` +
      `📏 *Quantidade Estimada:* ${meters} metros%0A` +
      `⚖️ *Gramatura/Espessura:* ${encodeURIComponent(gauge)}%0A` +
      `🎯 *Aplicação/Segmento:* ${encodeURIComponent(purpose)}%0A%0A` +
      `Poderiam me enviar o catálogo e valores para atacado?`;

    btnQuoteWhatsapp.href = `https://api.whatsapp.com/send?phone=${phone}&text=${msg}`;
  };

  fabricSelect.addEventListener('change', updateSimulation);
  meterInput.addEventListener('input', updateSimulation);
  gaugeSelect?.addEventListener('change', updateSimulation);
  purposeSelect?.addEventListener('change', updateSimulation);

  updateSimulation();
}

/* ==========================================================================
   7. FAQ Accordion Interativo
   ========================================================================== */
function initFaqAccordion() {
  const faqQuestions = document.querySelectorAll('.faq-question');
  if (!faqQuestions.length) return;

  faqQuestions.forEach(btn => {
    btn.addEventListener('click', () => {
      const parent = btn.parentElement;
      const isOpen = parent.classList.contains('active');

      // Fecha todos os outros itens
      document.querySelectorAll('.faq-item').forEach(item => {
        item.classList.remove('active');
        const ans = item.querySelector('.faq-answer');
        if (ans) ans.style.maxHeight = null;
      });

      // Abre o atual se não estava aberto
      if (!isOpen) {
        parent.classList.add('active');
        const ans = parent.querySelector('.faq-answer');
        if (ans) {
          ans.style.maxHeight = ans.scrollHeight + 40 + 'px';
        }
      }
    });
  });
}

/* ==========================================================================
   8. Formulário de Contato & Toast Feedback
   ========================================================================== */
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('cf-name')?.value.trim();
    const company = document.getElementById('cf-company')?.value.trim();
    const email = document.getElementById('cf-email')?.value.trim();
    const phone = document.getElementById('cf-phone')?.value.trim();
    const message = document.getElementById('cf-message')?.value.trim();

    if (!name || !email || !phone) {
      showToast('⚠️ Por favor, preencha os campos obrigatórios.');
      return;
    }

    // Feedback de envio bem-sucedido
    showToast('✨ Mensagem enviada com sucesso! Nossa equipe técnica entrará em contato.');
    form.reset();
  });
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = message;
  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(20px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 4000);
}

/* ==========================================================================
   9. Linha do Tempo & Seletor de Etapas (processos.html)
   ========================================================================== */
function initProcessTimeline() {
  const nodes = document.querySelectorAll('.pipeline-node');
  const stages = document.querySelectorAll('.stage-card-detailed');
  const progressBar = document.querySelector('.timeline-progress-bar');
  if (!nodes.length) return;

  nodes.forEach((node, index) => {
    node.addEventListener('click', () => {
      // Ativa nó
      nodes.forEach(n => n.classList.remove('active'));
      node.classList.add('active');

      // Atualiza barra de progresso
      if (progressBar) {
        const percent = ((index) / (nodes.length - 1)) * 90 + 5;
        progressBar.style.width = `${percent}%`;
      }

      // Rola suavemente até o estágio correspondente
      const stageTarget = stages[index];
      if (stageTarget) {
        stages.forEach(s => s.classList.remove('highlighted'));
        stageTarget.classList.add('highlighted');
        stageTarget.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });
  });
}

/* ==========================================================================
   10. Calculadora & Guia de Escolha de Espessura/Gramatura
   ========================================================================== */
function initGaugeCalculator() {
  const gaugeBtns = document.querySelectorAll('.gauge-btn');
  const resultDisplay = document.getElementById('gauge-calc-result');
  if (!gaugeBtns.length || !resultDisplay) return;

  const specsDatabase = {
    camisaria: {
      title: 'Camisaria Fina & Vestuário Leve',
      grammage: '110 a 145 g/m²',
      thickness: '0.18 mm a 0.25 mm',
      yarn: 'Fio 50/1 ou 60/1 Penteado',
      features: 'Toque acetinado, respirabilidade máxima, caimento nobre.',
      fabrics: 'Popeline de Algodão Egípcio, Viscose Premium, Voil de Linho'
    },
    alfaiataria: {
      title: 'Alfaiataria, Calças & Blazers',
      grammage: '190 a 260 g/m²',
      thickness: '0.35 mm a 0.48 mm',
      yarn: 'Fio 30/1 ou 40/2 Retorcido',
      features: 'Estrutura elegante, excelente caimento, alta durabilidade e resistência a rugas.',
      fabrics: 'Sarja Acetinada CIT, Crepe de Alfaiataria, Linho Misto Estruturado'
    },
    uniformes: {
      title: 'Uniformes Profissionais & Linha Pesada',
      grammage: '270 a 380 g/m²',
      thickness: '0.50 mm a 0.70 mm',
      yarn: 'Fio 20/1 ou 16/1 Cardado de Alta Tenacidade',
      features: 'Ultra resistência a tração e abrasão, acabamento hidrorrepelente opcional.',
      fabrics: 'Brim Pesado 100% Algodão, Ripstop Industrial CIT, Sarja Pesada'
    },
    decoracao: {
      title: 'Decoração, Cortinas & Estofados Nobres',
      grammage: '320 a 480 g/m²',
      thickness: '0.60 mm a 1.10 mm',
      yarn: 'Fios Mistos Nobres e Fios Especiais Jacquard',
      features: 'Solidez de cor a luz solar, toque aveludado e resistência ao atrito contínuo.',
      fabrics: 'Jacquard Nobre CIT, Veludo Cotelê, Linho Rústico de Alta Gramatura'
    }
  };

  gaugeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      gaugeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const appKey = btn.getAttribute('data-app');
      const data = specsDatabase[appKey];

      if (data) {
        resultDisplay.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px; margin-bottom: 14px;">
            <h4 style="color: var(--primary-gold); font-size: 1.2rem; font-weight: 700;">${data.title}</h4>
            <span class="badge-gauge">${data.grammage}</span>
          </div>
          <p style="color: var(--text-secondary); font-size: 0.92rem; margin-bottom: 16px;">${data.features}</p>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 14px; background: rgba(15, 23, 42, 0.6); padding: 16px; border-radius: var(--radius-md); border: 1px solid var(--border-light);">
            <div><strong style="color: var(--primary-gold); font-size: 0.8rem; display: block;">Espessura Calibrada:</strong> <span style="font-size: 0.88rem; color: #fff;">${data.thickness}</span></div>
            <div><strong style="color: var(--primary-gold); font-size: 0.8rem; display: block;">Título do Fio:</strong> <span style="font-size: 0.88rem; color: #fff;">${data.yarn}</span></div>
            <div><strong style="color: var(--primary-gold); font-size: 0.8rem; display: block;">Tecidos Recomendados:</strong> <span style="font-size: 0.88rem; color: #fff;">${data.fabrics}</span></div>
          </div>
        `;
      }
    });
  });
}

/* ========================================================================
   11. Acompanhamento das Fases para o Gestor (index.html)
   ======================================================================== */
function initManagerTracker() {
  const phaseButtons = document.querySelectorAll('.manager-phase');
  const progressFill = document.querySelector('.manager-progress-fill');
  const phaseTitle = document.getElementById('manager-phase-title');
  const phaseDescription = document.getElementById('manager-phase-description');
  const phaseMeta = document.getElementById('manager-phase-meta');
  const lastUpdate = document.getElementById('manager-last-update');
  const refreshButton = document.getElementById('manager-refresh');
  if (!phaseButtons.length || !progressFill || !phaseTitle || !phaseDescription || !phaseMeta || !lastUpdate) return;

  const phaseDetails = [
    ['Matéria-prima e fiação', 'Fibras selecionadas e fios preparados para iniciar a tecelagem.', 'Status: concluída'],
    ['Tecelagem e calibração', 'O tecido está sendo formado com controle de densidade, espessura e gramatura.', 'Status: em andamento'],
    ['Beneficiamento e acabamento', 'Tinturaria, pintura e tratamentos especiais serão realizados após a tecelagem.', 'Status: próxima etapa'],
    ['Inspeção final e expedição', 'A equipe validará o lote e liberará o material para corte e expedição.', 'Status: próxima etapa']
  ];

  const updateTimestamp = () => {
    const now = new Date();
    lastUpdate.dateTime = now.toISOString();
    lastUpdate.textContent = `Última atualização: ${now.toLocaleTimeString('pt-BR')}`;
  };

  const selectPhase = (index) => {
    const phase = phaseDetails[index];
    phaseButtons.forEach(phaseButton => {
      phaseButton.classList.remove('active');
      phaseButton.setAttribute('aria-selected', 'false');
    });
    phaseButtons[index].classList.add('active');
    phaseButtons[index].setAttribute('aria-selected', 'true');
    progressFill.style.width = `${((index + 1) / phaseButtons.length) * 100}%`;
    phaseTitle.textContent = phase[0];
    phaseDescription.textContent = phase[1];
    phaseMeta.textContent = phase[2];
    updateTimestamp();
  };

  phaseButtons.forEach((button, index) => {
    button.addEventListener('click', () => selectPhase(index));
  });

  refreshButton?.addEventListener('click', updateTimestamp);
  updateTimestamp();
  window.setInterval(updateTimestamp, 1000);

  const liveFabrics = document.querySelectorAll('.manager-fabric-live');
  const livePhases = ['Matéria-prima', 'Tecelagem', 'Beneficiamento', 'Inspeção final'];
  const updateLiveBoard = () => {
    liveFabrics.forEach(fabric => {
      let progress = Number(fabric.dataset.liveProgress) + 1;
      if (progress > 100) progress = 25;
      fabric.dataset.liveProgress = progress;
      const phaseIndex = Math.min(Math.floor(progress / 25), livePhases.length - 1);
      fabric.querySelector('.manager-fabric-progress span').style.width = `${progress}%`;
      fabric.querySelector('.live-fabric-phase').textContent = livePhases[phaseIndex];
      fabric.querySelector('.live-fabric-percent').textContent = `${progress}%`;
    });
    updateTimestamp();
  };

  updateLiveBoard();
  window.setInterval(updateLiveBoard, 15000);
}

function initManagerLogin() {
  const form = document.getElementById('manager-login-form');
  const loginCard = document.getElementById('manager-login-card');
  const dashboard = document.getElementById('manager-dashboard');
  const feedback = document.getElementById('manager-login-feedback');
  const logout = document.getElementById('manager-logout');
  if (!form || !loginCard || !dashboard || !feedback) return;

  const supabaseClient = window.citSupabase;

  const showDashboard = () => {
    loginCard.hidden = true;
    dashboard.hidden = false;
  };

  form.addEventListener('submit', async event => {
    event.preventDefault();
    if (!form.checkValidity()) {
      feedback.textContent = 'Informe um e-mail e uma senha válidos.';
      return;
    }

    if (!supabaseClient) {
      feedback.textContent = 'Configure o Supabase em js/supabase-config.js.';
      return;
    }

    const email = document.getElementById('manager-email').value.trim();
    const password = document.getElementById('manager-password').value;
    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });

    if (error) {
      feedback.textContent = 'E-mail ou senha incorretos.';
      return;
    }

    feedback.textContent = '';
    showDashboard();
  });

  logout?.addEventListener('click', async () => {
    await supabaseClient?.auth.signOut();
    dashboard.hidden = true;
    loginCard.hidden = false;
    form.reset();
  });

  supabaseClient?.auth.getSession().then(({ data }) => {
    if (data.session) showDashboard();
  });
}

function initLiveFabricBoard() {
  const liveFabrics = document.querySelectorAll('.manager-fabric-live');
  const dashboardClock = document.getElementById('dashboard-clock');
  if (!liveFabrics.length) return;

  const livePhases = ['Matéria-prima', 'Tecelagem', 'Beneficiamento', 'Inspeção final'];
  const updateLiveBoard = () => {
    liveFabrics.forEach(fabric => {
      let progress = Number(fabric.dataset.liveProgress) + 1;
      if (progress > 100) progress = 25;
      fabric.dataset.liveProgress = progress;
      const phaseIndex = Math.min(Math.floor(progress / 25), livePhases.length - 1);
      fabric.querySelector('.manager-fabric-progress span').style.width = `${progress}%`;
      fabric.querySelector('.live-fabric-phase').textContent = livePhases[phaseIndex];
      fabric.querySelector('.live-fabric-percent').textContent = `${progress}%`;
    });
    if (dashboardClock) dashboardClock.textContent = new Date().toLocaleTimeString('pt-BR');
  };

  updateLiveBoard();
  window.setInterval(updateLiveBoard, 15000);
}

function initTechnicalLiveTracker() {
  const phases = document.querySelectorAll('.technical-phase-live');
  if (!phases.length) return;

  const updatePhases = () => {
    phases.forEach(phase => {
      const progress = Math.min(Number(phase.dataset.technicalProgress) + 1, 100);
      phase.dataset.technicalProgress = progress;
      phase.querySelector('.technical-phase-bar span').style.width = `${progress}%`;
      phase.querySelector('.technical-phase-percent').textContent = `${progress}%`;
    });
  };

  updatePhases();
  window.setInterval(updatePhases, 12000);
}

