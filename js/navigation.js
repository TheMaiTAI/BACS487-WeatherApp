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
        nav.className = 'navbar navbar-expand-lg navbar-dark bg-dark';
        nav.innerHTML = `
            <div class="container-fluid">
                <a class="navbar-brand" href="index.html">Weather App</a>
                <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon"></span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <a class="nav-link" href="forecast.html">
                                <i class="fas fa-cloud-sun"></i> Forecast
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="radar.html">
                                <i class="fas fa-broadcast-tower"></i> Radar
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="precipitation.html">
                                <i class="fas fa-cloud-rain"></i> Precipitation
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="sun-tracker.html">
                                <i class="fas fa-sun"></i> Sun Tracker
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="air-quality.html">
                                <i class="fas fa-wind"></i> Air Quality
                            </a>
                        </li>
                        <li class="nav-item">
                            <a class="nav-link" href="weather-alerts.html">
                                <i class="fas fa-exclamation-triangle"></i> Weather Alerts
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        `;
        container.appendChild(nav);
    }
}