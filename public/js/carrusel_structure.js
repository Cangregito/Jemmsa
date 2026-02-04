function createCarouselItem({ title, description, image, link }) {
    return `
        <div class="carousel-item 
        w-[280px] h-[280px]
        sm:w-[320px] sm:h-[320px]
        md:w-[380px] md:h-[380px]
        lg:w-[450px] lg:h-[450px] 
        flex-shrink-0">
        <div class="carousel-inner w-full h-full transition-all duration-500 ease-out">
            <div class="relative rounded-2xl shadow-2xl overflow-hidden w-full h-full group">
            
            <img
                src="${image}"
                alt="${title}"
                class="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
            />

            <div class="absolute inset-0 bg-gradient-to-b from-black/40 via-black/60 to-black/80"></div>

            <div class="relative h-full flex flex-col justify-end p-8 text-white">
                <h3 class=" sm:text-lg md:text-xl lg:text-3xl font-bold mb-3">${title}</h3>

                <p class="text-white/90 mb-6 text-sm leading-relaxed">
                ${description}
                </p>

                <a
                href="${link}"
                class="inline-flex items-center gap-2 bg-white text-gray-900 sm:px-6 py-3 rounded-lg font-semibold transition-all duration-300 hover:bg-white/90 hover:gap-3 w-fit group/btn"
                >
                Ver productos
                <svg xmlns="http://www.w3.org/2000/svg" class="h-[16px] w-[16px] sm:h-[20px] sm:w-[20px] md:h-[24px] md:w-[24px] lg:h-[28px] lg:w-[28px] transition-transform duration-300 group-hover/btn:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
                </a>
            </div>
            </div>
        </div>
        </div>
    `;
    }