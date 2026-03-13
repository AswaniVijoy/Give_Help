// AuthLayout.jsx — from theme.docx layouts/AuthLayout.jsx
// Concept: Layout for auth pages (login, signup) — no Navbar, but has ToastContainer

import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AuthLayout = () => {
  return (
    <>
      <Outlet />      {/* login or signup page renders here */}
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
};

export default AuthLayout;
