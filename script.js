document.addEventListener('DOMContentLoaded', () => {
            
            // 1. Page Load Animation
            const pageTransition = document.getElementById('pageTransition');
            setTimeout(() => {
                pageTransition.style.transition = 'transform 0.8s cubic-bezier(0.76, 0, 0.24, 1)';
                pageTransition.style.transform = 'translateY(-100%)';
                
                // Trigger hero elements after transition
                setTimeout(() => {
                    document.querySelectorAll('.hero-elem').forEach((el, index) => {
                        setTimeout(() => {
                            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            el.style.opacity = '1';
                            el.style.transform = 'translateY(0)';
                        }, index * 150);
                    });
                    
                    document.querySelectorAll('.hero-elem-right').forEach((el, index) => {
                        setTimeout(() => {
                            el.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
                            el.style.opacity = '1';
                            if(el.classList.contains('hero-bg-circle')) {
                                el.style.transform = 'translate(-50%, -50%) scale(1)';
                            }
                        }, 600 + (index * 150));
                    });
                }, 400);
            }, 100);

            // 2. Custom Lerp Cursor
            const cursor = document.getElementById('cursor');
            let mouseX = window.innerWidth / 2, mouseY = window.innerHeight / 2;
            let cursorX = mouseX, cursorY = mouseY;
            const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

            if (!isTouchDevice) {
                document.addEventListener('mousemove', (e) => {
                    mouseX = e.clientX;
                    mouseY = e.clientY;
                });

                const animateCursor = () => {
                    let distX = mouseX - cursorX;
                    let distY = mouseY - cursorY;
                    cursorX += distX * 0.15; // Lerp factor
                    cursorY += distY * 0.15;
                    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
                    requestAnimationFrame(animateCursor);
                };
                animateCursor();

                // Cursor Hover States
                const interactives = document.querySelectorAll('.interactive, a, button');
                interactives.forEach(el => {
                    el.addEventListener('mouseenter', () => cursor.classList.add('grow'));
                    el.addEventListener('mouseleave', () => cursor.classList.remove('grow'));
                });
            } else {
                cursor.style.display = 'none';
            }

            // 3. Scroll & Navbar Progress
            const navbar = document.getElementById('navbar');
            const scrollProgress = document.getElementById('scrollProgress');
            const backToTop = document.getElementById('backToTop');

            window.addEventListener('scroll', () => {
                let scrollTop = window.scrollY;
                let docHeight = document.body.scrollHeight - window.innerHeight;
                
                // Progress bar
                let scrollPercent = (scrollTop / docHeight) * 100;
                scrollProgress.style.width = scrollPercent + '%';

                // Navbar Blur
                if (scrollTop > 100) navbar.classList.add('scrolled');
                else navbar.classList.remove('scrolled');

                // Back to Top
                if (scrollTop > 600) backToTop.classList.add('visible');
                else backToTop.classList.remove('visible');
            }, { passive: true });

            backToTop.addEventListener('click', () => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
            });

            // 4. Mobile Menu
            const hamburger = document.getElementById('hamburger');
            const mobileMenu = document.getElementById('mobileMenu');
            const mobileOverlay = document.getElementById('mobileOverlay');
            const menuLinks = document.querySelectorAll('.menu-link');

            function toggleMenu() {
                hamburger.classList.toggle('active');
                mobileMenu.classList.toggle('active');
                mobileOverlay.classList.toggle('active');
                document.body.style.overflow = hamburger.classList.contains('active') ? 'hidden' : '';
            }

            hamburger.addEventListener('click', toggleMenu);
            mobileOverlay.addEventListener('click', toggleMenu);
            menuLinks.forEach(link => link.addEventListener('click', toggleMenu));

            // 5. Intersection Observer (Scroll Reveal & Counters)
            const revealElements = document.querySelectorAll('.reveal');
            const counterElements = document.querySelectorAll('.counter');
            
            const observerOptions = { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 };

            const observer = new IntersectionObserver((entries, obs) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('active');
                        
                        // Handle stagger children
                        const staggers = entry.target.querySelectorAll('.reveal-stagger');
                        staggers.forEach((el, i) => {
                            el.style.transitionDelay = `${i * 0.15}s`;
                        });

                        // Handle Counters
                        if (entry.target.classList.contains('counter')) {
                            startCounter(entry.target);
                        }
                        
                        obs.unobserve(entry.target); // Run once
                    }
                });
            }, observerOptions);

            revealElements.forEach(el => observer.observe(el));
            counterElements.forEach(el => observer.observe(el));

            // Counter Logic
            function startCounter(el) {
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 2000; // 2 seconds
                let start = null;
                
                function easeOutExpo(t) {
                    return t === 1 ? 1 : 1 - Math.pow(2, -10 * t);
                }

                function animation(currentTime) {
                    if (!start) start = currentTime;
                    const progress = currentTime - start;
                    const timeRatio = Math.min(progress / duration, 1);
                    const easeRatio = easeOutExpo(timeRatio);
                    
                    let currentNum = Math.floor(easeRatio * target);
                    
                    // Format with comma if >= 1000
                    let displayStr = currentNum >= 1000 ? (currentNum/1000).toFixed(1).replace('.0','') + 'K' : currentNum;
                    el.innerText = displayStr + "+";

                    if (progress < duration) {
                        requestAnimationFrame(animation);
                    } else {
                        let finalStr = target >= 1000 ? (target/1000).toFixed(1).replace('.0','') + 'K' : target;
                        el.innerText = finalStr + "+";
                    }
                }
                requestAnimationFrame(animation);
            }

            // 6. Tabs (How It Works)
            const tabBtns = document.querySelectorAll('.tab-btn');
            const tabPanes = document.querySelectorAll('.tab-pane');
            const tabIndicator = document.getElementById('tabIndicator');

            function updateIndicator(btn) {
                tabIndicator.style.width = `${btn.offsetWidth}px`;
                tabIndicator.style.left = `${btn.offsetLeft}px`;
            }

            // Init indicator
            if(tabBtns.length > 0) updateIndicator(tabBtns[0]);

            tabBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    // Update buttons
                    tabBtns.forEach(b => b.classList.remove('active'));
                    btn.classList.add('active');
                    updateIndicator(btn);

                    // Update panes
                    const targetTab = btn.getAttribute('data-tab');
                    tabPanes.forEach(pane => {
                        pane.classList.remove('active');
                        if (pane.id === `pane-${targetTab}`) {
                            pane.classList.add('active');
                        }
                    });
                });
            });

            // 7. Accordion (Why Localyse)
            const accItems = document.querySelectorAll('.accordion-item');
            
            // Set initial heights
            accItems.forEach(item => {
                if(item.classList.contains('active')) {
                    const content = item.querySelector('.accordion-content');
                    content.style.maxHeight = content.scrollHeight + 40 + "px"; // + padding
                }
            });

            accItems.forEach(item => {
                const header = item.querySelector('.accordion-header');
                header.addEventListener('click', () => {
                    const isActive = item.classList.contains('active');
                    
                    // Close all
                    accItems.forEach(acc => {
                        acc.classList.remove('active');
                        acc.querySelector('.accordion-content').style.maxHeight = null;
                        acc.querySelector('.acc-icon').innerText = '+';
                    });

                    // Open clicked if it wasn't active
                    if (!isActive) {
                        item.classList.add('active');
                        const content = item.querySelector('.accordion-content');
                        content.style.maxHeight = content.scrollHeight + 40 + "px";
                        item.querySelector('.acc-icon').innerText = '×';
                    }
                });
            });

            // 8. Smooth Scroll for Nav Anchor Links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    const targetId = this.getAttribute('href');
                    if (targetId === '#') return;
                    
                    const targetElement = document.querySelector(targetId);
                    if (targetElement) {
                        e.preventDefault();
                        const headerOffset = 72;
                        const elementPosition = targetElement.getBoundingClientRect().top;
                        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                        
                        window.scrollTo({
                            top: offsetPosition,
                            behavior: "smooth"
                        });
                    }
                });
            });
            
            // Handle window resize for indicator
            window.addEventListener('resize', () => {
                const activeBtn = document.querySelector('.tab-btn.active');
                if(activeBtn) updateIndicator(activeBtn);
            });
        });