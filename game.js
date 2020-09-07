console.log('Flappy Bird - @maganezf');

const sources = new Image();
sources.src = './sprites.png';

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');


const floor = {
  sourceX: 0,
  sourceY: 610,
  width: 224,
  height: 112,
  x: 0,
  y: canvas.height - 112,

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

const flappyBird = {
  sourceX: 0,
  sourceY: 0,
  width: 33,
  height: 24,
  x: 10,
  y: 50,
  gravity: 0.25,
  speed: 0,

  refresh() {
    flappyBird.speed = flappyBird.speed + flappyBird.gravity;
    flappyBird.y = flappyBird.y + flappyBird.speed;
  },

  create() {
    context.drawImage(
      sources,
      flappyBird.sourceX, flappyBird.sourceY,
      flappyBird.width, flappyBird.height,
      flappyBird.x, flappyBird.y,
      flappyBird.width, flappyBird.height
    );
  }
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

let currentScreen = {};

function switchScreenOfGame (screen) {
  currentScreen = screen;
}

const screens = {
  start: {
    create () {
      background.create();
      floor.create();
      flappyBird.create();
      homeScreen.create();
    },

    click(){
      switchScreenOfGame(screens.Game);
    },

    refresh() {
      
    }
  }
   
}

screens.Game = {
  create () {
    background.create();
    floor.create();
    flappyBird.create();
  },

  refresh() {
    flappyBird.refresh();
  }
}

function loop () {
  
  currentScreen.create();
  currentScreen.refresh();

  requestAnimationFrame(loop);
}

window.addEventListener('click', () => {
  if (currentScreen.click){
    currentScreen.click();
  }
});

switchScreenOfGame(screens.start);
loop();