// main.jsx — from theme.docx main.jsx pattern
// Concepts:
//   RouterProvider  — used with createBrowserRouter (not BrowserRouter)
//   AuthProvider    — wraps entire app so ALL components can useAuth()
//   StrictMode      — helps catch bugs in development

import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      {/* AuthProvider must wrap RouterProvider so every page can call useAuth() */}
      <RouterProvider router={router} />
    </AuthProvider>
  </StrictMode>
);
