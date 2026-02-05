// DOM Elements
const navToggle = document.getElementById('nav-toggle');
const navLinks = document.getElementById('nav-links');
const themeToggle = document.getElementById('theme-toggle');
const themeIcon = themeToggle.querySelector('i');
const contactForm = document.getElementById('contact-form');
const sections = document.querySelectorAll('.section');

// Hamburger Menu Toggle
navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Animate hamburger bars (optional: rotate or change to X)
    navToggle.classList.toggle('active');
});

// Smooth Scrolling for Nav Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
        // Close mobile menu after clicking a link
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Scroll Animations (Fade-in on scroll)
const observerOptions = {
    threshold: 0.1  // Trigger when 10% of the section is visible
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections for fade-in animation
sections.forEach(section => {
    observer.observe(section);
});

// Theme Toggle (Dark/Light Mode)
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Update icon
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    
    // Save theme preference to localStorage
    localStorage.setItem('theme', newTheme);
});

// Load saved theme on page load
const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

// Form Validation and Submission
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); // Prevent default form submission
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    // Validation flags
    let isValid = true;
    let errors = [];
    
    // Name validation
    if (name === '') {
        isValid = false;
        errors.push('Name is required.');
    }
    
    // Email validation (basic regex)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (email === '') {
        isValid = false;
        errors.push('Email is required.');
    } else if (!emailRegex.test(email)) {
        isValid = false;
        errors.push('Please enter a valid email address.');
    }
    
    // Message validation
    if (message === '') {
        isValid = false;
        errors.push('Message is required.');
    } else if (message.length < 10) {
        isValid = false;
        errors.push('Message must be at least 10 characters long.');
    }
    
    // Display errors or success
    const formGroup = contactForm.querySelector('.form-group:last-child');
    let errorDiv = formGroup.querySelector('.error-message');
    if (!errorDiv) {
        errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        formGroup.appendChild(errorDiv);
    }
    
    if (!isValid) {
        errorDiv.innerHTML = errors.join('<br>');
        errorDiv.style.color = 'red';
        errorDiv.style.marginTop = '10px';
    } else {
        errorDiv.innerHTML = 'Message sent successfully! (This is a demo - no actual email sent.)';
        errorDiv.style.color = 'green';
        // Reset form
        contactForm.reset();
    }
});

// Inside your existing script.js
contactForm.addEventListener('submit', (e) => {
    e.preventDefault(); 
    
    // ... (Your validation code for name, email, and message goes here) ...

    if (!isValid) {
        // ... (Show error messages) ...
    } else {
        // THIS IS THE MANDATORY AJAX PART
        const $btn = $(contactForm).find(".btn");
        $btn.prop("disabled", true).text("Sending...");

        $.ajax({
            url: "https://script.google.com/macros/s/AKfycbxrp-5JxHtVhURltY6hkJkUCELalF8AcMqZEMBJ3cBXZPczmYm4qi_IPPociDBKqB6ADQ/exec",
            method: "POST",
            data: $(contactForm).serialize(),
            success: function(response) {
                alert("Message received! Check your Excel sheet.");
                contactForm.reset();
                $btn.prop("disabled", false).text("Send Message");
            },
            error: function() {
                alert("Error sending message.");
                $btn.prop("disabled", false).text("Send Message");
            }
        });
    }
});