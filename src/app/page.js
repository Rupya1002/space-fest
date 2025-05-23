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
  const [hasMounted, setHasMounted] = useState(false);

  // Animation delays
  const textDelay = 0.06;
  const taglineDelay = title.length * textDelay + 1.2;
  const themeLineDelay = taglineDelay + tagline.length * textDelay + 0.8;

  // Deterministic pseudo-random function
  function pseudoRandom(seed) {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  }

  function getDrift(index) {
    return (pseudoRandom(index) - 0.5) * 16;
  }

  useEffect(() => {
    setHasMounted(true);
  }, []);

  useEffect(() => {
    if (!hasMounted) return;

    setIsLeaving(false);

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 250 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.2 + 0.05
    }));

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
      videoRef.current.play().catch((e) => {
        // Ignore play interruption errors due to background tab or power saving
        if (
          e.name !== 'AbortError' &&
          !e.message.includes('background media was paused to save power')
        ) {
          console.error(e);
        }
      });
      videoRef.current.playbackRate = 1;
    }

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [hasMounted]);

  const handleNavigation = (path) => {
    setIsLeaving(true);
    setTimeout(() => {
      router.push(path);
    }, 1500);
  };

  return (
    <div className="page-container">
      <Navbar />
      {hasMounted && <canvas ref={canvasRef} className="galaxy-canvas" />}
      {hasMounted && (
        <video
          ref={videoRef}
          src="/smoke.mp4"
          muted
          autoPlay
          className="background-video"
        />
      )}
      <div className="content">
        <h1 className="title">
          {title.split('').map((char, i) => (
            <span
              key={i}
              className={`smoke-letter ${isLeaving ? 'reverse' : ''}`}
              style={{
                'animationDelay': `${i * textDelay}s`,
                '--drift': `${getDrift(i)}px`
              }}
            >
              {char}
            </span>
          ))}
        </h1>
        <h2 className="tagline">
          {tagline.split('').map((char, i) => (
            <span
              key={i}
              className={`smoke-letter ${isLeaving ? 'reverse' : ''}`}
              style={{
                'animationDelay': `${taglineDelay + i * textDelay}s`,
                '--drift': `${getDrift(i + title.length)}px`
              }}
            >
              {char}
            </span>
          ))}
        </h2>
        <h3 
          className="theme-line"
          style={{
            animationDelay: `${themeLineDelay}s`
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