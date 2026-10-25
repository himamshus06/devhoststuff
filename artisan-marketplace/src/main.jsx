import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import App from "./App.jsx";
import ArtisanPage from "./ArtisanPage.jsx";
import AuthPage from "./AuthPage.jsx";
import SellerDashboard from "./SellerDashboard.jsx";
import { LanguageProvider } from "./i18n.jsx";
import "./index.css";

function Root() {
  return (
    <LanguageProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />} />
          <Route path="/artisan/:slug" element={<ArtisanPage />} />
          <Route path="/login" element={<AuthPage />} />
          <Route path="/seller/dashboard" element={<SellerDashboard />} />
        </Routes>
      </BrowserRouter>
    </LanguageProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
