// =============================================
// Утилиты
// =============================================

function addSwipe(element, onLeft, onRight) {
    if (!element) return;

    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const threshold = 40;
    const angleLimit = 45;

    element.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startX = touch.clientX;
        startY = touch.clientY;
        isSwiping = false;
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 20) {
            isSwiping = false;
            return;
        }
        isSwiping = true;
    }, { passive: true });

    element.addEventListener('touchend', (e) => {
        if (!isSwiping) return;
        const touch = e.changedTouches[0];
        const dx = touch.clientX - startX;
        const dy = touch.clientY - startY;

        if (Math.abs(dy) > Math.abs(dx) * Math.tan(angleLimit * Math.PI / 180)) return;
        if (Math.abs(dx) < threshold) return;

        if (dx < 0) onLeft();
        else onRight();
    });
}

// =============================================
// Контактная форма
// =============================================
const form = document.getElementById('contact-form');
const nameInput = document.getElementById('name');
const phone = document.getElementById('phone');
const consent = document.getElementById('consent');
const feedback = document.getElementById('form-feedback');

if (form) {
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        document.querySelectorAll('.error-message').forEach(el => {
            el.style.display = 'none';
            el.textContent = '';
        });
        feedback.textContent = '';
        let isValid = true;

        if (!nameInput.value.trim()) {
            document.getElementById('name-error').textContent = 'Укажите ваше имя';
            document.getElementById('name-error').style.display = 'block';
            nameInput.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else {
            nameInput.removeAttribute('aria-invalid');
        }

        if (!phone.value.trim() || phone.value.replace(/\D/g, '').length < 11) {
            document.getElementById('phone-error').textContent = 'Введите номер полностью';
            document.getElementById('phone-error').style.display = 'block';
            phone.setAttribute('aria-invalid', 'true');
            isValid = false;
        } else {
            phone.removeAttribute('aria-invalid');
        }

        if (!consent.checked) {
            document.getElementById('consent-error').textContent = 'Необходимо согласие на обработку персональных данных';
            document.getElementById('consent-error').style.display = 'block';
            isValid = false;
        }

        if (!isValid) return;

        const formData = new FormData(form);
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.textContent;
        submitBtn.disabled = true;
        submitBtn.textContent = 'Отправляем...';

        try {
            const response = await fetch('https://formspree.io/f/maeyrvdz', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                form.reset();
                feedback.textContent = 'Спасибо! Ваше сообщение отправлено.';
                feedback.style.color = 'green';
            } else {
                const data = await response.json().catch(() => ({}));
                const msg = data?.errors?.[0]?.message || 'Ошибка сервера';
                throw new Error(msg);
            }
        } catch (error) {
            feedback.textContent = 'Произошла ошибка. Попробуйте позже.';
            feedback.style.color = 'red';
        } finally {
            submitBtn.disabled = false;
            submitBtn.textContent = originalText;
        }
    });
}

// =============================================
// Копирование ID
// =============================================
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

// =============================================
// Карусель изображений
// =============================================
const carouselTrack = document.querySelector('.images-carousel');
const carouselViewport = document.querySelector('.carousel-viewport');
const indicatorsContainer = document.querySelector('.dot-indicators');

const imageVariants = [
    {
        webp: { 
            small: './assets/home-images/home-1-small.webp', 
            medium: './assets/home-images/home-1-medium.webp', 
            large: './assets/home-images/home-1-large.webp' 
        },
        jpeg: { 
            small: './assets/home-images/home-1-small.jpeg', 
            medium: './assets/home-images/home-1-medium.jpeg', 
            large: './assets/home-images/home-1-large.jpeg' 
        }
    },
    {
        webp: { 
            small: './assets/home-images/home-2-small.webp', 
            medium: './assets/home-images/home-2-medium.webp', 
            large: './assets/home-images/home-2-large.webp' 
        },
        jpeg: { 
            small: './assets/home-images/home-2-small.jpeg', 
            medium: './assets/home-images/home-2-medium.jpeg', 
            large: './assets/home-images/home-2-large.jpeg' 
        }
    },
    {
        webp: { 
            small: './assets/home-images/home-3-small.webp', 
            medium: './assets/home-images/home-3-medium.webp', 
            large: './assets/home-images/home-3-large.webp' 
        },
        jpeg: { 
            small: './assets/home-images/home-3-small.jpg', 
            medium: './assets/home-images/home-3-medium.jpg', 
            large: './assets/home-images/home-3-large.jpg' 
        }
    },
    {
        webp: { 
            small: './assets/home-images/home-4-small.webp', 
            medium: './assets/home-images/home-4-medium.webp', 
            large: './assets/home-images/home-4-large.webp' 
        },
        jpeg: { 
            small: './assets/home-images/home-4-small.jpg', 
            medium: './assets/home-images/home-4-medium.jpg', 
            large: './assets/home-images/home-4-large.jpg' 
        }
    }
];

