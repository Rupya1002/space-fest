'use client';
import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import "./submission.css";
import Image from "next/image";
import Navbar from '../components/navbar/page';
export default function SubmissionPage() {
  const canvasRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
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
        ctx.drawImage(rockImg, -rock.size * 1.5, -rock.size * 1.5, rock.size * 3, rock.size * 3);
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
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="submission-root">
      <Navbar />
      <canvas ref={canvasRef} className="submission-bg-canvas" />
      <div className="submission-container">
        <div className="submission-card">
          <div className="submission-card-content">
            <div className="success-icon">
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Submission Successful!</h1>
            <p>
              Thank you for reaching out.<br />
              Your query has been submitted successfully.<br />
              Our team will get back to you soon.
            </p>
            <button className="submission-btn" onClick={() => router.push('/')}>
              Back to Home
            </button>
          </div>
        </div>
        <div className="astronaut-wrapper">
          <div className="astronaut-glow"></div>
        <Image
  src="/astronaut.png"
  alt="floating astronaut"
  className="astronaut-img"
  width={500}      
  height={500}
/>

        </div>
      </div>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css" />
    </div>
  );
}