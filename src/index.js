// Мобильное меню (оставь как есть)
const navToggle = document.querySelector('.mobile-nav-toggle');
const nav = document.querySelector('.primary-navigation');
if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isVisible = nav.getAttribute('data-visible') === 'true';
    nav.setAttribute('data-visible', !isVisible);
    navToggle.setAttribute('aria-expanded', !isVisible);
  });
}

// --- Контактная форма ---
const form = document.getElementById('contact-form');
const phone = document.getElementById('phone');
const consent = document.getElementById('consent');
const feedback = document.getElementById('form-feedback');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Сброс ошибок
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');
    let isValid = true;

    // Проверка телефона
    if (!phone.value.trim()) {
      document.getElementById('phone-error').textContent = 'Заполните номер телефона';
      document.getElementById('phone-error').style.display = 'block';
      isValid = false;
    }

    // Проверка согласия
    if (!consent.checked) {
      document.getElementById('consent-error').textContent = 'Необходимо согласие на обработку персональных данных';
      document.getElementById('consent-error').style.display = 'block';
      isValid = false;
    }

    if (!isValid) return;

    // Отправка через Formspree (замени YOUR_FORM_ID на свой)
    const formData = new FormData(form);
    try {
      const response = await fetch('https://formspree.io/f/YOUR_FORM_ID', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        form.reset();
        feedback.textContent = 'Спасибо! Ваше сообщение отправлено.';
        feedback.style.color = 'green';
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (error) {
      feedback.textContent = 'Произошла ошибка. Попробуйте позже.';
      feedback.style.color = 'red';
    }
  });
}

// Копирование ID
document.querySelectorAll('.copy-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const targetId = btn.dataset.target;
    const text = document.getElementById(targetId)?.textContent.trim();
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      btn.textContent = '✓';
      btn.classList.add('copied');
      setTimeout(() => {
        btn.textContent = 'К';
        btn.classList.remove('copied');
      }, 2000);
    }).catch(err => console.error('Ошибка копирования:', err));
  });
});