'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './nav.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleGuestClick = (e) => {
    e.preventDefault();
    router.push('/guests');
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    router.push('/contact');
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo-container">
          <img src="/logo.webp" alt="NSSC Logo" className="navbar-logo" />
        </div>
        <div className="navbar-title-group">
          <div className="navbar-title">NATIONAL STUDENTSPACE CHALLENGE</div>
          <div className="navbar-subtitle">
            6<sup>th</sup> - 8<sup>th</sup> OCT23 | IIT KHARAGPUR
          </div>
        </div>
      </div>
      <div className={`navbar-links${open ? ' open' : ''}`}>
        <a href="#">About</a>
        <a href="#">Events</a>
        <a href="/guests" onClick={handleGuestClick}>Guests</a>
        <a href="#">Lectures</a>
     
        <a href="#">Gallery</a>
        <a href="#">Schedule</a>
        <a href="#">Accomodation</a>
        <a href="#">Team</a>
        <a href="/contact" onClick={handleContactClick}>Contact</a>
        <a href="#">Login</a>
      </div>
      <button
        className={`navbar-hamburger${open ? ' open' : ''}`}
        onClick={() => setOpen(!open)}
        aria-label="Toggle navigation"
      >
        <span />
        <span />
        <span />
      </button>
    </nav>
  );
}