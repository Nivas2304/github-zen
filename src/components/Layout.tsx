import React from 'react';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { BackgroundShapes } from './BackgroundShapes';

export const Layout: React.FC = () => {
  return (
    <div className="min-h-screen bg-app relative">
      <BackgroundShapes variant="minimal" />
      <div className="relative z-10">
        <Header />
        <main className="transition-smooth">
          <Outlet />
        </main>
      </div>
    </div>
  );
};