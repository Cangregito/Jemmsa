const track = document.getElementById('carousel-track');
const viewport = document.getElementById('carousel-viewport');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// 1️⃣ Renderizar items
track.innerHTML = carouselData
    .map(item => createCarouselItem(item))
    .join('');

// 2️⃣ Obtener items DESPUÉS
const items = [...track.querySelectorAll('.carousel-item')];
const totalItems = items.length;
let currentIndex = 1;
        
function getBaseItemWidth() {
    const item = items[0];
    const style = window.getComputedStyle(item);
    return item.offsetWidth +
    parseFloat(style.marginLeft) +
    parseFloat(style.marginRight);
}


function getGap() {
    const style = window.getComputedStyle(track);
    return parseFloat(style.columnGap || style.gap || 0);
}

function updateCarousel() {
    const baseItem = items[0];
    const itemWidth = baseItem.offsetWidth;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;
    const viewportWidth = viewport.offsetWidth;

    const offset =
    -(currentIndex * (itemWidth + gap)) +
    (viewportWidth / 2 - itemWidth / 2);

    track.style.transform = `translateX(${offset}px)`;
    items.forEach((item, i) => {            
    const inner = item.querySelector('.carousel-inner');

    inner.classList.remove(
        'scale-75',
        'scale-90',
        'scale-110',
        'opacity-50',
        'opacity-75',
        'z-10',
        'z-20',
        'z-30',
        '-translate-x-6',
        'translate-x-6',
        '-translate-x-20',
        'translate-x-20'
    );

    const distance = Math.abs(i - currentIndex);

    if (distance === 0) {
        inner.classList.add('scale-110', 'z-30');
    } 
    else if (distance === 1) {
        inner.classList.add(
        'scale-90',
        'opacity-75',
        'z-20',
        );
    } 
    else {
        inner.classList.add(
        'scale-75',
        'opacity-50',
        'z-10',
        i < currentIndex ? 'translate-x-20' : '-translate-x-20'
        );
    }
    });

}

function nextSlide() {
    currentIndex = (currentIndex + 1) % totalItems;
    updateCarousel();
}

function prevSlide() {
    currentIndex = (currentIndex - 1 + totalItems) % totalItems;
    updateCarousel();
}

function goToSlide(i) {
    currentIndex = i;
    updateCarousel();
}

prevBtn.onclick = prevSlide;
nextBtn.onclick = nextSlide;

document.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft') prevSlide();
    if (e.key === 'ArrowRight') nextSlide();
});

function initCarousel() {
    // Forzar layout
    track.getBoundingClientRect();

    requestAnimationFrame(() => {
    updateCarousel();
    });
}
initCarousel();
window.addEventListener('resize', () => {
    requestAnimationFrame(updateCarousel);
});
