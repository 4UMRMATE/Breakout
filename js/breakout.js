var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 800;
/* Constants for bricks */
var NUM_ROWS = 8;
var BRICK_TOP_OFFSET = 15;
var BRICK_SPACING = 2;
var NUM_BRICKS_PER_ROW = 10;
var BRICK_HEIGHT = CANVAS_HEIGHT / 50;
var SPACE_FOR_BRICKS = CANVAS_WIDTH - (NUM_BRICKS_PER_ROW + 1) * BRICK_SPACING;
var BRICK_WIDTH = SPACE_FOR_BRICKS / NUM_BRICKS_PER_ROW;

/* Constants for ball and paddle */
var PADDLE_WIDTH = CANVAS_WIDTH / 8;
var PADDLE_HEIGHT = CANVAS_HEIGHT / 40;
var PADDLE_OFFSET = 10;

var BALL_RADIUS = 15;
//
var BALL_COLOR = "#FFFFFF";
var PADDLE_COLOR = "#FFFFFF";
var BACKGROUND_COLOR = "#000000";
/* Ball Movement Parameters */
var BALL_DX = 2.5;
var BALL_DY = 2.5;
var speed = 2.5;
var starting_dx = 2.5;
var starting_dy = 2.5;

/* Main Objects */

// Menu
var menuBackground;
/* Main Buttons */
var MENU_SPACING = 5;
var gameTitle;
var TITLE_WIDTH = CANVAS_WIDTH / 2;
var TITLE_HEIGHT = TITLE_WIDTH / 2;
var TITLE_X = CANVAS_WIDTH / 2 - TITLE_WIDTH / 2;
var TITLE_Y = TITLE_HEIGHT;
var gameTitleText;
var menuButton;
var MENU_BUTTONS_WIDTH = CANVAS_WIDTH / 3;
var MENU_BUTTONS_HEIGHT = CANVAS_HEIGHT / 8;
var MENU_BUTTONS_X = TITLE_X + MENU_BUTTONS_WIDTH / 4;
var MENU_BUTTONS_Y = TITLE_Y + TITLE_HEIGHT + MENU_SPACING;
var menuButtonText;
// Settings Menu
var exitSettingsMenu;
var exitSettingsButtonRadius = (CANVAS_HEIGHT / CANVAS_WIDTH) * 12.5;
var exitSettingsMenuText;
var settingsMenu;
var settingsMenuText;
var SOUNDS_ON = true;
var SOUNDS_STATE = "SOUNDS: ON";

// Button Sounds
var backgroundSound;
var buttonClickSound;
var playButtonSound;
var bricksCrashSound;
var pausedSound;
var gameOverSound;
var gameWinSound;

// Objects
var background;
var brick;
var ball;
var paddle;
//
var message;
var hint;

/* Game Details */
var scoreBox;
var highScoreBox;
var livesBox1;
var livesBox2;
var livesBox3;

/* Main Booleans */
var GAME_OVER = false;
var GAME_WON = false;
var GAME_PAUSED = false;

/* Main Counters */
var SCORE = 0;
var HIGHSCORE = 0;
var LIVES_LEFT = 3;

/* Some Helper Vars */
var COLOR;
var X_AXIS = 0;
var Y_AXIS = 1;

window.onload = function () {
  start();
};

function start() {
  enterMainMenu();
  playBackgroundSound();
}

function enterMainMenu() {
  removeAll();

  drawMenu();
  mouseClickMethod(menuButtons);
}

function drawMenu() {
  /* Background */
  menuBackground = new WebImage("./images/background.png");
  menuBackground.setSize(getWidth(), getHeight());
  add(menuBackground);

  buttonClickSound = new Audio("./sounds/clickSound.wav");

  playButtonSound = new Audio("./sounds/play.mp3");

  // Game Title
  drawBoxWithTitle(TITLE_HEIGHT, "Breakout By .MS.", "20pt Monaco");

  // Menu Buttons
  drawMenuButtons(
    MENU_BUTTONS_X,
    MENU_BUTTONS_Y,
    "PLAY",
    getWidth() / 2 - MENU_BUTTONS_WIDTH / 8,
    MENU_BUTTONS_Y + MENU_BUTTONS_HEIGHT / 2 + MENU_SPACING,
    "20pt Monaco"
  );
  drawMenuButtons(
    MENU_BUTTONS_X,
    MENU_BUTTONS_Y + MENU_BUTTONS_HEIGHT + MENU_SPACING,
    "SETTINGS",
    getWidth() / 2 - menuButtonText.getWidth(),
    MENU_BUTTONS_Y +
      MENU_BUTTONS_HEIGHT +
      MENU_SPACING +
      MENU_BUTTONS_HEIGHT / 2,
    "20pt Monaco"
  );
}

