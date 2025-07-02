const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let resources = { wood: 0, stone: 0, gold: 0 };
let playerHp = 100, enemyHp = 100;
let units = [], enemyUnits = [], buildings = [];
let buildingCounts = { barracks: 0, mine: 0, goldmine: 0, barricade: 0 };

function updateUI() {
  document.getElementById("wood").textContent = resources.wood;
  document.getElementById("stone").textContent = resources.stone;
  document.getElementById("gold").textContent = resources.gold;
  document.getElementById("playerHp").textContent = playerHp;
  document.getElementById("enemyHp").textContent = enemyHp;
  document.getElementById("barracksLvl").textContent = buildingCounts.barracks;
  document.getElementById("mineLvl").textContent = buildingCounts.mine;
  document.getElementById("goldmineLvl").textContent = buildingCounts.goldmine;
  document.getElementById("barricadeBuilt").textContent = buildingCounts.barricade ? "Yes" : "No";
  document.getElementById("woodRate").textContent = (buildingCounts.mine / 2).toFixed(1);
  document.getElementById("goldRate").textContent = (buildingCounts.goldmine / 2).toFixed(1);
}

function gather(type) {
  resources[type]++;
  updateUI();
}

function build(type) {
  if (type === 'barracks' && resources.wood >= 10) {
    resources.wood -= 10;
    buildingCounts.barracks++;
    buildings.push({ type, x: 100 });
  } else if (type === 'mine' && resources.stone >= 10) {
    resources.stone -= 10;
    buildingCounts.mine++;
    buildings.push({ type, x: 130 });
  } else if (type === 'goldmine' && resources.gold >= 10) {
    resources.gold -= 10;
    buildingCounts.goldmine++;
    buildings.push({ type, x: 160 });
  } else if (type === 'barricade' && resources.stone >= 10 && !buildingCounts.barricade) {
    resources.stone -= 10;
    buildingCounts.barricade = 1;
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
  if (buildingCounts.barricade) {
    ctx.fillStyle = "brown";
    ctx.fillRect(65, 180, 10, 30); // barricade
  }
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

  for (let e of enemyUnits) {
    e.x -= 1;
    ctx.fillStyle = "red";
    ctx.fillRect(e.x, e.y, 10, 10);
    const hitX = buildingCounts.barricade ? 65 : 30;
    if (e.x <= hitX) {
      if (!buildingCounts.barricade) {
        playerHp -= e.damage;
      }
      e.x = -100; // remove enemy
    }
  }

  updateUI();

  if (playerHp <= 0) {
    alert("You lost!");
    location.reload();
    return;
  }

  if (enemyHp <= 0) {
    alert("You win!");
    location.reload();
  }

  requestAnimationFrame(draw);
}

function startGame() {
  document.getElementById("tutorial").style.display = "none";
  setInterval(() => {
    resources.wood += buildingCounts.mine;
    resources.gold += buildingCounts.goldmine;
    updateUI();
  }, 2000);

  setInterval(() => {
    enemyUnits.push({ x: 820, y: 200, damage: 5 });
  }, 7000); // enemy wave every 7 seconds

  draw();
}
