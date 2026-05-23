/* === Калькулятор === */
  function openCalc() { document.getElementById('calcModal').classList.add('open'); }
  function closeCalc() { document.getElementById('calcModal').classList.remove('open'); }
  document.addEventListener('keydown', function(e) { if (e.key === 'Escape') closeCalc(); });

  /* === Версия для слабовидящих === */
  function toggleA11y() {
    document.documentElement.classList.toggle('a11y-mode');
  }

  /* === Бургер-меню === */
  var burger = document.getElementById('burgerBtn');
  var mobileNav = document.getElementById('mobileNav');
  burger.addEventListener('click', function() {
    mobileNav.classList.toggle('open');
  });
  mobileNav.querySelectorAll('a').forEach(function(link) {
    link.addEventListener('click', function() { mobileNav.classList.remove('open'); });
  });

  /* === Плавный скролл === */
  document.documentElement.style.scrollBehavior = 'smooth';

  /* === Активный пункт меню при скролле (IntersectionObserver) === */
  var allNavLinks = document.querySelectorAll('.header__nav a, .header__mobile-nav a');
  var sections = document.querySelectorAll('section[id], header[id]');

  var sectionObserver = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (!entry.isIntersecting) return;
      var id = entry.target.id;
      allNavLinks.forEach(function(link) {
        var href = link.getAttribute('href').replace('#', '');
        var isMatch =
          href === id ||
          (href === 'home' && (id === 'home')) ||
          (href === 'about' && (id === 'about' || id === 'details'));
        link.classList.toggle('active', isMatch);
      });
    });
  }, { threshold: 0.25, rootMargin: '-60px 0px 0px 0px' });

  sections.forEach(function(s) { sectionObserver.observe(s); });