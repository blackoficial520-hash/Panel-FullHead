import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";
import { initNativeApp } from "./utils/nativeApp.js";

// Force dark theme on Android
if (navigator.userAgent.includes('Android')) {
  document.documentElement.style.colorScheme = 'dark';
  document.body.style.backgroundColor = '#0f172a';
  document.body.style.color = '#f1f5f9';
  
  // Update theme color meta tag dynamically
  let themeColorMeta = document.querySelector('meta[name="theme-color"]');
  if (themeColorMeta) {
    themeColorMeta.setAttribute('content', '#0f172a');
  }
}

// Inicializar app nativa
initNativeApp().catch(console.error);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);