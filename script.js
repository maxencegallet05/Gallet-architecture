/* Interactive Logic: Gallet Architectes Modernization */

document.addEventListener('DOMContentLoaded', () => {
    // 0. Dynamic Rendering
    renderProjects();
    renderNews();
    renderDistinctions();
    renderSocialMedia();

    // 1. Header Scroll Effect
    const header = document.getElementById('main-header');
    window.addEventListener('scroll', () => {
        const isHomePage = !window.location.pathname.includes('projet.html') && !window.location.pathname.includes('actualites.html') && !window.location.pathname.includes('agence.html') && !window.location.pathname.includes('distinctions.html');
        if (window.scrollY > 50 || !isHomePage) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Initial check for non-home pages
    if (window.location.pathname.includes('projet.html') || window.location.pathname.includes('actualites.html') || window.location.pathname.includes('agence.html') || window.location.pathname.includes('distinctions.html')) {
        header.classList.add('scrolled');
    }

    // 2. Reveal Animations on Scroll
    initRevealObserver();

    // 3. Project Filtering Logic
    initFiltering();

    // 4. Smooth Scrolling for Nav Links
    initSmoothScroll();

    // 5. Generic Modal Logic (News & Projects)
    initGenericModal();

    // 6. Tabs Logic (Distinctions)
    initTabs();

    // 7. Mobile Menu
    initMobileMenu();

    // 8. Project Detail Rendering (if on detail page)
    renderProjectDetail();

    // 9. Contact Form Logic
    initContactForm();
});

function renderProjects() {
    const grid = document.getElementById('project-grid');
    if (!grid) return;

    let projectsToRender = window.projectsData;

    const isHomePage = window.location.pathname.endsWith('index.html') || window.location.pathname === '/' || !window.location.pathname.includes('.html');
    
    if (isHomePage) {
        let selectedProjects = [];
        let categoriesUsed = new Set();
        let shuffled = [...window.projectsData].sort(() => 0.5 - Math.random());
        
        // First get one from each category
        for (let p of shuffled) {
            if (!categoriesUsed.has(p.category)) {
                selectedProjects.push(p);
                categoriesUsed.add(p.category);
            }
        }
        // Fill the rest up to 15
        for (let p of shuffled) {
            if (selectedProjects.length >= 15) break;
            if (!selectedProjects.includes(p)) {
                selectedProjects.push(p);
            }
        }
        projectsToRender = selectedProjects.slice(0, 15);
    }

    grid.innerHTML = projectsToRender.map(project => `
        <article class="project-card reveal" data-category="${project.category}" data-id="${project.id}">
            <div class="project-img-fallback">
                <img src="${project.image}" alt="${project.title}" style="width: 100%; height: 100%; object-fit: cover; transition: transform 0.6s ease;">
            </div>
            <div class="project-info-static">
                <p style="font-size: 0.65rem; text-transform: uppercase; letter-spacing: 1.5px; color: var(--accent); margin-bottom: 2px;">${project.category}</p>
                <h3 style="font-size: 0.9rem; font-weight: 600;">${project.title}</h3>
                <p style="font-size: 0.75rem; color: var(--text-muted);">${project.location}</p>
            </div>
        </article>
    `).join('');
    
    updateProjectCount();
}

function updateProjectCount() {
    const countEl = document.getElementById('project-count');
    if (countEl) {
        const visibleCards = document.querySelectorAll('.project-card[style*="display: block"]').length || document.querySelectorAll('.project-card').length;
        countEl.textContent = visibleCards;
    }
}

function renderNews() {
    const container = document.getElementById('news-container');
    if (!container) return;

    container.innerHTML = window.newsData.map(item => `
        <article class="reveal glass-card" style="color: var(--primary); display: flex; flex-direction: column; padding: 0; overflow: hidden; border-radius: 4px;">
            ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 100%; height: 200px; object-fit: cover;">` : ''}
            <div style="padding: var(--space-md);">
                <small style="color: var(--accent); font-weight: 600;">${item.date}</small>
                <h3 style="margin: 0.5rem 0;">${item.title}</h3>
                <p style="font-size: 0.9rem; opacity: 0.8;">${item.description}</p>
                <a href="javascript:void(0)" class="read-more" data-id="${item.id}" style="display: inline-block; margin-top: 1.5rem; border-bottom: 2px solid var(--accent); padding-bottom: 2px; font-weight: 600; font-size: 0.8rem; text-transform: uppercase; letter-spacing: 1px;">Lire la suite</a>
            </div>
        </article>
    `).join('');
}

function renderDistinctions() {
    const awardsContainer = document.getElementById('awards-list');
    const conferencesContainer = document.getElementById('conferences-grid');
    const publicationsContainer = document.getElementById('publications-list');
    const data = window.distinctionsData;

    if (!data) return;

    if (awardsContainer) {
        awardsContainer.innerHTML = data.awards.map(award => `
            <div class="distinction-item reveal">
                <div class="dist-year">${award.year}</div>
                <div class="dist-content">
                    <span class="dist-tag">${award.tag}</span>
                    <h3>${award.title}</h3>
                    <p>${award.description}</p>
                </div>
                <div class="dist-badge">${award.badge}</div>
            </div>
        `).join('');
    }

    if (conferencesContainer) {
        conferencesContainer.innerHTML = data.conferences.map(conf => `
            <div class="conf-card reveal" style="background: white; padding: var(--space-md);">
                <small style="color: var(--accent); font-weight: 600; letter-spacing: 1px;">${conf.date}</small>
                <h3 style="margin: 0.5rem 0; font-size: 1.1rem;">${conf.title}</h3>
                <p style="font-size: 0.85rem; color: var(--text-muted);">${conf.location}</p>
            </div>
        `).join('');
    }

    if (publicationsContainer) {
        publicationsContainer.innerHTML = data.publications.map(pub => `
            <div class="distinction-item reveal">
                <div class="dist-year" style="font-size: 1rem; color: var(--text-muted);">${pub.year}</div>
                <div class="dist-content">
                    <span class="dist-tag">${pub.tag}</span>
                    <h3>${pub.title}</h3>
                    <p>${pub.description}</p>
                </div>
            </div>
        `).join('');
    }
}

function initRevealObserver() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                revealObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });

    window.refreshReveal = () => {
        document.querySelectorAll('.reveal:not(.active)').forEach(el => {
            revealObserver.observe(el);
        });
    };
}

function initFiltering() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const grid = document.getElementById('project-grid');
            if (!grid) return;
            const projectCards = grid.querySelectorAll('.project-card');
            
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 400);
                }
            });
            
            setTimeout(updateProjectCount, 450);
        });
    });
}

function initSmoothScroll() {
    document.querySelectorAll('nav a, .hero a').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetElement = document.querySelector(href);
                if (targetElement) {
                    window.scrollTo({
                        top: targetElement.offsetTop - 80,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });
}

function initGenericModal() {
    const modal = document.getElementById('project-modal');
    const modalContainer = document.getElementById('modal-container');
    const modalContent = document.getElementById('modal-content');
    const closeBtn = document.querySelector('.modal-close');
    const overlay = document.querySelector('.modal-overlay');

    if (!modal) return;

    const openModal = () => {
        modal.style.display = 'flex';
        modal.offsetHeight; // Force reflow
        modal.classList.add('active');
        document.body.classList.add('overflow-hidden');
    };

    const closeModal = () => {
        modal.classList.remove('active');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.classList.remove('overflow-hidden');
        }, 800); // Matches the new premium transition duration
    };

    document.addEventListener('click', (e) => {
        // 1. News Click
        if (e.target.classList.contains('read-more')) {
            const newsId = parseInt(e.target.getAttribute('data-id'));
            const newsItem = window.newsData.find(item => item.id === newsId);
            
            if (newsItem) {
                modalContainer.classList.remove('project-modal-container');
                modalContent.innerHTML = `
                    <div style="padding: var(--space-md);">
                        <small style="color: var(--accent); font-weight: 600; text-transform: uppercase; letter-spacing: 2px;">${newsItem.date}</small>
                        <h2 style="margin: 1.5rem 0; font-size: 2.5rem; font-family: var(--font-heading);">${newsItem.title}</h2>
                        <div style="line-height: 1.8; font-size: 1.1rem; color: var(--text); border-top: 1px solid var(--gray-light); padding-top: 2rem;">
                            ${newsItem.content || newsItem.description}
                        </div>
                    </div>
                `;
                openModal();
            }
        }

        // 2. Project Card Click (on main project grid)
        const projectCard = e.target.closest('.project-card');
        if (projectCard && !e.target.closest('.pinterest-view')) {
            const projectId = projectCard.getAttribute('data-id');
            window.location.href = `projet-detail.html?id=${projectId}`;
        }
    });

    if (closeBtn) closeBtn.addEventListener('click', closeModal);
    if (overlay) overlay.addEventListener('click', closeModal);

    // Expose openModal for other functions
    window.openPinterestModal = openModal;
}


function renderProjectDetail() {
    const renderContainer = document.getElementById('project-detail-render');
    if (!renderContainer) return;

    const urlParams = new URLSearchParams(window.location.search);
    const projectId = parseInt(urlParams.get('id'));

    if (!projectId) {
        window.location.href = 'projet.html';
        return;
    }

    const project = window.projectsData.find(p => p.id === projectId);

    if (project) {
        document.title = `${project.title.toUpperCase()} | GALLET ARCHITECTES`;
        
        const projectImages = project.images && project.images.length > 0 ? project.images : [project.image];

        let heroHtml = '';
        if (projectImages.length > 1) {
            heroHtml = `
            <div class="detail-gallery-sticky">
                <div class="carousel" id="detail-carousel">
                    <div class="carousel-inner" id="detail-carousel-inner">
                        ${projectImages.map((img, i) => `<img src="${img}" alt="${project.title} - Image ${i+1}" class="carousel-item ${i === 0 ? 'active' : ''}">`).join('')}
                    </div>
                    <button class="carousel-btn prev" onclick="moveCarousel(-1)" aria-label="Image précédente">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    </button>
                    <button class="carousel-btn next" onclick="moveCarousel(1)" aria-label="Image suivante">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </button>
                    <div class="carousel-indicators" id="detail-carousel-indicators">
                        ${projectImages.map((_, i) => `<span class="indicator ${i === 0 ? 'active' : ''}" onclick="goToCarousel(${i})"></span>`).join('')}
                    </div>
                </div>
            </div>`;
        } else {
            heroHtml = `
            <div class="detail-gallery-sticky">
                <div class="single-image-container">
                    <img src="${project.image}" alt="${project.title}" class="detail-single-image">
                </div>
            </div>`;
        }

        let descriptionHtml = '';
        if (project.longDescription || project.description) {
            descriptionHtml += `
                <div class="detail-text-content">
                    <h2 class="specs-title" style="margin-top: 0;">Présentation</h2>
                    <p class="project-long-desc">${project.longDescription || project.description}</p>
                </div>
            `;
        }


        let specsHtml = '';
        if (project.details) {
            specsHtml += `
                <div class="project-specs-grid">
                    <h2 class="specs-title">Fiche Technique</h2>
                    <div class="specs-table-2">
                        ${project.details.programme ? `<div class="spec-row-2"><span class="label">Programme</span><span class="val">${project.details.programme}</span></div>` : ''}
                        ${project.details.maitreOuvrage ? `<div class="spec-row-2"><span class="label">Maître d'ouvrage</span><span class="val">${project.details.maitreOuvrage}</span></div>` : ''}
                        ${project.details.maitreOeuvre ? `<div class="spec-row-2"><span class="label">Maître d'œuvre</span><span class="val">${project.details.maitreOeuvre}</span></div>` : ''}
                        ${project.details.montant ? `<div class="spec-row-2"><span class="label">Budget travaux</span><span class="val">${project.details.montant}</span></div>` : ''}
                        ${project.details.surfaces ? `<div class="spec-row-2"><span class="label">Surface</span><span class="val">${project.details.surfaces}</span></div>` : ''}
                        ${project.details.missions ? `<div class="spec-row-2"><span class="label">Missions</span><span class="val">${project.details.missions}</span></div>` : ''}
                        ${project.details.livraison ? `<div class="spec-row-2"><span class="label">Livraison</span><span class="val">${project.details.livraison}</span></div>` : ''}
                    </div>
                </div>
            `;

            if (project.details.specificites && project.details.specificites.length > 0) {
                specsHtml += `
                    <div class="project-specs-list-container" style="margin-top: var(--space-md);">
                        <h3 class="specs-title" style="font-size: 0.8rem; letter-spacing: 2px;">Détails & Écologie</h3>
                        <ul class="eco-specs-list">
                            ${project.details.specificites.map(spec => spec.trim() ? `<li><span class="bullet">―</span> <span class="text">${spec}</span></li>` : '').join('')}
                        </ul>
                    </div>
                `;
            }
        }

        let creditHtml = project.details && (project.details.credit || project.details.credits) ? `
            <div class="photo-credit">
                <span>Crédits :</span> ${project.details.credit || project.details.credits}
            </div>
        ` : '';

        // Generate dynamic recommendations
        const similarProjects = window.projectsData
            .filter(p => p.category === project.category && p.id !== project.id)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        let recommendationsHtml = '';
        if (similarProjects.length > 0) {
            recommendationsHtml = `
            <section class="similar-projects-section section-padding">
                <div class="container">
                    <div class="section-header-centered">
                        <span class="sub-indicator">Découvrir</span>
                        <h2 class="section-title" style="font-family: var(--font-heading); font-size: clamp(2rem, 4vw, 2.8rem); font-weight: 400; text-align: center;">Projets Similaires</h2>
                    </div>
                    <div class="project-grid-2">
                        ${similarProjects.map(p => `
                            <article class="project-card-2" onclick="window.location.href='projet-detail.html?id=${p.id}'">
                                <div class="card-img-wrapper">
                                    <img src="${p.image}" alt="${p.title}">
                                    <div class="card-overlay-modern">
                                        <span class="card-arrow-btn">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                                        </span>
                                    </div>
                                </div>
                                <div class="card-text-wrapper">
                                    <span class="card-category">${p.category.toUpperCase()}</span>
                                    <h3 class="card-title">${p.title}</h3>
                                    <p class="card-location">${p.location}</p>
                                </div>
                            </article>
                        `).join('')}
                    </div>
                </div>
            </section>`;
        }

        renderContainer.innerHTML = `
            <div class="container detail-breadcrumbs" style="padding-top: var(--space-md); padding-bottom: var(--space-xs);">
                <a href="projet.html" class="back-link">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Retour aux projets
                </a>
            </div>

            <article class="project-detail-layout container">
                <!-- Left: Sticky Gallery -->
                <div class="detail-left-pane">
                    ${heroHtml}
                    ${creditHtml}
                </div>

                <!-- Right: Content & Specs -->
                <div class="detail-right-pane">
                    <header class="detail-header-text">
                        <span class="detail-category-label">${project.category.toUpperCase()}</span>
                        <h1 class="detail-main-title">${project.title}</h1>
                        <p class="detail-location-sub">${project.location} ${project.year && !project.year.includes('?') ? ` • ${project.year}` : ''}</p>
                    </header>

                    ${descriptionHtml}

                    ${specsHtml}
                    
                    <div class="detail-actions-panel" style="margin-top: var(--space-md); padding-top: var(--space-sm); border-top: 1px dashed var(--gray-light); display: flex; gap: 15px;">
                        <button class="action-btn-pill btn-outline" onclick="window.print()">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"></polyline><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
                            Imprimer le dossier
                        </button>
                        <a href="mailto:contact@gallet-architectes.fr?subject=Intérêt pour le projet : ${encodeURIComponent(project.title)}" class="action-btn-pill btn-filled">
                            Nous contacter sur ce projet
                        </a>
                    </div>
                </div>
            </article>

            ${recommendationsHtml}
        `;

        // Scroll to top of window to make sure transition is clean
        window.scrollTo({ top: 0, behavior: 'instant' });

        // Trigger reveal animations
        setTimeout(() => {
            if (window.refreshReveal) window.refreshReveal();
            document.querySelectorAll('.project-detail-layout .reveal').forEach(el => el.classList.add('active'));
        }, 100);

    } else {
        renderContainer.innerHTML = `<div class="container" style="padding: 100px 0; text-align: center;"><h2 style="font-family: var(--font-heading); margin-bottom: var(--space-sm);">Projet introuvable</h2><p style="color: var(--text-muted); margin-bottom: var(--space-md);">Le projet demandé n'existe pas ou a été déplacé.</p><a href="projet.html" class="filter-btn active">Retour aux projets</a></div>`;
    }
}


function initTabs() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    if (!tabBtns.length) return;

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.getAttribute('data-tab');

            // Update buttons
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.borderBottomColor = 'transparent';
                b.style.color = 'var(--text-muted)';
            });
            btn.classList.add('active');
            btn.style.borderBottomColor = 'var(--accent)';
            btn.style.color = 'var(--primary)';

            // Update contents
            tabContents.forEach(content => {
                content.style.display = 'none';
                content.classList.remove('active');
            });
            const targetContent = document.getElementById(`tab-${target}`);
            if (targetContent) {
                targetContent.style.display = 'block';
                targetContent.classList.add('active');
            }

            // Refresh reveal animations for new content
            if (window.refreshReveal) window.refreshReveal();
        });
    });
}
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainNav = document.getElementById('main-nav');
    const navLinks = document.querySelectorAll('#main-nav a');

    if (!menuToggle || !mainNav) return;

    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        mainNav.classList.toggle('active');
        document.body.classList.toggle('overflow-hidden');
    });

    // Close menu when a link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            mainNav.classList.remove('active');
            document.body.classList.remove('overflow-hidden');
        });
    });
}

