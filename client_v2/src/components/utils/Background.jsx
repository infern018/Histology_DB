// Background.js
import React, { useEffect, useRef } from "react";

const Background = () => {
	const canvasRef = useRef(null);

	useEffect(() => {
		const canvas = canvasRef.current;
		const ctx = canvas.getContext("2d");

		let particles = [];
		const numParticles = 100;

		class Particle {
			constructor() {
				// Set initial position to the center of the canvas
				this.x = Math.random() * canvas.width; // Randomize the x position
				this.y = Math.random() * canvas.height; // Randomize the y position
				this.radius = Math.random() * 3 + 1;
				this.color = `rgba(255, 255, 255, 0.8)`;
				this.speedX = (Math.random() - 0.5) * 2;
				this.speedY = (Math.random() - 0.5) * 2;
			}

			update() {
				this.x += this.speedX;
				this.y += this.speedY;

				// Bounce off the edges
				if (this.x > canvas.width || this.x < 0) this.speedX *= -1;
				if (this.y > canvas.height || this.y < 0) this.speedY *= -1;
			}

			draw() {
				ctx.fillStyle = this.color;
				ctx.beginPath();
				ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
				ctx.fill();
			}
		}

		function init() {
			for (let i = 0; i < numParticles; i++) {
				particles.push(new Particle());
			}
		}

		function animate() {
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			particles.forEach((particle) => {
				particle.update();
				particle.draw();
			});
			requestAnimationFrame(animate);
		}

		init();
		animate();

		// Set canvas size
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;

		// Resize canvas on window resize
		window.addEventListener("resize", () => {
			canvas.width = window.innerWidth;
			canvas.height = window.innerHeight;
		});

		return () => {
			window.removeEventListener("resize", () => {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			});
		};
	}, []);

	return (
		<canvas
			ref={canvasRef}
			style={{
				position: "fixed",
				top: 0,
				left: 0,
				zIndex: -1,
				pointerEvents: "none",
			}}
		/>
	);
};

export default Background;
