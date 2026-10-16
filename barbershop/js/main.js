// Барбершоп «Бригада» — интерактив страницы
(function () {
  'use strict';

  const header = document.querySelector('.header');
  const burger = document.querySelector('.burger');
  const nav = document.getElementById('nav');
  const navLinks = nav.querySelectorAll('a[href^="#"]');

  /* ---------- Мобильное меню ---------- */
  function setMenu(open) {
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    nav.classList.toggle('is-open', open);
    document.body.classList.toggle('no-scroll', open);
  }

  burger.addEventListener('click', function () {
    setMenu(burger.getAttribute('aria-expanded') !== 'true');
  });

  // Закрываем меню после перехода по ссылке
  navLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      setMenu(false);
    });
  });

  // Закрываем по Escape и возвращаем фокус на кнопку
  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      burger.focus();
    }
  });

  // Если окно расширили до десктопа, сбрасываем состояние меню
  window.matchMedia('(min-width: 861px)').addEventListener('change', function (e) {
    if (e.matches) setMenu(false);
  });

  /* ---------- Тень шапки при прокрутке ---------- */
  function onScroll() {
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Подсветка активного пункта меню ---------- */
  const sectionLinks = document.querySelectorAll('.nav__link');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        sectionLinks.forEach(function (link) {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });

    sectionLinks.forEach(function (link) {
      const section = document.querySelector(link.getAttribute('href'));
      if (section) observer.observe(section);
    });
  }

  /* ---------- Форма записи ---------- */
  const form = document.getElementById('booking-form');
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const dateInput = document.getElementById('date');
  const status = document.getElementById('form-status');
  const submitBtn = form.querySelector('.form__submit');

  // Нельзя выбрать прошедшую дату
  const today = new Date();
  today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
  dateInput.min = today.toISOString().slice(0, 10);

  // Маска телефона: +7 (999) 123-45-67
  function formatPhone(value) {
    let digits = value.replace(/\D/g, '');
    if (digits.startsWith('8')) digits = '7' + digits.slice(1);
    if (!digits.startsWith('7')) digits = '7' + digits;
    digits = digits.slice(0, 11);

    const parts = [digits.slice(1, 4), digits.slice(4, 7), digits.slice(7, 9), digits.slice(9, 11)];
    let result = '+7';
    if (parts[0]) result += ' (' + parts[0];
    if (parts[0].length === 3) result += ')';
    if (parts[1]) result += ' ' + parts[1];
    if (parts[2]) result += '-' + parts[2];
    if (parts[3]) result += '-' + parts[3];
    return result;
  }

  phoneInput.addEventListener('input', function () {
    phoneInput.value = phoneInput.value ? formatPhone(phoneInput.value) : '';
  });

  function setError(input, message) {
    const error = document.getElementById(input.id + '-error');
    error.textContent = message;
    input.classList.toggle('is-invalid', Boolean(message));
    input.setAttribute('aria-invalid', message ? 'true' : 'false');
    if (message) input.setAttribute('aria-describedby', error.id);
    else input.removeAttribute('aria-describedby');
  }

  function validate() {
    let valid = true;

    if (nameInput.value.trim().length < 2) {
      setError(nameInput, 'Введите имя (минимум 2 буквы)');
      valid = false;
    } else {
      setError(nameInput, '');
    }

    if (phoneInput.value.replace(/\D/g, '').length !== 11) {
      setError(phoneInput, 'Введите номер полностью: +7 (999) 123-45-67');
      valid = false;
    } else {
      setError(phoneInput, '');
    }

    return valid;
  }

  // Повторная проверка поля после первой ошибки
  [nameInput, phoneInput].forEach(function (input) {
    input.addEventListener('blur', function () {
      if (input.classList.contains('is-invalid')) validate();
    });
  });

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    status.textContent = '';
    status.className = 'form__status';

    if (!validate()) {
      form.querySelector('.is-invalid').focus();
      return;
    }

    const data = Object.fromEntries(new FormData(form));
    submitBtn.disabled = true;
    submitBtn.textContent = 'Отправляем...';

    // Демо-режим: имитация запроса к серверу.
    // Для реальной отправки замените на fetch() к Google Apps Script или CRM.
    setTimeout(function () {
      console.info('Заявка (демо):', data);
      status.textContent = 'Спасибо, ' + data.name.trim() + '! Мы перезвоним в течение 15 минут.';
      status.classList.add('form__status--success');
      form.reset();
      submitBtn.disabled = false;
      submitBtn.textContent = 'Отправить заявку';
    }, 800);
  });
})();
