// --- Trending Tools Component Logic ---
document.addEventListener("DOMContentLoaded", function() {
    const products = [
        {
            id: 1,
            title: "NeuroEngine AI Core",
            longDesc: "NeuroEngine AI Core revolutionizes how you process big data. With out-of-the-box support for advanced neural networks and deep learning models, it accelerates your data science workflow. Perfect for rapid prototyping and enterprise scaling.",
            price: "$499.00",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=400&q=80",
            features: [
                "Auto-scaling ML pipelines",
                "Advanced NLP processing",
                "Real-time visualization"
            ]
        },
        {
            id: 2,
            title: "PixelForge Studio X",
            longDesc: "Push the boundaries of digital art with PixelForge Studio X. Offering seamless integration between vector tools and high-res raster brushes. Experience zero-lag performance even with thousands of layers.",
            price: "$299.00",
            image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=400&q=80",
            features: [
                "Infinite canvas tech",
                "AI-assisted generation",
                "Cloud-synced workspace"
            ]
        },
        {
            id: 3,
            title: "StreamNova Pro",
            longDesc: "Broadcast-quality video rendering and distribution platform. Low latency encoding and dynamic overlays.",
            price: "$149.00",
            image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=400&q=80",
            features: [
                "4K 60FPS streaming",
                "Multi-destination casting",
                "Real-time analytics"
            ]
        },
        {
            id: 4,
            title: "CodeFlow Optimizer",
            longDesc: "Eliminate technical debt instantly. Detects memory leaks, unoptimized loops, and anti-patterns automatically.",
            price: "$89.00",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80",
            features: [
                "20+ programming languages",
                "CI/CD integration",
                "Automated patching"
            ]
        },
        {
            id: 5,
            title: "DataSphere Plus",
            longDesc: "Centralized big data analytics and dashboard manager. Highly customizable report building.",
            price: "$250.00",
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=400&q=80",
            features: [
                "Centralized API",
                "Custom report building",
                "1-click integrations"
            ]
        },
        {
            id: 6,
            title: "CloudSync Engine",
            longDesc: "Next generation cloud storage solution for secure, decentralized object storage.",
            price: "$50.00",
            image: "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?auto=format&fit=crop&w=400&q=80",
            features: [
                "Decentralized storage",
                "Object API access",
                "Unlimited bandwidth"
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
                    <img src="${product.image}" loading="lazy" alt="${product.title}">
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
