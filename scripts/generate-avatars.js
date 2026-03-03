const { createCanvas } = require("canvas");
const fs = require("fs");
const path = require("path");

const pirates = [
  "Ironbeard", "Stormfist", "Wavecutter", "Goldtooth", "Thunderjaw",
  "Sharpshot", "Blazecook", "Bonedoc", "Oakhand", "Seawhisper",
  "Nighteye", "Cannonblast", "Redmane", "Silveredge", "Tidereader",
  "Pepperflame", "Naildriver", "Drumtide", "Windbreaker", "Tombkeeper",
  "Crowsnest", "Brassbarrel", "Coinspin", "Bladefury", "Starpoint",
  "Deadaim", "Grillmaster", "Stitchbone", "Plankwalker", "Fiddle",
  "Ruddergrip", "Relicfinder", "Falconeye", "Powderkeg", "Silkpurse",
  "Scarjaw", "Cutlass", "Driftwood", "Longshot", "Sauceboss",
  "Salvehand", "Hammerdown", "Shantyking", "Keelhaul", "Bonedigger",
  "Skyscope", "Flintlock", "Pearltrader", "Blacktide", "GrandLineDrake",
];

const types = [
  "Captain", "Navigator", "Gunner", "Cook", "Doctor",
  "Shipwright", "Lookout", "Quartermaster", "Boatswain", "Musician",
];

const typeColors = {
  Captain:      { bg: "#1a0a2e", primary: "#d4a017", accent: "#ff6b35" },
  Navigator:    { bg: "#0a1628", primary: "#00bcd4", accent: "#4fc3f7" },
  Gunner:       { bg: "#1a0000", primary: "#f44336", accent: "#ff9800" },
  Cook:         { bg: "#1a1200", primary: "#ff9800", accent: "#ffeb3b" },
  Doctor:       { bg: "#001a0a", primary: "#4caf50", accent: "#81c784" },
  Shipwright:   { bg: "#1a0f00", primary: "#8d6e63", accent: "#d4a017" },
  Lookout:      { bg: "#0a0a1a", primary: "#7c4dff", accent: "#b388ff" },
  Quartermaster:{ bg: "#1a1a00", primary: "#d4a017", accent: "#ffd54f" },
  Boatswain:    { bg: "#00101a", primary: "#1a3a5c", accent: "#4fc3f7" },
  Musician:     { bg: "#1a001a", primary: "#e91e63", accent: "#f48fb1" },
};

function hashCode(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed) {
  let s = seed;
  return function() {
    s = (s * 16807 + 0) % 2147483647;
    return s / 2147483647;
  };
}

