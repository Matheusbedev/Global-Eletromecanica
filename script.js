/* ============================================
   GLOBAL ELETROMECÂNICA - JAVASCRIPT MODERNO
   ============================================ */

// Portfolio data
const portfolio = [
  { img: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.58.07 (3).jpeg', titulo: 'Montagem Industrial Complexa', categoria: 'montagem' },
  { img: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.58.07.jpeg', titulo: 'Equipe Especializada em Ação', categoria: 'manutencao' },
  { img: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.57.57.jpeg', titulo: 'Instalação de Sistemas Elétricos', categoria: 'instalacao' },
  { img: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 15.21.56.jpeg', titulo: 'Manutenção Preventiva Industrial', categoria: 'manutencao' },
  { img: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.58.06.jpeg', titulo: 'Estruturas Metálicas', categoria: 'montagem' },
  { img: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.57.53.jpeg', titulo: 'Trabalho em Altura Seguro', categoria: 'manutencao' },
  { img: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-21 at 12.05.09 (1).jpeg', titulo: 'Projeto Industrial Finalizado', categoria: 'montagem' },
  { img: 'FOTOS SERVIÇO/WhatsApp Image 2026-04-18 at 14.57.50.jpeg', titulo: 'Instalações Eletromecânicas', categoria: 'instalacao' }
];

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initMobileMenu();
  initScrollEffects();
  initPortfolio();
  initCounters();
  initContactForm();
  initSmoothScroll();
});

// Mobile menu
function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const nav       = document.getElementById('nav');

  if (!hamburger || !nav) return;

  hamburger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', isOpen);
  });

  // Fecha ao clicar em qualquer link
  nav.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      nav.classList.remove('open');
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Scroll effects
function initScrollEffects() {
  const header = document.querySelector('.header');
  const scrollTopBtn = document.querySelector('.scroll-top');
  
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset > 100;
    
    // Header scroll effect
    if (header) {
      header.classList.toggle('scrolled', scrolled);
    }
    
    // Scroll to top button
    if (scrollTopBtn) {
      scrollTopBtn.classList.toggle('show', window.pageYOffset > 300);
    }
  });
  
  // Scroll to top functionality
  if (scrollTopBtn) {
    scrollTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}

// Portfolio
function initPortfolio() {
  const portfolioGrid = document.getElementById('portfolio-grid');
  const filterBtns    = document.querySelectorAll('.filter-btn');

  if (!portfolioGrid) return;

  let currentItems = [...portfolio];

  function getCategoryLabel(categoria) {
    const labels = {
      'manutencao': 'Manutenção Industrial',
      'montagem':   'Montagem Industrial',
      'instalacao': 'Instalações Eletromecânicas'
    };
    return labels[categoria] || categoria;
  }

  function renderPortfolio(filter = 'todos') {
    currentItems = filter === 'todos'
      ? [...portfolio]
      : portfolio.filter(item => item.categoria === filter);

    portfolioGrid.innerHTML = currentItems.map((item, i) => `
      <div class="portfolio-item" data-index="${i}">
        <img src="${item.img}" alt="${item.titulo}" loading="lazy">
        <div class="portfolio-overlay">
          <div>
            <h3>${item.titulo}</h3>
            <p>${getCategoryLabel(item.categoria)}</p>
          </div>
        </div>
      </div>
    `).join('');

    // Bind lightbox
    portfolioGrid.querySelectorAll('.portfolio-item').forEach(el => {
      el.addEventListener('click', () => openLightbox(parseInt(el.dataset.index)));
    });
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderPortfolio(btn.dataset.filtro);
    });
  });

  renderPortfolio();

  // ── Lightbox ──────────────────────────────
  const lightbox = document.getElementById('lightbox');
  const lbImg    = document.getElementById('lightbox-img');
  const lbCap    = document.getElementById('lightbox-caption');
  let lbIndex    = 0;

  function openLightbox(index) {
    lbIndex = index;
    showLightboxItem();
    lightbox.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    lightbox.classList.remove('open');
    document.body.style.overflow = '';
  }

  function showLightboxItem() {
    const item = currentItems[lbIndex];
    lbImg.src = item.img;
    lbImg.alt = item.titulo;
    lbCap.textContent = `${item.titulo} · ${lbIndex + 1}/${currentItems.length}`;
  }

  function navigate(dir) {
    lbIndex = (lbIndex + dir + currentItems.length) % currentItems.length;
    showLightboxItem();
  }

  document.getElementById('lightbox-close').addEventListener('click', closeLightbox);
  document.getElementById('lightbox-prev').addEventListener('click', () => navigate(-1));
  document.getElementById('lightbox-next').addEventListener('click', () => navigate(1));
  lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });

  document.addEventListener('keydown', e => {
    if (!lightbox.classList.contains('open')) return;
    if (e.key === 'Escape')      closeLightbox();
    if (e.key === 'ArrowLeft')   navigate(-1);
    if (e.key === 'ArrowRight')  navigate(1);
  });
}

// Animated counters
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => observer.observe(counter));
}

function animateCounter(element) {
  const target = parseInt(element.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, 16);
}

// Contact form
function initContactForm() {
  const form = document.getElementById('contato-form');
  if (!form) return;
  
  form.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const formData = new FormData(form);
    const nome = formData.get('nome');
    const email = formData.get('email');
    const mensagem = formData.get('mensagem');
    
    if (!nome || !email || !mensagem) {
      showFormFeedback('Por favor, preencha todos os campos obrigatórios.', 'error');
      return;
    }
    
    // Create WhatsApp message
    const empresa = formData.get('empresa') || '';
    const telefone = formData.get('telefone') || '';
    const servico = formData.get('servico') || '';
    
    const message = `Olá! Tenho interesse nos serviços da Global Eletromecânica.

*Nome:* ${nome}
${empresa ? `*Empresa:* ${empresa}` : ''}
*Email:* ${email}
${telefone ? `*Telefone:* ${telefone}` : ''}
${servico ? `*Serviço:* ${servico}` : ''}

*Mensagem:*
${mensagem}`;
    
    // Open WhatsApp
    const whatsappUrl = `https://wa.me/554331547568?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    
    // Show success message and reset form
    showFormFeedback('Mensagem enviada! Você será redirecionado para o WhatsApp.', 'success');
    form.reset();
  });
}

function showFormFeedback(message, type) {
  const feedback = document.getElementById('form-feedback');
  if (!feedback) return;
  
  feedback.textContent = message;
  feedback.className = `form-feedback ${type}`;
  feedback.style.display = 'block';
  
  setTimeout(() => {
    feedback.style.display = 'none';
  }, 5000);
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });
}

console.log('Global Eletromecânica - Site carregado com sucesso!');