function menuButtons(e) {
  var button = getElementAt(e.getX(), e.getY());
  if (button != null && button.width <= MENU_BUTTONS_WIDTH) {
    //alert(JSON.stringify(button));
    if (
      (button.x >= MENU_BUTTONS_X &&
        button.x <= MENU_BUTTONS_X + MENU_BUTTONS_WIDTH &&
        button.y >= MENU_BUTTONS_Y &&
        button.y <= MENU_BUTTONS_Y + MENU_BUTTONS_HEIGHT) ||
      button.label == "PLAY"
    ) {
      play();
      playButtonSound.play();
    } else if (
      button.x >= MENU_BUTTONS_X &&
      button.x <= MENU_BUTTONS_X + MENU_BUTTONS_WIDTH &&
      button.y >= MENU_BUTTONS_Y + MENU_BUTTONS_HEIGHT + MENU_SPACING &&
      button.y <= MENU_BUTTONS_Y + MENU_BUTTONS_HEIGHT * 2 + MENU_SPACING
    ) {
      enterSettingsMenu();
      buttonClicked();
    }
  }
}

function drawBoxWithTitle(height, text, font) {
  gameTitle = new Rectangle(TITLE_WIDTH, height);
  gameTitle.setColor(Color.white);
  gameTitle.setPosition(TITLE_X, TITLE_Y);
  add(gameTitle);

  gameTitleText = new Text(text, font);
  gameTitleText.setColor(Color.black);
  gameTitleText.setPosition(
    (getWidth() - gameTitleText.getWidth()) / 2,
    TITLE_Y + TITLE_HEIGHT / 2
  );
  add(gameTitleText);
}

function drawMenuButtons(buttonsX, buttonsY, text, textX, textY, font) {
  menuButton = new Rectangle(MENU_BUTTONS_WIDTH, MENU_BUTTONS_HEIGHT);
  menuButton.setColor(Color.white);
  menuButton.setPosition(buttonsX, buttonsY);
  add(menuButton);

  menuButtonText = new Text(text, font);
  menuButtonText.setColor(Color.black);
  menuButtonText.setPosition(textX, textY);
  add(menuButtonText);
}
//=== END OF MAIN MENU

function play() {
  removeAll();
  addBackground(Color.white);

  // Game Details
  updateDetails();
  updateLives();

  /* Bricks
   *
   * I tried to create flexible functions,
   * so thats the reason for so many parameters :P
   */
  drawBricksPattern(NUM_ROWS, NUM_BRICKS_PER_ROW, BRICK_WIDTH, BRICK_HEIGHT);

  /* Ball
   * Drawing Ball
   * Adding Movement
   * Bouncing Off Walls
   */
  drawBall(BALL_COLOR);
  setTimer(animateBall, 0);

  /* Paddle
   * Controll Movement With Mouse
   * Makes Sure That Paddle Won't Leave Canvas
   */
  drawPaddle();
  mouseMoveMethod(controllPaddle);

  mouseClickMethod(updateGameState);
}

function addBackground() {
  background = new Rectangle(getWidth(), getHeight());
  background.setColor(BACKGROUND_COLOR);
  background.setPosition(0, 0);
  add(background);
}

function updateDetails() {
  var scoreCount = "SCORE: " + SCORE;
  var highScoreCount = "HIGH SCORE: " + HIGHSCORE;
  gameDetails(scoreCount, highScoreCount);

  if (SCORE >= NUM_ROWS * NUM_BRICKS_PER_ROW) {
    gameWon();
  }
}

