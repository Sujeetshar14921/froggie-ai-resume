import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import { useSelector } from "react-redux";
import Loader from "../components/Loader";
import Login from "./Login";

const Layout = () => {
  const { user, loading } = useSelector((state) => state.auth);

  if (loading) {
    return <Loader />;
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100">
      <Navbar />

      <main className="relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/50 rounded-full blur-3xl opacity-40"></div>
        <div className="absolute right-0 top-40 w-96 h-96 bg-teal-100/40 rounded-full blur-3xl opacity-40"></div>

        <div className="relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
