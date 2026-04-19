// ============================================================
// Global Eletromecânica — script.js v3.0
// Autor: @dev.matheuss | dev.matheusaugustoo@gmail.com
// ============================================================

// ── Inicialização ───────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initHeader();
  initMobileMenu();
  initSmoothScroll();
  initScrollAnimations();
  initCounters();
  initHeroSlideshow();
  initServicos();
  initPortfolio();
  initDepoimentos();
  initContactForm();
  initScrollTop();
});

// ── Hero Slideshow Automático ───────────────────────────────
function initHeroSlideshow() {
  const slides = document.querySelectorAll('.hero-slide');
  const dotsContainer = document.getElementById('hero-dots');
  if (!slides.length) return;

  let current = 0;
  const total = slides.length;
  const INTERVAL = 5000;
  let timer;

  // Criar dots de navegação
  if (dotsContainer) {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'hero-dot' + (i === 0 ? ' active' : '');
      dot.setAttribute('aria-label', `Slide ${i + 1}`);
      dot.addEventListener('click', () => { goToSlide(i); resetTimer(); });
      dotsContainer.appendChild(dot);
    });
  }

  function goToSlide(index) {
    slides[current].classList.remove('active');
    if (dotsContainer) dotsContainer.children[current].classList.remove('active');
    current = index;
    slides[current].classList.add('active');
    if (dotsContainer) dotsContainer.children[current].classList.add('active');
  }

  function resetTimer() {
    clearInterval(timer);
    timer = setInterval(() => goToSlide((current + 1) % total), INTERVAL);
  }

  resetTimer();
}

// ── Header Scroll Effect ────────────────────────────────────
function initHeader() {
  const header = document.getElementById('header');
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll(); // estado inicial
}

// ── Scroll to Top ───────────────────────────────────────────
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Active Navigation — integrada no onScroll ───────────────

// ── Handler de scroll unificado (passive para performance) ──
function onScroll() {
  const scrollY     = window.pageYOffset;
  const header      = document.getElementById('header');
  const scrollTopBtn = document.querySelector('.scroll-top');

  // Header transparente → sólido
  header.classList.toggle('scrolled', scrollY > 80);

  // Botão voltar ao topo
  if (scrollTopBtn) scrollTopBtn.classList.toggle('visible', scrollY > 500);

  // Link ativo na navegação
  const scrollPos = scrollY + 100;
  document.querySelectorAll('section[id]').forEach(section => {
    const id = section.getAttribute('id');
    const inView = scrollPos >= section.offsetTop &&
                   scrollPos < section.offsetTop + section.offsetHeight;
    document.querySelectorAll(`.nav a[href="#${id}"]`)
      .forEach(link => link.classList.toggle('active', inView));
  });
}

// ── Mobile Menu ─────────────────────────────────────────────
function initMobileMenu() {
  const menuToggle = document.querySelector('.menu-toggle');
  const nav = document.getElementById('nav');
  const navLinks = nav.querySelectorAll('a');

  menuToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    menuToggle.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', isOpen);
    
    // Prevenir scroll do body quando menu está aberto
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Fechar menu ao clicar em um link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    });
  });

  // Fechar menu ao clicar fora
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target) && nav.classList.contains('open')) {
      nav.classList.remove('open');
      menuToggle.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }
  });
}

// ── Smooth Scroll ───────────────────────────────────────────
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      
      // Ignorar links vazios ou apenas "#"
      if (!href || href === '#') return;
      
      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();
      
      const headerHeight = document.getElementById('header').offsetHeight;
      const targetPosition = target.offsetTop - headerHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: 'smooth'
      });
    });
  });
}

// ── Scroll Animations ───────────────────────────────────────
// Observer reutilizável para elementos criados dinamicamente
const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in-up');
      scrollObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -80px 0px' });

function observeNewElements(elements) {
  elements.forEach(el => scrollObserver.observe(el));
}

function initScrollAnimations() {
  // Observar elementos estáticos (info-card, diferencial-item)
  document.querySelectorAll('.info-card, .diferencial-item').forEach(el => {
    scrollObserver.observe(el);
  });

  // Observar elementos com data-animate
  const dataAnimateObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.dataset.delay || 0;
        setTimeout(() => entry.target.classList.add('is-visible'), parseInt(delay));
        dataAnimateObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('[data-animate]').forEach(el => dataAnimateObserver.observe(el));
}

// ── Contadores Animados ─────────────────────────────────────
function initCounters() {
  const counters = document.querySelectorAll('.counter[data-target]');
  if (!counters.length) return;

  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(counter => counterObserver.observe(counter));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Easing out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  }

  requestAnimationFrame(update);
}