const totalSlides = imageVariants.length;

if (carouselTrack && totalSlides) {
    const staticFirstSlide = carouselTrack.querySelector('picture[data-static="true"]');
    
    if (!staticFirstSlide) {
        carouselTrack.innerHTML = '';
    }
    indicatorsContainer.innerHTML = '';

function createSlide(variant, realIndex, isClone = false) {
    const picture = document.createElement('picture');
    picture.dataset.index = realIndex;

    const sourceWebpMobile = document.createElement('source');
    sourceWebpMobile.type = 'image/webp';
    sourceWebpMobile.media = '(max-width: 45em)';
    sourceWebpMobile.srcset = `${variant.webp.small} 480w, ${variant.webp.medium} 800w`;
    sourceWebpMobile.sizes = '90vw';
    picture.appendChild(sourceWebpMobile);

    const sourceWebpDesktop = document.createElement('source');
    sourceWebpDesktop.type = 'image/webp';
    sourceWebpDesktop.media = '(min-width: 45em)';
    sourceWebpDesktop.srcset = `${variant.webp.medium} 800w, ${variant.webp.large} 1200w`;
    sourceWebpDesktop.sizes = '60vw';
    picture.appendChild(sourceWebpDesktop);

    const img = document.createElement('img');
    img.src = variant.jpeg.large;
    img.srcset = `${variant.jpeg.small} 480w, ${variant.jpeg.medium} 800w, ${variant.jpeg.large} 1200w`;
    img.sizes = '(max-width: 45em) 90vw, 60vw';
    img.alt = '';
    img.width = 1200;
    img.height = 750;
    img.decoding = 'async';

    if (!isClone && realIndex === 0) {
        img.fetchPriority = 'high';
    } else {
        img.loading = 'lazy';
    }

    picture.appendChild(img);
    return picture;
}

const lastClone = createSlide(imageVariants[totalSlides - 1], totalSlides - 1);
carouselTrack.insertBefore(lastClone, carouselTrack.firstChild);
imageVariants.forEach((variant, idx) => {
    if (staticFirstSlide && idx === 0) return;
    carouselTrack.appendChild(createSlide(variant, idx));
});

const firstClone = createSlide(imageVariants[0], 0);
carouselTrack.appendChild(firstClone);

    for (let i = 0; i < totalSlides; i++) {
        const btn = document.createElement('button');
        btn.setAttribute('role', 'tab');
        btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
        btn.innerHTML = `<span class="sr-only">${i + 1}</span>`;
        btn.addEventListener('click', () => goToRealIndex(i));
        indicatorsContainer.appendChild(btn);
    }

    const allSlides = [...carouselTrack.children];
    const indicators = [...indicatorsContainer.children];
    let currentIndex = 1;
    let isTransitioning = false;
    let step = 0;
    let viewportWidth = 0;
    let slideWidth = 0;

    function updateSizes() {
        if (!carouselViewport || allSlides.length < 2) return;
        viewportWidth = carouselViewport.offsetWidth;
        slideWidth = allSlides[0].offsetWidth;
        step = allSlides[1].getBoundingClientRect().left - allSlides[0].getBoundingClientRect().left;
    }

    function centerSlide(index) {
        updateSizes();
        if (step === 0) return;
        const offset = (viewportWidth - slideWidth) / 2;
        carouselTrack.style.transform = `translateX(${-step * index + offset}px)`;
    }

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

    carouselTrack.addEventListener('transitionend', () => {
        isTransitioning = false;
        const totalAll = allSlides.length;

        if (currentIndex === 0) {
            carouselTrack.style.transition = 'none';
            currentIndex = totalAll - 2;
            centerSlide(currentIndex);
            updateActiveClasses();
        } else if (currentIndex === totalAll - 1) {
            carouselTrack.style.transition = 'none';
            currentIndex = 1;
            centerSlide(currentIndex);
            updateActiveClasses();
        }
    });

carouselTrack.addEventListener('click', (e) => {
    const picture = e.target.closest('picture');
    if (!picture) return;
    const clickedRealIndex = parseInt(picture.dataset.index, 10);
    const currentReal = (currentIndex - 1 + totalSlides) % totalSlides;
    if (clickedRealIndex === currentReal) return;

    let diff = clickedRealIndex - currentReal;
    if (diff >  totalSlides / 2) diff -= totalSlides;
    if (diff < -totalSlides / 2) diff += totalSlides;

    goToSlide(currentIndex + diff);
});

    addSwipe(
        carouselViewport,
        () => goToSlide(currentIndex + 1),
        () => goToSlide(currentIndex - 1)
    );

    function initCarousel() {
        updateSizes();
        if (step === 0) return;
        currentIndex = 1;
        carouselTrack.style.transition = 'none';
        centerSlide(currentIndex);
        updateActiveClasses();
    }

    initCarousel();

    window.addEventListener('resize', () => {
        updateSizes();
        carouselTrack.style.transition = 'none';
        centerSlide(currentIndex);
    });

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

// =============================================
// Карусель отзывов
// =============================================
const reviewsTrack = document.querySelector('.reviews-carousel');
const reviewsViewport = document.querySelector('.reviews-carousel-wrapper');
const reviewsIndicatorsContainer = document.querySelector('.reviews-controls.dot-indicators');

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

function createReviewSlide(src, realIndex) {
    const div = document.createElement('div');
    const picture = document.createElement('picture');

    const webpSrc = src.replace(/\.jpe?g$/i, '.webp');

    const source = document.createElement('source');
    source.type = 'image/webp';
    source.srcset = webpSrc;
    picture.appendChild(source);

    const img = document.createElement('img');
    img.src = src;
    img.alt = '';
    img.width = 828;
    img.height = 1000;
    img.loading = 'lazy';
    img.decoding = 'async';
    picture.appendChild(img);

    div.dataset.index = realIndex;
    div.appendChild(picture);
    return div;
}


    const lastClone = createReviewSlide(reviewImages[totalReviews - 1], totalReviews - 1);
    const firstClone = createReviewSlide(reviewImages[0], 0);
    reviewsTrack.appendChild(lastClone);
    reviewImages.forEach((src, idx) => reviewsTrack.appendChild(createReviewSlide(src, idx)));
    reviewsTrack.appendChild(firstClone);

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
    let currentIndex = 1;
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

    function updateIndicators() {
        const realActive = (currentIndex - 1 + totalReviews) % totalReviews;
        indicators.forEach((btn, i) => {
            btn.setAttribute('aria-selected', i === realActive ? 'true' : 'false');
        });
    }

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
    reviewsTrack.addEventListener('click', (e) => {
        const slide = e.target.closest('div[data-index]');
        if (!slide) return;
        const clickedRealIndex = parseInt(slide.dataset.index, 10);
        const currentReal = (currentIndex - 1 + totalReviews) % totalReviews;
        if (clickedRealIndex === currentReal) return;

        let diff = clickedRealIndex - currentReal;
        if (diff >  totalReviews / 2) diff -= totalReviews;
        if (diff < -totalReviews / 2) diff += totalReviews;

        goToSlide(currentIndex + diff);
    });
    addSwipe(
        reviewsViewport,
        () => goToSlide(currentIndex + 1),
        () => goToSlide(currentIndex - 1)
    );

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

    window.addEventListener('resize', () => {
        updateSizes();
        reviewsTrack.style.transition = 'none';
        centerSlide(currentIndex);
    });

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

// =============================================
// Модальные окна (политика, противопоказания, подготовка)
// =============================================
document.querySelectorAll('[data-modal]').forEach(trigger => {
    trigger.addEventListener('click', (e) => {
        e.preventDefault();
        const id = trigger.dataset.modal;
        const modal = document.getElementById(id);
        if (!modal) return;
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
    });
});

document.querySelectorAll('.modal').forEach(modal => {
    const closeBtn = modal.querySelector('.modal-close');

    closeBtn?.addEventListener('click', () => {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('open');
            document.body.style.overflow = '';
        }
    });
});

document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    const opened = document.querySelector('.modal.open');
    if (opened) {
        opened.classList.remove('open');
        document.body.style.overflow = '';
    }
});

// =============================================
// Аккордеон прайса
// =============================================
document.querySelectorAll('.pricelist-zone').forEach(zone => {
    const heading = zone.querySelector('.pricelist-heading');
    if (!heading) return;

    heading.addEventListener('click', () => {
        const isCollapsed = zone.dataset.collapsed === 'true';
        zone.dataset.collapsed = isCollapsed ? 'false' : 'true';
        heading.setAttribute('aria-expanded', isCollapsed ? 'true' : 'false');
    });
});

// =============================================
// Адрес
// =============================================
document.querySelectorAll('.address-link--button').forEach(btn => {
    const menu = btn.nextElementSibling;
    if (!menu) return;

    btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = !menu.hidden;
        menu.hidden = isOpen;
        btn.setAttribute('aria-expanded', String(!isOpen));
    });

    document.addEventListener('click', (e) => {
        if (!menu.contains(e.target) && e.target !== btn) {
            menu.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            menu.hidden = true;
            btn.setAttribute('aria-expanded', 'false');
        }
    });
});