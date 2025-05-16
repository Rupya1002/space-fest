"use client"
import guestsData from './guests.json';
import Image from 'next/image';
import './guest.css';
import { useEffect, useRef, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Navbar from '../components/navbar/page';

// Main page component with Suspense boundary
function GuestsPage() {
  return (
    <div className="guests-container">
      <Navbar />
      <BackgroundCanvas />
      <h1 className="guests-title">Our Esteemed Guests</h1>
      <Suspense fallback={<div>Loading guests...</div>}>
        <GuestCardContainer />
      </Suspense>
    </div>
  );
}

// Separated background canvas for better component organization
function BackgroundCanvas() {
  const canvasRef = useRef(null);
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });

  // Responsive dimensions tracking with defensive programming
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setDimensions({
        width: window.innerWidth || 1200,
        height: window.innerHeight || 800
      });
    };

    // Initialize size
    handleResize();

    // Add event listener with a debounce to avoid excessive updates
    let resizeTimer;
    const debouncedResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(handleResize, 100);
    };

    window.addEventListener('resize', debouncedResize);

    return () => {
      clearTimeout(resizeTimer);
      window.removeEventListener('resize', debouncedResize);
    };
  }, []);

  // Canvas background animation with error handling
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let ctx;
    try {
      ctx = canvas.getContext('2d');
      if (!ctx) return;
    } catch (error) {
      console.error("Error getting canvas context:", error);
      return;
    }

    // Set initial canvas size with fallbacks
    let width = canvas.width = dimensions.width || 1200;
    let height = canvas.height = dimensions.height || 800;

    // Optimize star count for mobile
    const starCount = dimensions.width < 768 ? 150 : 250;

    const stars = Array.from({ length: starCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.2 + 0.05,
    }));

    const rockImg = new window.Image();
    rockImg.src = '/rock.png';
    rockImg.onerror = (e) => {
      console.error("Error loading rock image:", e);
    };

    // Fewer rocks on mobile
    const rockCount = dimensions.width < 768 ? 8 : 12;
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

    let animationId = null;

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

      // Safe checking for rockImg
      if (rockImg && rockImg.complete && rockImg.naturalHeight !== 0) {
        try {
          drawRocks();
        } catch (error) {
          console.error("Error drawing rocks:", error);
        }
      }

      animationId = requestAnimationFrame(animate);
    }

    // Check if we're in a browser environment before starting animation
    if (typeof window !== 'undefined') {
      animate();
    }

    function handleResize() {
      if (!canvas) return;
      try {
        width = canvas.width = dimensions.width || window.innerWidth || 1200;
        height = canvas.height = dimensions.height || window.innerHeight || 800;
      } catch (error) {
        console.error("Error resizing canvas:", error);
      }
    }

    // Update canvas when dimensions change
    handleResize();

    return () => {
      if (animationId) cancelAnimationFrame(animationId);
    };
  }, [dimensions]);

  return <canvas ref={canvasRef} className="galaxy-canvas" />;
}

// Container component that handles URL params with proper Suspense boundary
function GuestCardContainer() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [dimensions, setDimensions] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 1200,
    height: typeof window !== 'undefined' ? window.innerHeight : 800
  });
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth || 1200,
        height: window.innerHeight || 800
      });
    };
    
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const guestKeys = Object.keys(guestsData);
  const currentKey = searchParams.get('guest') || guestKeys[0];
  const idx = guestKeys.indexOf(currentKey);
  const guest = guestsData[currentKey];
  
  const [isSliding, setIsSliding] = useState(false);
  const [slideDirection, setSlideDirection] = useState(null);

  const goTo = (newIdx) => {
    if (newIdx < 0 || newIdx >= guestKeys.length || isSliding) return;

    setIsSliding(true);
    setSlideDirection(newIdx > idx ? 'left' : 'right');
    setTimeout(() => {
      router.push(`?guest=${guestKeys[newIdx]}`);

      setTimeout(() => {
        setIsSliding(false);
        setSlideDirection(null);
      }, 600);
    }, 300);
  };

  return (
    <>
      <div className="guests-grid" style={{ justifyContent: 'center' }}>
        <GuestCard 
          guest={guest} 
          isSliding={isSliding} 
          slideDirection={slideDirection}
          dimensions={dimensions}
        />
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 32 }}>
        <button 
          className="btn" 
          onClick={() => goTo(idx - 1)} 
          disabled={idx === 0 || isSliding}
        >
          Previous
        </button>
        <button 
          className="btn" 
          onClick={() => goTo(idx + 1)} 
          disabled={idx === guestKeys.length - 1 || isSliding}
        >
          Next
        </button>
      </div>
    </>
  );
}