// ── Renderizar Serviços — cards de texto com conteúdo real ──
function initServicos() {
  const grid = document.getElementById('servicos-grid');
  if (!grid) return;

  const servicos = [
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>`,
      titulo: 'Manutenção Industrial',
      itens: [
        'Paradas programadas de unidades produtivas',
        'Reforma de equipamentos industriais',
        'Extratores, redlers, secadores, elevadores, roscas e correias',
        'Bombas, redutores, equipamentos estáticos e rotativos',
        'Serviços de campo em motores elétricos',
      ]
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>`,
      titulo: 'Montagem Industrial',
      itens: [
        'Montagem mecânica de equipamentos e acessórios',
        'Fabricação e montagem de estruturas metálicas',
        'Fabricação e reforma de coberturas metálicas',
        'Instalação de tubulações e caldeiraria geral',
        'Redes de processos, utilidades, hidráulica e hidrantes',
      ]
    },
    {
      icon: `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
      titulo: 'Instalações Elétricas',
      itens: [
        'Instalações, montagem e manutenção elétrica geral',
        'Tubulações em diversas bitolas, materiais e classes de pressão',
        'Serviços de caldeiraria de processos e utilidades',
        'Toda a rede hidráulica e de hidrantes',
      ]
    },
  ];

  servicos.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'servico-card';
    card.style.transitionDelay = `${i * 0.12}s`;
    card.innerHTML = `
      <div class="servico-icon">${s.icon}</div>
      <h3>${s.titulo}</h3>
      <ul class="servico-list">
        ${s.itens.map(item => `
          <li>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
            ${item}
          </li>`).join('')}
      </ul>
    `;
    grid.appendChild(card);
  });

  // Card especial — Caminhão Munck
  const munckCard = document.createElement('div');
  munckCard.className = 'servico-card servico-card-munck';
  munckCard.style.transitionDelay = `${servicos.length * 0.12}s`;
  munckCard.innerHTML = `
    <div class="servico-icon">
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="1" y="13" width="15" height="8" rx="1"/>
        <path d="M16 17h2l3-5V9h-5v8z"/>
        <circle cx="5.5" cy="21" r="1.5"/><circle cx="18.5" cy="21" r="1.5"/>
        <path d="M7 13V7l4-4h2v10"/>
        <line x1="11" y1="3" x2="11" y2="13"/>
      </svg>
    </div>
    <div class="munck-content">
      <div class="munck-badge">Disponível para Locação</div>
      <h3>Caminhão Munck</h3>
      <p class="munck-desc">Disponibilizamos caminhão munck para locação, ideal para içamento e movimentação de cargas pesadas em obras e indústrias.</p>
    </div>
    <a href="#contato" class="munck-cta">
      <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
      Solicitar informações
    </a>
  `;
  grid.appendChild(munckCard);

  observeNewElements(grid.querySelectorAll('.servico-card'));
}

// ── Renderizar Portfólio — sem filtros, só as melhores fotos ─
function initPortfolio() {
  const grid = document.getElementById('portfolio-grid');
  if (!grid) return;

  // As 9 melhores fotos — correspondendo ao portfólio "Nosso Trabalho"
  const melhoresFotos = [
    { src: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.57.50.jpeg',      titulo: 'Manutenção de Eixos e Rolamentos' },
    { src: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.57.53.jpeg',      titulo: 'Instalação de Tubulações' },
    { src: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.57.54.jpeg',      titulo: 'Serviços de Solda e Vedação' },
    { src: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.57.57.jpeg',      titulo: 'Manutenção de Superfícies Metálicas' },
    { src: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.58.03.jpeg',      titulo: 'Serviços em Espaço Confinado' },
    { src: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.58.07 (3).jpeg',  titulo: 'Manutenção de Equipamentos Rotativos' },
    { src: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 15.21.56.jpeg',      titulo: 'Instalações Industriais' },
    { src: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 15.21.58.jpeg',      titulo: 'Montagem de Motores' },
    { src: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.57.54 (2).jpeg',  titulo: 'Sistemas de Transmissão' },
  ];

  melhoresFotos.forEach((item, index) => {
    const el = document.createElement('div');
    el.className = 'portfolio-item';
    el.style.transitionDelay = `${index * 0.06}s`;
    el.innerHTML = `
      <img src="${item.src}" alt="${item.titulo}" loading="lazy">
      <div class="portfolio-overlay">
        <span class="portfolio-titulo">${item.titulo}</span>
      </div>
    `;
    grid.appendChild(el);
  });

  observeNewElements(grid.querySelectorAll('.portfolio-item'));
}

// ── Depoimentos ─────────────────────────────────────────────
function initDepoimentos() {
  const grid = document.getElementById('depoimentos-grid');
  if (!grid) return;

  const depoimentos = [
    {
      nome: 'Carlos Eduardo',
      cargo: 'Gerente de Manutenção — BRF',
      texto: 'A Global Eletromecânica superou nossas expectativas. Equipe altamente qualificada, pontual e comprometida com a segurança. Recomendo sem hesitar.',
      estrelas: 5
    },
    {
      nome: 'Rodrigo Almeida',
      cargo: 'Engenheiro de Produção — Cargill',
      texto: 'Parceria de anos. Sempre que precisamos de uma parada programada ou manutenção emergencial, a Global está pronta. Confiança total no trabalho deles.',
      estrelas: 5
    },
    {
      nome: 'Fernanda Costa',
      cargo: 'Supervisora Industrial — LAR Cooperativa',
      texto: 'Profissionalismo e qualidade técnica em cada entrega. A montagem das estruturas metálicas foi executada com precisão e dentro do prazo.',
      estrelas: 5
    }
  ];

  depoimentos.forEach((d, i) => {
    const card = document.createElement('div');
    card.className = 'depoimento-card';
    card.style.transitionDelay = `${i * 0.12}s`;
    card.innerHTML = `
      <div class="depoimento-quote">"</div>
      <div class="depoimento-stars">${'★'.repeat(d.estrelas)}</div>
      <p class="depoimento-text">${d.texto}</p>
      <div class="depoimento-author">${d.nome}</div>
      <div class="depoimento-cargo">${d.cargo}</div>
    `;
    grid.appendChild(card);
  });

  observeNewElements(grid.querySelectorAll('.depoimento-card'));
}

// ── Formulário de Contato — Formspree ──────────────────────
function initContactForm() {
  const form = document.getElementById('contato-form');
  if (!form) return;

  const FORMSPREE_ID = form.dataset.formspreeId;

  // Máscara de telefone
  const telefoneInput = form.querySelector('#telefone');
  if (telefoneInput) {
    telefoneInput.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');
      if (value.length > 11) value = value.slice(0, 11);
      if (value.length > 10) {
        value = value.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1) $2-$3');
      } else if (value.length > 6) {
        value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
      } else if (value.length > 2) {
        value = value.replace(/^(\d{2})(\d{0,5})/, '($1) $2');
      } else if (value.length > 0) {
        value = value.replace(/^(\d*)/, '($1');
      }
      e.target.value = value;
    });
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn  = form.querySelector('#submit-btn');
    const originalHTML = submitBtn.innerHTML;

    // Validação
    const nome     = form.querySelector('#nome').value.trim();
    const email    = form.querySelector('#email').value.trim();
    const mensagem = form.querySelector('#mensagem').value.trim();

    if (!nome || !email || !mensagem) {
      showNotification('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showNotification('Por favor, insira um e-mail válido.', 'error');
      return;
    }

    // Estado de carregamento
    submitBtn.disabled = true;
    submitBtn.classList.add('loading');
    submitBtn.innerHTML = `
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
           style="animation:spin 0.8s linear infinite" aria-hidden="true">
        <circle cx="12" cy="12" r="10" opacity="0.25"/>
        <path d="M12 2a10 10 0 0 1 10 10" opacity="0.75"/>
      </svg>
      Enviando...
    `;

    try {
      let response;

      if (FORMSPREE_ID && FORMSPREE_ID !== 'SEU_FORM_ID') {
        // Envio real via Formspree
        const data = new FormData(form);
        response = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
          method: 'POST',
          body: data,
          headers: { 'Accept': 'application/json' }
        });

        if (!response.ok) throw new Error('Erro no envio');
        showNotification('Mensagem enviada! Entraremos em contato em breve.', 'success');
        form.reset();
      } else {
        // Modo demonstração — Formspree não configurado
        await new Promise(resolve => setTimeout(resolve, 1500));
        showNotification('⚠️ Configure o Formspree: adicione seu ID em data-formspree-id no HTML.', 'info');
      }
    } catch (err) {
      showNotification('Erro ao enviar. Tente pelo WhatsApp ou e-mail.', 'error');
    } finally {
      submitBtn.disabled = false;
      submitBtn.classList.remove('loading');
      submitBtn.innerHTML = originalHTML;
    }
  });
}

function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

function showNotification(message, type = 'info') {
  // Remover notificação existente
  const existing = document.querySelector('.notification');
  if (existing) existing.remove();

  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 32px;
    padding: 16px 24px;
    background: ${type === 'success' ? '#25d366' : type === 'error' ? '#e74c3c' : '#3498db'};
    color: white;
    border-radius: 8px;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5);
    z-index: 10000;
    font-family: 'Montserrat', sans-serif;
    font-weight: 600;
    font-size: 0.9rem;
    max-width: 400px;
    animation: slideInRight 0.3s ease-out;
  `;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = 'slideOutRight 0.3s ease-out';
    setTimeout(() => notification.remove(), 300);
  }, 5000);
}

// Adicionar animações de notificação ao CSS dinamicamente
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(400px);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  @keyframes slideOutRight {
    from {
      transform: translateX(0);
      opacity: 1;
    }
    to {
      transform: translateX(400px);
      opacity: 0;
    }
  }
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(style);

// ── Console Message ─────────────────────────────────────────
console.log('%c🔧 Global Eletromecânica', 'font-size: 20px; font-weight: bold; color: #FF6B35;');
console.log('%cManutenção e Montagem Industrial desde 2012', 'font-size: 12px; color: #999;');
console.log('%c(43) 3154.7568 | globaleletromecanica@gmail.com', 'font-size: 11px; color: #666;');
