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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-100 dark:from-[#090d16] dark:via-[#0c1222] dark:to-[#090d16] text-slate-900 dark:text-slate-100 transition-colors duration-300 pb-20 lg:pb-0">
      <Navbar />

      <main className="relative">
        <div className="absolute top-0 left-0 w-96 h-96 bg-emerald-100/50 dark:bg-emerald-950/20 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none"></div>
        <div className="absolute right-0 top-40 w-96 h-96 bg-teal-100/40 dark:bg-teal-950/20 rounded-full blur-3xl opacity-40 dark:opacity-20 pointer-events-none"></div>

        <div className="relative">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default Layout;
