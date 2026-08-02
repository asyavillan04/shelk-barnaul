document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');
  const feedback = document.getElementById('form-feedback');
  const phone = document.getElementById('phone');
  const email = document.getElementById('email');
  const social = document.getElementById('social');
  const socialContact = document.getElementById('social-contact');
  const consent = document.getElementById('consent');
  const modal = document.getElementById('policy-modal');
  const openPolicy = document.getElementById('open-policy');
  const closeModalBtn = modal.querySelector('.modal-close');

  // --- Модальное окно ---
  openPolicy.addEventListener('click', (e) => {
    e.preventDefault();
    modal.classList.add('open');
  });
  closeModalBtn.addEventListener('click', () => modal.classList.remove('open'));
  window.addEventListener('click', (e) => {
    if (e.target === modal) modal.classList.remove('open');
  });

  // --- Валидация и отправка ---
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Сброс ошибок
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    let isValid = true;

    // Проверка: хотя бы один контакт заполнен
    const phoneFilled = phone.value.trim() !== '';
    const emailFilled = email.value.trim() !== '';
    const socialFilled = social.value !== '' && socialContact.value.trim() !== '';

    if (!phoneFilled && !emailFilled && !socialFilled) {
      document.getElementById('phone-error').textContent = 'Заполните хотя бы одно поле контакта';
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

    const formData = new FormData(form);
    try {
      const response = await fetch('https://formspree.io/f/...', {
        method: 'POST',
        body: formData,
        headers: { 'Accept': 'application/json' }
      });

      if (response.ok) {
        feedback.textContent = 'Спасибо! Ваше сообщение отправлено.';
        form.reset();
      } else {
        throw new Error('Ошибка сервера');
      }
    } catch (error) {
      feedback.textContent = 'Произошла ошибка. Попробуйте позже.';
      feedback.style.color = 'red';
    }
  });
});