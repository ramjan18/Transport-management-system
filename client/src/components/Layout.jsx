import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Dashboard from "./Dashboard"; // Move your Sidebar code to a separate Sidebar.jsx

const Layout = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("userRole");
    if (!role) {
      navigate("/"); // If no role, redirect to login
    } else {
      setUserRole(role);
    }
  }, [navigate]);

  return (
    <div style={{ display: "flex" }}>
      <Dashboard userRole={userRole} />
      <main style={{ flexGrow: 1, padding: "24px" }}>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
