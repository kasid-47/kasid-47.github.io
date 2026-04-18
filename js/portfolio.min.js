// Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Theme Toggle Functionality
    const themeToggle = document.getElementById('theme-toggle');
    const themeIcon = themeToggle.querySelector('i');
    const body = document.body;

    // Check for saved theme preference or default to light mode
    const currentTheme = localStorage.getItem('theme') || 'light';
    if (currentTheme === 'dark') {
        body.setAttribute('data-theme', 'dark');
        themeIcon.classList.remove('fa-moon');
        themeIcon.classList.add('fa-sun');
    }

    // Toggle theme function
    function toggleTheme() {
        const currentTheme = body.getAttribute('data-theme');
        if (currentTheme === 'dark') {
            body.removeAttribute('data-theme');
            localStorage.setItem('theme', 'light');
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        } else {
            body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    // Add click event listener to theme toggle
    themeToggle.addEventListener('click', toggleTheme);

    // Set current year in footer automatically
    const yearElement = document.getElementById('current-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // Navigation Functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Toggle mobile menu
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');

        // Animate hamburger menu
        const spans = navToggle.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);

            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 80; // Account for fixed navbar

                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });

                // Update active link
                navLinks.forEach(link => link.classList.remove('active'));
                this.classList.add('active');

                // Close mobile menu
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
                const spans = navToggle.querySelectorAll('span');
                spans[0].style.transform = 'none';
                spans[1].style.opacity = '1';
                spans[2].style.transform = 'none';
            }
        });
    });

    // Update active navigation link on scroll
    function updateActiveLink() {
        const sections = document.querySelectorAll('.section');
        const scrollPosition = window.scrollY + 100;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    // Throttle scroll event for better performance
    let scrollTimer;
    window.addEventListener('scroll', function() {
        if (scrollTimer) {
            clearTimeout(scrollTimer);
        }
        scrollTimer = setTimeout(updateActiveLink, 10);
    });

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all sections for animation
    document.querySelectorAll('.section').forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(section);
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            // Reset mobile menu on desktop
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Add loading animation
    window.addEventListener('load', function() {
        document.body.classList.add('loaded');
    });

    // Keyboard navigation
    document.addEventListener('keydown', function(e) {
        // Escape key closes mobile menu
        if (e.key === 'Escape' && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }

        // Theme toggle with Ctrl/Cmd + Shift + T
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
            e.preventDefault();
            toggleTheme();
        }
    });

    // Add click outside to close mobile menu
    document.addEventListener('click', function(e) {
        if (!navToggle.contains(e.target) && !navMenu.contains(e.target) && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Performance optimization: Debounce scroll events
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Apply debounced scroll handler
    window.addEventListener('scroll', debounce(updateActiveLink, 10));

    // Initialize active link on page load
    updateActiveLink();

    // Add smooth reveal animations for card groups by section
    const sectionSelectors = document.querySelectorAll('.section');
    const cardSelectors = '.education-card, .publication-item, .certification-item, .additional-item, .timeline-content';

    sectionSelectors.forEach((section) => {
        const cards = section.querySelectorAll(cardSelectors);
        if (!cards.length) {
            return;
        }

        cards.forEach((card) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(10px)';
            card.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
        });

        const sectionObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    cards.forEach((card) => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    });
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        sectionObserver.observe(section);
    });

    // Add loading class to body for initial animations
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});