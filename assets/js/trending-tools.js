// --- Trending Tools Carousel Component Logic ---
document.addEventListener("DOMContentLoaded", function () {
    const products = [
        {
            id: 1,
            title: "ChatGPT Semi",
            price: "PKR 1000",
            orders: "350+",
            image: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
            badge: "AI Assistant",
            note: "Best-selling shared access for prompt work, writing, and fast everyday output."
        },
        {
            id: 2,
            title: "ChatGPT Private",
            price: "PKR 25000",
            orders: "75+",
            image: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
            badge: "Private Tier",
            note: "Dedicated premium access for teams or individuals who want the highest exclusivity."
        },
        {
            id: 3,
            title: "CapCut Private",
            price: "PKR 5000",
            orders: "500+",
            image: "https://www.google.com/s2/favicons?domain=capcut.com&sz=128",
            badge: "Editing Pro",
            note: "Fast-moving creator plan for premium edits, polished reels, and stronger visual delivery."
        },
        {
            id: 4,
            title: "Envato Elements",
            price: "PKR 700",
            orders: "750+",
            image: "https://www.google.com/s2/favicons?domain=envato.com&sz=128",
            badge: "Creative Assets",
            note: "Popular design library access for templates, graphics, and high-speed creative production."
        },
        {
            id: 5,
            title: "Netflix Premium",
            price: "PKR 300",
            orders: "1000+",
            image: "https://www.google.com/s2/favicons?domain=netflix.com&sz=128",
            badge: "Streaming Pick",
            note: "One of the most frequently ordered entertainment plans with strong everyday value."
        }
    ];

    const grid = document.getElementById("ttProductGrid");
    const container = document.querySelector(".tt-swiper-container");
    const heading = document.querySelector(".showcase-section .section-header h2");

    if (heading) {
        heading.textContent = "Trending Tools";
    }

    if (!grid || !container) {
        return;
    }

    function escapeHtml(value) {
        return String(value || "")
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#39;");
    }

    products.forEach(function (product) {
        const slide = document.createElement("div");
        const whatsappMessage = encodeURIComponent("Hi! I'm interested in " + product.title);
        const checkoutUrl = "https://wa.me/923268600994?text=" + whatsappMessage;

        slide.className = "swiper-slide";
        slide.innerHTML = [
            '<article class="tt-card">',
            '<div class="tt-card__shell">',
            '<span class="tt-card__beam"></span>',
            '<div class="tt-card__meta">',
            '<span class="tt-card__badge">' + escapeHtml(product.badge) + "</span>",
            '<span class="tt-card__orders">' + escapeHtml(product.orders) + ' sold</span>',
            "</div>",
            '<div class="tt-card__logo-wrap">',
            '<div class="tt-card__logo-ring">',
            '<div class="tt-card__logo-core">',
            '<img class="tt-card__logo-image" src="' + escapeHtml(product.image) + '" loading="lazy" alt="' + escapeHtml(product.title) + ' logo">',
            "</div>",
            "</div>",
            "</div>",
            '<div class="tt-card__body">',
            '<h3 class="tt-card__title"><a href="' + checkoutUrl + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(product.title) + "</a></h3>",
            '<p class="tt-card__note">' + escapeHtml(product.note) + "</p>",
            '<div class="tt-card__price-panel">',
            '<span class="tt-card__price-label">Current offer</span>',
            '<strong class="tt-card__price">' + escapeHtml(product.price) + "</strong>",
            "</div>",
            '<div class="tt-card__actions">',
            '<a class="tt-card__button" href="' + checkoutUrl + '" target="_blank" rel="noopener noreferrer">Buy Now</a>',
            '<a class="tt-card__ghost" href="' + checkoutUrl + '" target="_blank" rel="noopener noreferrer" aria-label="Chat about ' + escapeHtml(product.title) + ' on WhatsApp"><i class="fab fa-whatsapp"></i></a>',
            "</div>",
            "</div>",
            "</div>",
            "</article>"
        ].join("");

        grid.appendChild(slide);
    });

    if (typeof Swiper !== "undefined") {
        new Swiper(".tt-swiper-container", {
            slidesPerView: 1,
            spaceBetween: 22,
            loop: true,
            speed: 700,
            autoplay: {
                delay: 3200,
                disableOnInteraction: false
            },
            pagination: {
                el: ".tt-swiper-pagination",
                clickable: true
            },
            breakpoints: {
                480: { slidesPerView: 1.15 },
                768: { slidesPerView: 2.15 },
                992: { slidesPerView: 3 },
                1280: { slidesPerView: 4 }
            }
        });
    }
});
