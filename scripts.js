// Global function for onclick attributes if any exist
function enroll(course) {
    alert('You have selected: ' + course + '\nOur team will contact you soon!');
}

// --- Preloader ---
const preloader = document.getElementById('preloader');
if (preloader) {
    window.addEventListener('load', () => {
        preloader.classList.add('fade-out');
    });
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

    // --- Animated Counters (index.html) ---
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const counter = entry.target;
                    const updateCount = () => {
                        const target = +counter.getAttribute('data-target');
                        const count = +counter.innerText;
                        const increment = target / 200; // Adjust speed of animation

                        if (count < target) {
                            counter.innerText = `${Math.ceil(count + increment)}`;
                            setTimeout(updateCount, 1);
                        } else {
                            counter.innerText = target; // Ensure it ends on the exact target
                        }
                    };
                    updateCount();
                    observer.unobserve(counter); // Animate only once
                }
            });
        }, {
            threshold: 0.5
        });

        counters.forEach(counter => {
            counterObserver.observe(counter);
        });
    }

    // --- Cookie Consent Banner ---
    const cookieBanner = document.getElementById('cookie-banner');
    if (cookieBanner) {
        const acceptCookiesButton = document.getElementById('accept-cookies');
        
        // Show banner if consent not given
        if (!localStorage.getItem('cookie_consent')) {
            // Use a timeout to avoid layout shift issues and let the page render first
            setTimeout(() => {
                cookieBanner.classList.add('is-visible');
            }, 1500);
        }

        // Handle accept button click
        if (acceptCookiesButton) {
            acceptCookiesButton.addEventListener('click', () => {
                localStorage.setItem('cookie_consent', 'true');
                cookieBanner.classList.remove('is-visible');
            });
        }
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

    // --- Table of Contents (blog-post-1.html) ---
    const tocContainer = document.getElementById('toc-container');
    if (tocContainer) {
        const tocList = document.getElementById('toc-list');
        const articleContent = document.querySelector('.blog-post-content');
        const headings = articleContent.querySelectorAll('h3');

        if (headings.length > 0) {
            headings.forEach(heading => {
                const title = heading.innerText;
                // Create a URL-friendly ID
                const id = title.trim().toLowerCase().replace(/\s+/g, '-').replace(/[?]/g, '');
                heading.id = id;

                const listItem = document.createElement('li');
                listItem.innerHTML = `<a href="#${id}" class="toc-link">${title}</a>`;
                tocList.appendChild(listItem);

                // --- Scroll Spy Logic ---
                // Observe the heading to highlight the TOC link
                const observer = new IntersectionObserver(entries => {
                    entries.forEach(entry => {
                        const id = entry.target.getAttribute('id');
                        const link = document.querySelector(`.toc-link[href="#${id}"]`);
                        
                        if (entry.isIntersecting) {
                            // Remove active class from all links
                            document.querySelectorAll('.toc-link').forEach(l => l.classList.remove('active'));
                            // Add active class to current link
                            if (link) link.classList.add('active');
                        }
                    });
                }, {
                    rootMargin: '-100px 0px -66% 0px', // Trigger when heading is in the top third of screen
                    threshold: 0
                });
                
                observer.observe(heading);
            });
        } else {
            // If no h3s are found, hide the TOC container
            tocContainer.style.display = 'none';
        }
    }

    // --- Blog Page Logic (blog.html) ---
    const blogPageContainer = document.getElementById('blog-posts-container');
    if (blogPageContainer) {
        const searchInput = document.getElementById('blog-search');
        const paginationContainer = document.getElementById('pagination-container');
        const allPosts = Array.from(blogPageContainer.querySelectorAll('.blog-post-item'));
        const postsPerPage = 3; // Number of posts per page
        let currentPage = 1;

        const renderPagination = (totalPages) => {
            paginationContainer.innerHTML = '';

            if (totalPages <= 1) return;

            // Previous Button
            const prevLi = document.createElement('li');
            prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
            prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>`;
            prevLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage > 1) {
                    currentPage--;
                    updatePostVisibility();
                    // Scroll to top of blog section
                    document.getElementById('blog-search').scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            paginationContainer.appendChild(prevLi);

            // Page Numbers
            for (let i = 1; i <= totalPages; i++) {
                const li = document.createElement('li');
                li.className = `page-item ${i === currentPage ? 'active' : ''}`;
                li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
                li.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentPage = i;
                    updatePostVisibility();
                    document.getElementById('blog-search').scrollIntoView({ behavior: 'smooth', block: 'center' });
                });
                paginationContainer.appendChild(li);
            }

            // Next Button
            const nextLi = document.createElement('li');
            nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
            nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>`;
            nextLi.addEventListener('click', (e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                    currentPage++;
                    updatePostVisibility();
                    document.getElementById('blog-search').scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
            paginationContainer.appendChild(nextLi);
        };

        const updatePostVisibility = () => {
            const searchTerm = searchInput.value.toLowerCase();
            
            // Filter posts based on search
            const filteredPosts = allPosts.filter(post => {
                const title = post.querySelector('.card-title').textContent.toLowerCase();
                return title.includes(searchTerm);
            });

            const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
            
            // Adjust current page if it exceeds total pages after search filtering
            if (currentPage > totalPages) currentPage = 1;

            const startIndex = (currentPage - 1) * postsPerPage;
            const endIndex = startIndex + postsPerPage;

            // Hide all posts first
            allPosts.forEach(post => {
                post.style.display = 'none';
            });

            // Show posts for current page
            filteredPosts.slice(startIndex, endIndex).forEach(post => {
                post.style.display = 'block';
            });

            renderPagination(totalPages);
        };

        if (searchInput) {
            searchInput.addEventListener('keyup', () => {
                currentPage = 1; // Reset to page 1 on new search
                updatePostVisibility();
            });
        }

        // Initial setup
        updatePostVisibility();
    }

    // --- Newsletter Form ---
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            alert(`Thank you for subscribing with ${emailInput.value}!`);
            emailInput.value = '';
        });
    }

    // --- Social Share Buttons (blog-post-1.html) ---
    const shareTwitter = document.getElementById('share-twitter');
    const shareLinkedIn = document.getElementById('share-linkedin');
    const copyLinkBtn = document.getElementById('copy-link-btn');

    if (shareTwitter && shareLinkedIn && copyLinkBtn) {
        const postUrl = window.location.href;
        const postTitle = document.querySelector('h1').innerText;

        shareTwitter.addEventListener('click', (e) => {
            e.preventDefault();
            const twitterUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(postUrl)}&text=${encodeURIComponent(postTitle)}`;
            window.open(twitterUrl, '_blank', 'width=600,height=400');
        });

        shareLinkedIn.addEventListener('click', (e) => {
            e.preventDefault();
            const linkedInUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(postUrl)}&title=${encodeURIComponent(postTitle)}`;
            window.open(linkedInUrl, '_blank', 'width=600,height=600');
        });

        copyLinkBtn.addEventListener('click', () => {
            navigator.clipboard.writeText(postUrl).then(() => {
                const copyLinkText = document.getElementById('copy-link-text');
                copyLinkText.innerText = 'Copied!';
                setTimeout(() => {
                    copyLinkText.innerText = 'Copy Link';
                }, 2000);
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        });
    }

    // --- Comment Form (blog-post-1.html) ---
    const commentForm = document.getElementById('comment-form');
    if (commentForm) {
        commentForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const nameInput = document.getElementById('comment-name');
            const commentInput = document.getElementById('comment-text');
            const commentsContainer = document.getElementById('comments-container');
            const commentCount = document.getElementById('comment-count');

            const name = nameInput.value.trim();
            const commentText = commentInput.value.trim();

            if (name && commentText) {
                const newComment = document.createElement('div');
                newComment.classList.add('d-flex', 'mb-4');
                // Basic sanitization to prevent HTML injection
                const sanitizedName = name.replace(/</g, "&lt;").replace(/>/g, "&gt;");
                const sanitizedComment = commentText.replace(/</g, "&lt;").replace(/>/g, "&gt;");

                newComment.innerHTML = `
                    <img src="https://i.pravatar.cc/150?u=${Math.random()}" class="rounded-circle me-3" alt="${sanitizedName}" width="50" height="50">
                    <div>
                        <h6 class="fw-bold mb-1">${sanitizedName}</h6>
                        <p class="text-white-50 mb-1">${sanitizedComment}</p>
                        <small class="text-white-50">${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</small>
                    </div>
                `;
                commentsContainer.prepend(newComment);

                commentCount.innerText = parseInt(commentCount.innerText) + 1;

                nameInput.value = '';
                commentInput.value = '';
            }
        });
    }
});