document.addEventListener('DOMContentLoaded', () => {
    // --- Typewriter Effect ---
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const words = ["Creative Software Engineer", "AI/ML Enthusiast", "Full Stack Developer", "Problem Solver"];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentWord = words[wordIndex];
            const displayText = isDeleting
                ? currentWord.substring(0, charIndex - 1)
                : currentWord.substring(0, charIndex + 1);

            typewriterElement.textContent = displayText;
            charIndex = isDeleting ? charIndex - 1 : charIndex + 1;

            if (!isDeleting && charIndex === currentWord.length) {
                isDeleting = true;
                typeSpeed = 1500; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                typeSpeed = 500;
            } else {
                typeSpeed = isDeleting ? 50 : 100;
            }

            setTimeout(type, typeSpeed);
        }
        type();
    }

    // --- Scroll Reveal Animations ---
    const revealElements = document.querySelectorAll('[data-reveal]');
    console.log("Reveal elements found:", revealElements.length);

    const observerOptions = {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, observerOptions);

    revealElements.forEach(el => revealObserver.observe(el));

    // --- 3D Hover Effects ---
    const cards = document.querySelectorAll('.image-3d-inner, .project-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 15;
            const rotateY = (centerX - x) / 15;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `rotateX(0) rotateY(0)`;
        });
    });

    // --- Navigation Highlights & Scroll Progress ---
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const progressBar = document.getElementById('scroll-progress');

    window.addEventListener('scroll', () => {
        // Scroll Progress
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        if (progressBar) progressBar.style.width = scrolled + "%";

        // Nav Active Link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });

    // --- Parallax Effect ---
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        document.querySelectorAll('[data-parallax]').forEach(el => {
            const speed = el.getAttribute('data-parallax');
            el.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });

    // --- Contact Form Animation ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.textContent;

            btn.disabled = true;
            btn.textContent = 'Sending...';

            setTimeout(() => {
                btn.textContent = 'Message Sent! ✨';
                btn.style.background = '#28a745';
                contactForm.reset();

                setTimeout(() => {
                    btn.disabled = false;
                    btn.textContent = originalText;
                    btn.style.background = '';
                }, 3000);
            }, 1500);
        });
    }
    // --- Code Particle Animation (About Image) ---
    const particleContainer = document.getElementById('code-particles');
    if (particleContainer) {
        const createParticle = () => {
            const particle = document.createElement('span');
            particle.className = 'code-particle';
            particle.textContent = Math.random() > 0.5 ? '1' : '0';

            // Random horizontal position
            particle.style.left = Math.random() * 100 + '%';

            // Random size/speed variations
            const duration = 2 + Math.random() * 3;
            particle.style.animationDuration = duration + 's';
            particle.style.fontSize = (10 + Math.random() * 10) + 'px';

            particleContainer.appendChild(particle);

            // Cleanup
            setTimeout(() => {
                particle.remove();
            }, duration * 1000);
        };

        // Spawn particles continuously
        setInterval(createParticle, 150);
    }

    // --- Custom Cursor ---
    const cursor = document.querySelector('.custom-cursor');
    const cursorOutline = document.querySelector('.custom-cursor-outline');

    if (cursor && cursorOutline) {
        window.addEventListener('mousemove', (e) => {
            const posX = e.clientX;
            const posY = e.clientY;

            // Basic cursor position
            cursor.style.transform = `translate(${posX - 10}px, ${posY - 10}px)`;

            // Outline cursor position with lag effect
            cursorOutline.animate({
                transform: `translate(${posX - 20}px, ${posY - 20}px)`
            }, { duration: 500, fill: "forwards" });
        });

        // Effect on click
        window.addEventListener('mousedown', () => {
            cursor.style.transform += ' scale(0.8)';
            cursorOutline.style.transform += ' scale(1.2)';
        });
        window.addEventListener('mouseup', () => {
            cursor.style.transform = cursor.style.transform.replace(' scale(0.8)', '');
            cursorOutline.style.transform = cursorOutline.style.transform.replace(' scale(1.2)', '');
        });
    }

    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
            const isLight = document.body.classList.contains('light-mode');
            themeToggle.innerHTML = isLight ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';

            // Proactive: Update 3D scene colors if main scene exists
            if (window.appScene) {
                // This would require reaching into the ThreeScene instance
                // For now, the alpha: true renderer handles BG changes automatically
            }
        });
    }

    // --- Background Music ---
    const musicToggle = document.getElementById('music-toggle');
    // Using a subtle, relaxing synthwave track
    const audio = new Audio('https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    let isPlaying = false;

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (isPlaying) {
                audio.pause();
                musicToggle.innerHTML = '<i class="fa-solid fa-volume-xmark"></i>';
            } else {
                audio.play().catch(e => console.log("Audio play blocked by browser. Interaction required."));
                musicToggle.innerHTML = '<i class="fa-solid fa-volume-high"></i>';
            }
            isPlaying = !isPlaying;
        });
    }
});
