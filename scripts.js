// Global function for onclick attributes if any exist
function enroll(course) {
    alert('You have selected: ' + course + '\nOur team will contact you soon!');
}

document.addEventListener('DOMContentLoaded', () => {
    // --- Theme Toggle ---
    const themeToggle = document.getElementById('theme-toggle');
    const themeToggleIcon = document.getElementById('theme-toggle-icon');
    const body = document.body;

    const applyTheme = (theme) => {
        if (theme === 'light') {
            body.classList.add('light-mode');
            if (themeToggle) themeToggle.checked = true;
            if (themeToggleIcon) {
                themeToggleIcon.classList.remove('bi-moon-stars-fill');
                themeToggleIcon.classList.add('bi-sun-fill');
            }
        } else {
            body.classList.remove('light-mode');
            if (themeToggle) themeToggle.checked = false;
            if (themeToggleIcon) {
                themeToggleIcon.classList.remove('bi-sun-fill');
                themeToggleIcon.classList.add('bi-moon-stars-fill');
            }
        }
    };

    if (themeToggle) {
        themeToggle.addEventListener('change', () => {
            const newTheme = themeToggle.checked ? 'light' : 'dark';
            localStorage.setItem('theme', newTheme);
            applyTheme(newTheme);
        });
    }

    // Apply theme on initial load
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    let currentTheme = savedTheme || (systemPrefersDark ? 'dark' : 'light');
    applyTheme(currentTheme);


    // --- Scroll Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Optional: unobserve after it's visible so it doesn't re-trigger
                // observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1 // Trigger when 10% of the element is visible
    });

    const sectionsToAnimate = document.querySelectorAll('.fade-in-section');
    sectionsToAnimate.forEach(section => {
        observer.observe(section);
    });

    // --- Navbar Scroll effect for sub-pages ---
    const scrollNavbar = document.querySelector('.navbar.navbar-on-scroll');
    if (scrollNavbar) {
        const handleScroll = () => {
            if (window.scrollY > 50) {
                scrollNavbar.classList.add('scrolled');
            } else {
                scrollNavbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Check state on page load
    }


    // --- Back to Top Button ---
    const backToTopButton = document.querySelector('.back-to-top');
    if (backToTopButton) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('is-visible');
            } else {
                backToTopButton.classList.remove('is-visible');
            }
        });

        backToTopButton.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // --- Contact Form (index.html) ---
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            alert('Thank you for contacting HelloDevOps!');
        });
    }

    // --- Blog Search (blog.html) ---
    const searchInput = document.getElementById('blog-search');
    if (searchInput) {
        const blogPosts = document.querySelectorAll('.blog-post-item');
        searchInput.addEventListener('keyup', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            blogPosts.forEach(post => {
                const title = post.querySelector('.card-title').textContent.toLowerCase();
                if (title.includes(searchTerm)) {
                    post.style.display = 'block';
                } else {
                    post.style.display = 'none';
                }
            });
        });
    }
});