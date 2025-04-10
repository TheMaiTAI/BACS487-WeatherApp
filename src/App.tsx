import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/components/ThemeProvider';
import { LocationProvider } from '@/lib/LocationContext';
import { Layout } from '@/components/Layout';

// Pages
import Index from '@/pages/Index';
import Forecast from '@/pages/Forecast';
import Radar from '@/pages/Radar';
import Precipitation from '@/pages/Precipitation';
import SunTracker from '@/pages/SunTracker';
import AirQuality from '@/pages/AirQuality';
import WeatherAlerts from '@/pages/WeatherAlerts';
import NotFound from '@/pages/NotFound';

// CSS
import './App.css';

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <LocationProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Index />} />
              <Route path="forecast" element={<Forecast />} />
              <Route path="radar" element={<Radar />} />
              <Route path="precipitation" element={<Precipitation />} />
              <Route path="sun-tracker" element={<SunTracker />} />
              <Route path="air-quality" element={<AirQuality />} />
              <Route path="weather-alerts" element={<WeatherAlerts />} />
              <Route path="404" element={<NotFound />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </Router>
      </LocationProvider>
    </ThemeProvider>
  );
}

export default App;