function updateLives() {
  if (LIVES_LEFT == 3) {
    livesBox1 = new WebImage("./images/Live.png");
    livesBox1.setSize(15, 15);
    var LIVES_WIDTH = livesBox1.getWidth();
    livesBox1.setPosition((getWidth() - LIVES_WIDTH) / 2 - LIVES_WIDTH, 0);
    add(livesBox1);
    livesBox2 = new WebImage("./images/Live.png");
    livesBox2.setSize(15, 15);
    livesBox2.setPosition((getWidth() - LIVES_WIDTH) / 2, 0);
    add(livesBox2);
    livesBox3 = new WebImage("./images/Live.png");
    livesBox3.setSize(15, 15);
    livesBox3.setPosition((getWidth() - LIVES_WIDTH) / 2 + LIVES_WIDTH, 0);
    add(livesBox3);
  } else if (LIVES_LEFT == 2) {
    remove(livesBox3);
  } else if (LIVES_LEFT == 1) {
    remove(livesBox2);
  } else {
    remove(livesBox1);
  }
}

function gameDetails(text1, text2) {
  remove(scoreBox);
  remove(highScoreBox);

  scoreBox = new Text(text1, "15px Brush Script MT");
  highScoreBox = new Text(text2, "15px Monaco");
  var TEXT_HEIGHT = highScoreBox.getHeight();
  var SCORE_WIDTH = highScoreBox.getWidth();
  scoreBox.setPosition(BRICK_SPACING, TEXT_HEIGHT - 2.5);
  highScoreBox.setPosition(
    getWidth() - SCORE_WIDTH - BRICK_SPACING,
    TEXT_HEIGHT - 2.5
  );

  scoreBox.setColor(Color.white);
  highScoreBox.setColor(Color.white);

  add(scoreBox);
  add(highScoreBox);
}

/*
 * Balls Behavior on Paddle and Bricks
 * crushTheBricks() & checkForObject()
 */
function crushTheBricks() {
  var obejectInFront = getElementAt(ball.getX(), ball.getY() - BALL_RADIUS);
  var obejectToTheBottom = getElementAt(ball.getX(), ball.getY() + BALL_RADIUS);
  var obejectToTheLeft = getElementAt(ball.getX() - BALL_RADIUS, ball.getY());
  var obejectToTheRight = getElementAt(ball.getX() + BALL_RADIUS, ball.getY());
  checkForObject(obejectInFront, Y_AXIS);
  checkForObject(obejectToTheBottom, Y_AXIS);
  checkForObject(obejectToTheLeft, X_AXIS);
  checkForObject(obejectToTheRight, X_AXIS);
}

function checkForObject(elem, BALL_DIRECTION) {
  if (elem != null && elem.getWidth() == BRICK_WIDTH) {
    bricksCrashSound = new Audio(
      "https://codehs.com/uploads/" + "2ed1af30ef419b03998ca7b575d3dcbc"
    );
    bricksCrashSound.pause();
    bricksCrashSound.play();
    remove(elem);
    // Keep Score
    ++SCORE;
    if (SCORE > HIGHSCORE) {
      HIGHSCORE = SCORE;
    }
    updateDetails();
    //
    makeGameChallenging();
    //
    if (BALL_DIRECTION == Y_AXIS) {
      BALL_DY = -BALL_DY;
    } else {
      BALL_DX = -BALL_DX;
    }
  } else if (elem != null && elem.getWidth() == PADDLE_WIDTH) {
    BALL_DY = -BALL_DY;
  }
}
/*
 *
 */

function gameWon() {
  gameWinSound = new WebImage("./sounds/youWin.mp3");
  gameWinSound.play();
  stopTimer(animateBall);
  remove(ball);
  remove(message);
  remove(hint);
  SCORE = 0;
  LIVES_LEFT = 3;
  updateDetails();
  updateLives();
  GAME_WON = true;
  alertMessage("YOU WIN!", Color.green);
  hintMessage("wanna play again?", Color.white);
}

function gameOver() {
  gameOverSound = new Audio("./sounds/gameOver.mp3");
  pausedSound.pause();
  gameOverSound.play();
  stopTimer(animateBall);
  remove(ball);
  remove(message);
  remove(hint);
  SCORE = 0;
  LIVES_LEFT = 3;
  updateDetails();
  updateLives();
  GAME_OVER = true;
  alertMessage("GAME OVER", Color.red);
  hintMessage("click with mouse to restart", Color.white);
}

