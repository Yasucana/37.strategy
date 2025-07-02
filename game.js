const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let resources = { wood: 0, stone: 0, gold: 0 };
let playerHp = 100, enemyHp = 100;
let units = [], buildings = [];

function updateUI() {
  document.getElementById("wood").textContent = resources.wood;
  document.getElementById("stone").textContent = resources.stone;
  document.getElementById("gold").textContent = resources.gold;
  document.getElementById("playerHp").textContent = playerHp;
  document.getElementById("enemyHp").textContent = enemyHp;
}

function gather(type) {
  resources[type]++;
  updateUI();
}

function build(type) {
  if (type === 'barracks' && resources.wood >= 10) {
    resources.wood -= 10;
    buildings.push({ type, x: 100 });
  } else if (type === 'mine' && resources.stone >= 10) {
    resources.stone -= 10;
    buildings.push({ type, x: 130 });
  } else if (type === 'goldmine' && resources.gold >= 10) {
    resources.gold -= 10;
    buildings.push({ type, x: 160 });
  }
  updateUI();
}

function spawnUnit() {
  if (resources.gold >= 5) {
    resources.gold -= 5;
    units.push({ x: 200, y: 200, hp: 10 });
    updateUI();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "blue";
  ctx.fillRect(30, 180, 30, 30); // player base
  ctx.fillStyle = "red";
  ctx.fillRect(830, 180, 30, 30); // enemy base

  for (let b of buildings) {
    ctx.fillStyle = b.type === "barracks" ? "gray" : b.type === "mine" ? "brown" : "gold";
    ctx.fillRect(b.x, 300, 20, 20);
  }

  for (let u of units) {
    u.x += 1;
    ctx.fillStyle = "blue";
    ctx.fillRect(u.x, u.y, 10, 10);
    if (u.x > 830) {
      enemyHp -= 1;
      u.x = -100; // remove unit
    }
  }

  updateUI();

  if (enemyHp <= 0) {
    alert("You win!");
    location.reload();
  }

  requestAnimationFrame(draw);
}

function startGame() {
  document.getElementById("tutorial").style.display = "none";
  setInterval(() => {
    resources.wood += buildings.filter(b => b.type === 'mine').length;
    resources.gold += buildings.filter(b => b.type === 'goldmine').length;
    updateUI();
  }, 2000);

  setInterval(() => {
    playerHp -= 5;
    if (playerHp <= 0) {
      alert("You lost!");
      location.reload();
    }
  }, 7000); // enemy wave every 7 seconds

  draw();
}
