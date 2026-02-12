
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

console.log("X-Clone: Starting application...");

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("X-Clone Error: Could not find root element with id 'root'");
  throw new Error("Could not find root element to mount to");
}

try {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
  console.log("X-Clone: Rendered successfully");
} catch (error) {
  console.error("X-Clone: Failed to render application", error);
  rootElement.innerHTML = `
    <div style="color: white; padding: 20px; text-align: center; font-family: sans-serif;">
      <h1>Ups! Terjadi Kesalahan</h1>
      <p>Aplikasi gagal dimuat. Coba segarkan halaman atau periksa koneksi internet Anda.</p>
    </div>
  `;
}
