document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const navLinks = document.querySelectorAll('nav a');
    const darkModeToggle = document.getElementById('dark-mode-toggle');
    const body = document.body;

    // Custom cursor
    const cursor = document.querySelector('.cursor');
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Animate sections on scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(section => section.classList.add('fade-in'));

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        updateDarkModeIcon();
        saveDarkModePreference();
    });

    // Function to update dark mode icon
    function updateDarkModeIcon() {
        const icon = darkModeToggle.querySelector('i');
        if (body.classList.contains('dark-mode')) {
            icon.classList.remove('fa-moon');
            icon.classList.add('fa-sun');
        } else {
            icon.classList.remove('fa-sun');
            icon.classList.add('fa-moon');
        }
    }

    // Function to save dark mode preference
    function saveDarkModePreference() {
        localStorage.setItem('darkMode', body.classList.contains('dark-mode'));
    }

    // Function to load dark mode preference
    function loadDarkModePreference() {
        const darkMode = localStorage.getItem('darkMode');
        if (darkMode === 'true') {
            body.classList.add('dark-mode');
            updateDarkModeIcon();
        }
    }

    // Load dark mode preference on page load
    loadDarkModePreference();

    // Smooth scrolling for navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            const headerOffset = 70;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        });
    });

    // Add this function to your existing JavaScript file

    function smoothScroll(target, duration) {
        var target = document.querySelector(target);
        var targetPosition = target.getBoundingClientRect().top;
        var startPosition = window.pageYOffset;
        var distance = targetPosition - startPosition;
        var startTime = null;

        function animation(currentTime) {
            if (startTime === null) startTime = currentTime;
            var timeElapsed = currentTime - startTime;
            var run = ease(timeElapsed, startPosition, distance, duration);
            window.scrollTo(0, run);
            if (timeElapsed < duration) requestAnimationFrame(animation);
        }

        function ease(t, b, c, d) {
            t /= d / 2;
            if (t < 1) return c / 2 * t * t + b;
            t--;
            return -c / 2 * (t * (t - 2) - 1) + b;
        }

        requestAnimationFrame(animation);
    }

    // Add event listeners for smooth scrolling
    var links = document.querySelectorAll("a[href^='#']");

    links.forEach(function(link) {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            var target = this.getAttribute('href');
            smoothScroll(target, 1000);
        });
    });

    // Form submission
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        
        try {
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                // Clear the form
                contactForm.reset();
                // Show a success message
                showNotification('Thank you for your message! I will get back to you soon.');
            } else {
                throw new Error('Form submission failed');
            }
        } catch (error) {
            console.error('Error:', error);
            showNotification('Oops! There was a problem sending your message. Please try again later.');
        }
    });

    // Notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#2ecc71';
        notification.style.color = '#fff';
        notification.style.padding = '1rem';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.2)';
        notification.style.transition = 'opacity 0.3s ease';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Add this new function
    function updateActiveNavItem() {
        const sections = document.querySelectorAll('section');
        const navItems = document.querySelectorAll('nav ul li a');

        let currentSectionId = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.pageYOffset >= sectionTop - 150) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${currentSectionId}`) {
                item.classList.add('active');
            }
        });
    }

    // Call the function on scroll
    window.addEventListener('scroll', updateActiveNavItem);

    // Call the function on page load
    updateActiveNavItem();

    // Horizontal scrolling for projects
    const projectGrid = document.querySelector('.project-grid');
    let isDown = false;
    let startX;
    let scrollLeft;

    projectGrid.addEventListener('mousedown', (e) => {
        isDown = true;
        startX = e.pageX - projectGrid.offsetLeft;
        scrollLeft = projectGrid.scrollLeft;
    });

    projectGrid.addEventListener('mouseleave', () => {
        isDown = false;
    });

    projectGrid.addEventListener('mouseup', () => {
        isDown = false;
    });

    projectGrid.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - projectGrid.offsetLeft;
        const walk = (x - startX) * 2;
        projectGrid.scrollLeft = scrollLeft - walk;
    });
});
