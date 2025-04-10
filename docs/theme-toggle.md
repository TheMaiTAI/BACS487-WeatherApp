# Light/Dark Theme Toggle Feature

## Overview
A theme toggle feature has been added to the Weather App, allowing users to switch between light and dark themes according to their preference. The implementation follows accessibility guidelines ensuring proper contrast ratios and keyboard navigation support.

## Features

### Theme Options
- **Dark Theme (Default)**: A dark blue gradient background with light text for low-light environments
- **Light Theme**: A light gray-blue gradient with dark text for high-light environments or users who prefer light interfaces

### Toggle Controls
- **Navbar Toggle**: Located at the bottom of the sidebar for easy access from any page
- **Homepage Toggle**: Available on the homepage for immediate visibility to new users
- **Persistent Preference**: User's theme choice is saved in local storage and persists across visits

### Accessibility Considerations
- **Color Contrast**: Both themes maintain a minimum 4.5:1 contrast ratio for text readability (WCAG AA compliant)
- **Focus Indicators**: Visible focus states for keyboard navigation in both themes
- **Semantic HTML**: Proper ARIA labels for theme toggle buttons
- **OS Preference Detection**: Respects user's system preference for light/dark mode by default

### Technical Implementation

#### CSS Variables
The implementation uses CSS custom properties (variables) for all theme-dependent values:
- Base colors and gradients
- Text colors and opacities
- Border colors and shadows
- Input field styling
- Button colors and effects

#### Theme Switching Logic
- Theme preference is stored in `localStorage`
- System color scheme preference is detected with `prefers-color-scheme` media query
- Theme is applied by toggling the `.light-theme` class on the `body` element

#### Integration Points
- Navigation component includes theme toggle at the bottom of sidebar
- Homepage features a dedicated theme toggle button
- All components use CSS variables to adapt to the current theme

## Usage
- Click the moon/sun icon in the sidebar or the theme toggle button on the homepage
- The theme will instantly change across the entire application
- Your preference will be remembered for future visits

## Design Principles
- **Consistency**: Both themes maintain the same layout and functionality
- **Readability**: Text remains legible in all contexts
- **Visual Hierarchy**: Important elements stand out in both themes
- **Aesthetic Appeal**: Both themes provide visually pleasing experiences 