function resetGame() {
  pausedSound = new Audio("./sounds/gamePause.wav");
  pausedSound.play();

  --LIVES_LEFT;
  updateLives();

  updateDetails();
  remove(ball);
  stopTimer(animateBall);
  GAME_PAUSED = true;
  alertMessage("PAUSED", Color.white);
  hintMessage("click with mouse to continue", Color.white);
  if (LIVES_LEFT < 0) {
    gameOver();
  }
}

function updateGameState() {
  if (GAME_PAUSED) {
    remove(message);
    remove(hint);
    drawBall(Randomizer.nextColor());
    setTimer(animateBall, 0);
    var gameReset = new Audio("./sounds/gameReset.mp3");
    gameReset.play();
    GAME_PAUSED = false;
  }
  if (GAME_OVER) {
    remove(message);
    BALL_DX = starting_dx;
    BALL_DY = starting_dy;
    drawBricksPattern(NUM_ROWS, NUM_BRICKS_PER_ROW, BRICK_WIDTH, BRICK_HEIGHT);
  }
  if (GAME_WON) {
    remove(message);
    remove(hint);
    BALL_DX = starting_dx;
    BALL_DY = starting_dy;
    drawBricksPattern(NUM_ROWS, NUM_BRICKS_PER_ROW, BRICK_WIDTH, BRICK_HEIGHT);
    drawBall(BALL_COLOR);
    setTimer(animateBall, 0);
  }
}

function controllPaddle(e) {
  var PADDLE_Y = getHeight() - PADDLE_HEIGHT - PADDLE_OFFSET;
  if (
    e.getX() - PADDLE_WIDTH / 2 > 0 &&
    e.getX() + PADDLE_WIDTH / 2 < getWidth()
  ) {
    paddle.setPosition(e.getX() - PADDLE_WIDTH / 2, PADDLE_Y);
  } else if (e.getX() + PADDLE_WIDTH / 2 > getWidth()) {
    paddle.setPosition(getWidth() - PADDLE_WIDTH, PADDLE_Y);
  } else if (e.getX() - PADDLE_WIDTH / 2 < 0) {
    paddle.setPosition(0, PADDLE_Y);
  }
}
function drawPaddle() {
  var PADDLE_Y = getHeight() - PADDLE_HEIGHT - PADDLE_OFFSET;
  paddle = new Rectangle(PADDLE_WIDTH, PADDLE_HEIGHT);
  paddle.setColor(PADDLE_COLOR);
  paddle.setPosition(getWidth() / 2 - PADDLE_WIDTH / 2, PADDLE_Y);
  add(paddle);
}

function checkWalls() {
  if (ball.getX() + BALL_RADIUS > getWidth()) {
    BALL_DX = -BALL_DX;
  }
  if (ball.getX() - BALL_RADIUS < 0) {
    BALL_DX = -BALL_DX;
  }
  if (ball.getY() + BALL_RADIUS > getHeight()) {
    resetGame();
    //BALL_DY = -BALL_DY;
  }
  if (ball.getY() - BALL_RADIUS < 0) {
    BALL_DY = -BALL_DY;
  }
}

function makeGameChallenging() {
  if (SCORE % 5 == 0) {
    BALL_COLOR = Randomizer.nextColor();
    ball.setColor(BALL_COLOR);
    speed += 0.25;
    BALL_DX = speed;
    BALL_DY = speed;
  }
}

function animateBall() {
  checkWalls();
  crushTheBricks();
  ball.move(BALL_DX, BALL_DY);
}

function drawBall(color) {
  ball = new Circle(BALL_RADIUS);
  ball.setColor(color);
  ball.setPosition(getWidth() / 2, getHeight() / 2);
  add(ball);
}

function drawBricksPattern(
  NUM_ROWS,
  NUM_BRICKS_PER_ROW,
  BRICK_WIDTH,
  BRICK_HEIGHT
) {
  for (var i = 0; i < NUM_ROWS; i++) {
    if (i % 8 == 0) {
      COLOR = Color.red;
    } else if (i % 8 == 2) {
      COLOR = Color.orange;
    } else if (i % 8 == 4) {
      COLOR = Color.green;
    } else if (i % 8 == 6) {
      COLOR = Color.blue;
    }
    drawBricksLine(
      NUM_BRICKS_PER_ROW,
      BRICK_WIDTH,
      BRICK_HEIGHT,
      COLOR,
      i * (BRICK_HEIGHT + BRICK_SPACING)
    );
  }
}

