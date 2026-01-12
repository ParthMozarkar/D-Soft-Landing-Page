/**
 * D'SOFT WEBSITE CORE ENGINE
 */

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initScrollReveal();
    initFormHandling();
    initFaq();
    initTypewriter();
    initPopup();
    initMasterclassRedirects();
});

/**
 * Timed Pop-up Modal (6 Seconds)
 */
function initPopup() {
    const popup = document.getElementById('masterclass-popup');
    const closeBtn = document.getElementById('modal-close');
    const ctaBtn = document.getElementById('modal-cta');

    if (!popup) return;

    // Show popup after 2 seconds
    setTimeout(() => {
        console.log('Pop-up trigger fired');
        popup.classList.remove('hidden');
        popup.style.display = 'flex'; // Force display flex to override any potential CSS conflicts
        setTimeout(() => {
            popup.classList.add('show');
            popup.style.opacity = '1';
            popup.style.visibility = 'visible';
        }, 10);
    }, 2000);

    // Close on X
    closeBtn.addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.style.display = 'none', 500);
    });

    // Close on overlay click
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.classList.remove('show');
            setTimeout(() => popup.style.display = 'none', 500);
        }
    });

    // Close on CTA click
    ctaBtn.addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => popup.style.display = 'none', 500);
    });
}

/**
 * Typewriter Animation for Hero Heading & Urgency Bar
 */
function initTypewriter() {
    const typoElements = document.querySelectorAll('.typo-text');

    typoElements.forEach((el, index) => {
        const text = el.getAttribute('data-typo');
        const isUrgency = el.classList.contains('urgency-text');
        let i = 0;
        const speed = isUrgency ? 50 : 70; // faster for urgency
        const delay = isUrgency ? 500 : (index * 1000);

        function type() {
            if (i < text.length) {
                el.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                el.classList.add('typing-done');

                // If it's the urgency bar, restart after a delay for "continuous" attraction
                if (isUrgency) {
                    setTimeout(() => {
                        el.textContent = '';
                        i = 0;
                        el.classList.remove('typing-done');
                        type();
                    }, 3000); // Wait 3s before restarting
                }
            }
        }

        setTimeout(type, delay);
    });
}

/**
 * Navbar background change on scroll
 */
function initNavbar() {
    const nav = document.querySelector('.navbar');
    const mobileToggle = document.getElementById('mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            mobileToggle.classList.toggle('active');
            navLinks.classList.toggle('active');
        });

        // Close menu when a link is clicked
        navLinks.querySelectorAll('.n-link').forEach(link => {
            link.addEventListener('click', () => {
                mobileToggle.classList.remove('active');
                navLinks.classList.remove('active');
            });
        });
    }

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}

/**
 * Basic Scroll Reveal Animation
 */
function initScrollReveal() {
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Apply to various sections
    const animateElements = document.querySelectorAll('.problem-card, .path-card, .manifesto, .webinar-card, .faq-item, .faculty-card, .ardsoft-content');

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)';
        observer.observe(el);
    });

    // Custom CSS for reveal
    const style = document.createElement('style');
    style.innerHTML = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

/**
 * FAQ Accordion Interactivity
 */
function initFaq() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            // Close other items
            faqItems.forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
        });
    });
}

/**
 * Form Handling & Google Sheets Sync
 */
function initFormHandling() {
    const regForm = document.getElementById('google-sheet-form');

    if (regForm) {
        regForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const btn = regForm.querySelector('button');
            const data = {
                name: regForm.querySelector('input[name="Name"]').value,
                whatsapp: regForm.querySelector('input[name="Phone"]').value,
                course: regForm.querySelector('select[name="Course"]').value,
                timestamp: new Date().toLocaleString(),
                source: 'Dsoft/Ardsoft Registration'
            };

            // UI Feedback
            const originalText = btn.textContent;
            btn.innerHTML = '<span>Processing...</span>';
            btn.disabled = true;

            // Send to Google Sheets
            sendToRemoteStorage(data, () => {
                showSexySuccess(data);
                regForm.reset();
                btn.textContent = originalText;
                btn.disabled = false;
            });
        });
    }
}

/**
 * Sexy Success UI Transformation
 */
function showSexySuccess(data) {
    const formContainer = document.querySelector('.reg-form-container');
    const form = document.querySelector('.reg-form');
    const feedback = document.getElementById('form-success');

    // Smooth transition
    form.style.display = 'none';
    feedback.classList.remove('hidden');
    feedback.style.opacity = '0';
    feedback.style.transform = 'translateY(20px)';
    feedback.style.transition = 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)';

    // Update feedback text
    feedback.querySelector('h3').textContent = `READY TO START, ${data.name.split(' ')[0].toUpperCase()}?`;

    setTimeout(() => {
        feedback.style.opacity = '1';
        feedback.style.transform = 'translateY(0)';

        // Automated WhatsApp redirection after 2s
        setTimeout(() => {
            const waUrl = `https://wa.me/917972740441?text=Hi%20DSoft%20Team!%20My%20name%20is%20${encodeURIComponent(data.name)}.%20I%20just%20registered%20for%20the%20${encodeURIComponent(data.course)}%20session.%20I'm%20ready%20to%20master%20logic!`;
            window.open(waUrl, '_blank');
        }, 2000);
    }, 100);
}

/**
 * Send data to a Remote Cloud Endpoint
 * (Confirmed Working JSON Sync)
 */
function sendToRemoteStorage(data, callback) {
    const REMOTE_ENDPOINT = "https://script.google.com/macros/s/AKfycbzleYjdbAb0P_UkdZ8n5M3k0dujSo84RosTQr1tQg-XucNn3uRLfEiXLiHEDiEVS9nW/exec";

    // Backup locally
    let registrations = JSON.parse(localStorage.getItem('dsoft_cloud_backup') || '[]');
    registrations.push(data);
    localStorage.setItem('dsoft_cloud_backup', JSON.stringify(registrations));

    // Send as JSON (Confirmed working with your existing script)
    fetch(REMOTE_ENDPOINT, {
        method: "POST",
        mode: "no-cors",
        cache: "no-cache",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
    }).then(() => {
        console.log("Cloud Sync Successful");
        callback();
    }).catch(err => {
        console.warn("Cloud Sync Failed", err);
        callback();
    });
}
