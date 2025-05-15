"use client"
import guestsData from './guests.json';
import './guest.css';
import { useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function GuestsPage() {
  const cardRef = useRef(null);
  const detailsRef = useRef(null);
  const canvasRef = useRef(null);
  const searchParams = useSearchParams();
  const router = useRouter();
  const [expanded, setExpanded] = useState(false);

  // Animation states
  const [animating, setAnimating] = useState(false);
  const [animationDirection, setAnimationDirection] = useState(null); // 'left' or 'right'
  const [pendingIdx, setPendingIdx] = useState(null);

  const guestKeys = Object.keys(guestsData);
  const currentKey = searchParams.get('guest') || guestKeys[0];
  const idx = guestKeys.indexOf(currentKey);
  const guest = guestsData[currentKey];

  // Navigation handlers with animation
  const goTo = (newIdx) => {
    if (animating || newIdx < 0 || newIdx >= guestKeys.length) return;
    setAnimating(true);
    setAnimationDirection(newIdx > idx ? 'right' : 'left');
    setPendingIdx(newIdx);
  };

  // Handle animation end and update guest
  useEffect(() => {
    if (!animating || pendingIdx === null) return;
    const timeout = setTimeout(() => {
      router.push(`?guest=${guestKeys[pendingIdx]}`);
      setExpanded(false);
      setAnimationDirection(animationDirection === 'right' ? 'left' : 'right');
      setAnimating(false);
      setPendingIdx(null);
    }, 1200); // <-- increased duration for clearer transition
    return () => clearTimeout(timeout);
    // eslint-disable-next-line
  }, [animating, pendingIdx]);

  // When guest changes, trigger fly-in animation
  useEffect(() => {
    if (!animating && animationDirection) {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 1200); // <-- match duration
    }
    // eslint-disable-next-line
  }, [currentKey]);

  // Determine card animation class
  let cardClass = "guest-card";
  if (animating && pendingIdx !== null) {
    cardClass += " animating " + (animationDirection === 'right' ? "fly-out-right" : "fly-out-left");
  } else if (animating && pendingIdx === null && animationDirection) {
    cardClass += " animating " + (animationDirection === 'right' ? "fly-in-right" : "fly-in-left");
  }
  if (expanded) cardClass += " expanded";

  // 3D tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card || expanded) return;
    const handleMouseMove = (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * 10;
      const rotateY = ((x - centerX) / centerX) * -10;
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
    };
    const handleMouseLeave = () => {
      card.style.transform = '';
    };
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);
    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [currentKey, expanded]);

  // Smoke opacity on scroll
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;
    const smoke = card.querySelector('.smoke-overlay');
    const handleScroll = () => {
      const rect = card.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const cardMiddle = rect.top + rect.height / 2;
      const viewportMiddle = windowHeight / 2;
      const distance = Math.abs(cardMiddle - viewportMiddle);
      const maxDistance = windowHeight * 0.5;
      let opacity = Math.min(1, distance / maxDistance);
      opacity = Math.max(0.15, Math.min(1, opacity));
      if (smoke) smoke.style.opacity = opacity;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentKey]);

  // Listen for details open/close
  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    const handleToggle = () => setExpanded(details.open);
    details.addEventListener('toggle', handleToggle);
    return () => details.removeEventListener('toggle', handleToggle);
  }, [currentKey]);

  // --- Animated cosmic/galaxy background (stars + rocks) ---
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // --- Stars ---
    const stars = Array.from({ length: 250 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.2 + 0.05,
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
        opacity: 0.7 + Math.random() * 0.3,
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

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className="guests-container">
      <canvas ref={canvasRef} className="galaxy-canvas" />
      <h1 className="guests-title">Our Esteemed Guests</h1>
      <div className="guests-grid" style={{justifyContent: 'center'}}>
        <div
          className={cardClass}
          ref={cardRef}
        >
          <div className="noise-overlay" />
          <div className="guest-card-flex">
            <div className="guest-image-wrapper">
              <img src={guest.Image} alt={guest.Title} className="guest-image" />
            </div>
            <div className="guest-content" style={{position: "relative"}}>
              <div className="smoke-overlay" />
              <h2 className="guest-name guest-3d-text">{guest.Title}</h2>
              <h3 className="guest-designation">{guest.Designation}</h3>
              <p className="guest-description">{guest.Description}</p>
              <details className="guest-details" ref={detailsRef}>
                <summary>More Info</summary>
                <p className="guest-about">{guest.About}</p>
                {guest.Achievements && (
                  <p className="guest-achievements"><b>Achievements:</b> {guest.Achievements}</p>
                )}
                {guest.Agenda && (
                  <p className="guest-agenda"><b>Agenda:</b> {guest.Agenda}</p>
                )}
              </details>
            </div>
          </div>
        </div>
      </div>
      <div style={{display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32}}>
        <button className="btn" onClick={() => goTo(idx - 1)} disabled={idx === 0 || animating}>Previous</button>
        <button className="btn" onClick={() => goTo(idx + 1)} disabled={idx === guestKeys.length - 1 || animating}>Next</button>
      </div>
    </div>
  );
}