function drawBricksLine(
  NUM_BRICKS_PER_ROW,
  BRICK_WIDTH,
  BRICK_HEIGHT,
  color,
  brickY
) {
  for (var i = 0; i < NUM_BRICKS_PER_ROW; i++) {
    drawBrick(
      BRICK_WIDTH,
      BRICK_HEIGHT,
      color,
      BRICK_WIDTH * i + BRICK_SPACING * (i + 1),
      BRICK_TOP_OFFSET + brickY
    );
  }
}

function drawBrick(BRICK_WIDTH, BRICK_HEIGHT, color, x, y) {
  brick = new Rectangle(BRICK_WIDTH, BRICK_HEIGHT);
  brick.setColor(color);
  brick.setPosition(x, y);
  add(brick);
}

/* Settings */
function settings() {
  removeAll();
  alertMessage("Settings Menu", Color.blue);
  hintMessage("Will be added soon. XD", Color.red);
}

function alertMessage(text, color) {
  message = new Text(text, "30pt Arial");
  message.setColor(color);
  message.setPosition(
    getWidth() / 2 - message.getWidth() / 2,
    getHeight() / 2 + message.getHeight() / 2
  );
  add(message);
}

function hintMessage(text, color) {
  hint = new Text(text, "15pt Arial");
  hint.setColor(color);
  hint.setPosition(
    getWidth() / 2 - hint.getWidth() / 2,
    getHeight() / 2 + message.getHeight() + hint.getHeight() / 2
  );
  add(hint);
}

//=== SETTINGS MENU
function enterSettingsMenu() {
  removeAll();
  add(menuBackground);

  drawBoxWithTitle(getHeight() / 2, "SETTINGS", "16pt Monaco");
  drawMenuButtons(
    MENU_BUTTONS_X,
    MENU_BUTTONS_Y,
    SOUNDS_STATE,
    (getWidth() - menuButtonText.getWidth()) / 2 + MENU_SPACING * 3,
    MENU_BUTTONS_Y + MENU_BUTTONS_HEIGHT / 2 + MENU_SPACING,
    "12pt Monaco"
  );

  exitSettingsMenuButton();
}

function exitSettingsMenuButton() {
  exitSettingsMenu = new Circle(exitSettingsButtonRadius);
  exitSettingsMenu.setColor(Color.white);
  exitSettingsMenu.setPosition(gameTitle.getX() + TITLE_WIDTH, TITLE_Y);
  add(exitSettingsMenu);

  exitSettingsMenuText = new Text("X", "20px Monaco");
  exitSettingsMenuText.setColor(Color.black);
  exitSettingsMenuText.setPosition(
    gameTitle.getX() + TITLE_WIDTH - exitSettingsButtonRadius / 2,
    TITLE_Y + exitSettingsButtonRadius / 2
  );
  add(exitSettingsMenuText);

  mouseClickMethod(clickSettingsButtons);
}

function clickSettingsButtons(e) {
  var settingsButton = getElementAt(e.getX(), e.getY());
  if (settingsButton != null) {
    if (settingsButton.type == "Circle" || settingsButton.label == "X") {
      buttonClicked();
      removeAll();
      enterMainMenu();
    } else if (settingsButton.label == "SOUNDS: ON") {
      menuButtonText.setText("SOUNDS: OFF");
      SOUNDS_STATE = "SOUNDS: OFF"; // Needed for State update in menu
      SOUNDS_ON = false; // Turn off sounds (Boolean)
      backgroundSound.pause();
    } else if (settingsButton.label == "SOUNDS: OFF") {
      menuButtonText.setText("SOUNDS: ON");
      SOUNDS_STATE = "SOUNDS: ON";
      SOUNDS_ON = true;
      buttonClicked();
      playBackgroundSound();
    }
  }
}

function buttonClicked() {
  if (SOUNDS_ON) buttonClickSound.play();
}

function playBackgroundSound() {
  backgroundSound = new Audio("./sounds/background.mp3");
  if (SOUNDS_ON) {
    backgroundSound.play();
    backgroundSound.loop = true;
  }
}

// THE END :P
