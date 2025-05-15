'use client';
import React, { useEffect, useRef, useState } from "react";
import "./contact.css";

export default function ContactPage() {
  const canvasRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Store form data in local storage
    const existingQueries = JSON.parse(localStorage.getItem('queries') || '[]');
    const newQuery = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    existingQueries.push(newQuery);
    localStorage.setItem('queries', JSON.stringify(existingQueries));

    // Reset form
    setFormData({
      name: '',
      email: '',
      phone: '',
      query: ''
    });
    alert('Query submitted successfully!');
  };

  // Animated background
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const particles = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1.5 + Math.random() * 3.5,
      dx: (Math.random() - 0.5) * 0.3,
      dy: (Math.random() - 0.5) * 0.3,
      glow: 0.4 + Math.random() * 0.6,
      hue: 260 + Math.random() * 60
    }));

    function animate() {
      ctx.clearRect(0, 0, width, height);

      const grad = ctx.createRadialGradient(
        width / 2,
        height / 2,
        width * 0.1,
        width / 2,
        height / 2,
        width * 0.7
      );
      grad.addColorStop(0, "rgba(180,140,255,0.18)");
      grad.addColorStop(1, "rgba(30,20,60,0.7)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      for (const p of particles) {
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.shadowColor = `hsla(${p.hue}, 90%, 80%, 1)`;
        ctx.shadowBlur = 18 * p.glow;
        ctx.fillStyle = `hsla(${p.hue}, 90%, 80%, 0.85)`;
        ctx.fill();
        ctx.restore();

        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
      }

      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="contact-root">
      <canvas ref={canvasRef} className="contact-bg-canvas" />
      <div className="contact-container">
        <div className="contact-left">
          <div className="contact-left-bg">
            <h1>Contact Us !</h1>
            <p>
              Please get in touch with us, in case you have any queries or questions.
            </p>
            <div className="contact-info">
              <div className="contact-info-item">
                <span className="contact-icon">📍</span>
                <span>
                  Kalpana Chawla Space Technology Cell, IIT Kharagpur
                </span>
              </div>
              <div className="contact-info-item">
                <span className="contact-icon">📞</span>
                <span>
                  +91-9359873722<br />
                  +91-9350152471
                </span>
              </div>
              <div className="contact-info-item">
                <span className="contact-icon">🌐</span>
                <span>spats.co.in</span>
              </div>
              <div className="contact-info-item">
                <span className="contact-icon">✉️</span>
                <span>spats.iitkgp@gmail.com</span>
              </div>
            </div>
            <div className="contact-socials">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-facebook-f"></i>
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin-in"></i>
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-twitter"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="contact-right">
          <div className="contact-form-bg" />
          <h1>Send Your Query !</h1>
          <form className="contact-form" onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name"
              placeholder="Name" 
              required 
              value={formData.name}
              onChange={handleChange}
            />
            <input 
              type="email" 
              name="email"
              placeholder="Email address" 
              required 
              value={formData.email}
              onChange={handleChange}
            />
            <input 
              type="tel" 
              name="phone"
              placeholder="Phone number" 
              required 
              value={formData.phone}
              onChange={handleChange}
            />
            <textarea 
              name="query"
              placeholder="Write your query" 
              rows={4} 
              required
              value={formData.query}
              onChange={handleChange}
            />
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />
    </div>
  );
}