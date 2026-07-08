// Mobile Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

function closeMenu() {
    if (!hamburger || !navMenu) return;
    navMenu.classList.remove('active');
    hamburger.classList.remove('active');
    document.body.classList.remove('nav-open');
}

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        hamburger.classList.toggle('active');
        document.body.classList.toggle('nav-open', navMenu.classList.contains('active'));
    });

    // Close menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            closeMenu();
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMenu();
        }
    });

    // Close menu when pressing Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMenu();
        }
    });

    // If viewport switches to desktop, reset menu state
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            closeMenu();
        }
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
        const href = anchor.getAttribute('href');

        // Ignore placeholder links like href="#"
        if (!href || href === '#') {
            e.preventDefault();
            return;
        }

        let target;
        try {
            target = document.querySelector(href);
        } catch (error) {
            target = null;
        }

        if (target) {
            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add scroll effect to navbar
const header = document.querySelector('header');
if (header) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            header.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.4)';
        } else {
            header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
        }
    });
}

// Intersection Observer for fade-in animations
if ('IntersectionObserver' in window) {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.addEventListener('DOMContentLoaded', () => {
        const animateElements = document.querySelectorAll('.event-card, .news-card, .stat-card');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(el);
        });
    });
}

// Form validation (if forms are present)
const forms = document.querySelectorAll('form');
forms.forEach(form => {
    form.addEventListener('submit', (e) => {
        const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!String(input.value).trim()) {
                isValid = false;
                input.style.borderColor = '#c41e3a';
            } else {
                input.style.borderColor = '';
            }
        });

        if (!isValid) {
            e.preventDefault();
            alert('Proszę wypełnić wszystkie wymagane pola.');
        }
    });
});
