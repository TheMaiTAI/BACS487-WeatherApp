class Navigation {
  static createNavigation(containerId) {
      const currentPath = window.location.pathname;
      const isIndexPage = currentPath.endsWith('index.html') || currentPath.endsWith('/');
      const hasLocation = localStorage.getItem('weatherLocation');

      if (isIndexPage && hasLocation) {
          window.location.href = 'forecast.html';
          return;
      } else if (!isIndexPage && !hasLocation) {
          alert('Please select a location first.');
          window.location.href = 'index.html';
          return;
      }

      const container = document.getElementById(containerId);
      if (!container) return;

      const nav = document.createElement('nav');
      nav.className = 'navbar navbar-expand-lg shadow-sm bg-gradient sticky-top';
      nav.style.background = 'linear-gradient(90deg, #1e3c72, #2a5298)';
      nav.innerHTML = `
          <div class="container-fluid">
              <a class="navbar-brand text-white fw-bold" href="index.html">
                  <i class="fas fa-cloud-sun me-2"></i>WeatherApp
              </a>
              <button class="navbar-toggler text-white" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                  <span class="navbar-toggler-icon"></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarNav">
                  <ul class="navbar-nav ms-auto">
                      ${Navigation.navItem('forecast.html', 'fas fa-cloud-sun', 'Forecast')}
                      ${Navigation.navItem('radar.html', 'fas fa-broadcast-tower', 'Radar')}
                      ${Navigation.navItem('precipitation.html', 'fas fa-cloud-rain', 'Precipitation')}
                      ${Navigation.navItem('sun-tracker.html', 'fas fa-sun', 'Sun Tracker')}
                      ${Navigation.navItem('air-quality.html', 'fas fa-wind', 'Air Quality')}
                      ${Navigation.navItem('weather-alerts.html', 'fas fa-exclamation-triangle', 'Alerts')}
                  </ul>
              </div>
          </div>
      `;
      container.appendChild(nav);
  }

  static navItem(href, iconClass, label) {
      return `
          <li class="nav-item">
              <a class="nav-link text-white px-3" href="${href}">
                  <i class="${iconClass} me-2"></i>${label}
              </a>
          </li>
      `;
  }
}
