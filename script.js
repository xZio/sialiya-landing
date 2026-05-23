/* === Модальные окна === */
  function openModal(id)  { document.getElementById(id).classList.add('open'); }
  function closeModal(id) { document.getElementById(id).classList.remove('open'); }
  function openCalc()     { openModal('calcModal'); }
  function closeCalc()    { closeModal('calcModal'); }
  function openNotif()    { openModal('notifModal'); }
  function closeNotif()   { closeModal('notifModal'); }
  function openContact()  { openModal('contactModal'); }
  function closeContact() { closeModal('contactModal'); }

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
  var a11yState = { open: false, fs: 0, scheme: 'none', images: 1, spacing: 0 };
  var a11yPanelBtns = document.querySelectorAll('#a11yPanel [data-a11y]');
  var headerBtnText = document.querySelector('.header__a11y-text');

  function a11yLoad() {
    try {
      var saved = JSON.parse(localStorage.getItem('sialiya_a11y'));
      if (saved) {
        a11yState.open    = !!saved.open;
        a11yState.fs      = saved.fs      || 0;
        a11yState.scheme  = saved.scheme  || 'none';
        a11yState.images  = saved.images  !== undefined ? Number(saved.images) : 1;
        a11yState.spacing = saved.spacing || 0;
      }
    } catch(e) {}
  }

  function a11ySave() {
    try { localStorage.setItem('sialiya_a11y', JSON.stringify(a11yState)); } catch(e) {}
  }

  function a11yApply() {
    var html  = document.documentElement;
    var panel = document.getElementById('a11yPanel');

    // Панель
    panel.classList.toggle('open', a11yState.open);
    panel.setAttribute('aria-hidden', a11yState.open ? 'false' : 'true');

    // Размер шрифта
    html.classList.remove('a11y-fs-1', 'a11y-fs-2');
    if (a11yState.fs === 1) html.classList.add('a11y-fs-1');
    if (a11yState.fs === 2) html.classList.add('a11y-fs-2');

    // Цветовая схема
    html.classList.remove('a11y-scheme-white', 'a11y-scheme-black', 'a11y-scheme-yellow');
    if (a11yState.scheme !== 'none') html.classList.add('a11y-scheme-' + a11yState.scheme);

    // Изображения
    html.classList.toggle('a11y-no-images', a11yState.images === 0);

    // Интервал
    html.classList.remove('a11y-spacing-1', 'a11y-spacing-2');
    if (a11yState.spacing === 1) html.classList.add('a11y-spacing-1');
    if (a11yState.spacing === 2) html.classList.add('a11y-spacing-2');

    // Активные кнопки
    a11yPanelBtns.forEach(function(btn) {
      var key = btn.getAttribute('data-a11y');
      var val = btn.getAttribute('data-val');
      var cur = String(a11yState[key]);
      btn.classList.toggle('a11y-panel__btn--active', cur === val);
      btn.setAttribute('aria-pressed', cur === val ? 'true' : 'false');
    });

    // Текст кнопки в шапке
    if (headerBtnText) {
      headerBtnText.textContent = a11yState.open ? 'Обычная версия' : 'Версия для слабовидящих';
    }
  }

  function toggleA11y() {
    if (a11yState.open) {
      // Закрываем — полный сброс (как «Обычная версия»)
      a11yState = { open: false, fs: 0, scheme: 'none', images: 1, spacing: 0 };
    } else {
      // Открываем — белая схема по умолчанию
      a11yState.open = true;
      if (a11yState.scheme === 'none') a11yState.scheme = 'white';
    }
    a11ySave();
    a11yApply();
  }

  document.getElementById('a11yPanel').addEventListener('click', function(e) {
    // Кнопка «Обычная версия»
    if (e.target.closest('#a11yReset')) {
      a11yState = { open: false, fs: 0, scheme: 'none', images: 1, spacing: 0 };
      a11ySave();
      a11yApply();
      return;
    }
    // Остальные кнопки настроек
    var btn = e.target.closest('[data-a11y]');
    if (!btn) return;
    var key = btn.getAttribute('data-a11y');
    var val = btn.getAttribute('data-val');
    a11yState[key] = isNaN(Number(val)) ? val : Number(val);
    a11ySave();
    a11yApply();
  });

  // Инициализация: восстанавливаем настройки из localStorage
  a11yLoad();
  a11yApply();

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

  /* === Активный пункт меню === */
  var allNavLinks = document.querySelectorAll('.header__nav a, .header__mobile-nav a');
  var navLocked = false;
  var navLockTimer;

  // Клик → подсвечиваем нажатый пункт и блокируем скролл-обработчик на время анимации
  allNavLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      allNavLinks.forEach(function(l) { l.classList.remove('active'); });
      this.classList.add('active');

      navLocked = true;
      clearTimeout(navLockTimer);
      navLockTimer = setTimeout(function() { navLocked = false; }, 700);
    });
  });

  // Если пользователь сам проскроллил наверх — возвращаем «Главная»
  window.addEventListener('scroll', function() {
    if (navLocked) return;
    if (window.scrollY < 80) {
      allNavLinks.forEach(function(link) {
        link.classList.toggle('active', link.getAttribute('href') === '#home');
      });
    }
  }, { passive: true });

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

  var calcGenderWrap = document.getElementById('calcGender');
  var genderInputs = calcGenderWrap ? calcGenderWrap.querySelectorAll('input[type="radio"]') : [];
  genderInputs.forEach(function(radio) {
    radio.addEventListener('change', function() {
      calcGenderWrap.classList.remove('error');
    });
  });
