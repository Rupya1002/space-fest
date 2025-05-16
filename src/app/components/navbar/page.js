'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import './nav.css';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false); // <== Prevent hydration mismatch

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null; // Avoid rendering until mounted on client

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <div className="logo-container">
          <Image
            src="/logo.jpg"
            alt="NSSC Logo"
            className="navbar-logo"
            width={100}
            height={50}
          />
        </div>
        <div className="navbar-title-group">
          <div className="navbar-title">NATIONAL STUDENTSPACE CHALLENGE</div>
          <div className="navbar-subtitle">
            6<sup>th</sup> - 8<sup>th</sup> OCT23 | IIT KHARAGPUR
          </div>
        </div>
      </div>

      <div className={`navbar-links${open ? ' open' : ''}`}>
        <Link href="#">About</Link>
        <Link href="#">Events</Link>
        <Link href="/guests">Guests</Link>
        <Link href="#">Lectures</Link>
        <Link href="#">Gallery</Link>
        <Link href="#">Schedule</Link>
        <Link href="#">Accomodation</Link>
        <Link href="#">Team</Link>
        <Link href="/contact">Contact</Link>
        <Link href="#">Login</Link>
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
