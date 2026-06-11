// ============================================================
// Week 2 Example 2: Platformer with Platforms Array
// ============================================================


let bgImage;
let playerImage;

let platforms = [
  // { x, y, w, h }
  { x: 0,   y: 410, w: 800, h: 40 }, 
  { x: 80,  y: 310, w: 120, h: 16 }, 
  { x: 280, y: 240, w: 140, h: 16 }, 
  { x: 500, y: 170, w: 120, h: 16 }, 
  { x: 160, y: 150, w: 100, h: 16 }, 
  { x: 360, y: 320, w: 110, h: 16 }, 
  { x: 620, y: 290, w: 130, h: 16 }, 
];


let player = {
  x: 100,
  y: 100,

  vx: 0, 
  vy: 0, 

  r: 20, 

  speed: 0.55,    
  maxSpeed: 4.5,  
  jumpForce: -12, 
  friction: 0.78, 
  onGround: false, 
};


const GRAVITY = 0.6; 

let blobT = 0;

const PLATFORM_COLOR = [255, 160, 50]; 



function preload() {
  
bgImage = loadImage("background.png");
playerImage = loadImage("player.png");
}



function setup() {
  createCanvas(800, 450);

  player.y = platforms[0].y - player.r;
}


function draw() {
image(bgImage, 0, 0, width, height);
  handleInput();
  applyPhysics();
  resolvePlatformCollisions();

  drawPlatforms();
  drawPlayer();
  drawHUD();

  blobT += 0.015; 
}

function handleInput() {
  if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) { 
    player.vx -= player.speed;
  }
  if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) { 
    player.vx += player.speed;
  }


  player.vx = constrain(player.vx, -player.maxSpeed, player.maxSpeed);

  if (
    !keyIsDown(LEFT_ARROW) &&
    !keyIsDown(65) &&
    !keyIsDown(RIGHT_ARROW) &&
    !keyIsDown(68)
  ) {
    player.vx *= player.friction;
  }

 
  if ((keyIsDown(UP_ARROW) || keyIsDown(87)) && player.onGround) { 
    player.vy = player.jumpForce;
    player.onGround = false;
  }
}


function applyPhysics() {
  player.vy += GRAVITY;

  player.x += player.vx;
  player.y += player.vy;

  player.x = constrain(player.x, player.r, width - player.r);

  if (player.y > height + 100) {
    player.x = 100;
    player.y = platforms[0].y - player.r;
    player.vx = 0;
    player.vy = 0;
  }

  player.onGround = false;
}

function resolvePlatformCollisions() {
  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];

    let playerLeft   = player.x - player.r;
    let playerRight  = player.x + player.r;
    let playerBottom = player.y + player.r;

    let platLeft  = p.x;
    let platRight = p.x + p.w;
    let platTop   = p.y;


    let overlapsHorizontally = playerRight > platLeft && playerLeft < platRight;

  
    let landingOnTop =
      player.vy >= 0 &&
      playerBottom >= platTop &&
      playerBottom <= platTop + 20;

    if (overlapsHorizontally && landingOnTop) {
      player.y = platTop - player.r; 
      player.vy = 0;                
      player.onGround = true;        
    }
  }
}


function drawPlatforms() {
  fill(PLATFORM_COLOR[0], PLATFORM_COLOR[1], PLATFORM_COLOR[2]);
  noStroke();

  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];
    rect(p.x, p.y, p.w, p.h, 6); 
  }
}


function drawPlayer() {
  push();
  imageMode(CENTER);

  image(playerImage, player.x, player.y, player.r * 5, player.r * 5);

  pop();
}


g
function drawHUD() {
  fill(180);
  noStroke();
  textSize(13);
  textAlign(LEFT);
  text("Move: Arrow Keys or WASD   Jump: W or Up Arrow", 16, 24);
}
