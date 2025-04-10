// This is a test JavaScript file
console.log('Script loaded successfully!');

// Check if the root element exists
const rootElement = document.getElementById('root');
if (rootElement) {
  rootElement.innerHTML = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; text-align: center; background: white; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
      <h1 style="color: #0077cc;">Weather App Loading Test</h1>
      <p>If you can see this message, JavaScript is executing correctly.</p>
      <p>This means the issue might be with the React application initialization.</p>
    </div>
  `;
} 