function generateAvatar(name, index) {
  const SIZE = 512;
  const canvas = createCanvas(SIZE, SIZE);
  const ctx = canvas.getContext("2d");
  const type = types[index % types.length];
  const colors = typeColors[type];
  const seed = hashCode(name);
  const rand = seededRandom(seed);

  // Background gradient
  const bgGrad = ctx.createRadialGradient(256, 256, 50, 256, 256, 360);
  bgGrad.addColorStop(0, colors.bg);
  bgGrad.addColorStop(1, "#000000");
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Draw decorative border
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 3;
  ctx.strokeRect(15, 15, SIZE - 30, SIZE - 30);
  ctx.strokeStyle = colors.accent + "60";
  ctx.lineWidth = 1;
  ctx.strokeRect(25, 25, SIZE - 50, SIZE - 50);

  // Background geometric patterns
  ctx.globalAlpha = 0.08;
  for (let i = 0; i < 12; i++) {
    const x = rand() * SIZE;
    const y = rand() * SIZE;
    const size = 30 + rand() * 80;
    ctx.strokeStyle = colors.accent;
    ctx.lineWidth = 1;
    ctx.beginPath();
    const sides = 3 + Math.floor(rand() * 5);
    for (let j = 0; j <= sides; j++) {
      const angle = (j / sides) * Math.PI * 2 + rand();
      const px = x + Math.cos(angle) * size;
      const py = y + Math.sin(angle) * size;
      if (j === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    }
    ctx.closePath();
    ctx.stroke();
  }
  ctx.globalAlpha = 1;

  // Head (circle)
  const headX = 256;
  const headY = 195;
  const headR = 85;

  // Head shadow
  const headGrad = ctx.createRadialGradient(headX - 15, headY - 15, 10, headX, headY, headR);
  headGrad.addColorStop(0, "#e8c39e");
  headGrad.addColorStop(0.7, "#d4a574");
  headGrad.addColorStop(1, "#b8864e");
  ctx.fillStyle = headGrad;
  ctx.beginPath();
  ctx.arc(headX, headY, headR, 0, Math.PI * 2);
  ctx.fill();

  // Eyes
  const eyeOffsetX = 28;
  const eyeY = headY - 5;

  // Eye whites
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.ellipse(headX - eyeOffsetX, eyeY, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.ellipse(headX + eyeOffsetX, eyeY, 16, 12, 0, 0, Math.PI * 2);
  ctx.fill();

  // Pupils - color varies by type
  ctx.fillStyle = colors.primary;
  ctx.beginPath();
  ctx.arc(headX - eyeOffsetX + 2, eyeY, 7, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headX + eyeOffsetX + 2, eyeY, 7, 0, Math.PI * 2);
  ctx.fill();

  // Pupil dots
  ctx.fillStyle = "#000000";
  ctx.beginPath();
  ctx.arc(headX - eyeOffsetX + 2, eyeY, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headX + eyeOffsetX + 2, eyeY, 4, 0, Math.PI * 2);
  ctx.fill();

  // Eye shine
  ctx.fillStyle = "#ffffff";
  ctx.beginPath();
  ctx.arc(headX - eyeOffsetX + 5, eyeY - 3, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(headX + eyeOffsetX + 5, eyeY - 3, 2, 0, Math.PI * 2);
  ctx.fill();

  // Eye patch for some pirates
  if (rand() > 0.6) {
    ctx.fillStyle = "#1a1a1a";
    ctx.beginPath();
    ctx.ellipse(headX - eyeOffsetX, eyeY, 20, 15, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(headX - eyeOffsetX - 20, eyeY - 10);
    ctx.lineTo(headX + 60, headY - 70);
    ctx.stroke();
  }

  // Mouth / Grin
  ctx.strokeStyle = "#5a3825";
  ctx.lineWidth = 3;
  ctx.beginPath();
  const mouthWidth = 25 + rand() * 15;
  ctx.arc(headX, headY + 25, mouthWidth, 0.1 * Math.PI, 0.9 * Math.PI);
  ctx.stroke();

  // Gold tooth for some
  if (rand() > 0.5) {
    ctx.fillStyle = "#d4a017";
    ctx.fillRect(headX + 5, headY + 22, 6, 8);
  }

  // Nose
  ctx.fillStyle = "#c4956a";
  ctx.beginPath();
  ctx.moveTo(headX, headY + 2);
  ctx.lineTo(headX - 8, headY + 18);
  ctx.lineTo(headX + 8, headY + 18);
  ctx.closePath();
  ctx.fill();

  // Hat - varies by type
  const hatStyle = Math.floor(rand() * 3);
  if (hatStyle === 0) {
    // Tricorn hat
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.moveTo(headX - 100, headY - 65);
    ctx.lineTo(headX, headY - 140);
    ctx.lineTo(headX + 100, headY - 65);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#2a2a3e";
    ctx.fillRect(headX - 90, headY - 75, 180, 20);
    // Skull emblem
    ctx.fillStyle = colors.primary;
    ctx.beginPath();
    ctx.arc(headX, headY - 100, 12, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1a1a2e";
    ctx.beginPath();
    ctx.arc(headX - 4, headY - 102, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(headX + 4, headY - 102, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (hatStyle === 1) {
    // Bandana
    ctx.fillStyle = colors.accent;
    ctx.beginPath();
    ctx.ellipse(headX, headY - 60, 90, 35, 0, Math.PI, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.primary;
    ctx.fillRect(headX - 85, headY - 62, 170, 8);
    // Knot
    ctx.beginPath();
    ctx.moveTo(headX + 70, headY - 55);
    ctx.lineTo(headX + 100, headY - 30);
    ctx.lineTo(headX + 90, headY - 25);
    ctx.lineTo(headX + 65, headY - 50);
    ctx.closePath();
    ctx.fill();
  } else {
    // Captain's bicorne
    ctx.fillStyle = "#0a0a2e";
    ctx.beginPath();
    ctx.moveTo(headX - 95, headY - 60);
    ctx.quadraticCurveTo(headX - 60, headY - 140, headX, headY - 110);
    ctx.quadraticCurveTo(headX + 60, headY - 140, headX + 95, headY - 60);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#1a1a3e";
    ctx.fillRect(headX - 90, headY - 70, 180, 18);
    // Feather
    ctx.strokeStyle = colors.primary;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(headX + 30, headY - 110);
    ctx.quadraticCurveTo(headX + 80, headY - 160, headX + 50, headY - 130);
    ctx.stroke();
  }

  // Beard - varies
  const beardStyle = Math.floor(rand() * 4);
  if (beardStyle === 0 || name.toLowerCase().includes("beard")) {
    // Full beard
    ctx.fillStyle = "#2a1a0a";
    if (rand() > 0.5) ctx.fillStyle = "#4a3020";
    ctx.beginPath();
    ctx.moveTo(headX - 55, headY + 30);
    ctx.quadraticCurveTo(headX - 65, headY + 100, headX, headY + 120);
    ctx.quadraticCurveTo(headX + 65, headY + 100, headX + 55, headY + 30);
    ctx.closePath();
    ctx.fill();
  } else if (beardStyle === 1) {
    // Goatee
    ctx.fillStyle = "#2a1a0a";
    ctx.beginPath();
    ctx.moveTo(headX - 15, headY + 40);
    ctx.quadraticCurveTo(headX, headY + 80, headX + 15, headY + 40);
    ctx.closePath();
    ctx.fill();
  } else if (beardStyle === 2) {
    // Sideburns
    ctx.fillStyle = "#3a2515";
    ctx.fillRect(headX - 75, headY - 10, 15, 55);
    ctx.fillRect(headX + 60, headY - 10, 15, 55);
  }

  // Scar for some
  if (rand() > 0.6) {
    ctx.strokeStyle = "#aa6655";
    ctx.lineWidth = 3;
    ctx.beginPath();
    const scarX = headX + (rand() > 0.5 ? 20 : -20);
    ctx.moveTo(scarX - 15, headY - 30);
    ctx.lineTo(scarX + 15, headY + 10);
    ctx.stroke();
  }

  // Body / Torso
  const bodyGrad = ctx.createLinearGradient(headX, headY + 80, headX, 420);
  bodyGrad.addColorStop(0, colors.primary);
  bodyGrad.addColorStop(1, colors.bg);
  ctx.fillStyle = bodyGrad;
  ctx.beginPath();
  ctx.moveTo(headX - 80, headY + 80);
  ctx.quadraticCurveTo(headX - 110, 350, headX - 100, 420);
  ctx.lineTo(headX + 100, 420);
  ctx.quadraticCurveTo(headX + 110, 350, headX + 80, headY + 80);
  ctx.closePath();
  ctx.fill();

  // Coat lapels
  ctx.strokeStyle = colors.accent;
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(headX - 20, headY + 80);
  ctx.lineTo(headX - 40, 420);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(headX + 20, headY + 80);
  ctx.lineTo(headX + 40, 420);
  ctx.stroke();

  // Belt
  ctx.fillStyle = "#2a1a0a";
  ctx.fillRect(headX - 85, 340, 170, 15);
  ctx.fillStyle = colors.primary;
  ctx.fillRect(headX - 12, 337, 24, 21);

  // Type-specific accessory
  const accessoryType = type;
  ctx.globalAlpha = 0.9;
  switch (accessoryType) {
    case "Captain":
      // Shoulder epaulettes
      ctx.fillStyle = "#d4a017";
      ctx.beginPath();
      ctx.ellipse(headX - 85, headY + 85, 20, 12, -0.3, 0, Math.PI * 2);
      ctx.fill();
      ctx.beginPath();
      ctx.ellipse(headX + 85, headY + 85, 20, 12, 0.3, 0, Math.PI * 2);
      ctx.fill();
      break;
    case "Navigator":
      // Compass pendant
      ctx.strokeStyle = "#00bcd4";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(headX, 310, 15, 0, Math.PI * 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(headX, 295); ctx.lineTo(headX, 325);
      ctx.moveTo(headX - 15, 310); ctx.lineTo(headX + 15, 310);
      ctx.stroke();
      break;
    case "Gunner":
      // Crossed bandolier
      ctx.strokeStyle = "#8b4513";
      ctx.lineWidth = 8;
      ctx.beginPath();
      ctx.moveTo(headX - 80, headY + 85);
      ctx.lineTo(headX + 60, 380);
      ctx.stroke();
      break;
    case "Cook":
      // Chef's mark
      ctx.fillStyle = "#ff9800";
      ctx.font = "bold 30px sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("🍖", headX + 70, 330);
      break;
    case "Doctor":
      // Cross symbol
      ctx.fillStyle = "#4caf50";
      ctx.fillRect(headX + 55, 290, 20, 8);
      ctx.fillRect(headX + 61, 284, 8, 20);
      break;
    case "Shipwright":
      // Wrench
      ctx.strokeStyle = "#8d6e63";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(headX + 60, 300);
      ctx.lineTo(headX + 85, 350);
      ctx.stroke();
      break;
    case "Lookout":
      // Telescope
      ctx.fillStyle = "#7c4dff";
      ctx.save();
      ctx.translate(headX + 75, headY + 30);
      ctx.rotate(0.8);
      ctx.fillRect(-5, -25, 10, 50);
      ctx.restore();
      break;
    case "Quartermaster":
      // Coin necklace
      for (let c = 0; c < 5; c++) {
        ctx.fillStyle = "#d4a017";
        ctx.beginPath();
        ctx.arc(headX - 30 + c * 15, headY + 85, 6, 0, Math.PI * 2);
        ctx.fill();
      }
      break;
    case "Boatswain":
      // Rope coil
      ctx.strokeStyle = "#c4a882";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(headX - 70, 330, 18, 0, Math.PI * 1.7);
      ctx.stroke();
      break;
    case "Musician":
      // Music note
      ctx.fillStyle = "#e91e63";
      ctx.beginPath();
      ctx.arc(headX + 65, 320, 8, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(headX + 72, 290, 3, 30);
      break;
  }
  ctx.globalAlpha = 1;

  // Name banner at bottom
  ctx.fillStyle = "#000000cc";
  ctx.fillRect(0, 430, SIZE, 82);

  ctx.fillStyle = colors.primary;
  ctx.font = "bold 28px sans-serif";
  ctx.textAlign = "center";
  ctx.fillText(name, headX, 462);

  ctx.fillStyle = colors.accent;
  ctx.font = "16px sans-serif";
  ctx.fillText(type, headX, 488);

  // Corner accents
  const cornerSize = 20;
  ctx.strokeStyle = colors.primary;
  ctx.lineWidth = 2;
  // Top-left
  ctx.beginPath();
  ctx.moveTo(8, 8 + cornerSize); ctx.lineTo(8, 8); ctx.lineTo(8 + cornerSize, 8);
  ctx.stroke();
  // Top-right
  ctx.beginPath();
  ctx.moveTo(SIZE - 8 - cornerSize, 8); ctx.lineTo(SIZE - 8, 8); ctx.lineTo(SIZE - 8, 8 + cornerSize);
  ctx.stroke();
  // Bottom-left
  ctx.beginPath();
  ctx.moveTo(8, SIZE - 8 - cornerSize); ctx.lineTo(8, SIZE - 8); ctx.lineTo(8 + cornerSize, SIZE - 8);
  ctx.stroke();
  // Bottom-right
  ctx.beginPath();
  ctx.moveTo(SIZE - 8 - cornerSize, SIZE - 8); ctx.lineTo(SIZE - 8, SIZE - 8); ctx.lineTo(SIZE - 8, SIZE - 8 - cornerSize);
  ctx.stroke();

  return canvas.toBuffer("image/png");
}

const outDir = path.join(__dirname, "..", "public", "pirates");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

pirates.forEach((name, i) => {
  const buffer = generateAvatar(name, i);
  const filePath = path.join(outDir, `${name.toLowerCase()}.png`);
  fs.writeFileSync(filePath, buffer);
  console.log(`Generated: ${filePath}`);
});

console.log(`\nDone! Generated ${pirates.length} pirate avatars.`);
