/**
 * Mobile Optimization scripts for the Weather App
 * 
 * This file contains functions to optimize the mobile experience
 * across all pages of the weather application.
 */

class MobileOptimizer {
    /**
     * Initialize mobile optimizations
     */
    static init() {
        // Run all optimizations
        this.setupViewportHeight();
        this.handleOrientationChange();
        this.optimizeScrolling();
        this.detectNetworkChanges();
        this.setupTouchOptimizations();
        this.setupMobileSidebar();
        this.initMobileTemperatureSwitcher();
    }

    /**
     * Set up dynamic viewport height for mobile browsers
     * Fixes the 100vh issue on mobile browsers
     */
    static setupViewportHeight() {
        // First set a CSS variable for the viewport height
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };

        // Set the initial value
        setVH();

        // Update on resize
        window.addEventListener('resize', setVH);
    }

    /**
     * Optimize for orientation changes
     */
    static handleOrientationChange() {
        window.addEventListener('orientationchange', () => {
            // Force redraw after orientation change
            setTimeout(() => {
                // Scroll to top to prevent layout issues
                window.scrollTo(0, 0);
                
                // Force layout recalculation
                document.body.style.display = 'none';
                document.body.offsetHeight; // Trigger reflow
                document.body.style.display = '';
            }, 200);
        });
    }

    /**
     * Optimize scrolling performance
     */
    static optimizeScrolling() {
        // Add passive event listeners for better scroll performance
        document.addEventListener('touchstart', () => {}, {passive: true});
        document.addEventListener('touchmove', () => {}, {passive: true});
        
        // Add scroll optimization class to body when scrolling
        let scrollTimeout;
        window.addEventListener('scroll', () => {
            document.body.classList.add('is-scrolling');
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                document.body.classList.remove('is-scrolling');
            }, 200);
        }, {passive: true});
    }

    /**
     * Detect and handle network changes
     */
    static detectNetworkChanges() {
        // Show network status changes to the user
        const showNetworkToast = (online) => {
            // Remove any existing network toasts
            const existingToasts = document.querySelectorAll('.network-toast');
            existingToasts.forEach(toast => toast.remove());
            
            // Create new toast
            const toast = document.createElement('div');
            toast.className = 'network-toast ' + (online ? 'online' : 'offline');
            toast.innerHTML = online ? 
                '<i class="fas fa-wifi me-2"></i>You are back online' : 
                '<i class="fas fa-wifi-slash me-2"></i>You are offline';
            
            // Add to document
            document.body.appendChild(toast);
            
            // Fade in
            setTimeout(() => toast.classList.add('show'), 10);
            
            // Auto remove
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => toast.remove(), 300);
            }, 3000);
        };
        
        // Add event listeners for online/offline events
        window.addEventListener('online', () => showNetworkToast(true));
        window.addEventListener('offline', () => showNetworkToast(false));
    }

    /**
     * Set up touch-specific optimizations
     */
    static setupTouchOptimizations() {
        // Add touch class to body if touch device
        const isTouchDevice = 'ontouchstart' in window || 
            navigator.maxTouchPoints > 0 || 
            navigator.msMaxTouchPoints > 0;
            
        if (isTouchDevice) {
            document.body.classList.add('touch-device');
            
            // Improve touch response by removing hover delay
            const style = document.createElement('style');
            style.innerHTML = `
                .touch-device * {
                    -webkit-tap-highlight-color: transparent;
                }
                .touch-device .btn:hover,
                .touch-device .nav-link:hover {
                    transition: none !important;
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    /**
     * Optimize scrolling for forecast containers
     */
    static optimizeForecastScrolling() {
        // Get forecast containers
        const hourlyContainer = document.querySelector('.hourly-container');
        const dailyContainer = document.querySelector('.daily-container');
        
        // Apply optimization to both containers
        [hourlyContainer, dailyContainer].forEach(container => {
            if (!container) return;
            
            // Check scroll state when container is scrolled
            const updateScrollIndicator = () => {
                if (container.scrollWidth <= container.clientWidth) {
                    return;
                }
                
                // Check if scrolled to end
                if (container.scrollLeft + container.clientWidth >= container.scrollWidth - 20) {
                    container.classList.add('scrolled-end');
                } else {
                    container.classList.remove('scrolled-end');
                }
            };
            
            // Initial check
            updateScrollIndicator();
            
            // Update on scroll
            container.addEventListener('scroll', updateScrollIndicator, { passive: true });
            
            // Update on resize
            window.addEventListener('resize', updateScrollIndicator, { passive: true });
        });
    }
    
    /**
     * Setup mobile sidebar navigation
     */
    static setupMobileSidebar() {
        const mobileToggle = document.querySelector('.mobile-toggle');
        const sidebar = document.querySelector('.sidebar');
        
        if (mobileToggle && sidebar) {
            mobileToggle.addEventListener('click', function() {
                sidebar.classList.toggle('expanded');
                sidebar.classList.toggle('collapsed');
                
                const icon = mobileToggle.querySelector('.navbar-toggler-icon');
                if (icon) {
                    icon.classList.toggle('active');
                }
            });
        }
    }
    
    /**
     * Initialize the mobile temperature switcher
     */
    static initMobileTemperatureSwitcher() {
        const mobileTempSwitcher = document.querySelector('.mobile-temp-switcher');
        
        if (mobileTempSwitcher) {
            // Ensure static positioning
            mobileTempSwitcher.style.position = 'static';
            mobileTempSwitcher.style.top = 'auto';
            mobileTempSwitcher.style.right = 'auto';
            
            // Make sure the active state is set correctly based on localStorage
            const currentUnit = localStorage.getItem('temperatureUnit') || 'fahrenheit';
            const celsius = mobileTempSwitcher.querySelector('button[onclick*="celsius"]');
            const fahrenheit = mobileTempSwitcher.querySelector('button[onclick*="fahrenheit"]');
            
            if (celsius && fahrenheit) {
                // Clear all styles first
                [celsius, fahrenheit].forEach(btn => {
                    btn.classList.remove('btn-secondary', 'btn-outline-secondary');
                    btn.classList.add('btn-outline-secondary');
                });
                
                // Set active style
                if (currentUnit === 'celsius') {
                    celsius.classList.remove('btn-outline-secondary');
                    celsius.classList.add('btn-secondary');
                } else {
                    fahrenheit.classList.remove('btn-outline-secondary');
                    fahrenheit.classList.add('btn-secondary');
                }
            }
        }
    }
}

// Run mobile optimizations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    MobileOptimizer.init();
});

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (mobileToggle && sidebar) {
        mobileToggle.addEventListener('click', function() {
            sidebar.classList.toggle('expanded');
            sidebar.classList.toggle('collapsed');
            
            const icon = mobileToggle.querySelector('.navbar-toggler-icon');
            if (icon) {
                icon.classList.toggle('active');
            }
        });
    }
    
    // Fix for mobile scroll issue
    let isScrolling;
    window.addEventListener('scroll', function() {
        document.body.classList.add('is-scrolling');
        clearTimeout(isScrolling);
        isScrolling = setTimeout(function() {
            document.body.classList.remove('is-scrolling');
        }, 100);
    });
    
    // Fix vh unit for mobile browsers
    function setMobileHeight() {
        const vh = window.innerHeight * 0.01;
        document.documentElement.style.setProperty('--vh', `${vh}px`);
    }
    setMobileHeight();
    window.addEventListener('resize', setMobileHeight);
    
    // Initialize the mobile temperature switcher
    initMobileTemperatureSwitcher();
});

function initMobileTemperatureSwitcher() {
    const mobileTempSwitcher = document.querySelector('.mobile-temp-switcher');
    
    if (mobileTempSwitcher) {
        // Make sure the active state is set correctly based on localStorage
        const currentUnit = localStorage.getItem('temperatureUnit') || 'fahrenheit';
        const celsius = mobileTempSwitcher.querySelector('button[onclick*="celsius"]');
        const fahrenheit = mobileTempSwitcher.querySelector('button[onclick*="fahrenheit"]');
        
        if (celsius && fahrenheit) {
            if (currentUnit === 'celsius') {
                celsius.classList.add('btn-secondary');
                celsius.classList.remove('btn-outline-secondary');
                fahrenheit.classList.add('btn-outline-secondary');
                fahrenheit.classList.remove('btn-secondary');
            } else {
                fahrenheit.classList.add('btn-secondary');
                fahrenheit.classList.remove('btn-outline-secondary');
                celsius.classList.add('btn-outline-secondary');
                celsius.classList.remove('btn-secondary');
            }
        }
    }
} 