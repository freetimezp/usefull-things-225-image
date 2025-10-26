const container = document.querySelector(".container");

container.addEventListener("mousemove", (e) => {
    const { left, top, width, height } = container.getBoundingClientRect();
    const x = ((e.clientX - left - width / 2) / width) * 20;
    const y = ((e.clientY - top - height / 2) / height) * -20;

    container.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

container.addEventListener("mouseleave", () => {
    container.style.transform = `rotateY(0deg) rotateX(0deg)`;
});

const canvas = document.getElementById("blinks");
const ctx = canvas.getContext("2d");

canvas.width = innerWidth;
canvas.height = innerHeight;

const blinks = [];
const MAX_BLINKS = 20;

class Blink {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 150 + 50;
        this.life = 0;
        this.maxLife = Math.random() * 120 + 80;
        this.opacity = 0;
        this.active = true;
        this.color = Math.random() > 0.5 ? "255,215,0" : "255,255,230"; // gold/white mix
    }

    update() {
        this.life++;
        const progress = this.life / this.maxLife;

        // Fade in, hold, fade out
        if (progress < 0.2) this.opacity = progress / 0.2;
        else if (progress < 0.8) this.opacity = 1;
        else this.opacity = (1 - progress) / 0.2;

        if (this.life > this.maxLife) this.reset();
    }

    draw() {
        const grad = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.r);
        grad.addColorStop(0, `rgba(${this.color},${this.opacity * 0.5})`);
        grad.addColorStop(0.5, `rgba(${this.color},${this.opacity * 0.2})`);
        grad.addColorStop(1, `rgba(${this.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fill();
    }
}

// Initialize
for (let i = 0; i < MAX_BLINKS; i++) {
    blinks.push(new Blink());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    blinks.forEach((b) => {
        b.update();
        b.draw();
    });

    requestAnimationFrame(animate);
}
animate();

// Adjust on resize
window.addEventListener("resize", () => {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
});
