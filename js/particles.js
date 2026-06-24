// ============================================
// 🎨 Particle Background Animation
// Canvas-based particles — สีฟ้า/น้ำเงิน
// ============================================

class ParticleBackground {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: null, y: null };
    this.animationId = null;
    
    this.config = {
      particleCount: 80,
      particleSize: { min: 1, max: 3 },
      speed: { min: 0.2, max: 0.8 },
      connectionDistance: 150,
      mouseRadius: 120,
      colors: [
        'rgba(59, 130, 246, 0.6)',   // Blue
        'rgba(96, 165, 250, 0.5)',   // Light Blue
        'rgba(6, 182, 212, 0.5)',    // Cyan
        'rgba(34, 211, 238, 0.4)',   // Light Cyan
        'rgba(147, 197, 253, 0.4)',  // Pale Blue
      ]
    };
    
    this.init();
  }
  
  init() {
    this.resize();
    this.createParticles();
    this.addEventListeners();
    this.animate();
  }
  
  resize() {
    this.canvas.width = this.canvas.offsetWidth;
    this.canvas.height = this.canvas.offsetHeight;
  }
  
  createParticles() {
    this.particles = [];
    const count = window.innerWidth < 768 ? this.config.particleCount / 2 : this.config.particleCount;
    
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        size: Math.random() * (this.config.particleSize.max - this.config.particleSize.min) + this.config.particleSize.min,
        speedX: (Math.random() - 0.5) * this.config.speed.max,
        speedY: (Math.random() - 0.5) * this.config.speed.max,
        color: this.config.colors[Math.floor(Math.random() * this.config.colors.length)],
        opacity: Math.random() * 0.5 + 0.3
      });
    }
  }
  
  addEventListeners() {
    window.addEventListener('resize', () => {
      this.resize();
      this.createParticles();
    });
    
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });
    
    this.canvas.addEventListener('mouseleave', () => {
      this.mouse.x = null;
      this.mouse.y = null;
    });
  }
  
  drawParticle(p) {
    this.ctx.beginPath();
    this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    this.ctx.fillStyle = p.color;
    this.ctx.fill();
  }
  
  drawConnections() {
    for (let i = 0; i < this.particles.length; i++) {
      for (let j = i + 1; j < this.particles.length; j++) {
        const dx = this.particles[i].x - this.particles[j].x;
        const dy = this.particles[i].y - this.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.config.connectionDistance) {
          const opacity = (1 - dist / this.config.connectionDistance) * 0.3;
          this.ctx.beginPath();
          this.ctx.strokeStyle = `rgba(96, 165, 250, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
          this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
          this.ctx.stroke();
        }
      }
    }
  }
  
  updateParticles() {
    this.particles.forEach(p => {
      p.x += p.speedX;
      p.y += p.speedY;
      
      // Bounce off edges
      if (p.x < 0 || p.x > this.canvas.width) p.speedX *= -1;
      if (p.y < 0 || p.y > this.canvas.height) p.speedY *= -1;
      
      // Mouse interaction
      if (this.mouse.x !== null && this.mouse.y !== null) {
        const dx = p.x - this.mouse.x;
        const dy = p.y - this.mouse.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        
        if (dist < this.config.mouseRadius) {
          const force = (this.config.mouseRadius - dist) / this.config.mouseRadius;
          p.x += dx * force * 0.02;
          p.y += dy * force * 0.02;
        }
      }
    });
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.updateParticles();
    this.drawConnections();
    this.particles.forEach(p => this.drawParticle(p));
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  destroy() {
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }
}

// Auto-init when DOM ready
document.addEventListener('DOMContentLoaded', () => {
  const heroCanvas = document.getElementById('hero-particles');
  if (heroCanvas) {
    new ParticleBackground('hero-particles');
  }
});
