/* QSATH System | Josué Sathler: comportamento da página. Sem dependências. */
(function () {
  'use strict';

  // ---------- Contatos (altere aqui) ----------
  var CONTATO = {
    email: 'josuesathlersantos@gmail.com',
    whatsapp: '5527998397504' // DDI + DDD + número, só dígitos
  };

  // ---------- Cabeçalho: borda ao rolar ----------
  var header = document.querySelector('.site-header');
  function onScroll() { header.classList.toggle('is-scrolled', window.scrollY > 8); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---------- Menu no celular ----------
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.getElementById('menu');

  function setMenu(open) {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('.menu-toggle-label').textContent = open ? 'Fechar' : 'Menu';
    nav.classList.toggle('is-open', open);
  }
  toggle.addEventListener('click', function () {
    setMenu(toggle.getAttribute('aria-expanded') !== 'true');
  });
  nav.addEventListener('click', function (e) {
    if (e.target.closest('a')) setMenu(false);
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      toggle.focus();
    }
  });
  window.matchMedia('(min-width: 761px)').addEventListener('change', function (mq) {
    if (mq.matches) setMenu(false);
  });

  // ---------- Item ativo da navegação ----------
  var navLinks = Array.prototype.slice.call(nav.querySelectorAll('a[href^="#"]'));
  var sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); }).filter(Boolean);
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          if (a.getAttribute('href') === '#' + entry.target.id) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { io.observe(s); });
  }

  // ---------- Abas das telas de cada projeto (padrão WAI-ARIA tabs) ----------
  document.querySelectorAll('[data-gallery]').forEach(function (gallery) {
    var tabs = Array.prototype.slice.call(gallery.querySelectorAll('[role="tab"]'));
    var urlLabel = gallery.querySelector('[data-url-label]');

    function selectTab(tab, focus) {
      tabs.forEach(function (t) {
        var selected = t === tab;
        t.setAttribute('aria-selected', String(selected));
        t.tabIndex = selected ? 0 : -1;
        var panel = document.getElementById(t.getAttribute('aria-controls'));
        if (selected) {
          panel.hidden = false;
          panel.classList.remove('is-entering');
          void panel.offsetWidth;
          panel.classList.add('is-entering');
        } else {
          panel.hidden = true;
        }
      });
      if (urlLabel) urlLabel.textContent = tab.dataset.url;
      if (focus) tab.focus();
    }
    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () { selectTab(tab); });
      tab.addEventListener('keydown', function (e) {
        var next = null;
        if (e.key === 'ArrowRight') next = tabs[(i + 1) % tabs.length];
        if (e.key === 'ArrowLeft') next = tabs[(i - 1 + tabs.length) % tabs.length];
        if (e.key === 'Home') next = tabs[0];
        if (e.key === 'End') next = tabs[tabs.length - 1];
        if (next) { e.preventDefault(); selectTab(next, true); }
      });
    });
  });

  // ---------- Revelar blocos ao rolar ----------
  var reveals = document.querySelectorAll('.section-head, .case-top, .gallery, .facts, .cols, .about-grid, .github-strip, .composer');
  if ('IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        ro.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -10% 0px' });
    reveals.forEach(function (el) { el.classList.add('reveal'); ro.observe(el); });
  }

  // ---------- Composer de mensagem (abre e-mail ou WhatsApp) ----------
  var form = document.getElementById('composer');
  var nome = document.getElementById('c-nome');
  var msg = document.getElementById('c-msg');
  var status = document.getElementById('composer-status');
  var ASSUNTOS = { estagio: 'Vaga de estágio', projeto: 'Conversa sobre um projeto', outro: 'Contato pelo portfólio' };

  // Links "Descrever minha necessidade" já marcam o assunto "Projeto".
  document.querySelectorAll('[data-subject]').forEach(function (link) {
    link.addEventListener('click', function () {
      var radio = form.querySelector('input[name="assunto"][value="' + link.dataset.subject + '"]');
      if (radio) radio.checked = true;
      setTimeout(function () { nome.focus({ preventScroll: true }); }, 450);
    });
  });

  function setError(input, text) {
    var err = document.getElementById(input.getAttribute('aria-describedby'));
    err.textContent = text;
    if (text) input.setAttribute('aria-invalid', 'true');
    else input.removeAttribute('aria-invalid');
  }

  function validate() {
    var ok = true;
    if (nome.value.trim().length < 2) { setError(nome, 'Escreva seu nome para eu saber com quem estou falando.'); ok = false; }
    else setError(nome, '');
    if (msg.value.trim().length < 10) { setError(msg, 'Escreva pelo menos uma frase sobre o que você precisa (mínimo de 10 caracteres).'); ok = false; }
    else setError(msg, '');
    return ok;
  }
  [nome, msg].forEach(function (el) {
    el.addEventListener('input', function () { if (el.getAttribute('aria-invalid')) validate(); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    status.textContent = '';
    if (!validate()) {
      (nome.getAttribute('aria-invalid') ? nome : msg).focus();
      return;
    }
    var canal = (e.submitter && e.submitter.value) || 'email';
    var assunto = ASSUNTOS[form.querySelector('input[name="assunto"]:checked').value];
    var corpo = msg.value.trim() + '\n\n' + nome.value.trim();
    var url;

    if (canal === 'whatsapp') {
      url = 'https://wa.me/' + CONTATO.whatsapp + '?text=' + encodeURIComponent('Olá, Josué! ' + assunto + '.\n\n' + corpo);
      window.open(url, '_blank', 'noopener');
      status.textContent = 'Abrimos o WhatsApp com a mensagem pronta. É só enviar por lá.';
    } else {
      url = 'mailto:' + CONTATO.email + '?subject=' + encodeURIComponent(assunto) + '&body=' + encodeURIComponent(corpo);
      var a = document.createElement('a');
      a.href = url; a.target = '_blank'; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      status.textContent = 'Abrimos seu app de e-mail com a mensagem pronta. Se nada abriu, escreva para ' + CONTATO.email + '.';
    }
  });

  // ---------- Ano no rodapé ----------
  var ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();
})();
