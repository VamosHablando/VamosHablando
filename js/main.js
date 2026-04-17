

document.addEventListener('DOMContentLoaded', () => { 
   
    const navbar = document.querySelector('.navbar');
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuClose = document.querySelector('.mobile-menu-close');
    const mobileLinks = document.querySelectorAll('.mobile-nav-link');

   
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

   
    const toggleMobileMenu = () => {
        const isOpen = mobileMenu.classList.toggle('open');
        document.body.style.overflow = isOpen ? 'hidden' : '';

        const icon = mobileMenuToggle.querySelector('svg');
        if (isOpen) {
            icon.innerHTML = '<line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line>'; 
        } else {
            icon.innerHTML = '<line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line>'; 
        }
    }; 

    mobileMenuToggle.addEventListener('click', toggleMobileMenu);
    mobileMenuClose?.addEventListener('click', toggleMobileMenu);

   
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('open');
            document.body.style.overflow = '';
        });
    });

   
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-link, .mobile-nav-link').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPath || (currentPath === 'index.html' && href === '/')) {
            link.classList.add('active');
        }
    });

   
    (function initGallery() {
        const galleryCards = document.querySelectorAll('.gallery-card');

        if (!galleryCards.length) return;

       
        galleryCards.forEach(card => {
            card.addEventListener('click', (e) => {
                e.stopPropagation();

                const isActive = card.classList.contains('active');

               
                galleryCards.forEach(c => c.classList.remove('active'));

               
                if (!isActive) {
                    card.classList.add('active');
                }
            });
        });

       
        document.addEventListener('click', (e) => {
           
            galleryCards.forEach(c => c.classList.remove('active'));
        });
    })();

    // Animation Observer
    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });

    // --- ACCORDION LOGIC ---
    const accordionItems = document.querySelectorAll('.accordion-item');
    
    // Function to open accordion by hash (ID used in URL)
    const openAccordionByHash = () => {
        const hash = window.location.hash;
        if (hash) {
            const id = hash.substring(1);
            const targetItem = document.getElementById(id);
            if (targetItem && targetItem.classList.contains('accordion-item')) {
                targetItem.classList.add('active');
                
                // Update button text for pre-expanded item
                const btnText = targetItem.querySelector('.accordion-toggle-text');
                if (btnText) btnText.textContent = 'Minder info';
                
                // Scroll to wait for any layout shifts
                setTimeout(() => {
                    targetItem.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        }
    };

    openAccordionByHash();
    window.addEventListener('hashchange', openAccordionByHash);

    accordionItems.forEach(item => {
        const header = item.querySelector('.accordion-header');
        if (!header) return;

        header.addEventListener('click', (e) => {
            // If clicking a link inside the header, don't toggle
            if (e.target.closest('a')) return;
            
            e.stopPropagation();
            const isActive = item.classList.contains('active');
            
            if (!isActive) {
                item.classList.add('active');
                // Update text if the button exists
                const btnText = item.querySelector('.accordion-toggle-text');
                if (btnText) btnText.textContent = 'Minder info';
            } else {
                item.classList.remove('active');
                // Update text if the button exists
                const btnText = item.querySelector('.accordion-toggle-text');
                if (btnText) btnText.textContent = 'Lees meer';
            }
        });
    });
});


/* --- COOKIE BANNER --- */
function initCookieBanner() {
    if (localStorage.getItem('cookieAccepted')) return;

    // Block scrolling while banner is active
    document.body.style.overflow = 'hidden';

    // Add overlay to banner
    const bannerHTML = `<div id="cookie-banner" class="cookie-banner">
        <div class="cookie-content">
            <p><strong>Welkom bij Vamos Hablando!</strong><br><br>Voordat u verder gaat, willen wij u laten weten dat wij cookies gebruiken om uw gebruikerservaring te verbeteren en webverkeer te analyseren.</p>
            <div class="cookie-buttons">
                <button id="accept-cookies" class="btn btn-primary">Accepteren</button>
                <button id="reject-cookies" class="btn btn-secondary">Weigeren</button>
            </div>
        </div>
    </div>`;

    document.body.insertAdjacentHTML('beforeend', bannerHTML);

    const banner = document.getElementById('cookie-banner');
    document.getElementById('accept-cookies').addEventListener('click', () => { 
        localStorage.setItem('cookieAccepted', 'true');
        banner.classList.add('hidden');
        document.body.style.overflow = '';
        setTimeout(() => banner.remove(), 300);
    });

    document.getElementById('reject-cookies').addEventListener('click', () => { 
        localStorage.setItem('cookieAccepted', 'false');
        banner.classList.add('hidden');
        document.body.style.overflow = '';
document.addEventListener('DOMContentLoaded', initCookieBanner);
