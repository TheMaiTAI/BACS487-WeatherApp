/**
 * Navigation class for creating the sidebar navigation.
 * 
 * The navigation has been updated to use a vertical sidebar design
 * positioned on the left side of the screen with improved styling.
 * 
 * See docs/navbar-update.md for complete documentation of changes.
 */
class Navigation {
    static createNavigation(containerId) {
        // Check if we're on index.html and have location data
        const currentPath = window.location.pathname;
        const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
        const hasLocation = localStorage.getItem('weatherLocation');

        // Redirect to appropriate page based on conditions
        if (isIndexPage && hasLocation) {
            window.location.href = 'forecast.html';
            return;
        } else if (!isIndexPage && !hasLocation) {
            // Show error message before redirecting
            const errorMessage = 'Please select a location first.';
            alert(errorMessage);
            window.location.href = 'index.html';
            return;
        }

        const container = document.getElementById(containerId);
        if (!container) return;

        const nav = document.createElement('nav');
        nav.className = 'navbar navbar-dark sidebar collapsed';
        
        nav.innerHTML = `
            <a class="navbar-brand d-flex align-items-center" href="index.html">
                <i class="fas fa-cloud-sun"></i>Weather App
            </a>
            <button class="navbar-toggler mobile-toggle" type="button" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="navbar-collapse" id="navbarNav">
                <ul class="navbar-nav flex-column w-100">
                    <li class="nav-item">
                        <a class="nav-link" href="forecast.html">
                            <i class="fas fa-cloud-sun"></i><span>Forecast</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="radar.html">
                            <i class="fas fa-broadcast-tower"></i><span>Radar</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="precipitation.html">
                            <i class="fas fa-cloud-rain"></i><span>Precipitation</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="sun-tracker.html">
                            <i class="fas fa-sun"></i><span>Sun Tracker</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="air-quality.html">
                            <i class="fas fa-wind"></i><span>Air Quality</span>
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link" href="weather-alerts.html">
                            <i class="fas fa-exclamation-triangle"></i><span>Weather Alerts</span>
                        </a>
                    </li>
                </ul>
                
                <div class="theme-toggle-container mt-auto">
                    <button id="themeToggle" class="theme-toggle" aria-label="Toggle dark/light mode">
                        <i class="fas fa-moon"></i>
                        <span class="theme-label">Dark Mode</span>
                    </button>
                </div>
            </div>
        `;
        container.appendChild(nav);
        
        // Add active class to current page link
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            if (link.getAttribute('href') === currentPage) {
                link.classList.add('active');
            }
        });

        // Add event listener to toggle mobile navigation
        const toggleButton = nav.querySelector('.mobile-toggle');
        toggleButton.addEventListener('click', () => {
            nav.classList.toggle('collapsed');
            nav.classList.toggle('expanded');
        });

        // Initialize theme toggle functionality
        this.initThemeToggle();
    }

    static initThemeToggle() {
        const themeToggle = document.getElementById('themeToggle');
        const themeIcon = themeToggle.querySelector('i');
        const themeLabel = themeToggle.querySelector('.theme-label');
        
        // Check for saved theme preference or respect OS preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        // Set initial theme
        if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
            document.body.classList.add('light-theme');
            themeIcon.classList.replace('fa-moon', 'fa-sun');
            themeLabel.textContent = 'Light Mode';
        }
        
        // Add click event
        themeToggle.addEventListener('click', () => {
            // Toggle theme
            const isLightTheme = document.body.classList.toggle('light-theme');
            
            // Update icon and text
            if (isLightTheme) {
                themeIcon.classList.replace('fa-moon', 'fa-sun');
                themeLabel.textContent = 'Light Mode';
                localStorage.setItem('theme', 'light');
            } else {
                themeIcon.classList.replace('fa-sun', 'fa-moon');
                themeLabel.textContent = 'Dark Mode';
                localStorage.setItem('theme', 'dark');
            }
        });
    }
}