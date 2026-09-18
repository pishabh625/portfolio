/* ========================================
   RISHABH PATEL - GAME & TOOLS PROGRAMMER PORTFOLIO
   JavaScript - Interactive Features
   ======================================== */

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    initLoader();
    initCursor();
    initParticles();
    initNavigation();
    initTypingEffect();
    initScrollAnimations();
    initCounters();
    initXPBars();
    initProjectFilter();
    initMobileNav();
});

/* ========================================
   LOADING SCREEN
   ======================================== */
function initLoader() {
    const loader = document.getElementById('loader');
    const progress = document.querySelector('.loader-progress');
    const percent = document.querySelector('.loader-percent');
    if (!loader || !progress) return;

    // Skip loader on repeat visits in same session and for reduced-motion users
    if (sessionStorage.getItem('visited') === '1' || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        loader.classList.add('hidden');
        document.body.style.overflow = 'auto';
        triggerHeroAnimations();
        return;
    }

    let width = 0;
    const start = Date.now();
    const interval = setInterval(() => {
        width += Math.random() * 18;
        const elapsed = Date.now() - start;
        // cap total loader time to ~900ms for recruiter scan speed
        if (width >= 100 || elapsed > 900) {
            width = 100;
            clearInterval(interval);
            sessionStorage.setItem('visited', '1');
            setTimeout(() => {
                loader.classList.add('hidden');
                document.body.style.overflow = 'auto';
                triggerHeroAnimations();
            }, 300);
        }
        progress.style.width = width + '%';
        percent.textContent = Math.floor(width) + '%';
    }, 70);
}

function triggerHeroAnimations() {
    // Add visible class to hero elements with stagger
    const heroElements = document.querySelectorAll('.hero-content > *');
    heroElements.forEach((el, index) => {
        setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 200);
    });
}

/* ========================================
   CUSTOM CURSOR
   ======================================== */
function initCursor() {
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');

    if (!cursor || !follower) return;

    let mouseX = 0, mouseY = 0;
    let cursorX = 0, cursorY = 0;
    let followerX = 0, followerY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    function animate() {
        // Cursor follows mouse directly
        cursorX += (mouseX - cursorX) * 0.2;
        cursorY += (mouseY - cursorY) * 0.2;
        cursor.style.left = cursorX - 5 + 'px';
        cursor.style.top = cursorY - 5 + 'px';

        // Follower has more delay
        followerX += (mouseX - followerX) * 0.1;
        followerY += (mouseY - followerY) * 0.1;
        follower.style.left = followerX - 20 + 'px';
        follower.style.top = followerY - 20 + 'px';

        requestAnimationFrame(animate);
    }
    animate();

    // Hover effects
    const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-node');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(2)';
            follower.style.transform = 'scale(1.5)';
            follower.style.opacity = '0.2';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            follower.style.transform = 'scale(1)';
            follower.style.opacity = '0.5';
        });
    });
}

/* ========================================
   PARTICLE SYSTEM
   ======================================== */
function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');

    let particles = [];
    let mouseX = 0;
    let mouseY = 0;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.hue = Math.random() * 30 + 180; // Blue range
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse interaction
            const dx = mouseX - this.x;
            const dy = mouseY - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x -= dx * force * 0.02;
                this.y -= dy * force * 0.02;
            }

            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${this.hue}, 100%, 60%, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles — reduced for performance, honors reduced-motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    const particleCount = Math.min(60, Math.floor(window.innerWidth * window.innerHeight / 25000));
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(0, 212, 255, ${0.1 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    let rafId;
    let paused = false;
    function animate() {
        if (paused || document.hidden) { rafId = requestAnimationFrame(animate); return; }
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(particle => { particle.update(); particle.draw(); });
        drawConnections();
        rafId = requestAnimationFrame(animate);
    }
    animate();
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) paused = true; else { paused = false; if (!rafId) animate(); }
    });
}

/* ========================================
   NAVIGATION
   ======================================== */
function initNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    // Smooth scroll
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const target = document.querySelector(targetId);

            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });

                // Close mobile nav if open
                document.querySelector('.nav-links').classList.remove('active');
            }
        });
    });

    // Active section on scroll
    window.addEventListener('scroll', () => {
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;

            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('data-section') === current) {
                link.classList.add('active');
            }
        });
    });
}

