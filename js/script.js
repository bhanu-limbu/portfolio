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
        navLinks.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Scroll Animations (Fade-in on scroll)
const observerOptions = {
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

sections.forEach(section => {
    observer.observe(section);
});

// Theme Toggle (Dark/Light Mode)
themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
    localStorage.setItem('theme', newTheme);
});

const savedTheme = localStorage.getItem('theme') || 'light';
document.documentElement.setAttribute('data-theme', savedTheme);
themeIcon.className = savedTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';

// --- INTEGRATED FORM VALIDATION AND AJAX SUBMISSION ---
contactForm.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    // 1. Validation Logic
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();
    
    let isValid = true;
    let errors = [];
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (name === '') { isValid = false; errors.push('Name is required.'); }
    if (email === '') { isValid = false; errors.push('Email is required.'); } 
    else if (!emailRegex.test(email)) { isValid = false; errors.push('Valid email required.'); }
    if (message.length < 10) { isValid = false; errors.push('Message must be 10+ characters.'); }
    
    // Manage Error Display
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
        return; 
    }

    // 2. AJAX Submission (Only if valid)
    const submitBtn = contactForm.querySelector('.btn');
    errorDiv.innerHTML = 'Sending...';
    errorDiv.style.color = 'orange';
    submitBtn.disabled = true; 

    const scriptURL = "https://script.google.com/macros/s/AKfycbxrp-5JxHtVhURltY6hkJkUCELalF8AcMqZEMBJ3cBXZPczmYm4qi_IPPociDBKqB6ADQ/exec";

    $.ajax({
        url: scriptURL,
        method: "POST",
        data: $(this).serialize(),
        success: function(response) {
            alert("Message received! Your request has been logged with a timestamp.");
            errorDiv.innerHTML = '✅ Message sent successfully!';
            errorDiv.style.color = 'green';
            contactForm.reset();
            submitBtn.disabled = false;
            submitBtn.innerText = "Send Message";
        },
        error: function(jqXHR, textStatus, errorThrown) {
            console.error("AJAX Error:", textStatus, errorThrown);
            alert("Error: " + textStatus);
            errorDiv.innerHTML = '❌ Transmission failed. Please try again.';
            errorDiv.style.color = 'red';
            submitBtn.disabled = false;
            submitBtn.innerText = "Send Message";
        }
    });
});