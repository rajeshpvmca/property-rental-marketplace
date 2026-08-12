// Premium Preloader Logic with CSS Particles
document.addEventListener('DOMContentLoaded', () => {
    const particleContainer = document.getElementById('preloader-particles');
    if (particleContainer) {
        // Generate 40 particles for the background
        for (let i = 0; i < 40; i++) {
            const particle = document.createElement('div');
            particle.classList.add('css-particle');
            
            // Randomize position, size, and animation duration
            const size = Math.random() * 4 + 2; // 2px to 6px
            const left = Math.random() * 100; // 0% to 100%
            const duration = Math.random() * 2 + 2; // 2s to 4s
            const delay = Math.random() * 2; // 0s to 2s
            
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            particle.style.left = left + '%';
            particle.style.animationDuration = duration + 's';
            particle.style.animationDelay = delay + 's';
            
            particleContainer.appendChild(particle);
        }
    }
});

window.addEventListener('load', () => {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('loaded');
        }, 2000); // 2 second display
    }
});
document.addEventListener('DOMContentLoaded', async () => {
    // 0. Load Header and Footer
    await loadComponents();

    // 1. Initialize AOS (Animate On Scroll)
    AOS.init({
        duration: 1000,
        easing: 'ease-in-out',
        once: true,
        mirror: false,
        offset: 50
    });

    // 2. Navbar Scroll Effect (Needs to be attached after header is loaded)
    attachNavbarScroll();

    // 3. Initialize Counters
    initCounters();

    // 4. Initialize Swiper for Hero Section (if exists)
    if (document.querySelector('.hero-slider')) {
        const heroSwiper = new Swiper('.hero-slider', {
            loop: true,
            effect: 'fade',
            speed: 1500,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
        });
    }

    // 4.5. Initialize Testimonial Slider
    if (document.querySelector('.testimonial-slider')) {
        const testimonialSwiper = new Swiper('.testimonial-slider', {
            loop: true,
            autoplay: {
                delay: 4000,
                disableOnInteraction: false,
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            spaceBetween: 30,
            breakpoints: {
                320: { slidesPerView: 1, spaceBetween: 20 },
                768: { slidesPerView: 2, spaceBetween: 30 },
                992: { slidesPerView: 3, spaceBetween: 30 }
            }
        });
    }

    // 4. Initialize Three.js Background Animation (if canvas container exists)
    const threejsContainer = document.getElementById('threejs-canvas');
    if (threejsContainer) {
        initThreeJS(threejsContainer);
    }
});

async function loadComponents() {
    try {
        const headerPlaceholder = document.getElementById('header-placeholder');
        if (headerPlaceholder) {
            const headerResponse = await fetch('header.html');
            const headerHtml = await headerResponse.text();
            headerPlaceholder.outerHTML = headerHtml;
            
            // Set active class based on current URL
            const currentPage = window.location.pathname.split('/').pop() || 'index.html';
            document.querySelectorAll('.navbar-nav .nav-link').forEach(link => {
                if (link.getAttribute('data-page') === currentPage) {
                    link.classList.add('active');
                } else {
                    link.classList.remove('active');
                }
            });
        }

        const footerPlaceholder = document.getElementById('footer-placeholder');
        if (footerPlaceholder) {
            const footerResponse = await fetch('footer.html');
            const footerHtml = await footerResponse.text();
            footerPlaceholder.outerHTML = footerHtml;
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }
}

function attachNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        // Initial check in case page is already scrolled down on load
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        }
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }
}

function initThreeJS(container) {
    const scene = new THREE.Scene();
    
    // Camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 30;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Particles
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 700;
    const posArray = new Float32Array(particlesCount * 3);

    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 100;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    const material = new THREE.PointsMaterial({
        size: 0.1,
        color: 0x06b6d4,
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particlesMesh = new THREE.Points(particlesGeometry, material);
    scene.add(particlesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    
    document.addEventListener('mousemove', (event) => {
        mouseX = event.clientX / window.innerWidth - 0.5;
        mouseY = event.clientY / window.innerHeight - 0.5;
    });

    // Animation Loop
    const clock = new THREE.Clock();

    const tick = () => {
        const elapsedTime = clock.getElapsedTime();

        particlesMesh.rotation.y = elapsedTime * 0.05;
        particlesMesh.rotation.x = elapsedTime * 0.02;

        // Smooth mouse interaction
        particlesMesh.position.x += (mouseX * 5 - particlesMesh.position.x) * 0.05;
        particlesMesh.position.y += (-mouseY * 5 - particlesMesh.position.y) * 0.05;

        renderer.render(scene, camera);
        window.requestAnimationFrame(tick);
    }

    tick();

    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
}

// Counter Animation
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 100;

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const target = +counter.getAttribute('data-target');
                
                const updateCount = () => {
                    const count = +counter.innerText;
                    const inc = target / speed;

                    if (count < target) {
                        counter.innerText = Math.ceil(count + inc);
                        setTimeout(updateCount, 20);
                    } else {
                        counter.innerText = target;
                    }
                };
                
                updateCount();
                observer.unobserve(counter);
            }
        });
    }, { threshold: 0.5 });

    counters.forEach(counter => {
        observer.observe(counter);
    });
}


