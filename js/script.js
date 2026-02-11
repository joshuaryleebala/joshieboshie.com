// Navigation functionality
document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('[data-page]');
    const pages = document.querySelectorAll('.page');
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navMenu = document.querySelector('.nav-menu');

    // Page navigation
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');
            
            // Update active states
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Show target page
            pages.forEach(page => {
                page.classList.remove('active');
                if (page.id === targetPage) {
                    page.classList.add('active');
                }
            });

            // Close mobile menu if open
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
            }

            // Update URL hash
            window.location.hash = targetPage;

            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });

    // Mobile menu toggle
    mobileToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });

    // Handle initial page load with hash
    if (window.location.hash) {
        const hash = window.location.hash.substring(1);
        const targetLink = document.querySelector(`[data-page="${hash}"]`);
        if (targetLink) {
            targetLink.click();
        }
    }

    // Project filtering
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const filter = this.getAttribute('data-filter');
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            // Filter projects
            projectCards.forEach(card => {
                if (filter === 'all') {
                    card.style.display = 'block';
                    setTimeout(() => card.style.opacity = '1', 10);
                } else {
                    const tags = card.getAttribute('data-tags');
                    if (tags && tags.includes(filter)) {
                        card.style.display = 'block';
                        setTimeout(() => card.style.opacity = '1', 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                }
            });
        });
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    const formStatus = document.getElementById('form-status');

    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('message').value
        };

        // Create mailto link
        const mailtoLink = `mailto:joshuaryleebala@gmail.com?subject=${encodeURIComponent(formData.subject)}&body=${encodeURIComponent(
            `Name: ${formData.name}\nEmail: ${formData.email}\n\nMessage:\n${formData.message}`
        )}`;

        // Open email client
        window.location.href = mailtoLink;

        // Show success message
        formStatus.textContent = 'Opening your email client...';
        formStatus.classList.remove('error');
        formStatus.classList.add('success');

        // Reset form after a delay
        setTimeout(() => {
            contactForm.reset();
            formStatus.classList.remove('success');
            formStatus.style.display = 'none';
        }, 3000);
    });

    // Gallery lightbox (simple implementation)
    const galleryItems = document.querySelectorAll('.gallery-item');
    
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            const img = this.querySelector('img');
            const lightbox = document.createElement('div');
            lightbox.className = 'lightbox';
            lightbox.innerHTML = `
                <div class="lightbox-content">
                    <span class="lightbox-close">&times;</span>
                    <img src="${img.src}" alt="${img.alt}">
                </div>
            `;
            
            document.body.appendChild(lightbox);
            document.body.style.overflow = 'hidden';
            
            // Close lightbox
            const closeBtn = lightbox.querySelector('.lightbox-close');
            closeBtn.addEventListener('click', closeLightbox);
            lightbox.addEventListener('click', function(e) {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });
            
            function closeLightbox() {
                lightbox.remove();
                document.body.style.overflow = 'auto';
            }
        });
    });

    // Add smooth scroll behavior
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Handle profile image error
    const profileImg = document.getElementById('profile-img');
    if (profileImg) {
        profileImg.addEventListener('error', function() {
            this.style.display = 'none';
        });
    }
});

// Add lightbox styles dynamically
const style = document.createElement('style');
style.textContent = `
    .lightbox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    }

    .lightbox-content {
        position: relative;
        max-width: 90%;
        max-height: 90%;
    }

    .lightbox-content img {
        max-width: 100%;
        max-height: 90vh;
        border-radius: 8px;
    }

    .lightbox-close {
        position: absolute;
        top: -40px;
        right: 0;
        color: white;
        font-size: 40px;
        cursor: pointer;
        transition: transform 0.3s ease;
    }

    .lightbox-close:hover {
        transform: scale(1.2);
    }

    .project-card {
        opacity: 1;
        transition: opacity 0.3s ease;
    }
`;
document.head.appendChild(style);
