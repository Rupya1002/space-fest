import { useState } from 'react';
import Link from 'next/link';
import './nav.css';
'use client';
export default function Navbar() {
  const [open, setOpen] = useState(false);

  const handleGuestClick = () => {
    window.location.href = '/guests';
  };

  const handleContactClick = () => {
    window.location.href = '/contact';
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
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
        <a href="#" onClick={handleGuestClick}>Guests</a>
        <a href="#">Lectures</a>
        <a href="#">Talk Show</a>
        <a href="#">Gallery</a>
        <a href="#">Schedule</a>
        <a href="#">Accomodation</a>
        <a href="#">Team</a>
        <a href="#" onClick={handleContactClick}>Contact</a>
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