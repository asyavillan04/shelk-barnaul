

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

    // Отправка через Formspree
    const formData = new FormData(form);
    try {
      const response = await fetch('https://formspree.io/f/FORM_ID', {
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

// --- Карусель ---

const carouselTrack = document.querySelector('.images-carousel');
const carouselViewport = document.querySelector('.carousel-viewport');
const indicatorsContainer = document.querySelector('.dot-indicators');

const imageVariants = [
    {
        avif: {
            small: './assets/home-images/home-1-small.avif',
            large: './assets/home-images/home-1-large.avif'
        },
        webp: {
            small: './assets/home-images/home-1-small.webp',
            large: './assets/home-images/home-1-large.webp'
        },
        jpeg: {
            small: './assets/home-images/home-1-small.jpeg',
            large: './assets/home-images/home-1-large.jpeg'
        }
    },
    {
        avif: {
            small: './assets/home-images/home-2-small.avif',
            large: './assets/home-images/home-2-large.avif'
        },
        webp: {
            small: './assets/home-images/home-2-small.webp',
            large: './assets/home-images/home-2-large.webp'
        },
        jpeg: {
            small: './assets/home-images/home-2-small.jpeg',
            large: './assets/home-images/home-2-large.jpeg'
        }
    },
    {
        avif: {
            small: './assets/home-images/home-3-small.avif',
            large: './assets/home-images/home-3-large.avif'
        },
        webp: {
            small: './assets/home-images/home-3-small.webp',
            large: './assets/home-images/home-3-large.webp'
        },
        jpeg: {
            small: './assets/home-images/home-3-small.jpg',
            large: './assets/home-images/home-3-large.jpg'
        }
    },
    {
        avif: {
            small: './assets/home-images/home-4-small.avif',
            large: './assets/home-images/home-4-large.avif'
        },
        webp: {
            small: './assets/home-images/home-4-small.webp',
            large: './assets/home-images/home-4-large.webp'
        },
        jpeg: {
            small: './assets/home-images/home-4-small.jpg',
            large: './assets/home-images/home-4-large.jpg'
        }
    }
];

const totalSlides = imageVariants.length;

if (carouselTrack && totalSlides) {
    carouselTrack.innerHTML = '';
    indicatorsContainer.innerHTML = '';

    // Функция создания слайда
    function createSlide(variant, realIndex) {
        const picture = document.createElement('picture');
        picture.dataset.index = realIndex;

        // Источник AVIF 
        const sourceAvif = document.createElement('source');
        sourceAvif.type = 'image/avif';
        sourceAvif.srcset = `
            ${variant.avif.small} 480w,
            ${variant.avif.large} 1200w
        `;
        sourceAvif.sizes = '(max-width: 600px) 480px, 1200px';
        picture.appendChild(sourceAvif);

        // Источник WebP (если AVIF не поддерживается)
        const sourceWebp = document.createElement('source');
        sourceWebp.type = 'image/webp';
        sourceWebp.srcset = `
            ${variant.webp.small} 480w,
            ${variant.webp.large} 1200w
        `;
        sourceWebp.sizes = '(max-width: 600px) 480px, 1200px';
        picture.appendChild(sourceWebp);

        // Fallback на JPEG (если ни AVIF, ни WebP не поддерживаются)
        const img = document.createElement('img');
        img.src = variant.jpeg.large;               // базовый src
        img.srcset = `
            ${variant.jpeg.small} 480w,
            ${variant.jpeg.large} 1200w
        `;
        img.sizes = '(max-width: 600px) 480px, 1200px';
        img.alt = '';
        picture.appendChild(img);

        return picture;
    }

    // Трек: [клон последнего, 0, 1, 2, ..., клон первого]
    const lastClone = createSlide(imageVariants[totalSlides - 1], totalSlides - 1);
    const firstClone = createSlide(imageVariants[0], 0);
    carouselTrack.appendChild(lastClone);
    imageVariants.forEach((variant, idx) => carouselTrack.appendChild(createSlide(variant, idx)));
    carouselTrack.appendChild(firstClone);

    // Точки для реальных слайдов
    for (let i = 0; i < totalSlides; i++) {
        const btn = document.createElement('button');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.innerHTML = `<span class="sr-only">${i + 1}</span>`;
        btn.addEventListener('click', () => goToRealIndex(i));
        indicatorsContainer.appendChild(btn);
    }

    const allSlides = [...carouselTrack.children];   // теперь это <picture>
    const indicators = [...indicatorsContainer.children];
    let currentIndex = 1;        // в allSlides: 0 – клон последнего, 1..totalSlides – настоящие, totalSlides+1 – клон первого
    let isTransitioning = false;
    let step = 0;
    let viewportWidth = 0;
    let slideWidth = 0;

    // Пересчёт размеров
    function updateSizes() {
        if (!carouselViewport || allSlides.length < 2) return;
        viewportWidth = carouselViewport.offsetWidth;
        slideWidth = allSlides[0].offsetWidth;
        step = allSlides[1].getBoundingClientRect().left - allSlides[0].getBoundingClientRect().left;
    }

    // Центрирование слайда с индексом в полном массиве
    function centerSlide(index) {
        updateSizes();
        if (step === 0) return;
        const offset = (viewportWidth - slideWidth) / 2;
        carouselTrack.style.transform = `translateX(${-step * index + offset}px)`;
    }

    // Обновление классов прозрачности и индикаторов на основе текущего реального индекса
    function updateActiveClasses() {
        const realActive = (currentIndex - 1 + totalSlides) % totalSlides;

        allSlides.forEach(slide => {
            slide.classList.remove('active', 'prev', 'next');
            const slideRealIndex = parseInt(slide.dataset.index, 10);
            if (slideRealIndex === realActive) {
                slide.classList.add('active');
            } else if (slideRealIndex === (realActive - 1 + totalSlides) % totalSlides) {
                slide.classList.add('prev');
            } else if (slideRealIndex === (realActive + 1) % totalSlides) {
                slide.classList.add('next');
            }
        });

        indicators.forEach((btn, i) => {
            btn.setAttribute('aria-selected', i === realActive ? 'true' : 'false');
        });
    }

    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        updateSizes();
        if (step === 0) {
            isTransitioning = false;
            return;
        }

        carouselTrack.style.transition = 'transform 0.3s ease';
        centerSlide(index);
        currentIndex = index;
        updateActiveClasses();
    }

    function goToRealIndex(realIndex) {
        goToSlide(realIndex + 1);
    }

    // Бесшовный прыжок после завершения анимации
    carouselTrack.addEventListener('transitionend', () => {
        isTransitioning = false;
        const totalAll = allSlides.length;

        if (currentIndex === 0) {   // на клоне последнего
            carouselTrack.style.transition = 'none';
            currentIndex = totalAll - 2;   // реальный последний
            centerSlide(currentIndex);
            updateActiveClasses();
        } else if (currentIndex === totalAll - 1) {   // на клоне первого
            carouselTrack.style.transition = 'none';
            currentIndex = 1;   // реальный первый
            centerSlide(currentIndex);
            updateActiveClasses();
        }
    });

    // Клик по слайду
    carouselTrack.addEventListener('click', (e) => {
        const picture = e.target.closest('picture');
        if (!picture) return;
        const clickedRealIndex = parseInt(picture.dataset.index, 10);
        const currentReal = (currentIndex - 1 + totalSlides) % totalSlides;
        if (clickedRealIndex !== currentReal) {
            goToRealIndex(clickedRealIndex);
        }
    });

    // Инициализация
    function initCarousel() {
        updateSizes();
        if (step === 0) return;
        currentIndex = 1;
        carouselTrack.style.transition = 'none';
        centerSlide(currentIndex);
        updateActiveClasses();
    }

    window.addEventListener('load', initCarousel);
    if (document.readyState === 'complete') initCarousel();

    // Ресайз
    window.addEventListener('resize', () => {
        updateSizes();
        carouselTrack.style.transition = 'none';
        centerSlide(currentIndex);
    });

    // Автопрокрутка
    let autoplay;
    function startAutoplay() {
        autoplay = setInterval(() => goToSlide(currentIndex + 1), 5000);
    }
    function stopAutoplay() {
        clearInterval(autoplay);
    }
    carouselViewport?.addEventListener('mouseenter', stopAutoplay);
    carouselViewport?.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
}

// --- Карусель отзывов ---
const reviewsTrack = document.querySelector('.reviews-carousel');
const reviewsViewport = document.querySelector('.reviews-carousel-wrapper');
const reviewsIndicatorsContainer = document.querySelector('.reviews-controls.dot-indicators');

// Исходные изображения
const reviewImages = [
    'assets/reviews/review-1.jpg',
    'assets/reviews/review-2.jpg',
    'assets/reviews/review-3.jpg',
    'assets/reviews/review-4.jpg',
    'assets/reviews/review-5.jpg',
    'assets/reviews/review-6.jpg'
];
const totalReviews = reviewImages.length;

if (reviewsTrack && totalReviews) {
    reviewsTrack.innerHTML = '';
    reviewsIndicatorsContainer.innerHTML = '';

    // Создаём слайд
    function createReviewSlide(src, realIndex) {
        const div = document.createElement('div');
        const img = document.createElement('img');
        img.src = src;
        img.alt = '';
        div.dataset.index = realIndex;
        div.appendChild(img);
        return div;
    }

    // Трек: [клон последнего, 0, 1, 2, ..., 5, клон первого]
    const lastClone = createReviewSlide(reviewImages[totalReviews - 1], totalReviews - 1);
    const firstClone = createReviewSlide(reviewImages[0], 0);
    reviewsTrack.appendChild(lastClone);
    reviewImages.forEach((src, idx) => reviewsTrack.appendChild(createReviewSlide(src, idx)));
    reviewsTrack.appendChild(firstClone);

    // Точки
    for (let i = 0; i < totalReviews; i++) {
        const btn = document.createElement('button');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.innerHTML = `<span class="sr-only">${i + 1}</span>`;
        btn.addEventListener('click', () => goToRealIndex(i));
        reviewsIndicatorsContainer.appendChild(btn);
    }

    const allSlides = [...reviewsTrack.children];
    const indicators = [...reviewsIndicatorsContainer.children];
    let currentIndex = 1;      // реальный первый (индекс 1)
    let isTransitioning = false;
    let step = 0;
    let viewportWidth = 0;
    let slideWidth = 0;

    function updateSizes() {
        if (!reviewsViewport || allSlides.length < 2) return;
        viewportWidth = reviewsViewport.offsetWidth;
        slideWidth = allSlides[0].offsetWidth;
        step = allSlides[1].getBoundingClientRect().left - allSlides[0].getBoundingClientRect().left;
    }

    function centerSlide(index) {
        updateSizes();
        if (step === 0) return;
        const offset = (viewportWidth - slideWidth) / 2;
        reviewsTrack.style.transform = `translateX(${-step * index + offset}px)`;
    }

    function goToSlide(index) {
        if (isTransitioning || index === currentIndex) return;
        isTransitioning = true;
        updateSizes();
        if (step === 0) {
            isTransitioning = false;
            return;
        }
        reviewsTrack.style.transition = 'transform 0.4s ease';
        centerSlide(index);
        currentIndex = index;
        updateIndicators();
    }

    function goToRealIndex(realIndex) {
        goToSlide(realIndex + 1);
    }

    // Обновление только точек
    function updateIndicators() {
        const realActive = (currentIndex - 1 + totalReviews) % totalReviews;
        indicators.forEach((btn, i) => {
            btn.setAttribute('aria-selected', i === realActive ? 'true' : 'false');
        });
    }

    // Бесшовный прыжок
    reviewsTrack.addEventListener('transitionend', () => {
        isTransitioning = false;
        const totalAll = allSlides.length;
        if (currentIndex === 0) {
            reviewsTrack.style.transition = 'none';
            currentIndex = totalAll - 2;
            centerSlide(currentIndex);
            updateIndicators();
        } else if (currentIndex === totalAll - 1) {
            reviewsTrack.style.transition = 'none';
            currentIndex = 1;
            centerSlide(currentIndex);
            updateIndicators();
        }
    });

    // Клик по слайду — переход на тот, по которому кликнули
    reviewsTrack.addEventListener('click', (e) => {
        const slide = e.target.closest('div[data-index]');
        if (!slide) return;
        const clickedRealIndex = parseInt(slide.dataset.index, 10);
        const currentReal = (currentIndex - 1 + totalReviews) % totalReviews;
        if (clickedRealIndex !== currentReal) {
            goToRealIndex(clickedRealIndex);
        }
    });

    // Инициализация
    function initReviewsCarousel() {
        updateSizes();
        if (step === 0) return;
        currentIndex = 1;
        reviewsTrack.style.transition = 'none';
        centerSlide(currentIndex);
        updateIndicators();
    }

    window.addEventListener('load', initReviewsCarousel);
    if (document.readyState === 'complete') initReviewsCarousel();

    // Ресайз
    window.addEventListener('resize', () => {
        updateSizes();
        reviewsTrack.style.transition = 'none';
        centerSlide(currentIndex);
    });

    // Автоплей
    let autoplay;
    function startAutoplay() {
        autoplay = setInterval(() => goToSlide(currentIndex + 1), 10000);
    }
    function stopAutoplay() {
        clearInterval(autoplay);
    }
    reviewsViewport?.addEventListener('mouseenter', stopAutoplay);
    reviewsViewport?.addEventListener('mouseleave', startAutoplay);
    startAutoplay();
}

// Модальное окно с политикой
const policyModal = document.getElementById('policy-modal');
const openPolicyBtn = document.getElementById('open-policy');
const closeModalBtn = policyModal?.querySelector('.modal-close');

// Открытие
openPolicyBtn?.addEventListener('click', (e) => {
    e.preventDefault(); // чтобы ссылка не перезагружала страницу
    policyModal.classList.add('open');
});

// Закрытие по кнопке
closeModalBtn?.addEventListener('click', () => {
    policyModal.classList.remove('open');
});

// Закрытие по клику вне окна
policyModal?.addEventListener('click', (e) => {
    if (e.target === policyModal) {
        policyModal.classList.remove('open');
    }
});

// Закрытие по Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && policyModal?.classList.contains('open')) {
        policyModal.classList.remove('open');
    }
});