// Individual guest card component
function GuestCard({ guest, isSliding, slideDirection, dimensions }) {
  const cardRef = useRef(null);
  const detailsRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [imagePosition, setImagePosition] = useState({ x: 0.5, y: 0.5 });

  // Optimized image move handler with null check and fix
  const handleImageMove = (e) => {
    if (!e || !e.currentTarget) return;

    const target = e.currentTarget;  // Capture synchronously
    const clientX = e.clientX;
    const clientY = e.clientY;

    requestAnimationFrame(() => {
      try {
        const rect = target.getBoundingClientRect();
        if (!rect) return;

        const x = (clientX - rect.left) / rect.width;
        const y = (clientY - rect.top) / rect.height;
        setImagePosition({ x, y });
      } catch (error) {
        console.error("Error in handleImageMove:", error);
        // Fallback to center position on error
        setImagePosition({ x: 0.5, y: 0.5 });
      }
    });
  };

  const handleImageLeave = () => {
    setImagePosition({ x: 0.5, y: 0.5 });
  };

  // Improved 3D card effect with proper null checking
  useEffect(() => {
    const card = cardRef.current;
    if (!card || expanded) return;

    let rafId = null;
    let isHovering = false;

    const handleMouseMove = (e) => {
      if (!e || !card) return;
      isHovering = true;

      if (rafId) return; // Skip if a frame is already scheduled

      rafId = requestAnimationFrame(() => {
        try {
          const rect = card.getBoundingClientRect();
          if (!rect) return;

          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          // Make rotation more subtle for mobile
          const isMobile = dimensions.width < 768;
          const multiplier = isMobile ? 5 : 10;

          const rotateX = ((y - centerY) / centerY) * multiplier;
          const rotateY = ((x - centerX) / centerX) * -multiplier;

          card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.04)`;
          card.style.transition = isHovering ? 'transform 0.05s ease-out' : 'transform 0.3s ease-out';
        } catch (error) {
          console.error("Error in 3D card effect:", error);
        }

        rafId = null;
      });
    };

    const handleMouseLeave = () => {
      isHovering = false;
      if (card) {
        card.style.transform = '';
        card.style.transition = 'transform 0.3s ease-out';
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (rafId) cancelAnimationFrame(rafId);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [guest?.Title, expanded, dimensions.width]);

  // Smoke effect based on scroll position with error handling
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const smoke = card.querySelector('.smoke-overlay');
    if (!smoke) return;

    const handleScroll = () => {
      requestAnimationFrame(() => {
        try {
          const rect = card.getBoundingClientRect();
          if (!rect) return;

          const windowHeight = window.innerHeight || 800;
          const cardMiddle = rect.top + rect.height / 2;
          const viewportMiddle = windowHeight / 2;
          const distance = Math.abs(cardMiddle - viewportMiddle);
          const maxDistance = windowHeight * 0.5;
          let opacity = Math.min(1, distance / maxDistance);
          opacity = Math.max(0.15, Math.min(1, opacity));

          smoke.style.opacity = opacity;
        } catch (error) {
          console.error("Error in scroll effect:", error);
        }
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initialize effect

    return () => window.removeEventListener('scroll', handleScroll);
  }, [guest?.Title]);

  // Details toggle handler
  useEffect(() => {
    const details = detailsRef.current;
    if (!details) return;
    const handleToggle = () => setExpanded(details.open);
    details.addEventListener('toggle', handleToggle);
    return () => details.removeEventListener('toggle', handleToggle);
  }, [guest?.Title]);

  // Determine card layout based on screen size
  const isMobile = dimensions.width < 768;

  let cardClass = "guest-card";
  if (expanded) cardClass += " expanded";
  if (isSliding && slideDirection) cardClass += ` slide-${slideDirection}`;

  if (!guest) return <div>Guest not found</div>;

  return (
    <div className={cardClass} ref={cardRef}>
      <div className="noise-overlay" />
      <div className={`guest-card-flex ${isMobile ? 'mobile' : ''}`}>
        <div 
          className="guest-image-wrapper" 
          onMouseMove={handleImageMove}
          onMouseLeave={handleImageLeave}
          style={{
            '--move-x': `${(imagePosition.x - 0.5) * 20}px`,
            '--move-y': `${(imagePosition.y - 0.5) * 20}px`
          }}
        >
          <div className="image-container">
            <Image
              src={guest.Image}
              alt={guest.Title}
              width={isMobile ? 400 : 300}
              height={isMobile ? 300 : 400}
              className="guest-image"
              style={{
                transform: isSliding ? 'scale(1.2)' : `translate(var(--move-x), var(--move-y))`,
                objectFit: 'cover',
              }}
              priority={true}
            />
          </div>
        </div>
        <div className="guest-content" style={{ position: "relative" }}>
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
  );
}

export default GuestsPage;