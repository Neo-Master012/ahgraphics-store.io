// --- Trending Tools Component Logic ---
document.addEventListener("DOMContentLoaded", function() {
    const products = [
        {
            id: 1,
            title: "NeuroEngine AI Core",
            shortDesc: "Next-gen machine learning framework for predictive insights.",
            longDesc: "NeuroEngine AI Core revolutionizes how you process big data. With out-of-the-box support for advanced neural networks and deep learning models, it accelerates your data science workflow. Perfect for rapid prototyping and enterprise scaling.",
            price: "$499.00",
            image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
            badge: "Hot",
            features: [
                "Auto-scaling ML pipelines",
                "Advanced natural language processing",
                "Real-time data visualization",
                "Enterprise-grade security"
            ]
        },
        {
            id: 2,
            title: "PixelForge Studio X",
            shortDesc: "The ultimate vector and raster graphic design suite.",
            longDesc: "Push the boundaries of digital art with PixelForge Studio X. Offering seamless integration between vector tools and high-res raster brushes. Experience zero-lag performance even with thousands of layers.",
            price: "$299.00",
            image: "https://images.unsplash.com/photo-1542744094-3a31f272c490?auto=format&fit=crop&w=800&q=80",
            badge: "Bestseller",
            features: [
                "Infinite canvas technology",
                "AI-assisted asset generation",
                "Cloud-synced workspaces",
                "One-click asset export"
            ]
        },
        {
            id: 3,
            title: "StreamNova Pro",
            shortDesc: "Broadcast-quality video rendering and distribution platform.",
            longDesc: "Take your content live with StreamNova Pro. Featuring ultra-low latency hardware encoding, multi-platform simulcasting, and dynamic overlays. Designed for professional creators and e-sport broadcasts.",
            price: "$149.00/mo",
            image: "https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=800&q=80",
            badge: "Trending",
            features: [
                "4K 60FPS streaming capabilities",
                "Multi-destination casting (Twitch, YT, etc.)",
                "Real-time analytics dashboard",
                "Automated VOD backups"
            ]
        },
        {
            id: 4,
            title: "CodeFlow Optimizer",
            shortDesc: "AI-driven code analysis and automated refactoring tool.",
            longDesc: "Eliminate technical debt instantly. CodeFlow continuously scans your repository to detect memory leaks, unoptimized loops, and anti-patterns, suggesting or automatically applying fixes via Pull Requests.",
            price: "$89.00",
            image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
            badge: "Sale",
            features: [
                "Supports 20+ programming languages",
                "Seamless CI/CD integration",
                "Automated vulnerability patching",
                "Custom rule definition engine"
            ]
        }
    ];

    const grid = document.getElementById('ttProductGrid');
    if (!grid) return; // Ensure element exists on page

    // Render Cards
    products.forEach(product => {
        const card = document.createElement('div');
        card.className = 'tt-product-card';
        card.onclick = () => openTTModal(product);

        card.innerHTML = `
            <div class="tt-card-image-wrapper">
                <span class="tt-badge-hot">${product.badge}</span>
                <img src="${product.image}" loading="lazy" alt="${product.title}">
            </div>
            <div class="tt-card-content">
                <h3 class="tt-card-title">${product.title}</h3>
                <p class="tt-card-description">${product.shortDesc}</p>
                <div class="tt-card-footer">
                    <span class="tt-card-price">${product.price}</span>
                    <span class="tt-card-action">View details &xrarr;</span>
                </div>
            </div>
        `;
        grid.appendChild(card);
    });

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
