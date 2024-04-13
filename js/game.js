const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let targets = []; // Tableau pour stocker les cibles

function Target(x, y, radius) {
  this.x = x;
  this.y = y;
  this.radius = radius;
}

function generateRandomTarget() {
  const radius = Math.floor(Math.random() * 20) + 10; // Taille aléatoire entre 10 et 30
  const x = Math.floor(Math.random() * (canvas.width - 2 * radius)) + radius;
  const y = Math.floor(Math.random() * (canvas.height - 2 * radius)) + radius;
  return new Target(x, y, radius);
}

function drawTarget(target) {
  ctx.beginPath();
  ctx.arc(target.x, target.y, target.radius, 0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.fill();
  ctx.closePath();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function shoot(event) {
  const rect = canvas.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const mouseY = event.clientY - rect.top;

  targets.forEach((target, index) => {
    const distance = Math.sqrt((mouseX - target.x) ** 2 + (mouseY - target.y) ** 2);
    if (distance <= target.radius) {
      targets.splice(index, 1); // Supprime la cible touchée
      generateNewTarget(); // Génère une nouvelle cible
    }
  });
}

canvas.addEventListener("mousedown", shoot);

function generateNewTarget() {
  const newTarget = generateRandomTarget();
  targets.push(newTarget);
}

function draw() {
  clearCanvas();
  targets.forEach(drawTarget);
  requestAnimationFrame(draw);
}

generateNewTarget(); // Génère une cible initiale
draw();