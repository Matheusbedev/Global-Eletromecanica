// ============================================================
// Global Eletromecânica — script.js v3.0
// Autor: @dev.matheuss | dev.matheusaugustoo@gmail.com
// ============================================================

// ── Prevenção de FOUC ───────────────────────────────────────
document.documentElement.classList.add('js-loaded');

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
  initFooterSlideshow();
  initPerformanceOptimizations();
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
// ── Scroll to Top ───────────────────────────────────────────
function initScrollTop() {
  const btn = document.querySelector('.scroll-top');
  if (!btn) return;
  btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// ── Footer Slideshow — removido (fundo agora é marca d'água estática) ──
function initFooterSlideshow() {
  /* não há mais slides no footer */
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
      icon: 'fa-wrench',
      titulo: 'Manutenção Industrial',
      desc: 'Paradas programadas, reformas e manutenção corretiva com agilidade e segurança.',
      itens: [
        'Paradas programadas de unidades produtivas',
        'Reforma de equipamentos industriais',
        'Extratores, redlers, secadores, elevadores e correias',
        'Bombas, redutores, equipamentos rotativos',
        'Serviços de campo em motores elétricos',
      ]
    },
    {
      icon: 'fa-industry',
      titulo: 'Montagem Industrial',
      desc: 'Montagem mecânica e estrutural com precisão técnica e cumprimento de prazos.',
      itens: [
        'Montagem mecânica de equipamentos e acessórios',
        'Fabricação e montagem de estruturas metálicas',
        'Fabricação e reforma de coberturas metálicas',
        'Instalação de tubulações e caldeiraria geral',
        'Redes de processos, utilidades e hidrantes',
      ]
    },
    {
      icon: 'fa-bolt',
      titulo: 'Instalações Elétricas',
      desc: 'Instalações e manutenção elétrica industrial com total conformidade às normas.',
      itens: [
        'Instalações, montagem e manutenção elétrica geral',
        'Tubulações em diversas bitolas e classes de pressão',
        'Serviços de caldeiraria de processos e utilidades',
        'Rede hidráulica e de hidrantes completa',
      ]
    },
  ];

  servicos.forEach((s, i) => {
    const card = document.createElement('div');
    card.className = 'servico-card';
    card.style.transitionDelay = `${i * 0.1}s`;
    card.innerHTML = `
      <div class="servico-icon-wrap">
        <i class="fas ${s.icon}"></i>
      </div>
      <h3>${s.titulo}</h3>
      <p class="servico-card-desc">${s.desc}</p>
      <div class="servico-divider"></div>
      <ul class="servico-list">
        ${s.itens.map(item => `
          <li>
            <span class="check-icon">
              <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>
            </span>
            ${item}
          </li>`).join('')}
      </ul>
    `;
    grid.appendChild(card);
  });

  const munckCard = document.createElement('div');
  munckCard.className = 'servico-card servico-card-munck';
  munckCard.style.transitionDelay = `${servicos.length * 0.1}s`;
  munckCard.innerHTML = `
    <div class="servico-icon-wrap">
      <i class="fas fa-truck-moving"></i>
    </div>
    <div class="munck-content">
      <div class="munck-badge">Disponível para Locação</div>
      <h3>Caminhão Munck</h3>
      <p class="munck-desc">Disponibilizamos caminhão munck para locação, ideal para içamento e movimentação de cargas pesadas em obras e indústrias com total segurança e eficiência operacional.</p>
    </div>
    <a href="https://wa.me/554331547568?text=Olá! Gostaria de informações sobre locação de Caminhão Munck." target="_blank" rel="noopener noreferrer" class="munck-cta">
      <i class="fab fa-whatsapp"></i>
      Solicitar via WhatsApp
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

// ── Otimizações de Performance ──────────────────────────────
function initPerformanceOptimizations() {
  // Lazy loading para imagens fora da viewport
  if ('loading' in HTMLImageElement.prototype) {
    const images = document.querySelectorAll('img[loading="lazy"]');
    images.forEach(img => {
      img.src = img.src;
    });
  } else {
    // Fallback para navegadores antigos
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js';
    document.body.appendChild(script);
  }

  // Preload de fontes críticas
  const fontPreload = document.createElement('link');
  fontPreload.rel = 'preload';
  fontPreload.as = 'font';
  fontPreload.type = 'font/woff2';
  fontPreload.crossOrigin = 'anonymous';
  document.head.appendChild(fontPreload);

  // Otimização de scroll com requestAnimationFrame
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        onScroll();
        ticking = false;
      });
      ticking = true;
    }
  }, { passive: true });
}

// ── Easter Egg — Console Art ────────────────────────────────
console.log('%c╔═══════════════════════════════════════════════════════════╗', 'color: #F55A1E; font-weight: bold;');
console.log('%c║                                                           ║', 'color: #F55A1E; font-weight: bold;');
console.log('%c║     🔧  GLOBAL ELETROMECÂNICA                             ║', 'color: #F55A1E; font-weight: bold; font-size: 16px;');
console.log('%c║                                                           ║', 'color: #F55A1E; font-weight: bold;');
console.log('%c║     Manutenção e Montagem Industrial desde 2012          ║', 'color: #1A5FA8;');
console.log('%c║     Cambé, Paraná — Brasil                                ║', 'color: #1A5FA8;');
console.log('%c║                                                           ║', 'color: #F55A1E; font-weight: bold;');
console.log('%c║     📞 (43) 3154.7568                                     ║', 'color: #64748B;');
console.log('%c║     📧 globaleletromecanica@gmail.com                     ║', 'color: #64748B;');
console.log('%c║                                                           ║', 'color: #F55A1E; font-weight: bold;');
console.log('%c║     Desenvolvido por @dev.matheuss                        ║', 'color: #8A96A8; font-style: italic;');
console.log('%c║     dev.matheusaugustoo@gmail.com                         ║', 'color: #8A96A8; font-style: italic;');
console.log('%c║                                                           ║', 'color: #F55A1E; font-weight: bold;');
console.log('%c╚═══════════════════════════════════════════════════════════╝', 'color: #F55A1E; font-weight: bold;');
console.log('%c\n💡 Dica: Pressione Ctrl+Shift+I para explorar o código!\n', 'color: #25D366; font-weight: bold;');
