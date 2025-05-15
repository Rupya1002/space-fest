'use client';
import React, { useEffect, useRef, useState } from "react";
import "./contact.css";
import Navbar from '../components/navbar/page';

export default function ContactPage() {
  const canvasRef = useRef(null);
  const videoRef = useRef(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    query: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const existingQueries = JSON.parse(localStorage.getItem('queries') || '[]');
    const newQuery = {
      ...formData,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    existingQueries.push(newQuery);
    localStorage.setItem('queries', JSON.stringify(existingQueries));
    setFormData({
      name: '',
      email: '',
      phone: '',
      query: ''
    });
    alert('Query submitted successfully!');
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Stars setup
    const stars = Array.from({ length: 250 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.2 + 0.05
    }));

    // Rocks setup
    const rockImg = new window.Image();
    rockImg.src = '/rock.png';

    const rockCount = 12;
    const rocks = Array.from({ length: rockCount }).map(() => {
      const size = Math.random() * 60 + 40;
      return {
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        speedY: Math.random() * 0.4 + 0.2,
        speedX: (Math.random() - 0.5) * 0.2,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.01,
        opacity: 0.7 + Math.random() * 0.3
      };
    });

    function drawRocks() {
      for (const rock of rocks) {
        ctx.save();
        ctx.globalAlpha = rock.opacity;
        ctx.translate(rock.x + rock.size / 2, rock.y + rock.size / 2);
        ctx.rotate(rock.rotation);
        ctx.drawImage(
          rockImg,
          -rock.size * 1.5,
          -rock.size * 1.5,
          rock.size * 3,
          rock.size * 3
        );
        ctx.restore();

        rock.y += rock.speedY;
        rock.x += rock.speedX;
        rock.rotation += rock.rotationSpeed;

        if (rock.y > height + rock.size * 1.5) {
          rock.y = -rock.size * 3;
          rock.x = Math.random() * width;
        }
        if (rock.x < -rock.size * 1.5) rock.x = width + rock.size * 1.5;
        if (rock.x > width + rock.size * 1.5) rock.x = -rock.size * 1.5;
      }
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);

      ctx.fillStyle = 'white';
      for (const star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fill();
        star.y += star.speed;
        if (star.y > height) {
          star.y = 0;
          star.x = Math.random() * width;
        }
      }

      if (rockImg.complete) drawRocks();

      requestAnimationFrame(animate);
    }

    animate();

    function handleResize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    
    window.addEventListener('resize', handleResize);
    if (videoRef.current) {
      videoRef.current.play();
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="contact-root">
      <Navbar />
      <canvas ref={canvasRef} className="contact-bg-canvas" />
   
      <div className="contact-container">
        <div className="contact-wrapper">
          <div className="contact-left">
            <div className="contact-left-content">
              <h1>Contact Us</h1>
              <p>
                Have questions about the National Studentspace Challenge? We are here to help!
              </p>
              <div className="contact-info">
                <div className="contact-info-item">
                  <i className="fas fa-map-marker-alt"></i>
                  <span>
                    Kalpana Chawla Space Technology Cell, IIT Kharagpur
                  </span>
                </div>
                <div className="contact-info-item">
                  <i className="fas fa-phone"></i>
                  <span>
                    +91-9359873722<br />
                    +91-9350152471
                  </span>
                </div>
                <div className="contact-info-item">
                  <i className="fas fa-globe"></i>
                  <span>spats.co.in</span>
                </div>
                <div className="contact-info-item">
                  <i className="fas fa-envelope"></i>
                  <span>spats.iitkgp@gmail.com</span>
                </div>
              </div>
              <div className="contact-socials">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-facebook-f"></i>
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-linkedin-in"></i>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
          <div className="contact-right">
            <div className="contact-form-wrapper">
              <h1>Send Your Query</h1>
              <form
                className="contact-form"
                onSubmit={(e) => {
                  handleSubmit(e);
                  // Open submission file after submit
                    window.open('/submission', '_blank');
                }}
              >
                <div className="form-group">
                  <input 
                    type="text" 
                    name="name"
                    placeholder="Enter your name" 
                    required 
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="email" 
                    name="email"
                    placeholder="Enter your email" 
                    required 
                    value={formData.email}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <input 
                    type="tel" 
                    name="phone"
                    placeholder="Enter your phone number" 
                    required 
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </div>
                <div className="form-group">
                  <textarea 
                    name="query"
                    placeholder="Type your message here..." 
                    rows={4} 
                    required
                    value={formData.query}
                    onChange={handleChange}
                  />
                </div>
                <button type="submit">Submit Query</button>
              </form>
            </div>
          </div>
        </div>
      </div>
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css"
      />
    </div>
  );
}