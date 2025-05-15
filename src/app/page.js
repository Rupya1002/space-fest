'use client';
import Navbar from './components/navbar/page';
import { useEffect, useRef, useState } from 'react';
import './global.css';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const title = 'National Space Society';
  const tagline = 'The Legacy of Light';
  const themeLine = 'Beyond limits, lies true vision...';
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const router = useRouter();
  const [isLeaving, setIsLeaving] = useState(false);

  // Animation delays
  const textDelay = 0.06;
  const taglineDelay = title.length * textDelay + 1.2; // Wait for title smoke to finish
  const themeLineDelay = taglineDelay + tagline.length * textDelay + 0.8;

  useEffect(() => {
    setIsLeaving(false); // Reset smoke animation state on mount

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // --- Stars ---
    const stars = Array.from({ length: 250 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.2 + 0.05
    }));

    // --- Rocks ---
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
      videoRef.current.playbackRate = 1;
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNavigation = (path) => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push(path);
    }, 1500); // Match the animation duration + buffer
  };

  return (
    <div className="page-container">
      <Navbar />
      <canvas ref={canvasRef} className="galaxy-canvas" />
      <video
        ref={videoRef}
        src="/smoke.mp4"
        muted
        autoPlay
        className="background-video"
      />
      <div className="content">
        <h1 className="title">
          {title.split('').map((char, i) => (
            <span
              key={i}
              className={`smoke-letter ${isLeaving ? 'reverse' : ''}`}
              style={{
                animationDelay: `${i * textDelay}s`,
                '--drift': `${(Math.random() - 0.5) * 16}px`
              }}
            >
              {char}
            </span>
          ))}
        </h1>
        <h2 className="tagline" style={{ marginTop: 20 }}>
          {tagline.split('').map((char, i) => (
            <span
              key={i}
              className={`smoke-letter ${isLeaving ? 'reverse' : ''}`}
              style={{
                animationDelay: `${taglineDelay + i * textDelay}s`,
                '--drift': `${(Math.random() - 0.5) * 16}px`
              }}
            >
              {char}
            </span>
          ))}
        </h2>
        <h3
          className="theme-line"
          style={{
            animationDelay: `${themeLineDelay}s`,
            opacity: 0,
            animation: `fadeInText 1.2s ease-in-out ${themeLineDelay}s forwards`
          }}
        >
          {themeLine}
        </h3>
        <div className="buttons">
          <button className="btn explore" onClick={() => handleNavigation('/guests')}>
            Lets Explore
          </button>
          <button className="btn login">Login</button>
        </div>
      </div>
    </div>
  );
}