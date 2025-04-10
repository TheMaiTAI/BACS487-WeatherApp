# BACS487 Weather App

A modern, responsive weather application built with React, TypeScript, and Tailwind CSS. This application provides real-time weather data, forecasts, and various weather-related features with a beautiful, user-friendly interface.

## Features

- 🌤️ Real-time weather data
- 📍 Location-based weather information
- 📊 Detailed weather forecasts
- 🗺️ Interactive weather maps
- 🌡️ Temperature tracking
- 💨 Wind speed and direction
- 💧 Humidity and precipitation data
- 🌅 Sunrise and sunset times
- 🎨 Dark/Light theme support
- 📱 Fully responsive design

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Framer Motion (Animations)
- React Router (Navigation)
- OpenWeather API (Weather Data)
- Leaflet (Maps)
- Lucide Icons

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- OpenWeather API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/TheMaiTAI/BACS487-WeatherApp.git
cd BACS487-WeatherApp
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your OpenWeather API key:
```env
VITE_OPENWEATHER_API_KEY=your_api_key_here
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Application pages
├── lib/          # Utility functions and API
├── hooks/        # Custom React hooks
└── styles/       # Global styles
```

## Key Features

### Location Selection
- Automatic location detection
- Manual location search
- Location persistence
- Location-based weather data

### Weather Data
- Current weather conditions
- Hourly forecasts
- Daily forecasts
- Weather alerts
- UV index
- Air quality

### Interactive Maps
- Weather radar
- Precipitation maps
- Temperature maps
- Wind maps

### User Experience
- Smooth animations
- Responsive design
- Dark/Light theme
- Loading states
- Error handling

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- OpenWeather API for weather data
- Lucide for beautiful icons
- Framer Motion for smooth animations
- Tailwind CSS for styling
- React community for amazing tools and libraries

## Contact

For any questions or suggestions, please open an issue in the repository. 