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
