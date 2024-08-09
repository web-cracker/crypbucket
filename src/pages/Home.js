import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Logo from "../components/Logo";
import Navigation from "../components/Navigation";
import { CryptoProvider } from "../context/CryptoContext";
import { StorageProvider } from "../context/StorageContext";
import { TrendingProvider } from "../context/TrendingContext";
import HeroSection from "../pages/HeroSection"; // Corrected import path

const Home = () => {
  const location = useLocation();

  return (
    <CryptoProvider>
      <TrendingProvider>
        <StorageProvider>
          <main
            className="w-full h-full flex flex-col content-center items-center relative text-white font-nunito"
          >
            <div className="w-screen h-screen fixed -z-10" style={{ backgroundColor: 'black' }} />
            <Logo />
            <Navigation />

            {/* Conditionally render HeroSection only on the root route */}
            {location.pathname === "/" && <HeroSection />}

            {/* Renders the nested routes */}
            <Outlet />
          </main>
        </StorageProvider>
      </TrendingProvider>
    </CryptoProvider>
  );
};

export default Home;
