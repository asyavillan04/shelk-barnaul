// --- Валидация и отправка ---
form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Сброс ошибок
    document.querySelectorAll('.error-message').forEach(el => el.style.display = 'none');

    let isValid = true;

    // Проверка: телефон обязателен
    const phoneFilled = phone.value.trim() !== '';
    if (!phoneFilled) {
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

    // Отправка через Formspree
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