// Carousel Logic
let currentCarouselIndex = 0;

window.moveCarousel = function(direction) {
    const inner = document.getElementById('detail-carousel-inner');
    if (!inner) return;
    const items = inner.querySelectorAll('.carousel-item');
    const newIndex = (currentCarouselIndex + direction + items.length) % items.length;
    goToCarousel(newIndex);
};

window.goToCarousel = function(index) {
    const inner = document.getElementById('detail-carousel-inner');
    const indicatorsContainer = document.getElementById('detail-carousel-indicators');
    if (!inner) return;

    const items = inner.querySelectorAll('.carousel-item');
    let indicators = [];
    if(indicatorsContainer) {
        indicators = indicatorsContainer.querySelectorAll('.indicator');
    }

    if (index >= 0 && index < items.length) {
        items[currentCarouselIndex].classList.remove('active');
        if(indicators[currentCarouselIndex]) indicators[currentCarouselIndex].classList.remove('active');
        
        currentCarouselIndex = index;
        
        items[currentCarouselIndex].classList.add('active');
        if(indicators[currentCarouselIndex]) indicators[currentCarouselIndex].classList.add('active');
    }
};

function renderSocialMedia() {
    const container = document.getElementById('social-icons-container');
    if (!container || !window.socialMediaData) return;

    container.innerHTML = window.socialMediaData.map(social => `
        <a href="${social.url}" target="_blank" aria-label="${social.name}" style="color: white; opacity: 0.8; transition: opacity 0.3s ease;">
            <div style="width: 24px; height: 24px; cursor: pointer;" onmouseover="this.parentElement.style.opacity='1'" onmouseout="this.parentElement.style.opacity='0.8'">
                ${social.icon}
            </div>
        </a>
    `).join('');
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const inputs = contactForm.querySelectorAll('input, textarea');
        if (inputs.length >= 3) {
            const name = inputs[0].value;
            const email = inputs[1].value;
            const message = inputs[2].value;
            
            const subject = encodeURIComponent(`Nouveau message de ${name} via le site web`);
            const body = encodeURIComponent(`Nom: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
            
            window.location.href = `mailto:contact@gallet-architectes.fr?subject=${subject}&body=${body}`;
            
            contactForm.reset();
            
            // Show a brief success indication
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = "Préparation de l'email...";
            setTimeout(() => {
                submitBtn.textContent = originalText;
            }, 3000);
        }
    });
}

