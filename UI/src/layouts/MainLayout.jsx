// MainLayout.jsx — from theme.docx layouts/MainLayout.jsx
// Concept: Layout component using Outlet — wraps pages that need the Navbar

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

const MainLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />   {/* child route renders here */}
    </>
  );
};

export default MainLayout;
