/**
 * ANIverse Portfolio - Interactive JavaScript
 * Anime Cyberpunk Video Editor Portfolio
 * 
 * Features:
 * ✅ Custom Glowing Cursor
 * ✅ Smooth Scrolling Navigation
 * ✅ Mobile Hamburger Menu
 * ✅ Loading Animation
 * ✅ Navbar Scroll Effects
 * ✅ Active Link Highlighting
 * ✅ Portfolio Video Controls
 * ✅ Scroll Animations
 * ✅ Performance Optimized
 * 
 * Author: ANIverse Team
 * Version: 1.0.0
 */

(function() {
    'use strict';

    // ==========================================================================
    // DOM ELEMENTS
    // ==========================================================================
    const elements = {
        loading: document.getElementById('loading'),
        cursor: document.getElementById('cursor'),
        cursorFollower: document.getElementById('cursor-follower'),
        navbar: document.getElementById('navbar'),
        navLinks: document.getElementById('nav-links'),
        hamburger: document.getElementById('hamburger'),
        navLinksList: document.querySelectorAll('.nav-link'),
        portfolioItems: document.querySelectorAll('.portfolio-item'),
        sections: document.querySelectorAll('section')
    };

    // ==========================================================================
    // STATE
    // ==========================================================================
    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let isMobileMenuOpen = false;

    // ==========================================================================
    // INIT
    // ==========================================================================
    function init() {
        // Bind events after DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', bindEvents);
        } else {
            bindEvents();
        }
        
        // Start cursor animation loop
        requestAnimationFrame(cursorLoop);
    }

    // ==========================================================================
    // EVENT BINDERS
    // ==========================================================================
    function bindEvents() {
        // Window Events
        window.addEventListener('load', handleLoad);
        window.addEventListener('scroll', throttle(handleScroll, 16));
        window.addEventListener('mousemove', throttle(handleMouseMove, 16));
        window.addEventListener('resize', throttle(handleResize, 250));

        // Navbar Events
        if (elements.hamburger) {
            elements.hamburger.addEventListener('click', toggleMobileMenu);
        }

        // Navigation Events
        elements.navLinksList.forEach(link => {
            link.addEventListener('click', handleNavClick);
        });

        // Portfolio Events
        elements.portfolioItems.forEach(item => {
            item.addEventListener('mouseenter', handlePortfolioHover);
            item.addEventListener('mouseleave', handlePortfolioLeave);
            item.addEventListener('click', handlePortfolioClick);
        });

        // Interactive Elements for Cursor
        document.querySelectorAll('a, button, .glass-card, .service-card, .feature-card').forEach(el => {
            el.addEventListener('mouseenter', handleCursorEnter);
            el.addEventListener('mouseleave', handleCursorLeave);
        });

        // Preload videos
        preloadPortfolioVideos();
    }

    // ==========================================================================
    // LOADING & PERFORMANCE
    // ==========================================================================
    function handleLoad() {
        // Loading screen fade out
        setTimeout(() => {
            if (elements.loading) {
                elements.loading.style.opacity = '0';
                setTimeout(() => {
                    elements.loading.style.display = 'none';
                }, 500);
            }
        }, 1800);

        // Reveal animations
        revealOnScroll();
    }

    function preloadPortfolioVideos() {
        elements.portfolioItems.forEach(item => {
            const video = item.querySelector('.portfolio-video');
            if (video) {
                video.preload = 'metadata';
                video.muted = true;
            }
        });
    }

    // ==========================================================================
    // CUSTOM CURSOR SYSTEM
    // ==========================================================================
    function handleMouseMove(e) {
        mouseX = e.clientX;
        mouseY = e.clientY;
    }

    function cursorLoop() {
        // Smooth cursor movement
        cursorX += (mouseX - cursorX) * 0.12;
        cursorY += (mouseY - cursorY) * 0.12;
        
        if (elements.cursor) {
            elements.cursor.style.left = `${cursorX}px`;
            elements.cursor.style.top = `${cursorY}px`;
        }
        
        if (elements.cursorFollower) {
            elements.cursorFollower.style.left = `${cursorX}px`;
            elements.cursorFollower.style.top = `${cursorY}px`;
        }
        
        requestAnimationFrame(cursorLoop);
    }

    function handleCursorEnter() {
        if (elements.cursor) {
            elements.cursor.style.transform = 'scale(1.5) rotate(180deg)';
            elements.cursor.style.opacity = '0.8';
        }
        if (elements.cursorFollower) {
            elements.cursorFollower.style.transform = 'scale(2.5)';
            elements.cursorFollower.style.opacity = '0.7';
            elements.cursorFollower.style.borderWidth = '3px';
        }
    }

    function handleCursorLeave() {
        if (elements.cursor) {
            elements.cursor.style.transform = 'scale(1) rotate(0deg)';
            elements.cursor.style.opacity = '1';
        }
        if (elements.cursorFollower) {
            elements.cursorFollower.style.transform = 'scale(1)';
            elements.cursorFollower.style.opacity = '0.5';
            elements.cursorFollower.style.borderWidth = '2px';
        }
    }

    // ==========================================================================
    // NAVBAR & NAVIGATION
    // ==========================================================================
    function handleScroll() {
        updateNavbar();
        updateActiveNav();
        revealOnScroll();
    }

    function updateNavbar() {
        if (!elements.navbar) return;
        
        if (window.scrollY > 100) {
            elements.navbar.style.background = 'rgba(10, 10, 10, 0.97)';
            elements.navbar.style.backdropFilter = 'blur(35px)';
            elements.navbar.style.boxShadow = '0 10px 40px rgba(0,0,0,0.5)';
        } else {
            elements.navbar.style.background = 'rgba(10, 10, 10, 0.92)';
            elements.navbar.style.backdropFilter = 'blur(25px)';
            elements.navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.3)';
        }
    }

    function toggleMobileMenu() {
        isMobileMenuOpen = !isMobileMenuOpen;
        
        if (elements.navLinks) {
            elements.navLinks.classList.toggle('active');
        }
        
        if (elements.hamburger) {
            elements.hamburger.classList.toggle('active');
        }
        
        // Body scroll lock
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : '';
    }

    function handleNavClick(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            targetSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
        
        // Close mobile menu
        if (isMobileMenuOpen) {
            toggleMobileMenu();
        }
    }

    function updateActiveNav() {
        let current = '';
        const scrollPos = window.scrollY + 150;

        elements.sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        elements.navLinksList.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // PORTFOLIO INTERACTIONS
    // ==========================================================================
    function handlePortfolioHover(e) {
        const video = e.currentTarget.querySelector('.portfolio-video');
        if (video && !video.paused) {
            video.pause();
        }
    }

    function handlePortfolioLeave(e) {
        const video = e.currentTarget.querySelector('.portfolio-video');
        if (video) {
            video.currentTime = 0;
            video.play().catch(() => {}); // Ignore play promise errors
        }
    }

    function handlePortfolioClick(e) {
        const video = e.currentTarget.querySelector('.portfolio-video');
        const overlay = e.currentTarget.querySelector('.portfolio-overlay');
        
        if (video && overlay) {
            // Toggle play/pause
            if (video.paused) {
                video.play();
                overlay.style.opacity = '0';
            } else {
                video.pause();
                overlay.style.opacity = '1';
            }
        }
    }

    // ==========================================================================
    // SCROLL ANIMATIONS
    // ==========================================================================
    function revealOnScroll() {
        const reveals = document.querySelectorAll('.glass-card, .service-card, .feature-card, .testimonial-card');
        
        reveals.forEach(el => {
            const windowHeight = window.innerHeight;
            const revealTop = el.getBoundingClientRect().top;
            const revealPoint = 150;

            if (revealTop < windowHeight - revealPoint) {
                el.classList.add('revealed');
            }
        });
    }

    // ==========================================================================
    // RESPONSIVE & UTILS
    // ==========================================================================
    function handleResize() {
        // Recalculate cursor position
        if (window.innerWidth < 768) {
            // Hide cursor on mobile
            if (elements.cursor) elements.cursor.style.display = 'none';
            if (elements.cursorFollower) elements.cursorFollower.style.display = 'none';
        } else {
            if (elements.cursor) elements.cursor.style.display = 'block';
            if (elements.cursorFollower) elements.cursorFollower.style.display = 'block';
        }
    }

    // Throttle utility for performance
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    // Intersection Observer for performance
    function setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('in-view');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.glass-card, .portfolio-item').forEach(el => {
            observer.observe(el);
        });
    }

    // ==========================================================================
    // WHATSAPP ANALYTICS (Optional)
    // ==========================================================================
    function trackWhatsAppClick() {
        // Google Analytics / Custom tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'whatsapp_click', {
                'event_category': 'conversion',
                'event_label': 'hire_me'
            });
        }
        
        // Custom event
        window.dispatchEvent(new CustomEvent('whatsappConversion'));
    }

    // Add WhatsApp tracking to links
    document.addEventListener('click', (e) => {
        if (e.target.closest('a[href*="wa.me"]')) {
            trackWhatsAppClick();
        }
    });

    // ==========================================================================
    // PUBLIC API
    // ==========================================================================
    window.ANIverse = {
        init: init,
        toggleMenu: toggleMobileMenu,
        updateCursor: cursorLoop
    };

    // Auto-init
    init();
    setupIntersectionObserver();

})();