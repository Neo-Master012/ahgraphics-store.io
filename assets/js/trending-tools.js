// --- Trending Tools Carousel Component Logic ---
document.addEventListener("DOMContentLoaded", function() {
    const products = [
        {
            id: 1,
            title: "ChatGPT Semi",
            price: "PKR 1000",
            orders: "350+",
            image: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
        },
        {
            id: 2,
            title: "ChatGPT Private",
            price: "PKR 25000",
            orders: "75+",
            image: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
        },
        {
            id: 3,
            title: "Capcut Private",
            price: "PKR 5000",
            orders: "500+",
            image: "https://www.google.com/s2/favicons?domain=capcut.com&sz=128",
        },
        {
            id: 4,
            title: "Envato Elements",
            price: "PKR 700",
            orders: "750+",
            image: "https://www.google.com/s2/favicons?domain=envato.com&sz=128",
        },
        {
            id: 5,
            title: "Netflix Premium",
            price: "PKR 300",
            orders: "1000+",
            image: "https://www.google.com/s2/favicons?domain=netflix.com&sz=128",
        }
    ];

    const grid = document.getElementById('ttProductGrid');
    if (!grid) return;

    // Render Cards in Swiper Wrapper
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'tt-card-inner swiper-slide'; // Treat inner container directly as the slide 

        const whatsappMessage = encodeURIComponent(`Hi! I'm interested in ${product.title}`);
        const checkoutUrl = `https://wa.me/923268600994?text=${whatsappMessage}`;

        card.innerHTML = `
            <div class="tt-card-top">
                <div class="tt-card-icon">
                    <img src="${product.image}" loading="lazy" alt="${product.title} logo">
                </div>
                <div class="tt-card-badges">
                    <span class="tt-card-orders"><i class="fas fa-shopping-cart"></i> ${product.orders} Sold</span>
                </div>
            </div>
            <div class="tt-card-content">
                <h3 class="tt-card-title">${product.title}</h3>
                <div class="tt-card-price-action">
                    <span class="tt-card-price">${product.price}</span>
                    <a href="${checkoutUrl}" target="_blank" class="tt-card-btn thm-btn thm-btn-two">Buy Now</a>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Initialize Swiper Carousel
    if (typeof Swiper !== 'undefined') {
        new Swiper(".tt-swiper-container", {
            slidesPerView: 1,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 2800,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".tt-swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                480: {
                    slidesPerView: 2,
                },
                768: {
                    slidesPerView: 3,
                },
                992: {
                    slidesPerView: 4,
                },
                1200: {
                    slidesPerView: 5,
                }
            }
        });
    }
});
