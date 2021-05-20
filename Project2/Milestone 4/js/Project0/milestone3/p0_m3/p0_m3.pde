int width = 800; //<>// //<>//
int height = 400;

// edge length of square to use for calculations
int squareSideWidth = 50;

// int to track bottom rect location
int bottomRecCurrentX = 0;
int bottomRecCurrentY = height / 2;

// enum value to track direction of rect
Direction direction = Direction.REVERSE;

boolean running = true;


void setup() {
  println(System.getProperty("java.version"));

  size(800, 400);
}

void draw() {

  if (running) {

    background(255);

    int topRectX = (width / 2) - (squareSideWidth / 2);
    int topRectY = 0;

    int bottomRectX = bottomRecCurrentX;
    int bottomRectY = bottomRecCurrentY;

    stroke(0);
    line(topRectX + (squareSideWidth / 2), topRectY+ (squareSideWidth / 2), bottomRectX+ (squareSideWidth / 2), bottomRectY+ (squareSideWidth / 2));

    fill(255, 0, 0);
    rect(topRectX, topRectY, squareSideWidth, squareSideWidth);

    fill(0, 0, 255);
    rect(bottomRectX, bottomRectY, squareSideWidth, squareSideWidth);

    step();

    fill(0, 0, 0);
    text("Press the space bar to reverse the blue rectangles movement", 5, 15);
    text("Press the up arrow to slowly move the blue rectangle up", 5, 35);
    text("Press the down arrow to slowly move the blue rectangle down", 5, 55);
    text("Click the blue rectangle to pause the animation. Click it again to resume.", 5, 75);
    text("Click the screen anywhere will move the blue rectangle to that height", 5, 95);
  }
}

void step() {

  // the X value to reverse the direction
  int reverseOn = width - squareSideWidth;

  // how to decide which way to go
  if (Direction.REVERSE.equals(direction) && bottomRecCurrentX == 0) {
    direction = Direction.FORWARD;
  } else if (Direction.FORWARD.equals(direction) && bottomRecCurrentX == reverseOn) {
    direction = Direction.REVERSE;
  }

  // step instructions for current step
  if (Direction.FORWARD.equals(direction)) {
    bottomRecCurrentX++;
  } else if (Direction.REVERSE.equals(direction)) {
    bottomRecCurrentX--;
  }
}

public enum Direction {
  FORWARD, REVERSE
}

void mousePressed() {

  if(didClickRect()) {
    running = !running;
  }else{
    bottomRecCurrentY = mouseY - (squareSideWidth / 2);
  }

  
}

boolean didClickRect() {

  //println(bottomRecCurrentX + " , " +(bottomRecCurrentX + squareSideWidth));
  //println(bottomRecCurrentY + " , " +(bottomRecCurrentY + squareSideWidth));

  if (mouseX > bottomRecCurrentX && mouseX < (bottomRecCurrentX + squareSideWidth)
    && mouseY > bottomRecCurrentY && mouseY < (bottomRecCurrentY + squareSideWidth)) {
    return true;
  } else {
    return false;
  }
}

void keyPressed() {
  //println("Key pressed: " + keyCode);
  if (keyCode == 38) {
    // arrow up
    bottomRecCurrentY = bottomRecCurrentY <= 0  ? 0 : bottomRecCurrentY - 5;
  } else if (keyCode == 40) {
    // arrow down
    //println(bottomRecCurrentY);
    bottomRecCurrentY = (bottomRecCurrentY+squareSideWidth) >= height  ? (height - squareSideWidth) : bottomRecCurrentY + 5;
  } else if (keyCode == 32) {
    // space bar
    if (Direction.REVERSE.equals(direction)) {
      direction = Direction.FORWARD;
    } else if (Direction.FORWARD.equals(direction) ) {
      direction = Direction.REVERSE;
    }
  }
}
