// --- 严格模式 ---
'use strict';

// --- 全局变量与常量 ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleDarkIcon = document.getElementById('theme-toggle-dark-icon');
const themeToggleLightIcon = document.getElementById('theme-toggle-light-icon');
const htmlElement = document.documentElement; // Target the <html> element

// --- DOMContentLoaded Wrapper ---
document.addEventListener('DOMContentLoaded', () => {

    console.log("DOM fully loaded and parsed");

    initializeDarkMode();
    initializeAOS(); // For scroll-in animations
    initializeSmoothScroll(); // For internal links
    initializeGsapAnimations(); // For Hero entrance and background SVGs

    // Add any other initializations here
    // initializeMobileMenu(); // If you implemented a mobile menu

}); // End DOMContentLoaded

// --- 暗色模式逻辑 ---
function initializeDarkMode() {
    // Check for color-theme in localStorage first, then system preference
    let isDarkMode = localStorage.getItem('color-theme') === 'dark' ||
        (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);

    // Apply the initial theme
    applyTheme(isDarkMode);

    // Add event listener to the toggle button
    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            isDarkMode = htmlElement.classList.contains('dark'); // Check current state
            applyTheme(!isDarkMode); // Toggle theme
            console.log(`Theme toggled to: ${!isDarkMode ? 'dark' : 'light'}`);
        });
    } else {
        console.error("Theme toggle button (#theme-toggle) not found!");
    }

    // Listen for changes in system preference IF no theme is set in localStorage
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
        if (!('color-theme' in localStorage)) {
            applyTheme(event.matches);
            console.log(`System theme changed. Applied: ${event.matches ? 'dark' : 'light'}`);
        }
    });
}

// Function to apply the theme class and icon state
function applyTheme(isDark) {
    if (themeToggleLightIcon && themeToggleDarkIcon) {
        themeToggleLightIcon.classList.toggle('hidden', isDark);
        themeToggleDarkIcon.classList.toggle('hidden', !isDark);
    }
    htmlElement.classList.toggle('dark', isDark); // Add/remove 'dark' class on <html>
    localStorage.setItem('color-theme', isDark ? 'dark' : 'light'); // Save preference
}

// --- AOS 初始化 (用于非 Hero 部分的滚动入场动画) ---
function initializeAOS() {
    // Check if AOS library is loaded
    if (typeof AOS === 'undefined') {
        console.error("AOS library not loaded! Make sure the script tag is correct.");
        return;
    }
    AOS.init({
        duration: 800, // Animation duration
        easing: 'ease-out-cubic', // Easing function
        once: true, // Whether animation should happen only once - keep true for portal sections
        offset: 50, // Offset (in px) from the top of the viewport to trigger animation
        delay: 0, // Delay animation (per element delay can be set via data-aos-delay)
        // disable: 'phone', // Optional: disable AOS on phone
    });
    console.log("AOS initialized for non-hero sections");
}

// --- 平滑滚动逻辑 (适用于所有 href="#section-id" 的链接) ---
function initializeSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Check if it's a valid internal link
            if (targetId && targetId.startsWith('#') && targetId.length > 1) {
                const targetElement = document.querySelector(targetId);

                if (targetElement) {
                    e.preventDefault(); // Prevent default jump

                    // Calculate offset for sticky header
                    const header = document.querySelector('header');
                    const headerOffset = header ? header.offsetHeight : 0; // Get header height, default to 0 if not found

                    const elementPosition = targetElement.getBoundingClientRect().top;
                    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                    window.scrollTo({
                        top: offsetPosition,
                        behavior: "smooth" // Enable smooth scrolling
                    });
                    console.log(`Smooth scrolling to: ${targetId}`);
                } else {
                    console.warn(`Smooth scroll target element not found for: ${targetId}`);
                }
            }
        });
    });
    console.log("Smooth scroll initialized.");
}


// --- GSAP 动画 ---
function initializeGsapAnimations() {
    // Check if GSAP library is loaded
    if (typeof gsap === 'undefined') {
        console.error("GSAP library not loaded! Make sure the script tag is correct.");
        return;
    }
    console.log("Initializing GSAP animations...");

    // --- Hero Section 入场动画 (精确模仿时间线) ---
    const heroTimeline = gsap.timeline({ defaults: { ease: "power3.out", duration: 0.8 } });

    heroTimeline.fromTo('#hero-badge',
        { opacity: 0, y: -30, scale: 0.8 },
        { opacity: 1, y: 0, scale: 1, duration: 0.6, delay: 0.2 }
    )
        .fromTo('#hero-title-main',
            { opacity: 0, y: 40, skewX: -10 },
            { opacity: 1, y: 0, skewX: 0, duration: 1 },
            "-=0.4" // Overlap
        )
        .fromTo('#hero-title-sub',
            { opacity: 0, y: 30, scale: 0.9 },
            { opacity: 1, y: 0, scale: 1 },
            "-=0.7" // Overlap more
        )
        .fromTo('#hero-desc',
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.7 },
            "-=0.5"
        )
        .fromTo('#hero-buttons > a', // Target direct child links/buttons
            { opacity: 0, y: 20, scale: 0.8 },
            { opacity: 1, y: 0, scale: 1, stagger: 0.15 }, // Staggered reveal
            "-=0.4"
        );

    console.log("GSAP Hero entrance animation configured.");

    // --- 全局背景 SVG 动画 (保持慢速、循环) ---
    // Target the circle elements within your background SVGs
    gsap.to("#global-gradient-1 circle", {
        duration: 45, // Slower duration
        rotation: 360,
        scale: 1.15, // Slightly larger scale
        repeat: -1, // Infinite loop
        yoyo: true, // Reverse animation on repeat
        ease: "sine.inOut", // Smooth easing
        svgOrigin: "500 500", // Ensure center point - adjust if your SVG viewBox/circle cx/cy differs
        transformOrigin: "50% 50%" // Ensure CSS transform origin is also center
    });

    gsap.to("#global-gradient-2 circle", {
        duration: 55, // Different duration
        rotation: -360, // Rotate in opposite direction
        scale: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        svgOrigin: "450 450", // Ensure center point - adjust if your SVG viewBox/circle cx/cy differs
        transformOrigin: "50% 50%"
    });

    console.log("GSAP Global background animations started.");

} // End initializeGsapAnimations

// --- Other potential functions (e.g., for mobile menu toggle) ---
/*
function initializeMobileMenu() {
    const mobileMenuButton = document.querySelector('header .md\\:hidden button'); // Adjust selector
    const mobileMenu = document.getElementById('mobile-menu'); // Get mobile menu div

    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden'); // Simple toggle
            // Add ARIA attributes and focus management for accessibility
        });
         console.log("Mobile menu toggle initialized.");
    } else {
         console.warn("Mobile menu elements not found.");
    }
}
*/
