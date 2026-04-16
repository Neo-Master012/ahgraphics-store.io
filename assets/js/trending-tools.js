// --- Trending Tools Component Logic ---
document.addEventListener("DOMContentLoaded", function() {
    const products = [
        {
            id: 1,
            title: "ChatGPT Plus Shared",
            longDesc: "Affordable shared ChatGPT Plus plan for writing, research, and everyday productivity. Includes access to GPT-4 and advanced prompt support.",
            price: "PKR 500",
            image: "https://www.google.com/s2/favicons?domain=chatgpt.com&sz=128",
            features: [
                "Shared Plus access",
                "Advanced AI prompts",
                "Best low-cost entry plan"
            ]
        },
        {
            id: 2,
            title: "CapCut Pro Monthly",
            longDesc: "CapCut Pro subscription for premium templates, video effects, and faster content editing. Ideal for short-form creators.",
            price: "PKR 600",
            image: "https://www.google.com/s2/favicons?domain=capcut.com&sz=128",
            features: [
                "Monthly Pro access",
                "Premium video templates",
                "Affordable creator plan"
            ]
        },
        {
            id: 3,
            title: "Canva Pro 1 Year",
            longDesc: "One-year Canva Pro access for flawless social posts, branding, and content design. Includes premium assets and background remover.",
            price: "PKR 250",
            image: "https://www.google.com/s2/favicons?domain=canva.com&sz=128",
            features: [
                "1 year validity",
                "Premium design elements",
                "Excellent budget value"
            ]
        },
        {
            id: 4,
            title: "Midjourney Private",
            longDesc: "Standard Midjourney access for premium image creation, art concepts, and high-res generative designs.",
            price: "PKR 2500",
            image: "https://www.google.com/s2/favicons?domain=midjourney.com&sz=128",
            features: [
                "Standard plan access",
                "High-res AI generation",
                "Great for creatives and ads"
            ]
        },
        {
            id: 5,
            title: "Netflix Private",
            longDesc: "Private Netflix plan for users who want dedicated and uninterrupted premium streaming access in Ultra HD.",
            price: "PKR 2000",
            image: "https://www.google.com/s2/favicons?domain=netflix.com&sz=128",
            features: [
                "Private account setup",
                "Premium UHD streaming",
                "Best for personal use"
            ]
        },
        {
            id: 6,
            title: "Grammarly Premium",
            longDesc: "Premium grammar and writing suggestions for polished personal and business content. Plagiarism detection included.",
            price: "PKR 450",
            image: "https://www.google.com/s2/favicons?domain=grammarly.com&sz=128",
            features: [
                "Grammar and tone fixes",
                "Premium writing checks",
                "Affordable monthly option"
            ]
        },
        {
            id: 7,
            title: "Envato Elements",
            longDesc: "Direct login Envato plan for access to thousands of WordPress themes, templates, graphics, and video assets.",
            price: "PKR 1800",
            image: "https://www.google.com/s2/favicons?domain=envato.com&sz=128",
            features: [
                "Direct login access",
                "Premium design resources",
                "Clean workflow access"
            ]
        },
        {
            id: 8,
            title: "MS Office 365 Yearly",
            longDesc: "Yearly Office 365 plan for documents, spreadsheets, presentations, and reliable daily office work across devices.",
            price: "PKR 2500",
            image: "https://www.google.com/s2/favicons?domain=microsoft.com&sz=128",
            features: [
                "Yearly Office access",
                "Word, Excel, PowerPoint",
                "Strong productivity bundle"
            ]
        }
    ];

    const grid = document.getElementById('ttProductGrid');
    if (!grid) return;

    // Render Cards in Swiper Wrapper
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'tt-product-card swiper-slide';
        card.onclick = () => openTTModal(product);

        card.innerHTML = `
            <div class="tt-card-inner">
                <div class="tt-card-icon">
                    <img src="${product.image}" loading="lazy" alt="${product.title} logo">
                </div>
                <div class="tt-card-content">
                    <h3 class="tt-card-title">${product.title}</h3>
                    <span class="tt-card-price">${product.price}</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

    // Initialize Swiper Carousel
    // Assumes Swiper is available globally (which it is in ahgraphics-store.io)
    if (typeof Swiper !== 'undefined') {
        new Swiper(".tt-swiper-container", {
            slidesPerView: 2,
            spaceBetween: 20,
            loop: true,
            autoplay: {
                delay: 2500,
                disableOnInteraction: false,
            },
            pagination: {
                el: ".tt-swiper-pagination",
                clickable: true,
            },
            breakpoints: {
                576: {
                    slidesPerView: 3,
                },
                768: {
                    slidesPerView: 4,
                },
                992: {
                    slidesPerView: 5,
                },
            }
        });
    }

    // Modal Elements Setup
    const modal = document.getElementById('ttProductModal');
    const modalTitle = document.getElementById('ttModalTitle');
    const modalPrice = document.getElementById('ttModalPrice');
    const modalDesc = document.getElementById('ttModalDesc');
    const modalImg = document.getElementById('ttModalImg');
    const modalFeatures = document.getElementById('ttModalFeatures');
    
    const closeBtn = document.getElementById('ttCloseModal');
    const cancelBtn = document.getElementById('ttCancelModal');

    function openTTModal(data) {
        if(!modal) return;
        modalTitle.textContent = data.title;
        modalPrice.textContent = data.price;
        modalDesc.textContent = data.longDesc;
        modalImg.src = data.image;
        modalImg.alt = data.title;
        
        modalFeatures.innerHTML = '';
        data.features.forEach(feature => {
            const li = document.createElement('li');
            li.textContent = feature;
            modalFeatures.appendChild(li);
        });

        document.body.style.overflow = 'hidden';
        modal.classList.add('active');
    }

    function closeTTModal() {
        if(!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    if(closeBtn) closeBtn.addEventListener('click', closeTTModal);
    if(cancelBtn) cancelBtn.addEventListener('click', closeTTModal);
    
    if(modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeTTModal();
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
            closeTTModal();
        }
    });
});
