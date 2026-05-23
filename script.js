/* === Калькулятор === */
  function openCalc() { document.getElementById('calcModal').classList.add('open'); }
  function closeCalc() { document.getElementById('calcModal').classList.remove('open'); }

  /* === Маска телефона === */
  function phoneMask(input) {
    var digits = input.value.replace(/\D/g, '');
    if (digits.startsWith('7') || digits.startsWith('8')) digits = digits.slice(1);
    digits = digits.slice(0, 10);
    var result = '+7';
    if (digits.length > 0) result += ' (' + digits.slice(0, 3);
    if (digits.length >= 3) result += ') ' + digits.slice(3, 6);
    if (digits.length >= 6) result += '-' + digits.slice(6, 8);
    if (digits.length >= 8) result += '-' + digits.slice(8, 10);
    input.value = result;
  }

  function submitCalc(e) {
    e.preventDefault();
    var phoneInput  = document.querySelector('#calcModal input[type="tel"]');
    var checkbox    = document.querySelector('#calcModal .calc__checkbox');
    var periodSel   = document.getElementById('calcPeriod');
    var ageInput    = document.getElementById('calcAge');
    var mobilitySel = document.getElementById('calcMobility');
    var genderWrap  = document.getElementById('calcGender');
    var valid = true;

    // Сбросить все ошибки
    [phoneInput, periodSel, ageInput, mobilitySel].forEach(function(el) {
      el.classList.remove('error');
    });
    checkbox.classList.remove('error');
    genderWrap.classList.remove('error');

    // Срок пребывания
    if (!periodSel.value) { periodSel.classList.add('error'); valid = false; }

    // Возраст (обязательное, 1–120)
    var age = parseInt(ageInput.value, 10);
    if (!ageInput.value || isNaN(age) || age < 1 || age > 120) {
      ageInput.classList.add('error'); valid = false;
    }

    // Степень самостоятельности
    if (!mobilitySel.value) { mobilitySel.classList.add('error'); valid = false; }

    // Пол
    if (!document.querySelector('#calcModal input[name="gender"]:checked')) {
      genderWrap.classList.add('error'); valid = false;
    }

    // Телефон
    var digits = phoneInput.value.replace(/\D/g, '');
    if (digits.length < 11) { phoneInput.classList.add('error'); valid = false; }

    // Чекбокс согласия
    if (!checkbox.checked) { checkbox.classList.add('error'); valid = false; }

    if (!valid) {
      // Фокус на первое ошибочное поле (select / input)
      var firstErr = document.querySelector('#calcModal .calc__input.error');
      if (firstErr) firstErr.focus();
      return;
    }

    closeCalc();
    openNotif();
    // TODO: отправка в Telegram-бот (токен и chat_id добавить позже)
  }

  /* === Уведомление === */
  function openNotif() { document.getElementById('notifModal').classList.add('open'); }
  function closeNotif() { document.getElementById('notifModal').classList.remove('open'); }

  /* === Попап контактов === */
  function openContact() { document.getElementById('contactModal').classList.add('open'); }
  function closeContact() { document.getElementById('contactModal').classList.remove('open'); }

  /* === Поле уточнения психического заболевания === */
  function toggleMentalDetail(sel) {
    var detail = document.getElementById('calcMentalDetail');
    detail.style.display = sel.value === 'yes' ? 'block' : 'none';
    if (sel.value !== 'yes') detail.value = '';
  }

  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') { closeCalc(); closeNotif(); closeContact(); }
  });

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

  /* === Логотип и «Главная» → наверх === */
  document.querySelectorAll('a[href="#home"]').forEach(function(a) {
    a.addEventListener('click', function(e) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });

  /* === Активный пункт меню при скролле === */
  var allNavLinks = document.querySelectorAll('.header__nav a, .header__mobile-nav a');

  // Секции в порядке снизу вверх: первая совпавшая = текущая
  var navSections = [
    { id: 'contacts',    nav: 'contacts'  },
    { id: 'documents',   nav: 'documents' },
    { id: 'services',    nav: 'services'  },
    { id: 'about',       nav: 'about'     },
    { id: 'sialiya',     nav: 'home'      },
    { id: 'sialiya-yug', nav: 'home'      },
  ];

  function updateActiveNav() {
    var scrollY = window.scrollY + 80; // смещение на высоту шапки
    var activeNav = 'home';            // по умолчанию — Главная

    for (var i = 0; i < navSections.length; i++) {
      var el = document.getElementById(navSections[i].id);
      if (el && el.offsetTop <= scrollY) {
        activeNav = navSections[i].nav;
        break;
      }
    }

    allNavLinks.forEach(function(link) {
      link.classList.toggle('active', link.getAttribute('href') === '#' + activeNav);
    });
  }

  window.addEventListener('scroll', updateActiveNav, { passive: true });
  updateActiveNav();

  // При клике сразу подсвечиваем выбранный пункт (на случай если секции уже видны)
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      allNavLinks.forEach(function(l) { l.classList.remove('active'); });
      this.classList.add('active');
    });
  });

  /* === Инициализация поля телефона === */
  var phoneField = document.querySelector('#calcModal input[type="tel"]');
  if (phoneField) {
    phoneField.addEventListener('input', function() {
      phoneMask(this);
      this.classList.remove('error');
    });
    phoneField.addEventListener('focus', function() {
      if (!this.value) this.value = '+7 ';
    });
    phoneField.addEventListener('blur', function() {
      if (this.value === '+7 ') this.value = '';
    });
  }

  /* === Сброс ошибок при изменении полей === */
  var consentBox = document.querySelector('#calcModal .calc__checkbox');
  if (consentBox) {
    consentBox.addEventListener('change', function() { this.classList.remove('error'); });
  }

  ['calcPeriod', 'calcMobility'].forEach(function(id) {
    var el = document.getElementById(id);
    if (el) el.addEventListener('change', function() { this.classList.remove('error'); });
  });

  var ageField = document.getElementById('calcAge');
  if (ageField) {
    ageField.addEventListener('input', function() { this.classList.remove('error'); });
  }

  var genderInputs = document.querySelectorAll('#calcGender input[type="radio"]');
  genderInputs.forEach(function(radio) {
    radio.addEventListener('change', function() {
      document.getElementById('calcGender').classList.remove('error');
    });
  });