/* ========================================
   TYPING EFFECT
   ======================================== */
function initTypingEffect() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const roles = [
        'Game Programmer',
        'Tools Programmer',
        'Unreal C++ Learner',
        'Verse Programmer',
        'UEFN Developer'
    ];

    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentRole = roles[roleIndex];

        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 2000; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500; // Pause before next word
        }

        setTimeout(type, typeSpeed);
    }

    // Start after loader
    setTimeout(type, 2000);
}

/* ========================================
   SCROLL ANIMATIONS
   ======================================== */
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                entry.target.classList.add('visible');

                // Trigger XP bar animations when about section is visible
                if (entry.target.closest('#about')) {
                    animateXPBars();
                }
            }
        });
    }, observerOptions);

    // Observe reveal elements - start them hidden
    const revealElements = document.querySelectorAll('.timeline-content, .project-card, .skill-category, .about-card, .about-xp, .contact-info, .contact-terminal, .journey-season');
    revealElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease';
        observer.observe(el);
    });

    // Check if elements are already visible on page load
    setTimeout(() => {
        revealElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight && rect.bottom > 0) {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
                el.classList.add('visible');
            }
        });
    }, 100);
}

/* ========================================
   COUNTER ANIMATION
   ======================================== */
function initCounters() {
    const counters = document.querySelectorAll('.stat-value');
    let animated = false;

    function animateCounters() {
        if (animated) return;

        counters.forEach(counter => {
            const target = parseInt(counter.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.floor(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };

            updateCounter();
        });

        animated = true;
    }

    // Trigger when hero section is visible
    const heroSection = document.querySelector('.hero');
    const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
            setTimeout(animateCounters, 1500);
        }
    }, { threshold: 0.5 });

    observer.observe(heroSection);
}

/* ========================================
   XP BARS ANIMATION
   ======================================== */
let xpAnimated = false;

function initXPBars() {
    // XP bars are animated in scroll animations
}

function animateXPBars() {
    if (xpAnimated) return;

    const xpFills = document.querySelectorAll('.xp-fill');
    xpFills.forEach((fill, index) => {
        setTimeout(() => {
            const width = fill.getAttribute('data-width');
            fill.style.width = width + '%';
        }, index * 200);
    });

    xpAnimated = true;
}

/* ========================================
   PROJECT FILTER
   ======================================== */
function initProjectFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                if (filter === 'all' || category === filter) {
                    card.style.display = 'block';
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(() => {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
}

/* ========================================
   MOBILE NAVIGATION
   ======================================== */
function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (!toggle || !navLinks) return;

    toggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        toggle.classList.toggle('active');
    });

    // Close on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
            toggle.classList.remove('active');
        });
    });
}

/* ========================================
   PARALLAX EFFECTS
   ======================================== */
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;

    // Hero parallax
    const heroContent = document.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight);
    }
});

/* ========================================
   GLITCH EFFECT ON HOVER
   ======================================== */
document.querySelectorAll('.glitch').forEach(el => {
    el.addEventListener('mouseenter', () => {
        el.style.animation = 'glitch 0.3s infinite';
    });

    el.addEventListener('mouseleave', () => {
        el.style.animation = '';
    });
});

/* ========================================
   3D CARD TILT EFFECT
   ======================================== */
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

/* ========================================
   SKILL NODE HOVER EFFECT
   ======================================== */
document.querySelectorAll('.skill-node').forEach(node => {
    node.addEventListener('mouseenter', () => {
        // Add glow pulse effect
        node.style.boxShadow = '0 0 30px rgba(0, 212, 255, 0.4), inset 0 0 20px rgba(0, 212, 255, 0.1)';
    });

    node.addEventListener('mouseleave', () => {
        node.style.boxShadow = '';
    });
});

/* ========================================
   CONSOLE EASTER EGG
   ======================================== */
console.log('%c⚡ Welcome to Rishabh Patel\'s Portfolio ⚡',
    'color: #00d4ff; font-size: 20px; font-weight: bold; text-shadow: 0 0 10px #00d4ff;');
console.log('%cGame Programmer | Tools Programmer',
    'color: #a0a0b0; font-size: 14px;');
console.log('%c🎮 Looking for the source code? Check out my GitHub!',
    'color: #00ff88; font-size: 12px;');
