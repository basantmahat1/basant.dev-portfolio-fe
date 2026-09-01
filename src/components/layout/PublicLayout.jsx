import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Preloader from '../ui/Preloader';

export default function PublicLayout() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="min-h-screen">
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
