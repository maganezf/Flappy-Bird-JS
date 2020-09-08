console.log('Flappy Bird - @maganezf');

let frames = 0;

const hit_sound = new Audio();
hit_sound.src = './sounds/hit.wav'

const sources = new Image();
sources.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');

function createFloor() {

  const floor = {
    sourceX: 0,
    sourceY: 610,
    width: 224,
    height: 112,
    x: 0,
    y: canvas.height - 112,
  
    refresh() {
      const movedFloor = 1;
      const repeatFloor = floor.width / 2;
      const movementFloor = floor.x - movedFloor;

      /* console.log('[floor.x]', floor.x);
      console.log('[repeatFloor]', repeatFloor);
      console.log('[movementFloor]', movementFloor); */

      floor.x = movementFloor % repeatFloor;
    },
  
    create() {
      context.drawImage(
        sources,
        floor.sourceX, floor.sourceY,
        floor.width, floor.height,
        floor.x, floor.y,
        floor.width, floor.height
      );
  
      context.drawImage(
        sources,
        floor.sourceX, floor.sourceY,
        floor.width, floor.height,
        floor.x + floor.width, floor.y,
        floor.width, floor.height
      );
    }
  }
  return floor;

}


const background = {
  sourceX: 390,
  sourceY: 0,
  width: 275,
  height: 204,
  x: 0,
  y: canvas.height - 204,

  create() {
    context.fillStyle = '#70c5ce';
    context.fillRect(0, 0, canvas.width, canvas.height);

    context.drawImage(
      sources,
      background.sourceX, background.sourceY,
      background.width, background.height,
      background.x, background.y,
      background.width, background.height,
    );

    context.drawImage(
      sources,
      background.sourceX, background.sourceY,
      background.width, background.height,
      background.x + background.width, background.y,
      background.width, background.height,
    );
  }
}

function madeCollision(flappyBird, floor) {
  const flappyBirdY = flappyBird.y + flappyBird.height;
  const floorY = floor.y;

  if (flappyBirdY >= floorY) {
    return true;
  } else {
    return false;
  }
}

function createFlappyBird() {

  const flappyBird = {
    sourceX: 0,
    sourceY: 0,
    width: 33,
    height: 24,
    x: 10,
    y: 50,
    gravity: 0.25,
    speed: 0,
    jump_set: 4.6,
    
    jump() {
      console.log("[antes]", flappyBird.speed);
      flappyBird.speed = -flappyBird.jump_set;
      console.log("[depois]", flappyBird.speed);
    },
  
    refresh() {
  
      if (madeCollision(flappyBird, globals.floor)){
        //made a collision
        hit_sound.play();
        switchScreenOfGame(start);
        return;
      }
      
      flappyBird.speed = flappyBird.speed + flappyBird.gravity;
      flappyBird.y = flappyBird.y + flappyBird.speed;
    },

    movementsWing: [
      { sourceX: 0, sourceY: 0 },    //Wing Up
      { sourceX: 0, sourceY: 25 },   //Wing mid
      { sourceX: 0, sourceY: 51 },   //Wing down
      { sourceX: 0, sourceY: 26 },   //wing mid 
    ],

    currentFrames: 0,
    
    refreshCurrentFrames () {
      const framesInterval = 10;
      const intervalExceeded = frames % framesInterval === 0;
      console.log('[passou intervalo]', intervalExceeded);
      
      if (intervalExceeded) {
        const initIncrement = 1;
        const increment = initIncrement + flappyBird.currentFrames;
        const repeatIncrement = flappyBird.movementsWing.length;
        flappyBird.currentFrames = increment % repeatIncrement;
      }
    },
    
    create() {
      flappyBird.refreshCurrentFrames();

      const { sourceX, sourceY } = flappyBird.movementsWing[flappyBird.currentFrames];

      context.drawImage(
        sources,
        sourceX, sourceY,
        flappyBird.width, flappyBird.height,
        flappyBird.x, flappyBird.y,
        flappyBird.width, flappyBird.height
      );
    }
  }
  return flappyBird;
}


const homeScreen = {
  sourceX: 134,
  sourceY: 0,
  width: 174,
  height: 152,
  x: (canvas.width / 2) - 174 / 2 ,
  y: 50,

  create() {
    context.drawImage(
      sources,
      homeScreen.sourceX, homeScreen.sourceY,
      homeScreen.width, homeScreen.height,
      homeScreen.x, homeScreen.y,
      homeScreen.width, homeScreen.height
    );
  }
}

const globals = {};
let currentScreen = {};

function switchScreenOfGame (newScreen) {
  currentScreen = newScreen;
  
  if (currentScreen.initialize){
    currentScreen.initialize();
  }
}

const screens = {

  start: {

    initialize(){
      globals.flappyBird = createFlappyBird();
      globals.floor = createFloor();
    },

    create () {
      background.create();
      globals.flappyBird.create();
      globals.floor.create();

      homeScreen.create();
    },

    click(){
      switchScreenOfGame(screens.Game);
    },

    refresh() {
      globals.floor.refresh();
    }
  }
   
}

screens.Game = {
  create () {
    background.create();
    globals.floor.create();
    globals.flappyBird.create();
  },

  click(){
    globals.flappyBird.jump();
  },

  refresh() {
    globals.flappyBird.refresh();
   }
}

function loop () {
  
  currentScreen.create();
  currentScreen.refresh();

  frames = frames + 1;

  requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
  if (currentScreen.click){
    currentScreen.click();
  }
});

switchScreenOfGame(screens.start);
loop();